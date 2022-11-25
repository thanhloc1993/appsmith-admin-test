import {
    Envelope,
    Hook,
    TestCase,
    StepDefinition,
    Pickle,
    Scenario,
    Rule,
    TestStepResultStatus,
    Attachment,
} from '@cucumber/messages';

import instancesBob from './hasura/instances-query';
import { IDocumentsStorage, FeatureType, IFeature, ITestCaseRunning } from './type';
import { initialInstance, genId, initialTestResultStatus, isOnTrunk } from './utils';

class DocumentsStorage {
    workerId = process.env.CUCUMBER_WORKER_ID ? process.env.CUCUMBER_WORKER_ID : 0;

    instance: IDocumentsStorage['instance'] = initialInstance();
    features: IDocumentsStorage['features'] = {};
    featureStarted: IDocumentsStorage['featureStarted'] = {};
    pickle: IDocumentsStorage['pickle'] = {};
    testCase: IDocumentsStorage['testCase'] = {};
    testCaseRunning: IDocumentsStorage['testCaseRunning'] = {};
    testStep: IDocumentsStorage['testStep'] = {};
    testStepRunning: IDocumentsStorage['testStepRunning'] = {};
    hook: IDocumentsStorage['hook'] = {};
    stepDefinition: IDocumentsStorage['stepDefinition'] = {};

    constructor() {
        console.log('welcome to document storage');
    }

    setStorageOfFeature<T>(uri: string, key: FeatureType, value: T) {
        if (!uri || !key) return;

        this.features[uri] = {
            ...this.features[uri],
            [key]: value,
        };

        return this.getStorageOfFeature(uri);
    }
    getStorageOfFeature(uri: string) {
        return this.features[uri] || {};
    }
    getStorageOfTestStepRunning(stepRunId: string) {
        return this.testStepRunning[stepRunId] || {};
    }

    getStorageOfTestCaseRunning(testCaseRunId: string) {
        return this.testCaseRunning[testCaseRunId] || {};
    }
    setStorageOfHook(hook: Hook) {
        this.hook[hook.id] = hook;
    }
    getStorageOfHook(hookId: string) {
        return this.hook[hookId] || {};
    }

    setStorageOfStepDefinition(stepDefinition: StepDefinition) {
        this.hook[stepDefinition.id] = stepDefinition;
    }

    setStorageOfTestCase(testCase: TestCase) {
        const pickle = this.getStorageOfPickle(testCase.pickleId);

        this.testCase[testCase.id] = {
            ...this.testCase[testCase.id],
            testCase,
            pickle,
        };
    }
    getStorageOfTestCase(testCaseId: string) {
        return this.testCase[testCaseId];
    }
    setStorageOfPickle(pickleId: string, pickle: Pickle) {
        if (!pickleId) return;

        this.pickle[pickleId] = pickle;
    }
    getStorageOfPickle(pickleId: string) {
        return this.pickle[pickleId];
    }

    initialInstance = (envelope: Envelope) => {
        if (!envelope.meta) return;

        this.instance.metadata = envelope.meta;
    };
    initialSources = (envelope: Envelope) => {
        if (!envelope.source) return;

        const source = envelope.source!;
        this.setStorageOfFeature(source.uri, 'source', source);
        this.setStorageOfFeature(source.uri, 'status', TestStepResultStatus.UNKNOWN);

        this.setStorageOfFeature(source.uri, 'featureId', genId());
    };

    initialPickle = (envelope: Envelope) => {
        if (!envelope.pickle) return;

        const pickle = envelope.pickle!;

        this.setStorageOfPickle(pickle.id, pickle);
    };

