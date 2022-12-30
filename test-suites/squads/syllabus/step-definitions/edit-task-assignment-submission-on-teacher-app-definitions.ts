import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByText, ByValueKey, FlutterDriver } from 'flutter-driver-x';

export const studentSeesSubmittedTextNote = async (learner: LearnerInterface, value: string) => {
    const driver = learner.flutterDriver!;
    const textNoteInput = new ByValueKey(SyllabusLearnerKeys.assignment_note_field_text(value));
    const scrollView = new ByValueKey(SyllabusLearnerKeys.assignment_scrollview);

    try {
        await driver.scrollUntilVisible(scrollView, textNoteInput, 0.0, 0.0, 100, 20000);
    } catch {
        await driver.waitFor(textNoteInput);
    }
};

export const studentSeesSubmittedCorrectness = async (learner: LearnerInterface, value: string) => {
    const driver = learner.flutterDriver!;
    const correctInput = new ByValueKey(SyllabusLearnerKeys.taskAssignmentCorrectTextFormField);
    const totalInput = new ByValueKey(SyllabusLearnerKeys.taskAssignmentTotalTextFormField);

    const correctValue = await driver.getText(correctInput);
    const totalValue = await driver.getText(totalInput);
    const displayedCorrectness = `${correctValue}/${totalValue}`;

    weExpect(
        displayedCorrectness,
        `The displayed correctness is ${displayedCorrectness} and equal to correctness ${value}`
    ).toEqual(value);
};

export const studentSeesTaskAssignmentAttachments = async (
    learner: LearnerInterface,
    attachmentFileName: string
) => {
    const driver = learner.flutterDriver!;
    const uploadedAttachmentName = await driver.getText(
        new ByValueKey(SyllabusLearnerKeys.assignment_submitted_attachment_title(0))
    );

    weExpect(
        uploadedAttachmentName,
        `The displayed file attachment is ${uploadedAttachmentName} and equal to ${attachmentFileName}`
    ).toEqual(attachmentFileName);
};

export const studentSeesSubmittedUnderstandingLevel = async (
    learner: LearnerInterface,
    selectedEmoji: string
) => {
    const driver = learner.flutterDriver!;
    const understandingLevelFinder = new ByValueKey(
        SyllabusLearnerKeys.taskAssignmentUnderstandingLevel(selectedEmoji)
    );
    const scrollView = new ByValueKey(SyllabusLearnerKeys.assignment_scrollview);

    try {
        await driver.scrollUntilVisible(
            scrollView,
            understandingLevelFinder,
            0.0,
            0.0,
            -100,
            20000
        );
    } catch {
        await driver.waitFor(understandingLevelFinder);
    }
};

export const teacherTapsSelectorOnTaskAssignment = async (
    driver: FlutterDriver,
    selector: ByValueKey,
    dy = -100
) => {
    const listKey = new ByValueKey(SyllabusTeacherKeys.taskAssignmentScrollBodyView);

    try {
        await driver.scrollUntilVisible(listKey, selector, 0.0, 0.0, dy);
        await driver.tap(selector);
    } catch {
        await driver.tap(selector);
    }
};

export const teacherTapsCompleteDateOnTaskAssignment = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const completeDateFinder = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentCompleteDateTextFormField
    );

    await teacherTapsSelectorOnTaskAssignment(driver, completeDateFinder);
};

export const teacherTapsDurationOnTaskAssignment = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const durationFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentDurationTextFormField);

    await teacherTapsSelectorOnTaskAssignment(driver, durationFinder);
};

export const teacherCannotEditCompleteDateOrDuration = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const okText = new ByText('OK');
    await driver.waitForAbsent(okText);
};

export const teacherEditsTextNoteOnTaskAssignment = async (
    teacher: TeacherInterface,
    content: string
) => {
    const driver = teacher.flutterDriver!;
    const textNoteFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentTextNoteTextFormField);

    await teacherTapsSelectorOnTaskAssignment(driver, textNoteFinder, 100);
    await driver.enterText(content);

    const textNote = await driver.getText(textNoteFinder);
    return textNote;
};

export const teacherEditsCorrectnessOnTaskAssignment = async (
    teacher: TeacherInterface,
    correct: string,
    total: string
) => {
    const driver = teacher.flutterDriver!;
    const correctFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentCorrectTextFormField);
    const totalFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentTotalTextFormField);

    await teacherTapsSelectorOnTaskAssignment(driver, correctFinder);
    await driver.enterText(correct);

    await teacherTapsSelectorOnTaskAssignment(driver, totalFinder);
    await driver.enterText(total);

    const correctValue = await driver.getText(correctFinder);
    const totalValue = await driver.getText(totalFinder);
    return { correctValue, totalValue };
};

export const teacherRemovesAttachmentFilesOnTaskAssignment = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const uploadedAttachmentName = await driver.getText(
        new ByValueKey(SyllabusTeacherKeys.taskAssignmentAttachmentFiles(0))
    );
    const removeButton = new ByValueKey(
        SyllabusTeacherKeys.deleteAttachmentButtonByFileName(uploadedAttachmentName)
    );
    const deleteAttachmentButton = new ByValueKey(SyllabusTeacherKeys.deleteAttachment);

    await teacherTapsSelectorOnTaskAssignment(driver, removeButton);

    await teacherTapsSelectorOnTaskAssignment(driver, deleteAttachmentButton);

    await driver.waitForAbsent(
        new ByValueKey(SyllabusTeacherKeys.taskAssignmentAttachmentFiles(0))
    );
};

export const teacherSelectsUnderstandingLevelOnTaskAssignment = async (
    teacher: TeacherInterface,
    selectedEmoji: string
) => {
    const driver = teacher.flutterDriver!;
    const emojiItem = new ByValueKey(selectedEmoji);

    await teacherTapsSelectorOnTaskAssignment(driver, emojiItem);

    return { selectedEmoji };
};
