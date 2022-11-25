import {
    Background,
    Meta,
    Hook,
    TestCase,
    StepDefinition,
    Pickle,
    TestCaseStarted,
    Source,
    TestStepStarted,
    GherkinDocument,
    Scenario,
    TestStepResultStatus,
    Attachment,
} from '@cucumber/messages';

import featuresBob from './hasura/features-query';

export interface IFeature {
    gherkinDocument: GherkinDocument;
    source?: Source;
    featureId: string;
    background?: Background;
    scenarios?: Scenario[];
    status: TestStepResultStatus;
    endedAt: Date;
    startedAt?: Date;
    dataMutation?: Parameters<typeof featuresBob.upsertFeatures>[0];
}

export type FeatureType = keyof IFeature;

export interface ITestCaseRunning {
    testCaseStarted: TestCaseStarted;
    testCase: TestCase;
    pickle: Pickle;
    status: TestStepResultStatus;
    scenario?: Scenario;
    background?: Background;
    startIndexStep: number;
}
export interface IInstanceFlavor {
    cms_flavor: string;
    learner_flavor: string;
    teacher_flavor: string;
    env: string;
    feature_files: string;
    platform: string;
    run_id: string;
    eibanam_ref: string;
    me_ref: string;
    fe_ref: string;
    organization: string;
    actor: string;
    pull_request_id: string;
    repository: string;
}

export interface IDocumentsStorage {
    features: {
        [uri: string]: IFeature;
    };
    featureStarted: {
        [uri: string]: IFeature;
    };
    instance: {
        instanceId: string;
        totalWorker: number;
        metadata?: Meta & {
            cms_build_time?: number;
            teacher_build_time?: number;
            learner_build_time?: number;
        };
        statusStatistics: {
            feature: {
                [x in TestStepResultStatus]: number;
            };
            scenario: {
                [x in TestStepResultStatus]: number;
            };
        };
        status: TestStepResultStatus;
        message?: string;
        endedAt?: Date;
        startedAt?: Date;
        instanceName: string;
        flavor: IInstanceFlavor;
        tags: string[];
        squadTags: string[];
    };
    pickle: {
        [pickleId: string]: Pickle;
    };
    testCase: {
        [testCaseId: string]: {
            testCase: TestCase;
            pickle: Pickle;
        };
    };
    testCaseRunning: {
        [testCaseRunId: string]: ITestCaseRunning;
    };
    hook: {
        [hookId: string]: Hook;
    };
    stepDefinition: {
        [stepDefinitionId: string]: StepDefinition;
    };
    testStep: {
        [testStepRunId: string]: {
            testStepStarted: TestStepStarted;
            embeddings: Attachment[];
        };
    };
    testStepRunning: {
        [testStepRunId: string]: {
            testStepStarted: TestStepStarted;
            embeddings: Attachment[];
        };
    };
}