    initialTestCase = (envelope: Envelope) => {
        if (!envelope.testCase) return;

        const testCase = envelope.testCase;

        this.setStorageOfTestCase(testCase);
    };
    initialHook = (envelope: Envelope) => {
        if (!envelope.hook) return;
        this.setStorageOfHook(envelope.hook);
    };
    initialStepDefinition = (envelope: Envelope) => {
        if (!envelope.stepDefinition) return;
        this.setStorageOfStepDefinition(envelope.stepDefinition);
    };
    initialTestStep = (envelope: Envelope) => {
        if (!envelope.testStepStarted) return;
        const testStepStarted = envelope.testStepStarted;

        this.testStep[testStepStarted.testStepId] = {
            ...this.testStep[testStepStarted.testStepId],
            testStepStarted,
        };
    };

    initialFeature = (envelope: Envelope) => {
        if (!envelope.gherkinDocument) return;

        const gherkinDocument = envelope.gherkinDocument!;
        const uri = gherkinDocument?.uri;
        if (!uri) return;

        const feature = gherkinDocument?.feature;
        const storageFeature = this.getStorageOfFeature(uri);

        if (!storageFeature || !feature) return;

        const { source, featureId } = storageFeature;

        const indexBackground = feature?.children.findIndex((e) => e.background);

        const background = feature?.children[indexBackground]?.background;

        let scenarios: Scenario[] = [];
        let rules: Rule[] = [];

        const children = feature?.children;
        if (indexBackground >= 0) {
            children.slice(indexBackground);
        }

        children.forEach((e) => {
            if (e.scenario) scenarios = [...scenarios, e.scenario];
            if (e.rule) rules = [...rules, e.rule];
        });

        this.setStorageOfFeature<IFeature['scenarios']>(uri, 'scenarios', scenarios);
        this.setStorageOfFeature<IFeature['gherkinDocument']>(
            uri,
            'gherkinDocument',
            gherkinDocument
        );
        this.setStorageOfFeature<IFeature['background']>(uri, 'background', background);
        this.setStorageOfFeature<IFeature['dataMutation']>(uri, 'dataMutation', {
            arg: {
                feature_id: featureId,
                instance_id: this.instance?.instanceId,
                name: feature.name,
                keyword: feature.keyword,
                tags: (feature.tags || []).map((t) => t.name),
                rules,
                scenarios,
                background,
                children: feature.children,
                description: feature.description,
                uri: gherkinDocument.uri,
                media_type: source?.mediaType,
                data: source?.data,
                status: '',
            },
        });
    };
    storageDocument(envelope: Envelope) {
        this.initialInstance(envelope);
        this.initialSources(envelope);
        this.initialFeature(envelope);
        this.initialHook(envelope);
        this.initialPickle(envelope);
        this.initialStepDefinition(envelope);
        this.initialTestCase(envelope);
        this.setAttachmentForTestStepRunning(envelope);
    }
    setStorageOfFeatureStarted(uri: string, feature: IFeature) {
        this.featureStarted[uri] = feature;
    }
    getStorageOfFeatureStarted(uri: string) {
        return this.featureStarted[uri];
    }

