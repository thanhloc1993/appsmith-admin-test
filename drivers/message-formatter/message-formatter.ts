import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';

import { Formatter, IFormatterOptions } from '@cucumber/cucumber';
import {
    Envelope,
    AttachmentContentEncoding,
    Step,
    TestStepResultStatus,
} from '@cucumber/messages';
import * as messages from '@cucumber/messages';

import GoogleCloudStorage from '../google-cloud-storage';
import { REPORT_HASURA_SECRET, REPORT_GRAPHQL_URL } from './config';
import DocumentsStorage from './documents-storage';
import featuresBob from './hasura/features-query';
import instancesBob from './hasura/instances-query';
import scenariosBob from './hasura/scenarios-query';
import stepsBob from './hasura/steps-query';
import {
    parseBuildTimeOfBackOffice,
    parseBuildTimeOfTeacherLearnerWeb,
} from './parse-build-time-of-application';
import { genId, isOnTrunk } from './utils';
import 'cross-fetch/polyfill';
import path from 'path';
import { EventEmitter } from 'stream';

export default class MessageFormatter extends Formatter {
    public static readonly documentation: string = 'Outputs protobuf messages';
    googleStorage: GoogleCloudStorage;
    gqlClient: ApolloClient<any>;
    mapPromises: { [key: string]: Promise<unknown> };
    documentsStorage: DocumentsStorage;
    constructor(options: IFormatterOptions) {
        super(options);
        this.documentsStorage = new DocumentsStorage();
        this.mapPromises = {};
        const httpLink = createHttpLink({
            uri: REPORT_GRAPHQL_URL,
            headers: {
                'x-hasura-admin-secret': REPORT_HASURA_SECRET,
                'Content-Type': 'application/json',
            },
        });

        this.gqlClient = new ApolloClient({
            link: httpLink,
            cache: new InMemoryCache(),
        });

        this.googleStorage = new GoogleCloudStorage();
        const { eventBroadcaster } = options;
        this.registerListeners(eventBroadcaster);
    }

    registerListeners(eventBroadcaster: EventEmitter) {
        eventBroadcaster.on('envelope', async (envelope: Envelope) => {
            this.documentsStorage.storageDocument(envelope);

            if (
                !envelope.testRunStarted &&
                !envelope.testRunFinished &&
                !envelope.testCaseStarted &&
                !envelope.testCaseFinished &&
                !envelope.testStepStarted &&
                !envelope.testStepFinished
            ) {
                return;
            }
            const uuid = genId();

            this.mapPromises[uuid] = this.handleNavigation(envelope)
                .catch((e) => {
                    console.log(uuid, '[message-formatter]', e);
                    delete this.mapPromises[uuid];
                })
                .finally(() => {
                    delete this.mapPromises[uuid];
                });
        });
    }

    async handleNavigation(envelope: Envelope) {
        // ==== instance
        if (envelope.testRunStarted) return this.startInstances(envelope);
        if (envelope.testRunFinished) return this.finishAInstance(envelope);
        // ==== scenarios
        if (envelope.testCaseStarted) return this.startTestCase(envelope); // test case started
        if (envelope.testCaseFinished) return this.finishTestCase(envelope); // test case finished
        // ==== steps
        if (envelope.testStepStarted) return this.startTestStep(envelope);
        if (envelope.testStepFinished) return this.finishTestStep(envelope);
    }

    async finished() {
        this.log('==== Finished processing \n');

        const timeout = 15 * 60 * 1000; // 15 minutes timeout force delete

        await new Promise<void>((resolve, reject) => {
            const interval = setInterval(() => {
                Object.keys(this.mapPromises).forEach((uuid) => {
                    this.log(
                        `Waiting for promises to finish ${this.mapPromises[uuid].toString?.()}\n`
                    );
                    if (!(this.mapPromises[uuid] instanceof Promise) || !this.mapPromises[uuid]) {
                        delete this.mapPromises[uuid];
                    } else {
                        this.mapPromises[uuid].finally(() => {
                            delete this.mapPromises[uuid];
                        });
                    }
                });

                if (!Object.keys(this.mapPromises).length) {
                    clearInterval(interval);
                    resolve();
                }

                this.log(`==== All promises are resolving ${Object.keys(this.mapPromises)}\n`);
            }, 5000);

            setTimeout(function () {
                clearInterval(interval);
                reject(new Error('Timeout connect'));
            }, timeout);
        });

        console.table(
            this.documentsStorage.getMutationDataOfUpsertInstance(false).arg.status_statistics
        );
        console.log('==== All promises are resolved');

        await super.finished();
    }

