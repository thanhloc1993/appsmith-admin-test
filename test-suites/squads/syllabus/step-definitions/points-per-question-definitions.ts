import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, TeacherInterface } from '@supports/app-types';

import { QuizDescription } from './cms-models/quiz';
import {
    schoolAdminFillQuizPoint,
    schoolAdminFillQuizQuestionData,
} from './syllabus-create-question-definitions';
import {
    schoolAdminClicksQuestionOptions,
    schoolAdminDeletesAQuestion,
    schoolAdminWaitingDeleteQuestionDialogHidden,
} from './syllabus-delete-question-definitions';
import {
    schoolAdminChooseAddQuestionButtonByLOType,
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminFillsAllAnswersByQuestionType,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingUpsertQuestionDialog,
} from './syllabus-question-utils';
import { ByValueKey } from 'flutter-driver-x';

export const teacherOpensAttemptHistory = async (
    teacher: TeacherInterface,
    loName: string,
    loId: string
) => {
    const driver = teacher.flutterDriver!;
    const studentStudyPlanLORowFinder = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemRow(loName)
    );
    const studentStudyPlanLOHistoryButtonFinder = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanLOHistoryButton(loId)
    );
    await driver.runUnsynchronized(async () => {
        await driver.waitFor(studentStudyPlanLORowFinder, 10000);
        await driver.waitFor(studentStudyPlanLOHistoryButtonFinder, 5000);
        await driver.tap(studentStudyPlanLOHistoryButtonFinder);
    });
};

export const schoolAdminDeletesQuestion = async (questionName: string, cms: CMSInterface) => {
    await schoolAdminClicksQuestionOptions(cms, questionName);

    await schoolAdminDeletesAQuestion(cms);

    await schoolAdminWaitingDeleteQuestionDialogHidden(cms);

    await cms.waitForSkeletonLoading();
};

export const schoolAdminCreatesQuestionWithPoints = async (
    quizDescription: QuizDescription,
    cms: CMSInterface
) => {
    await schoolAdminChooseAddQuestionButtonByLOType(cms, 'exam LO');

    await schoolAdminWaitingUpsertQuestionDialog(cms);
    await schoolAdminChooseToCreateQuizWithTypeV2(cms, quizDescription.type);

    await schoolAdminFillQuizPoint(cms, quizDescription.point);

    await schoolAdminFillQuizQuestionData(cms, quizDescription.content);

    await schoolAdminFillsAllAnswersByQuestionType(cms, quizDescription.type);

    await schoolAdminSubmitQuestion(cms);
};
