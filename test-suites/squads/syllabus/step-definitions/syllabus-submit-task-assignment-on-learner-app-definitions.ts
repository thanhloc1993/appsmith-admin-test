import { randomInteger } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasScoreByStudyPlanItemNameAndLearnerName,
    aliasTaskAssignmentCompleteDate,
    aliasTaskAssignmentCorrectness,
    aliasTaskAssignmentDuration,
    aliasTaskAssignmentUnderstandingLevel,
} from './alias-keys/syllabus';
import { parseStudentDurationToTeacherDuration } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export async function studentIsOnTaskAssignmentDetailScreen(
    learner: LearnerInterface,
    assignmentName: string
): Promise<void> {
    const driver = learner.flutterDriver!;
    const assignmentScreenFinder = new ByValueKey(
        SyllabusLearnerKeys.assignment_screen([assignmentName])
    );
    await driver.waitFor(assignmentScreenFinder);
}

export const studentFillsCompleteDateOnTaskAssignment = async (learner: LearnerInterface) => {
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
};

export const studentGetsCompleteDateOnTaskAssignment = async (
    learner: LearnerInterface,
    context: ScenarioContext
) => {
    const driver = learner.flutterDriver!;
    const completeDateInput = new ByValueKey(
        SyllabusLearnerKeys.taskAssignmentCompleteDateTextFormField
    );
    const completeDate = await driver.getText(completeDateInput);
    await context.set(aliasTaskAssignmentCompleteDate, completeDate);
};

export const studentFillsCorrectnessOnTaskAssignment = async (learner: LearnerInterface) => {
    const driver = learner.flutterDriver!;
    const correctFinder = new ByValueKey(SyllabusLearnerKeys.taskAssignmentCorrectTextFormField);
    const listKey = new ByValueKey(SyllabusLearnerKeys.assignment_scrollview);
    try {
        await driver.scrollUntilVisible(listKey, correctFinder, 0.0, 0.0, -100);
        await driver.tap(correctFinder);
    } catch (error) {
        await driver.tap(correctFinder);
    }
    const correct = randomInteger(0, 10);
    await driver.enterText(`${correct}`);
    const totalFinder = new ByValueKey(SyllabusLearnerKeys.taskAssignmentTotalTextFormField);
    try {
        await driver.scrollUntilVisible(listKey, totalFinder, 0.0, 0.0, -100);
        await driver.tap(totalFinder);
    } catch (error) {
        await driver.tap(totalFinder);
    }
    const total = randomInteger(10, 20);
    await driver.enterText(`${total}`);
};

export const studentGetsCorrectnessOnTaskAssignment = async (
    learner: LearnerInterface,
    context: ScenarioContext,
    studyPlanItemName?: string,
    learnerName?: string
) => {
    const driver = learner.flutterDriver!;
    const correctInput = new ByValueKey(SyllabusLearnerKeys.taskAssignmentCorrectTextFormField);
    const correct = await driver.getText(correctInput);
    const totalInput = new ByValueKey(SyllabusLearnerKeys.taskAssignmentTotalTextFormField);
    const total = await driver.getText(totalInput);
    const correctness = `${correct}/${total}`;
    context.set(aliasTaskAssignmentCorrectness, correctness);
    context.set(
        aliasScoreByStudyPlanItemNameAndLearnerName(studyPlanItemName ?? '', learnerName ?? ''),
        correctness
    );
};

export const studentChoosesUnderstandingLevelOnTaskAssignment = async (
    learner: LearnerInterface,
    context: ScenarioContext
) => {
    const driver = learner.flutterDriver!;
    const emojiList = ['EmojiEnum.laughing', 'EmojiEnum.sad', 'EmojiEnum.smiling'];
    const randomIndex = randomInteger(0, emojiList.length - 1);
    const selectedEmoji = emojiList[randomIndex];
    const emojiKey = new ByValueKey(selectedEmoji);
    const listKey = new ByValueKey(SyllabusLearnerKeys.assignment_scrollview);
    try {
        await driver.scrollUntilVisible(listKey, emojiKey, 0.0, 0.0, -100);
        await driver.tap(emojiKey);
    } catch (error) {
        await driver.tap(emojiKey);
    }
    context.set(aliasTaskAssignmentUnderstandingLevel, selectedEmoji);
};

export const studentFillsDurationOnTaskAssignment = async (learner: LearnerInterface) => {
    const driver = learner.flutterDriver!;
    const durationFinder = new ByValueKey(SyllabusLearnerKeys.taskAssignmentDurationTextFormField);
    const listKey = new ByValueKey(SyllabusLearnerKeys.assignment_scrollview);
    try {
        await driver.scrollUntilVisible(listKey, durationFinder, 0.0, 0.0, -100);
        await driver.tap(durationFinder);
    } catch (error) {
        await driver.tap(durationFinder);
    }
};

export const studentGetsDurationOnTaskAssignment = async (
    learner: LearnerInterface,
    context: ScenarioContext
) => {
    const driver = learner.flutterDriver!;
    const durationInput = new ByValueKey(SyllabusLearnerKeys.taskAssignmentDurationTextFormField);
    const duration = await driver.getText(durationInput);
    await context.set(aliasTaskAssignmentDuration, duration);
};