    updateStepDefinitions = async (testStepId: string) => {
        const testStepRunning = this.documentsStorage.getStorageOfTestStepRunning(testStepId);
        const embeddings = await Promise.all(
            (testStepRunning.embeddings || []).map(async (attachment) => {
                if (attachment?.contentEncoding === AttachmentContentEncoding.BASE64) {
                    attachment = await this.uploadMedia(attachment);
                    attachment.body = '';
                }
                if (attachment.mediaType == 'application/json') {
                    return this.handleAttachEvent(attachment);
                }
                return attachment;
            })
        );

        if (!embeddings || !embeddings.length) return [];
        return embeddings;
    };

    handleAttachEvent = (attachment: messages.Attachment) => {
        const eventData = JSON.parse(attachment.body);
        if (eventData['event'] == 'attach_message_instance') {
            this.documentsStorage.setMessageAndStatusInstance(
                eventData['message'],
                eventData['status']
            );
            return null;
        }
        return attachment;
    };

    startTestStep = async (envelope: Envelope) => {
        if (!envelope.testStepStarted) return false;

        this.documentsStorage.initialTestStep(envelope);

        const testStepStarted = envelope.testStepStarted;

        const { testCase, pickle, scenario, background, startIndexStep, testCaseStarted } =
            this.documentsStorage.getStorageOfTestCaseRunning(testStepStarted.testCaseStartedId);

        const indexStep = testCase.testSteps.findIndex((e) => e.id === testStepStarted.testStepId);
        if (indexStep < 0) {
            console.error('[startTestStep]: cannot find testCase.testSteps');
            return false;
        }

        const testStep = testCase.testSteps[indexStep];
        if (!testStep) {
            console.error('[startTestStep]: cannot find testStep');
            return false;
        }

        const mutation: Parameters<typeof stepsBob.upsertSteps>[0] = {
            arg: {
                step_id: testStepStarted.testStepId,
                scenario_id: testCaseStarted.testCaseId,
                uri: pickle.uri,
                started_at: this.convertTimeStamp(testStepStarted.timestamp),
                index: indexStep,
                on_trunk: isOnTrunk(),
            },
        };

        if (testStep?.hookId) {
            const hook = this.documentsStorage.getStorageOfHook(testStep.hookId);
            mutation.arg = {
                ...mutation.arg,
                name: hook.tagExpression || '',
                uri: hook.sourceReference.uri || '',
                is_hook: true,
                keyword: startIndexStep < indexStep ? 'After' : 'Before',
            };
        }

        if (testStep.pickleStepId) {
            const step = pickle.steps.find((e) => e.id === testStep?.pickleStepId);
            const scenarioIds = pickle?.astNodeIds || [];
            const stepIds = step?.astNodeIds || [];

            mutation.arg.name = step?.text || '';
            let steps: Step[] = [];

            if (scenario && scenarioIds.indexOf(scenario.id) >= 0) {
                steps = [...scenario.steps];
            }
            if (background?.steps) {
                steps = [...steps, ...background.steps];
            }

            const stepKeyword = steps.find((e) => stepIds.indexOf(e.id) >= 0);
            if (stepKeyword) {
                mutation.arg.keyword = stepKeyword.keyword;
            }
        }

        return await this.gqlClient
            .mutate(stepsBob.upsertSteps(mutation))
            .catch((err) => console.error('[message-formatter]: startTestCase', err));
    };
    finishTestStep = async (envelope: Envelope) => {
        if (!('testStepFinished' in envelope) || !envelope.testStepFinished) return false;

        const { testStepResult, testCaseStartedId, testStepId, timestamp } =
            envelope.testStepFinished;

        const testCaseRunning =
            this.documentsStorage.getStorageOfTestCaseRunning(testCaseStartedId);

        if (
            testCaseRunning.status === TestStepResultStatus.UNKNOWN ||
            testCaseRunning.status === TestStepResultStatus.PASSED
        ) {
            testCaseRunning.status = testStepResult.status;
        }
        const {
            testCaseStarted: { testCaseId },
        } = testCaseRunning;

        const embeddings = await this.updateStepDefinitions(testStepId);
        const mutation = stepsBob.updateResultSteps({
            arg: {
                step_id: testStepId,
                scenario_id: testCaseId,
                status: testStepResult.status,
                duration: this.convertDuration(testStepResult.duration),
                message: testStepResult.message,
                ended_at: this.convertTimeStamp(timestamp),
                embeddings,
            },
        });

        await this.gqlClient
            .mutate(mutation)
            .catch((err) =>
                console.error('[message-formatter]: finishTestStep', err, mutation.variables.arg)
            );
    };

