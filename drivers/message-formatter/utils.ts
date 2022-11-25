import { TestStepResultStatus } from '@cucumber/messages';

import { IDocumentsStorage, IInstanceFlavor } from './type';
import { monotonicFactory } from 'ulid';

const ulid = monotonicFactory();
export const genId = () => ulid(Date.now());

export function generateInstanceName() {
    const { TAGS = '', FEATURE_FILES = '' } = process.env;
    const message = `${TAGS} ${FEATURE_FILES}`.trim() || `Welcome to manabie end-to-end world`;
    return message;
}

const regexReplaceTags = new RegExp(/ and | or | |\(|\)/gi);

export function generateInstanceTags(): string[] {
    const { TAGS = '' } = process.env;
    const tags = TAGS.replace(regexReplaceTags, ',')
        .split(',')
        .filter((e) => e);

    return tags;
}
export function generateInstanceFlavor(): IInstanceFlavor {
    const {
        EIBANAM_REF = '',
        FE_REF = '',
        ME_REF = '',
        PLATFORM,
        CMS_FLAVOR = '',
        LEARNER_FLAVOR = '',
        TEACHER_FLAVOR = '',
        ENV,
        FEATURE_FILES = '',
        RUN_ID = '',
        ORGANIZATION,
        ACTOR = '',
        REPO,
        ISSUE_NUMBER,
    } = process.env;

    return {
        env: ENV || 'staging',
        platform: PLATFORM || 'WEB',
        feature_files: FEATURE_FILES,
        cms_flavor: CMS_FLAVOR,
        learner_flavor: LEARNER_FLAVOR,
        teacher_flavor: TEACHER_FLAVOR,
        run_id: RUN_ID,
        organization: ORGANIZATION || 'manabie',
        eibanam_ref: EIBANAM_REF,
        fe_ref: FE_REF,
        me_ref: ME_REF,
        actor: ACTOR,
        repository: REPO || '',
        pull_request_id: ISSUE_NUMBER || '',
    };
}

export function convertArrayToPostgresArray(arrs: string[] = []): string {
    let str = '';
    arrs.forEach((v, i) => {
        if (i === 0) return (str += v);

        return (str += `, ${v}`);
    });

    return `{${str}}`;
}

export const initialTestResultStatus: {
    [x in TestStepResultStatus]: number;
} = {
    [TestStepResultStatus.PASSED]: 0,
    [TestStepResultStatus.UNKNOWN]: 0,
    [TestStepResultStatus.UNDEFINED]: 0,
    [TestStepResultStatus.AMBIGUOUS]: 0,
    [TestStepResultStatus.FAILED]: 0,
    [TestStepResultStatus.PENDING]: 0,
    [TestStepResultStatus.SKIPPED]: 0,
};

export const getSquadTags = (tags: string[]) => {
    if (!tags || !tags.length) return [];

    const squadTags = tags
        .filter((tag) => tag)
        .map((tag) => {
            if (tag.startsWith('@')) return tag;

            return `@${tag}`;
        });

    return squadTags;
};

export const initialInstance = (): IDocumentsStorage['instance'] => {
    const { SQUADS: squads, CUCUMBER_TOTAL_WORKERS: totalWorkers = 1 } = process.env;
    return {
        instanceId: genId(), // to keep one instance for multiple job in one run of Github Action
        totalWorker: Number(totalWorkers),
        instanceName: generateInstanceName(),
        status: TestStepResultStatus.UNKNOWN,
        statusStatistics: {
            feature: initialTestResultStatus,
            scenario: initialTestResultStatus,
        },
        flavor: generateInstanceFlavor(),
        tags: generateInstanceTags(),
        squadTags: getSquadTags(squads?.split(',') || []),
    };
};

export const isOnTrunk = () => {
    const { ME_REF, FE_REF, EIBANAM_REF } = process.env;
    return (
        (!ME_REF || ME_REF === 'develop') &&
        (EIBANAM_REF === 'develop' || EIBANAM_REF === 'refs/heads/develop') &&
        (!FE_REF || FE_REF === 'develop')
    );
};