export const studentSeesLearningTimeOnStatsPage = async (
    learner: LearnerInterface,
    date: string,
    duration: string
) => {
    const driver = learner.flutterDriver!;
    const todayLearningTimeFinder = new ByValueKey(
        SyllabusLearnerKeys.learningStatsOnDateWithLearningTime(date, duration)
    );
    await driver.waitFor(todayLearningTimeFinder);
};

export const studentDoesNotSeeLearningTimeOnStatsPage = async (
    learner: LearnerInterface,
    date: string,
    duration: string
) => {
    const driver = learner.flutterDriver!;
    const todayLearningTimeFinder = new ByValueKey(
        SyllabusLearnerKeys.learningStatsOnDateWithLearningTime(date, duration)
    );
    await driver.waitForAbsent(todayLearningTimeFinder);
};

export const teacherSeesIncompleteStatusOnTeacherDashBoard = async (
    teacher: TeacherInterface,
    taskAssignmentName: string
) => {
    const driver = teacher.flutterDriver!;
    const incompleteStatusFinder = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemStatusIncomplete(taskAssignmentName)
    );
    await driver.waitFor(incompleteStatusFinder);
};

export const teacherSeesCompleteStatusOnTeacherDashBoard = async (
    teacher: TeacherInterface,
    taskAssignmentName: string
) => {
    const driver = teacher.flutterDriver!;
    const completeStatusFinder = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemStatusCompleted(taskAssignmentName)
    );
    await driver.waitFor(completeStatusFinder);
};

export const teacherSeesCompleteDateOnTeacherDashBoard = async (
    teacher: TeacherInterface,
    taskAssignmentName: string,
    completeDate: string
) => {
    const driver = teacher.flutterDriver!;
    const completeDateFinder = new ByValueKey(
        SyllabusTeacherKeys.studyPlanItemV2CompletedDate(taskAssignmentName, completeDate)
    );
    await driver.waitFor(completeDateFinder);
};

export const teacherSeesGradeOnTeacherDashBoard = async (
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
        `Expect grade in teacher dashboard ${gradeInTeacher} is the same as correctness ${correctness} in submission string`
    ).toEqual(correctness);
};

export const teacherSeesIncompleteStatusOnTaskAssignmentDetailScreen = async (
    teacher: TeacherInterface
) => {
    const driver = teacher.flutterDriver!;
    const incompleteStatusFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentStatus(false));
    await driver.waitFor(incompleteStatusFinder);
};

export const teacherSeesCompleteStatusOnTaskAssignmentDetailScreen = async (
    teacher: TeacherInterface
) => {
    const driver = teacher.flutterDriver!;
    const completeStatusFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentStatus(true));
    await driver.waitFor(completeStatusFinder);
};

export const teacherSeesSubmittedCorrectness = async (
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
        `The displayed correctness ${displayedCorrectness} is equal to the submitted correctness ${submittedCorrectness}`
    ).toEqual(submittedCorrectness);
};

export const teacherSeesSubmittedDuration = async (
    teacher: TeacherInterface,
    submittedDuration: string
) => {
    const driver = teacher.flutterDriver!;
    const durationInput = new ByValueKey(SyllabusTeacherKeys.taskAssignmentDurationTextFormField);
    const displayedDuration = await driver.getText(durationInput);
    let formattedSubmittedDuration = submittedDuration;

    if (submittedDuration.includes(' ')) {
        formattedSubmittedDuration = parseStudentDurationToTeacherDuration(submittedDuration);
    }

    weExpect(
        displayedDuration,
        `The displayed duration ${displayedDuration} is equal to the submitted duration ${submittedDuration}`
    ).toEqual(formattedSubmittedDuration);
};

export const teacherSeesSubmittedCompleteDate = async (
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
        `The displayed complete date ${displayedCompleteDate} is equal to the submitted complete date ${formattedSubmittedDate}`
    ).toEqual(formattedSubmittedDate);
};

export const teacherSeesSubmittedTextNote = async (
    teacher: TeacherInterface,
    submittedTextNote: string
) => {
    const driver = teacher.flutterDriver!;
    const textNoteInput = new ByValueKey(SyllabusTeacherKeys.taskAssignmentTextNoteTextFormField);
    const displayedTextNote = await driver.getText(textNoteInput);

    weExpect(
        displayedTextNote,
        `The displayed text note ${displayedTextNote} is equal to the submitted text note ${submittedTextNote}`
    ).toEqual(submittedTextNote);
};

export const teacherSeesSubmittedUnderstandingLevel = async (
    teacher: TeacherInterface,
    submittedUnderstandingLevel: string
) => {
    const driver = teacher.flutterDriver!;
    const understandingLevelFinder = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentUnderstandingLevel(submittedUnderstandingLevel)
    );
    await driver.waitFor(understandingLevelFinder);
};

export const teacherSeesTaskAssignmentAttachments = async (
    teacher: TeacherInterface,
    attachmentFileName: string
) => {
    const uploadedAttachmentName = await teacher.flutterDriver!.getText(
        new ByValueKey(SyllabusTeacherKeys.taskAssignmentAttachmentFiles(0))
    );
    weExpect(
        uploadedAttachmentName,
        `The displayed text note ${uploadedAttachmentName} is equal to the submitted text note ${attachmentFileName}`
    ).toEqual(attachmentFileName);
};