    startTestCase = async (envelope: Envelope) => {
        if (!('testCaseStarted' in envelope) || !envelope.testCaseStarted) return false;

        const testCaseStarted = envelope.testCaseStarted;
        const { pickle, testCase } = this.documentsStorage.getStorageOfTestCase(
            testCaseStarted.testCaseId!
        );

        const { scenarios, background, startedAt } = this.documentsStorage.getStorageOfFeature(
            pickle.uri
        );

        const scenario = (scenarios || []).find((e) => pickle.astNodeIds.indexOf(e.id) >= 0);
        const startIndexStep = testCase.testSteps.findIndex((e) => e.pickleStepId);

        this.documentsStorage.setStorageOfTestCaseRunning(testCaseStarted.id, {
            testCaseStarted,
            pickle,
            testCase,
            scenario,
            background,
            startIndexStep,
            status: TestStepResultStatus.UNKNOWN,
        });

        if (!startedAt) {
            const { dataMutation } = this.documentsStorage.setStartTimeOfFeature({
                uri: pickle.uri,
                startedAt: this.convertTimeStamp(testCaseStarted.timestamp),
            });

            return await this.gqlClient
                .mutate(featuresBob.upsertFeatures(dataMutation!))
                .catch((err) =>
                    console.error('[message-formatter]: insertFeature', err.graphQLErrors)
                );
        }
    };
    updateEndTimeAndStatusForFeature(uri: string, endedAt: Date, status: TestStepResultStatus) {
        const feature = this.documentsStorage.getStorageOfFeature(uri);
        if (!feature?.endedAt || endedAt.getTime() > feature.endedAt.getTime()) {
            this.documentsStorage.setEndTimeOfFeature(uri, endedAt);
        }

        this.documentsStorage.setStatusOfFeature(uri, status);

        return this.documentsStorage.getStorageOfFeature(uri);
    }

