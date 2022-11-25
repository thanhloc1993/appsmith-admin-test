import { TestStepResultStatus } from '@cucumber/messages';

import DocumentsStorage from '../documents-storage';
import { initialInstance, initialTestResultStatus } from '../utils';

describe('DocumentsStorage', () => {
    const OLD_ENV = process.env;

    afterAll(() => {
        process.env = OLD_ENV; // Restore old environment
    });
    beforeEach(() => {
        process.env = {
            ...OLD_ENV,
            CMS_FLAVOR: '.env.manabie.staging',
            LEARNER_FLAVOR: 'manabie_learner_staging',
            TEACHER_FLAVOR: 'manabie_teacher_staging',
            RUN_ID: '',
        };
    });
    it('DocumentsStorage | initialInstance', () => {
        const documentStorages = new DocumentsStorage();
        const sample = initialInstance();
        const instance = documentStorages.instance;
        sample.instanceId = '';
        instance.instanceId = '';

        expect(instance).toMatchObject(sample);
    });

    it('DocumentsStorage | getMutationDataOfUpsertInstance for start instance', () => {
        const documentStorages = new DocumentsStorage();
        const instance = documentStorages.instance;

        expect(documentStorages.getMutationDataOfUpsertInstance(true)).toMatchObject({
            arg: {
                instance_id: instance.instanceId,
                ended_at: undefined,
                started_at: undefined,
                status: 'UNKNOWN',
                name: 'Welcome to manabie end-to-end world',
                duration: 0,
                status_statistics: {
                    feature: initialTestResultStatus,
                    scenario: initialTestResultStatus,
                },
                flavor: {
                    env: 'staging',
                    platform: 'WEB',
                    feature_files: '',
                    cms_flavor: '.env.manabie.staging',
                    learner_flavor: 'manabie_learner_staging',
                    teacher_flavor: 'manabie_teacher_staging',
                    run_id: '',
                },
                tags: [],
            },
        });
    });
    it('DocumentsStorage | getMutationDataOfUpsertInstance for finish instance', () => {
        const documentStorages = new DocumentsStorage();
        const startedAt = new Date('Sat Nov 01 2021 20:36:51 GMT+0700');

        const endedAt = new Date('Sat Nov 07 2021 20:36:51 GMT+0700');

        documentStorages.setStartTimeOfInstance({
            startedAt,
        });
        const instance = documentStorages.setEndTimeOfInstance({
            endedAt,
        });

        expect(documentStorages.getMutationDataOfUpsertInstance(false)).toMatchObject({
            arg: {
                instance_id: instance.instanceId,
                ended_at: endedAt,
                started_at: startedAt,
                status: 'PASSED',
                name: 'Welcome to manabie end-to-end world',
                duration: endedAt.getTime() - startedAt.getTime(),
                status_statistics: {
                    feature: initialTestResultStatus,
                    scenario: initialTestResultStatus,
                },
                flavor: {
                    env: 'staging',
                    platform: 'WEB',
                    feature_files: '',
                    cms_flavor: '.env.manabie.staging',
                    learner_flavor: 'manabie_learner_staging',
                    teacher_flavor: 'manabie_teacher_staging',
                    run_id: '',
                },
                tags: [],
            },
        });
    });

    it('DocumentsStorage | checkToUpdateStatus should return status=passed', () => {
        const documentStorages = new DocumentsStorage();

        const endedAt = new Date('Sat Nov 07 2021 20:36:51 GMT+0700');

        documentStorages.featureStarted = {
            feature_1: {
                gherkinDocument: {
                    comments: [],
                },
                status: TestStepResultStatus.PASSED,
                endedAt: endedAt,
                featureId: '1',
            },
            feature_2: {
                gherkinDocument: {
                    comments: [],
                },
                status: TestStepResultStatus.PASSED,
                endedAt: endedAt,
                featureId: '2',
            },
        };

        expect(documentStorages.checkToUpdateStatus(TestStepResultStatus.UNKNOWN)).toEqual(
            TestStepResultStatus.PASSED
        );
    });

    it('DocumentsStorage | checkToUpdateStatus should return status=failed', () => {
        const documentStorages = new DocumentsStorage();

        const endedAt = new Date('Sat Nov 07 2021 20:36:51 GMT+0700');

        documentStorages.featureStarted = {
            feature_1: {
                gherkinDocument: {
                    comments: [],
                },
                status: TestStepResultStatus.PASSED,
                endedAt: endedAt,
                featureId: '1',
            },
            feature_2: {
                gherkinDocument: {
                    comments: [],
                },
                status: TestStepResultStatus.PASSED,
                endedAt: endedAt,
                featureId: '2',
            },
            feature_3: {
                gherkinDocument: {
                    comments: [],
                },
                status: TestStepResultStatus.FAILED,
                endedAt: endedAt,
                featureId: '2',
            },
        };

        expect(documentStorages.checkToUpdateStatus(TestStepResultStatus.UNKNOWN)).toEqual(
            TestStepResultStatus.FAILED
        );
    });
});