    setStartTimeOfFeature({ startedAt, uri }: { startedAt: Date; uri: string }) {
        const feature = this.getStorageOfFeature(uri);

        this.setStorageOfFeatureStarted(uri, feature);

        this.setStorageOfFeature<IFeature['dataMutation']>(uri, 'dataMutation', {
            arg: {
                ...feature.dataMutation?.arg,
                started_at: startedAt,
                on_trunk: isOnTrunk(),
            },
        });

        return this.getStorageOfFeature(uri);
    }
    getMutationDataOfUpsertInstance(
        isStart: boolean
    ): Parameters<typeof instancesBob.upsertInstance>[0] {
        if (!isStart) {
            this.calcStatusOfFeatureInInstance();
        }

        const instance = this.instance;
        const duration =
            !instance.endedAt || !instance.startedAt
                ? 0
                : instance.endedAt.getTime() - instance.startedAt.getTime();

        let status = this.checkToUpdateStatus(instance.status);

        if (isStart) {
            status = TestStepResultStatus.UNKNOWN;
        }

        return {
            arg: {
                instance_id: instance?.instanceId,
                ended_at: instance.endedAt,
                started_at: instance.startedAt,
                status: status,
                name: instance.instanceName,
                duration: duration,
                status_statistics: instance.statusStatistics,
                flavor: instance.flavor,
                tags: instance.tags,
                squad_tags: instance.squadTags,
                metadata: instance.metadata,
                message: instance.message,
                on_trunk: isOnTrunk(),
            },
        };
    }
    setStatusOfInstance(status: TestStepResultStatus) {
        this.instance.status = status;
        return this.instance;
    }
    setStartTimeOfInstance({ startedAt }: { startedAt: Date }) {
        this.instance.startedAt = startedAt;
        return this.instance;
    }
    setEndTimeOfInstance({ endedAt }: { endedAt: Date }) {
        this.instance.endedAt = endedAt;
        return this.instance;
    }
    setEndTimeOfFeature(uri: string, endedAt: Date) {
        this.setStorageOfFeature<IFeature['endedAt']>(uri, 'endedAt', endedAt);
        return this.getStorageOfFeature(uri);
    }
    setStorageOfTestCaseRunning(testCaseRunId: string, data: ITestCaseRunning) {
        const testCaseRun = this.getStorageOfTestCaseRunning(testCaseRunId);
        this.testCaseRunning[testCaseRunId] = {
            ...testCaseRun,
            ...data,
        };
    }
    setAttachmentForTestStepRunning({ attachment }: { attachment?: Attachment }) {
        if (!attachment || !attachment.testStepId) return;
        const { testStepId } = attachment;
        const stepRunning = this.getStorageOfTestStepRunning(testStepId);

        this.testStepRunning[testStepId] = {
            testStepStarted: this.testStep[testStepId].testStepStarted,
            embeddings: [...(stepRunning.embeddings || []), attachment],
        };
    }
    setStatusOfFeature(uri: string, status: TestStepResultStatus) {
        const feature = this.setStorageOfFeature<IFeature['status']>(uri, 'status', status);
        if (feature) this.setStorageOfFeatureStarted(uri, feature);

        return this.getStorageOfFeature(uri);
    }
    calcStatusOfFeatureInInstance() {
        const statusStatistics = initialTestResultStatus;
        const features = Object.values(this.featureStarted);
        features.forEach((feature) => {
            statusStatistics[feature.status]++;
        });

        this.instance.statusStatistics.feature = statusStatistics;
    }
    checkToUpdateStatus(status: TestStepResultStatus): TestStepResultStatus {
        // Check if status = failed because sometime we need force fail by timeout
        if (status != TestStepResultStatus.FAILED) {
            const features = Object.values(this.featureStarted);
            status = TestStepResultStatus.PASSED;
            for (let indexFeature = 0; indexFeature < features.length; indexFeature++) {
                const feature = features[indexFeature];
                if (
                    [
                        TestStepResultStatus.AMBIGUOUS,
                        TestStepResultStatus.FAILED,
                        TestStepResultStatus.PENDING,
                        TestStepResultStatus.SKIPPED,
                        TestStepResultStatus.UNDEFINED,
                        TestStepResultStatus.UNKNOWN,
                    ].includes(feature.status)
                ) {
                    status = TestStepResultStatus.FAILED;
                    break;
                }
            }
        }
        return status;
    }

    increaseStatusOfScenarioInInstance(status: TestStepResultStatus) {
        const scenario = this.instance.statusStatistics.scenario;
        const count = scenario[status] + 1;
        this.instance.statusStatistics.scenario = {
            ...scenario,
            [status]: count,
        };

        return this.instance;
    }

    setMessageAndStatusInstance(message: string, status = TestStepResultStatus.UNKNOWN) {
        this.instance.message = message;
        this.instance.status = status;
    }
}

export default DocumentsStorage;