    finishTestCase = async (envelope: Envelope) => {
        if (!('testCaseFinished' in envelope) || !envelope.testCaseFinished) return false;

        const testCaseFinished = envelope.testCaseFinished;
        const { pickle, status, testCaseStarted, testCase, scenario } =
            this.documentsStorage.getStorageOfTestCaseRunning(testCaseFinished.testCaseStartedId);

        let { status: statusFeature } = this.documentsStorage.getStorageOfFeature(pickle.uri);
        if (
            statusFeature === TestStepResultStatus.UNKNOWN ||
            statusFeature === TestStepResultStatus.PASSED
        ) {
            statusFeature = status;
        }

        this.documentsStorage.increaseStatusOfScenarioInInstance(status);

        const endedAt = this.convertTimeStamp(testCaseFinished.timestamp);
        const feature = this.updateEndTimeAndStatusForFeature(
            pickle.uri,
            endedAt,
            statusFeature || TestStepResultStatus.UNKNOWN
        );

        const mutationScenario = scenariosBob.upsertScenarios({
            arg: {
                feature_id: feature.featureId,
                scenario_id: testCaseStarted.testCaseId,
                ended_at: endedAt,
                tags: (pickle.tags || []).map((t) => t.name),
                keyword: scenario?.keyword,
                name: pickle.name,
                steps: pickle.steps,
                pickle,
                test_case: testCase,
                // will_be_retried: testCaseFinished.willBeRetried, TODO: update will be retrieve here
                started_at: this.convertTimeStamp(testCaseStarted.timestamp),
                status,
                on_trunk: isOnTrunk(),
            },
        });

        const instance = this.documentsStorage.instance;

        const mutationFeatures = featuresBob.finishFeatures({
            arg: {
                status: feature.status,
                feature_id: feature.featureId,
                ended_at: feature.endedAt,
                instance_id: instance?.instanceId,
                on_trunk: isOnTrunk(),
            },
        });

        await Promise.all([
            this.gqlClient.mutate(mutationScenario),
            this.gqlClient.mutate(mutationFeatures),
        ]).catch((err) => console.error('[message-formatter]: finishTestCase', err));
    };
    startInstances = async (envelope: Envelope) => {
        if (!('testRunStarted' in envelope) || !envelope.testRunStarted) return false;
        const testRunStarted = envelope.testRunStarted;

        this.documentsStorage.setStartTimeOfInstance({
            startedAt: this.convertTimeStamp(testRunStarted.timestamp),
        });

        const mutation = instancesBob.upsertInstance(
            this.documentsStorage.getMutationDataOfUpsertInstance(true)
        );

        return await this.gqlClient
            .mutate(mutation)
            .catch((err) => console.error('[message-formatter]: startInstances', err));
    };

    finishAInstance = async (envelope: Envelope) => {
        if (!('testRunFinished' in envelope) || !envelope.testRunFinished) return false;
        const testRunFinished = envelope.testRunFinished;

        this.documentsStorage.setEndTimeOfInstance({
            endedAt: this.convertTimeStamp(testRunFinished.timestamp),
        });

        const data = this.documentsStorage.getMutationDataOfUpsertInstance(false);

        const cmsBuildTime = await parseBuildTimeOfBackOffice(
            path.join(__dirname, '../../report/build-logs/cms.log')
        );
        const teacherBuildTime = await parseBuildTimeOfTeacherLearnerWeb(
            path.join(__dirname, '../../report/build-logs/teacher.log')
        );
        const learnerBuildTime = await parseBuildTimeOfTeacherLearnerWeb(
            path.join(__dirname, '../../report/build-logs/learner.log')
        );

        data.arg.metadata = {
            ...data.arg.metadata,
            cms_build_time: cmsBuildTime,
            teacher_build_time: teacherBuildTime,
            learner_build_time: learnerBuildTime,
        };

        const mutation = instancesBob.upsertInstance(data);
        return await this.gqlClient
            .mutate(mutation)
            .catch((err) => console.error('[message-formatter]: finishAInstance', err));
    };

    async uploadMedia(attachment: messages.Attachment) {
        if (!attachment) return attachment;
        const instanceId = this.documentsStorage.instance.instanceId;
        const { pickle } = this.documentsStorage.getStorageOfTestCaseRunning(
            attachment.testCaseStartedId!
        );
        const scenarioName = pickle.name.replace(/ /g, '-');

        const type =
            attachment.mediaType === 'text/plain' ? 'txt' : attachment.mediaType.split('/')[1];
        const fileName = `[instance]${instanceId}[scenario]${scenarioName}[step]${
            attachment.testStepId
        }[uuid]${genId()}.${type}`;

        const url = await this.googleStorage.uploadFile({
            fileName: fileName,
            base64EncodedImageString: attachment.body,
            folder: `${instanceId}/${scenarioName}/`,
        });

        if (url) {
            attachment = {
                ...attachment,
                url,
                fileName,
            };
        }

        return attachment;
    }

    convertTimeStamp(timestamp: messages.Timestamp) {
        return new Date(
            new Date(
                messages.TimeConversion.timestampToMillisecondsSinceEpoch(timestamp)
            ).toISOString()
        );
    }
    convertDuration(timestamp: messages.Duration) {
        return messages.TimeConversion.durationToMilliseconds(timestamp);
    }
}
