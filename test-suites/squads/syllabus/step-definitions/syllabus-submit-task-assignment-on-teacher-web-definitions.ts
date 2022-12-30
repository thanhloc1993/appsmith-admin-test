import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasAssignmentFiles,
    aliasTaskAssignmentCompleteDate,
    aliasTaskAssignmentCorrectness,
    aliasTaskAssignmentDuration,
    aliasTaskAssignmentTextNote,
    aliasTaskAssignmentUnderstandingLevel,
} from './alias-keys/syllabus';
import { loAndAssignmentByName } from './cms-selectors/cms-keys';
import { schoolAdminIsOnBookDetailsPage } from './syllabus-content-book-create-definitions';
import { ByText, ByValueKey } from 'flutter-driver-x';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

export const teacherFillsCompleteDateOnTaskAssignment = async (
    teacher: TeacherInterface,
    date: number
) => {
    const driver = teacher.flutterDriver!;
    const completeDateFinder = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentCompleteDateTextFormField
    );
    const listKey = new ByValueKey(SyllabusTeacherKeys.taskAssignmentScrollBodyView);
    try {
        await driver.scrollUntilVisible(listKey, completeDateFinder, 0.0, 0.0, -100);
        await driver.tap(completeDateFinder);
    } catch (error) {
        await driver.tap(completeDateFinder);
    }
    await driver.tap(new ByText(`${date}`));
    const okDateText = new ByText('OK');
    await driver.tap(okDateText);
};

export const teacherGetsCompleteDateOnTaskAssignment = async (
    teacher: TeacherInterface,
    context: ScenarioContext
) => {
    const driver = teacher.flutterDriver!;
    const completeDateInput = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentCompleteDateTextFormField
    );
    const completeDate = await driver.getText(completeDateInput);
    context.set(aliasTaskAssignmentCompleteDate, completeDate);
};

export const teacherFillsDurationOnTaskAssignment = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const durationFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentDurationTextFormField);
    const listKey = new ByValueKey(SyllabusTeacherKeys.taskAssignmentScrollBodyView);
    try {
        await driver.scrollUntilVisible(listKey, durationFinder, 0.0, 0.0, -100);
        await driver.tap(durationFinder);
    } catch (error) {
        await driver.tap(durationFinder);
    }
    const okTimeKey = new ByText('OK');
    await driver.tap(okTimeKey);
};

export const teacherGetsDurationOnTaskAssignment = async (
    teacher: TeacherInterface,
    context: ScenarioContext
) => {
    const driver = teacher.flutterDriver!;
    const durationInput = new ByValueKey(SyllabusTeacherKeys.taskAssignmentDurationTextFormField);
    const duration = await driver.getText(durationInput);
    context.set(aliasTaskAssignmentDuration, duration);
};

export const teacherFillsCorrectnessOnTaskAssignment = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const correctFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentCorrectTextFormField);
    const listKey = new ByValueKey(SyllabusTeacherKeys.taskAssignmentScrollBodyView);
    try {
        await driver.scrollUntilVisible(listKey, correctFinder, 0.0, 0.0, -100);
        await driver.tap(correctFinder);
    } catch (error) {
        await driver.tap(correctFinder);
    }

    await driver.enterText('1');
    const totalFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentTotalTextFormField);
    try {
        await driver.scrollUntilVisible(listKey, totalFinder, 0.0, 0.0, -100);
        await driver.tap(totalFinder);
    } catch (error) {
        await driver.tap(totalFinder);
    }
    await driver.enterText('2');
};

export const teacherGetsCorrectnessOnTaskAssignment = async (
    learner: TeacherInterface,
    context: ScenarioContext
) => {
    const driver = learner.flutterDriver!;
    const correctInput = new ByValueKey(SyllabusTeacherKeys.taskAssignmentCorrectTextFormField);
    const correct = await driver.getText(correctInput);
    const totalInput = new ByValueKey(SyllabusTeacherKeys.taskAssignmentTotalTextFormField);
    const total = await driver.getText(totalInput);
    const correctness = `${correct}/${total}`;
    context.set(aliasTaskAssignmentCorrectness, correctness);
};

export const teacherChoosesUnderstandingLevelOnTaskAssignment = async (
    teacher: TeacherInterface,
    context: ScenarioContext
) => {
    const driver = teacher.flutterDriver!;
    const emojiList = ['EmojiEnum.laughing', 'EmojiEnum.sad', 'EmojiEnum.smiling'];
    const randomIndex = randomInteger(0, emojiList.length - 1);
    const selectedEmoji = emojiList[randomIndex];
    const emojiKey = new ByValueKey(selectedEmoji);
    const listKey = new ByValueKey(SyllabusTeacherKeys.taskAssignmentScrollBodyView);
    try {
        await driver.scrollUntilVisible(listKey, emojiKey, 0.0, 0.0, -100);
        await driver.tap(emojiKey);
    } catch (error) {
        await driver.tap(emojiKey);
    }
    context.set(aliasTaskAssignmentUnderstandingLevel, selectedEmoji);
};

