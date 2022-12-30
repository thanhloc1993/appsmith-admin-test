import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { emojiList } from '@supports/constants';

import { getLearnerToDoKeys, LearnerToDoTab } from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

export async function schoolAdminGoesToLODetailPage(cms: CMSInterface, name: string) {
    await schoolAdminClickLOByName(cms, name);

    await cms.instruction('school admin is waiting to load the details page', async () => {
        await cms.waitForSkeletonLoading();
        await cms.assertThePageTitle(name);
    });
}

export async function studentFillsCompleteDate(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const completeDateFinder = new ByValueKey(
        SyllabusLearnerKeys.taskAssignmentCompleteDateTextFormField
    );
    const listKey = new ByValueKey(SyllabusLearnerKeys.assignment_scrollview);

    try {
        await driver.scrollUntilVisible(listKey, completeDateFinder, 0.0, 0.0, -100);
        await driver.tap(completeDateFinder);
    } catch (error) {
        await driver.tap(completeDateFinder);
    }

    const completeDate = await driver.getText(completeDateFinder);
    return completeDate;
}

export async function studentFillsTextNote(learner: LearnerInterface, value: string) {
    const driver = learner.flutterDriver!;
    const loadingDialog = new ByValueKey(SyllabusLearnerKeys.loading_dialog);
    await driver.waitForAbsent(loadingDialog);

    const assignmentNote = new ByValueKey(SyllabusLearnerKeys.assignment_note_field);
    const assignmentScrollview = new ByValueKey(SyllabusLearnerKeys.assignment_scrollview);
    await driver.scrollUntilVisible(assignmentScrollview, assignmentNote, 0.0, 0.0, -300.0);
    await driver.waitFor(assignmentNote);
    await driver.tap(assignmentNote);
    await driver.enterText(value);
}

export const studentSelectsUnderstandingLevel = async (
    learner: LearnerInterface,
    emoticons = emojiList
) => {
    const driver = learner.flutterDriver!;
    const index = randomInteger(0, emoticons.length - 1);
    const selectedEmoji = emoticons[index];
    const emojiKey = new ByValueKey(selectedEmoji);
    const listKey = new ByValueKey(SyllabusLearnerKeys.assignment_scrollview);
    try {
        await driver.scrollUntilVisible(listKey, emojiKey, 0.0, 0.0, -100);
        await driver.tap(emojiKey);
    } catch (error) {
        await driver.tap(emojiKey);
    }
    return selectedEmoji;
};

export const studentSeesPreviousSelectedEmojiDeselected = async (
    learner: LearnerInterface,
    selectedEmoji: string
) => {
    const driver = learner.flutterDriver!;
    const understandingLevelFinder = new ByValueKey(
        SyllabusLearnerKeys.taskAssignmentUnderstandingLevel(selectedEmoji)
    );

    await driver.waitForAbsent(understandingLevelFinder);
};

export const studentGoesToTabInToDoScreen = async (
    learner: LearnerInterface,
    toDoTabPage: LearnerToDoTab
) => {
    const { pageKey, tabKey } = getLearnerToDoKeys(toDoTabPage);
    await learner.clickOnTab(tabKey, pageKey);
};
