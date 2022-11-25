import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export const teacherRemoveTaskAssignment = async (teacher: TeacherInterface) => {
    const driver = teacher.flutterDriver!;
    const removeButtonFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentRemoveButton);
    const removePopupFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentRemovePopupItem);
    const removeOptionFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentRemoveOption);

    await driver.tap(removeButtonFinder);
    await driver.tap(removePopupFinder);
    await driver.tap(removeOptionFinder);
};

export const teacherDoesNotSeeCompleteDateOnTeacherDashBoard = async (
    teacher: TeacherInterface,
    taskAssignmentName: string,
    completeDate: string
) => {
    const driver = teacher.flutterDriver!;
    const completeDateFinder = new ByValueKey(
        SyllabusTeacherKeys.studyPlanItemV2CompletedDate(taskAssignmentName, completeDate)
    );
    await driver.waitForAbsent(completeDateFinder);
};

export const teacherDoesNotSeeGradeOnTeacherDashBoard = async (
    teacher: TeacherInterface,
    taskAssignmentName: string,
    correctness: string
) => {
    const driver = teacher.flutterDriver!;
    const gradeFinder = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemGradeText(taskAssignmentName)
    );
    const gradeInTeacher = await driver.getText(gradeFinder);
    weExpect(
        gradeInTeacher,
        `Expect grade in teacher dashboard ${gradeInTeacher} is not ${correctness} as the latest submission that been removed and is empty`
    ).toEqual('--');
};

export const teacherDoesNotSeeSubmittedCompleteDate = async (
    teacher: TeacherInterface,
    submittedCompleteDate: string
) => {
    const driver = teacher.flutterDriver!;
    const completeDateInput = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentCompleteDateTextFormField
    );
    const displayedCompleteDate = await driver.getText(completeDateInput);
    const currentDate = new Date();
    const thisYear = currentDate.getFullYear();
    let formattedSubmittedDate = submittedCompleteDate;
    if (thisYear.toString() == submittedCompleteDate.split('/')[0]) {
        formattedSubmittedDate = `${submittedCompleteDate.split('/')[1]}/${
            submittedCompleteDate.split('/')[2]
        }`;
    }

    weExpect(
        displayedCompleteDate,
        `The displayed complete date is ${displayedCompleteDate} and not equal to the latest submitted complete date ${formattedSubmittedDate}`
    ).toEqual('');
};

export const teacherDoesNotSeeSubmittedTextNote = async (
    teacher: TeacherInterface,
    submittedTextNote: string
) => {
    const driver = teacher.flutterDriver!;
    const textNoteInput = new ByValueKey(SyllabusTeacherKeys.taskAssignmentTextNoteTextFormField);
    const displayedTextNote = await driver.getText(textNoteInput);

    weExpect(
        displayedTextNote,
        `The displayed text note is ${displayedTextNote} and not equal to the latest submitted text note ${submittedTextNote}`
    ).toEqual('');
};

export const teacherDoesNotSeeSubmittedCorrectness = async (
    teacher: TeacherInterface,
    submittedCorrectness: string
) => {
    const driver = teacher.flutterDriver!;
    const correctInput = new ByValueKey(SyllabusTeacherKeys.taskAssignmentCorrectTextFormField);
    const totalInput = new ByValueKey(SyllabusTeacherKeys.taskAssignmentTotalTextFormField);

    const correct = await driver.getText(correctInput);
    const total = await driver.getText(totalInput);
    const displayedCorrectness = `${correct}/${total}`;

    weExpect(
        displayedCorrectness,
        `The displayed correctness is ${displayedCorrectness} and not equal to the latest submitted correctness ${submittedCorrectness}`
    ).toEqual('/');
};

