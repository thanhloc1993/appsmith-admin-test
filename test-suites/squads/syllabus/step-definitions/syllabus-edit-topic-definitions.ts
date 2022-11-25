import { genId, getRandomElement } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { sampleImageFilePath } from '@supports/constants';
import { ScenarioContext } from '@supports/scenario-context';
import { FileTypes } from '@supports/types/cms-types';

import {
    aliasChapterNames,
    aliasTopicIconURL,
    aliasTopicName,
    aliasTopicNames,
} from './alias-keys/syllabus';
import { topicItem, optionsButton, renameOption, topicFormRoot } from './cms-selectors/cms-keys';
import { getItemTopicNameColumnWithName } from './cms-selectors/study-plan';
import {
    expandAChapter,
    expandAllChaptersTopics,
    schoolAdminFillTopicForm,
} from './syllabus-content-book-create-definitions';
import { studentSeeChapterList } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export async function schoolAdminClicksTopicOptions(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    if (!context.has(aliasTopicNames)) {
        throw Error('There is no topic');
    }

    const topics = context.get<string[]>(aliasTopicNames);
    const topicName = getRandomElement<string>(topics);

    if (context.has(aliasChapterNames)) {
        const chapters = context.get<string[]>(aliasChapterNames);
        for (let i = 0; i < chapters.length; i++) {
            try {
                await cms.page!.waitForSelector(topicItem(topicName), { timeout: 1000 });
                break;
            } catch (err) {
                const chapterName = chapters[i];
                await expandAChapter(cms, chapterName);
            }
        }
    }

    const topicOptionsButton = await cms.page!.waitForSelector(
        `${topicItem(topicName)} ${optionsButton}`
    );
    await topicOptionsButton.click();
    context.set(aliasTopicName, topicName);
}

export async function schoolAdminChoosesRenameTopic(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    if (!context.has(aliasTopicNames)) {
        throw Error('There is no topic');
    }
    await cms.page!.waitForSelector(renameOption);
    await cms.selectAButtonByAriaLabel('Rename');
}

export async function schoolAdminEditsTopicName(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    if (!context.has(aliasTopicNames)) {
        throw Error('There is no topic');
    }

    const topics = context.get<string[]>(aliasTopicNames);
    const topicName = context.get<string>(aliasTopicName);

    const newTopicName = `Topic edited ${genId()}`;

    await schoolAdminFillTopicForm(cms, {
        name: newTopicName,
    });

    for (let i = 0; i < topics.length; i++) {
        if (topics[i] == topicName) {
            topics[i] = newTopicName as string;
        }
    }

    context.set(aliasTopicNames, topics);
    context.set(aliasTopicName, newTopicName);
}

export async function schoolAdminSaveEditedTopicOption(
    cms: CMSInterface,
    context: ScenarioContext
) {
    if (!context.has(aliasTopicNames)) {
        throw Error('There is no topic');
    }

    await schoolAdminSubmitTopicForm(cms);

    await schoolAdminWaitingTopicDialogHidden(cms);
}

export const schoolAdminSubmitTopicForm = async (cms: CMSInterface) => {
    await cms.selectAButtonByAriaLabel('Save');
};

export const schoolAdminWaitingTopicDialogHidden = async (cms: CMSInterface) => {
    await cms.page!.waitForSelector(topicFormRoot, {
        state: 'hidden',
    });
};

export async function schoolAdminSeesRenamedTopic(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    const topicName = context.get<string>(aliasTopicName);
    await cms.page!.waitForSelector(topicItem(topicName));
}

export async function studentSeesRenamedTopic(learner: LearnerInterface, updatedTopicName: string) {
    const listKey = new ByValueKey(SyllabusLearnerKeys.chapter_with_topic_list);
    const topicKey = new ByValueKey(SyllabusLearnerKeys.topic(updatedTopicName));

    await learner.instruction(`Assert topic name: ${updatedTopicName}`, async function () {
        await studentSeeChapterList(learner);
        await learner.flutterDriver!.scrollUntilVisible(listKey, topicKey, 0.0, 0.0, -100);
    });
}

export async function schoolAdminEditsTopicIcon(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    if (!context.has(aliasTopicNames)) {
        throw Error('There is no topic');
    }

    await cms.instruction(`school admin checks topic icon`, async function (cms: CMSInterface) {
        const topicName = context.get<string>(aliasTopicName);
        const icon = await cms.page!.waitForSelector(`${topicItem(topicName)} img`);
        const iconURL = await icon.getAttribute('src');
        context.set(aliasTopicIconURL, iconURL);
    });

    await cms.instruction(
        `school admin uploads image to topic icon`,
        async function (cms: CMSInterface) {
            await cms.uploadAttachmentFiles(
                sampleImageFilePath,
                FileTypes.IMAGE,
                'AvatarInput__input'
            );
        }
    );
}

export const schoolAdminSeeTopicInStudyPlanDetail = async (
    cms: CMSInterface,
    topicName: string
) => {
    await cms.page?.waitForSelector(getItemTopicNameColumnWithName(topicName));
};

export async function schoolAdminSeesNewTopicIcon(
    cms: CMSInterface,
    context: ScenarioContext
): Promise<void> {
    await expandAllChaptersTopics(cms, context);
    const topicName = context.get<string>(aliasTopicName);
    const icon = await cms.page!.waitForSelector(`${topicItem(topicName)} img`);
    const iconURL = await icon.getAttribute('src');
    const oldIconUrl = await context.get(aliasTopicIconURL);
    weExpect(iconURL, `the topic icon url has changed`).not.toBe(oldIconUrl);
    context.set(aliasTopicIconURL, iconURL);
}

export async function studentSeesNewTopicIcon(learner: LearnerInterface, topicIconURL: string) {
    const listKey = new ByValueKey(SyllabusLearnerKeys.chapter_with_topic_list);
    const topicIconKey = new ByValueKey(SyllabusLearnerKeys.topic_icon_url(topicIconURL));

    await learner.instruction(`Assert topic icon url: ${topicIconURL}`, async function () {
        await studentSeeChapterList(learner);
        await learner.flutterDriver!.scrollUntilVisible(listKey, topicIconKey, 0.0, 0.0, -100);
    });
}