export const teacherAttachesFilesOnTaskAssignment = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const attachMaterialsButton = new ByValueKey(SyllabusTeacherKeys.attachYourMaterials);
    await driver.waitFor(attachMaterialsButton);
    await teacher.prepareUploadAttachmentType('image');
    const listKey = new ByValueKey(SyllabusTeacherKeys.taskAssignmentScrollBodyView);
    try {
        await driver.scrollUntilVisible(listKey, attachMaterialsButton, 0.0, 0.0, -100);
        await driver.tap(attachMaterialsButton);
    } catch (error) {
        await driver.tap(attachMaterialsButton);
    }
    const attachmentLoading = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentAttachmentLoading(0)
    );
    try {
        await driver.waitFor(attachmentLoading, 2000);
    } catch {
        console.log('Not found attachmentLoading: continue running');
    }
    await driver.waitForAbsent(attachmentLoading, 60000);
};

export const teacherGetsAttachmentNamesOnTaskAssignment = async (
    teacher: TeacherInterface,
    context: ScenarioContext
) => {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(new ByValueKey(SyllabusTeacherKeys.taskAssignmentAttachmentFiles(0)));
    const uploadedAttachmentName = await driver.getText(
        new ByValueKey(SyllabusTeacherKeys.taskAssignmentAttachmentFiles(0))
    );
    context.set(aliasAssignmentFiles, [uploadedAttachmentName]);
};

export const teacherFillsTextNoteOnTaskAssignment = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const textNoteFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentTextNoteTextFormField);
    const listKey = new ByValueKey(SyllabusTeacherKeys.taskAssignmentScrollBodyView);
    try {
        await driver.scrollUntilVisible(listKey, textNoteFinder, 0.0, 0.0, 100);
        await driver.tap(textNoteFinder);
    } catch (error) {
        await driver.tap(textNoteFinder);
    }
    await driver.enterText('task assignment text note');
};

export const teacherGetsTextNoteOnTaskAssignment = async (
    teacher: TeacherInterface,
    context: ScenarioContext
) => {
    const driver = teacher.flutterDriver!;
    const textNoteFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentTextNoteTextFormField);
    const textNote = await driver.getText(textNoteFinder);
    context.set(aliasTaskAssignmentTextNote, textNote);
};

export const teacherGoesToTaskAssignmentDetailScreen = async (
    teacher: TeacherInterface,
    assignmentName: string
) => {
    const driver = teacher.flutterDriver!;
    const studyPlanItemKey = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemRow(assignmentName)
    );
    const studyPlanTableKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemList);
    await driver.waitFor(studyPlanTableKey, 10000);
    try {
        await driver.tap(studyPlanItemKey);
    } catch (error) {
        await driver.scrollUntilTap(studyPlanTableKey, studyPlanItemKey, 0.0, -300, 10000);
    }
};

export const teacherCanSubmitTaskAssignment = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const buttonKey = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentSaveButtonWithCondition(true)
    );
    await driver.waitFor(buttonKey);
};

export const teacherCannotSubmitTaskAssignment = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const buttonKey = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentSaveButtonWithCondition(false)
    );
    await driver.waitFor(buttonKey);
};

export const teacherSubmitsTaskAssignment = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const buttonKey = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentSaveButtonWithCondition(true)
    );
    const listKey = new ByValueKey(SyllabusTeacherKeys.taskAssignmentScrollBodyView);
    try {
        await driver.waitFor(listKey);
        await driver.scrollUntilVisible(listKey, buttonKey, 0.0, 0.0, 100);
        await driver.tap(buttonKey);
    } catch (error) {
        throw Error(`Expect can tap save button`);
    }
};

export const teacherSeesDashboard = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const teacherDashboard = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTab);
    await driver.waitFor(teacherDashboard);
};

export async function schoolAdminGoesToTaskAssignmentDetails(
    cms: CMSInterface,
    context: ScenarioContext,
    assignmentName: string
): Promise<void> {
    await cms.instruction('User goes to the book detail page', async () => {
        await schoolAdminIsOnBookDetailsPage(cms, context);
    });

    await cms.page?.click(loAndAssignmentByName(assignmentName));

    await cms.instruction('User waiting for assignment detail page loaded', async () => {
        await cms.waitForSkeletonLoading();
        await cms.assertThePageTitle(assignmentName);
    });
}