export const teacherDoesNotSeeSubmittedDuration = async (
    teacher: TeacherInterface,
    submittedDuration: string
) => {
    const driver = teacher.flutterDriver!;
    const durationInput = new ByValueKey(SyllabusTeacherKeys.taskAssignmentDurationTextFormField);
    const displayedDuration = await driver.getText(durationInput);

    weExpect(
        displayedDuration,
        `The displayed duration is ${displayedDuration} and not equal to the previous submitted duration ${submittedDuration}`
    ).toEqual('');
};

export const teacherDoesNotSeeTaskAssignmentAttachments = async (
    teacher: TeacherInterface,
    attachmentFileName: string
) => {
    const uploadedAttachmentFinder = new ByValueKey(attachmentFileName);
    await teacher.flutterDriver!.waitForAbsent(uploadedAttachmentFinder);
};

export const teacherDoesNotSeeSubmittedUnderstandingLevel = async (
    teacher: TeacherInterface,
    submittedUnderstandingLevel: string
) => {
    const driver = teacher.flutterDriver!;
    const understandingLevelFinder = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentUnderstandingLevel(submittedUnderstandingLevel)
    );
    await driver.waitForAbsent(understandingLevelFinder);
};

export const studentSeesDefaultCompleteDate = async (
    learner: LearnerInterface,
    defaultCompleteDate: string
) => {
    const driver = learner.flutterDriver!;
    const completeDateInput = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentCompleteDateTextFormField
    );
    const displayedCompleteDate = await driver.getText(completeDateInput);

    weExpect(
        displayedCompleteDate,
        `The displayed complete date ${displayedCompleteDate} is equal to the default complete date ${defaultCompleteDate}`
    ).toEqual(defaultCompleteDate);
};

export const studentDoesNotSeeSubmittedTextNote = async (
    learner: LearnerInterface,
    submittedTextNote: string
) => {
    const driver = learner.flutterDriver!;
    const textNoteInput = new ByValueKey(
        SyllabusLearnerKeys.assignment_note_field_text(submittedTextNote)
    );
    await driver.waitForAbsent(textNoteInput);
};

export const studentDoesNotSeeSubmittedCorrectness = async (
    learner: LearnerInterface,
    submittedCorrectness: string
) => {
    const driver = learner.flutterDriver!;
    const correctInput = new ByValueKey(SyllabusLearnerKeys.taskAssignmentCorrectTextFormField);
    const totalInput = new ByValueKey(SyllabusLearnerKeys.taskAssignmentTotalTextFormField);

    const correct = await driver.getText(correctInput);
    const total = await driver.getText(totalInput);
    const displayedCorrectness = `${correct}/${total}`;

    weExpect(
        displayedCorrectness,
        `The displayed correctness is ${displayedCorrectness} and not equal to the latest submitted correctness ${submittedCorrectness}`
    ).toEqual('/');
};

export const studentDoesNotSeeSubmittedDuration = async (
    learner: LearnerInterface,
    submittedDuration: string
) => {
    const driver = learner.flutterDriver!;
    const durationInput = new ByValueKey(SyllabusLearnerKeys.taskAssignmentDurationTextFormField);
    const displayedDuration = await driver.getText(durationInput);

    weExpect(
        displayedDuration,
        `The displayed duration is ${displayedDuration} and not equal to the previous submitted duration ${submittedDuration}`
    ).toEqual('');
};

export const studentDoesNotSeeTaskAssignmentAttachments = async (
    learner: LearnerInterface,
    attachmentFileName: string
) => {
    const uploadedAttachmentFinder = new ByValueKey(attachmentFileName);
    await learner.flutterDriver!.waitForAbsent(uploadedAttachmentFinder);
};

export const studentDoesNotSeeSubmittedUnderstandingLevel = async (
    learner: LearnerInterface,
    submittedUnderstandingLevel: string
) => {
    const driver = learner.flutterDriver!;
    const understandingLevelFinder = new ByValueKey(
        SyllabusLearnerKeys.taskAssignmentUnderstandingLevel(submittedUnderstandingLevel)
    );
    await driver.waitForAbsent(understandingLevelFinder);
};
