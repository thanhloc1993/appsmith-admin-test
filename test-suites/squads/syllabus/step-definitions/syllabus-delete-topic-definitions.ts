import { getRandomElement } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { ActionOptions } from '@supports/types/cms-types';

import { aliasChapterNames, aliasTopicName, aliasTopicNames } from './alias-keys/syllabus';
import { deleteOption, optionsButton, topicItem } from './cms-selectors/cms-keys';
import { getItemTopicNameColumnWithName, itemTopicNameColumn } from './cms-selectors/study-plan';
import { expandAChapter } from './syllabus-content-book-create-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function schoolAdminClicksTopicOptions(cms: CMSInterface, context: ScenarioContext) {
    if (!context.has(aliasTopicNames)) {
        throw Error('There is no topic');
    }

    const topics = context.get<string[]>(aliasTopicNames);
    const topicNameOpened = getRandomElement<string>(topics);

    if (context.has(aliasChapterNames)) {
        const chapters = context.get<string[]>(aliasChapterNames);
        for (let i = 0; i < chapters.length; i++) {
            try {
                await cms.page!.waitForSelector(topicItem(topicNameOpened), { timeout: 1000 });
                break;
            } catch (err) {
                const chapterName = chapters[i];
                await expandAChapter(cms, chapterName);
            }
        }
    }

    const topicOptionsButton = await cms.page!.waitForSelector(
        `${topicItem(topicNameOpened)} ${optionsButton}`
    );
    await topicOptionsButton.click();
    await cms.page!.waitForSelector(deleteOption);

    return { topicNameOpened };
}

export const schoolAdminSelectTopicOption = async (
    cms: CMSInterface,
    topicName: string,
    action: ActionOptions
) => {
    await cms.selectActionButton(action, {
        target: 'actionPanelTrigger',
        wrapperSelector: topicItem(topicName),
    });
};

export async function schoolAdminConfirmsDeleteTopic(cms: CMSInterface): Promise<void> {
    await cms.selectAButtonByAriaLabel('Confirm');
}

export async function schoolAdminChoosesDeleteTopic(cms: CMSInterface): Promise<void> {
    await cms.page!.waitForSelector(deleteOption);
    await cms.selectAButtonByAriaLabel('Delete');
}

export async function schoolAdminDoesNotSeeTopic(cms: CMSInterface, topicName: string) {
    await cms.page!.waitForSelector(topicItem(topicName), {
        state: 'detached',
    });
}

export const studentSeeTopicOnCourse = async (learner: LearnerInterface, topicName: string) => {
    const topicKey = new ByValueKey(SyllabusLearnerKeys.topic(topicName));
    await learner.flutterDriver?.waitFor(topicKey);
};

export const studentNotSeeTopicOnCourse = async (learner: LearnerInterface, topicName: string) => {
    const topicKey = new ByValueKey(SyllabusLearnerKeys.topic(topicName));
    await learner.flutterDriver?.waitForAbsent(topicKey);
};

export const schoolAdminNotSeeTopicInStudyPlanDetail = async (
    cms: CMSInterface,
    topicName: string
) => {
    await cms.page?.waitForSelector(getItemTopicNameColumnWithName(topicName), {
        state: 'detached',
    });
};

export const schoolAdminSeeTotalTopicInStudyPlanDetail = async (
    cms: CMSInterface,
    total: number
) => {
    const elements = await cms.page?.$$(itemTopicNameColumn);

    if (!elements) throw new Error('Cannot find any topic in the study plan detail');

    weExpect(elements.length).toEqual(total);
};

export async function studentDoesNotSeeTopicOnCourse(
    learner: LearnerInterface,
    context: ScenarioContext
) {
    const topicNames = context.get<string[]>(aliasTopicNames);
    for (const topic of topicNames) {
        const topicKey = new ByValueKey(SyllabusLearnerKeys.topic(topic));
        await learner.flutterDriver?.waitFor(topicKey);
    }
    const deleteTopicName = context.get<string>(aliasTopicName);
    const deleteTopicKey = new ByValueKey(SyllabusLearnerKeys.topic(deleteTopicName));

    await learner.flutterDriver?.waitForAbsent(deleteTopicKey);
}

export const learnerGenTodoPageUrl = async (learner: LearnerInterface) => {
    const origin = await learner.flutterDriver?.webDriver?.getUrlOrigin();
    return `${origin}tab?tab_name=todos`;
};

export async function studentGoesToToDoPageFromHomeByURL(learner: LearnerInterface) {
    const url = await learnerGenTodoPageUrl(learner);
    await learner.flutterDriver?.webDriver?.page.goto(url);
}
