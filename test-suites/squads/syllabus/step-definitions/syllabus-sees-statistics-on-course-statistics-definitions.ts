import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { Quiz } from '@supports/services/common/quiz';

import { aliasQuizAnswerByQuestionName } from './alias-keys/syllabus';
import {
    studentFillFlashcardQuestion,
    studentSeesAndDoesMCQQuestion,
    studentSeesAndDoesMCQQuestionCorrect,
    studentSubmitsQuizAnswer,
} from './syllabus-create-question-definitions';
import {
    schoolAdminSelectTaskAssignmentSetting,
    TaskAssignmentSettingInfo,
} from './syllabus-create-task-assignment-definitions';
import { schoolAdminUpdateAssignmentGrade } from './syllabus-edit-assignment-definitions';
import { schoolAdminUploadLOStudyGuide } from './syllabus-edit-learning-objective-definitions';
import { LearningType } from './syllabus-sees-statistics-on-course-statistics-steps';
import { ByValueKey } from 'flutter-driver-x';

export const schoolAdminModifiesLearningType = async (
    cms: CMSInterface,
    context: ScenarioContext,
    learningType: LearningType
) => {
    // since receive support from FE to create by gRPC, no need this fn
    switch (learningType) {
        case 'Assignment non requires grading':
            await schoolAdminUpdateAssignmentGrade(cms, context, 'not require grading');
            break;
        case 'Assignment requires grading':
            console.log(`Already created`);
            break;
        case 'Exam LO':
            console.log(`Already created`);
            break;
        case 'Flashcard':
            console.log(`Already created`);
            break;
        case 'LO with quizzes':
            console.log(`Already created`);
            break;
        case 'TaskAssignment has Correctness':
            await schoolAdminSelectTaskAssignmentSetting(cms, [
                'Correctness',
            ] as TaskAssignmentSettingInfo[]);
            await cms.selectAButtonByAriaLabel('Save');
            break;
        case 'TaskAssignment no Correctness':
            console.log(`Already created`);
            break;
        case 'non LO with quizzes':
            await schoolAdminUploadLOStudyGuide(cms);
            break;
        default:
            break;
    }
};

export const studentLearnsStudyGuide = async (learner: LearnerInterface) => {
    const nextQuizButton = new ByValueKey(SyllabusLearnerKeys.next_quiz_button);
    await learner.flutterDriver!.tap(nextQuizButton);
};

export const studentBackToTopicListAfterSubmitAssignment = async (
    learner: LearnerInterface,
    topicName: string
) => {
    const learningFinishedTopicScreen = new ByValueKey(
        SyllabusLearnerKeys.learning_finished_topic_screen(topicName)
    );

    const nextButton = new ByValueKey(SyllabusLearnerKeys.next_button);
    const backToListButton = new ByValueKey(SyllabusLearnerKeys.back_to_list_text);

    await learner.instruction(
        `At Completed screen, tap next button`,
        async function (this: LearnerInterface) {
            await learner.flutterDriver!.waitFor(nextButton);
            await learner.flutterDriver!.tap(nextButton);
        }
    );

    await learner.instruction(
        `At Learning Finished Topic Screen, tap back to list button`,
        async function (this: LearnerInterface) {
            await learner.flutterDriver!.waitFor(learningFinishedTopicScreen);
            await learner.flutterDriver!.waitFor(backToListButton);
            await learner.flutterDriver!.tap(backToListButton);
        }
    );
};

export const studentBackToTopicListAfterSubmitLO = async (
    learner: LearnerInterface,
    topicName: string
) => {
    const learningFinishedTopicScreen = new ByValueKey(
        SyllabusLearnerKeys.learning_finished_topic_screen(topicName)
    );

    const nextButton = new ByValueKey(SyllabusLearnerKeys.next_button);
    const backToListButton = new ByValueKey(SyllabusLearnerKeys.back_to_list_text);

    await learner.instruction(
        `At Completed screen, tap next button`,
        async function (this: LearnerInterface) {
            await learner.flutterDriver!.waitFor(nextButton);
            await learner.flutterDriver!.tap(nextButton);
        }
    );

    await learner.instruction(
        `At Achievement screen, tap next button`,
        async function (this: LearnerInterface) {
            await learner.flutterDriver!.waitFor(nextButton);
            await learner.flutterDriver!.tap(nextButton);
        }
    );

    await learner.instruction(
        `At Learning Finished Topic Screen, tap back to list button`,
        async function (this: LearnerInterface) {
            await learner.flutterDriver!.waitFor(learningFinishedTopicScreen);
            await learner.flutterDriver!.waitFor(backToListButton);
            await learner.flutterDriver!.tap(backToListButton);
        }
    );
};

export const studentBackToTopicListAfterSubmitExamLO = async (learner: LearnerInterface) => {
    const nextButton = new ByValueKey(SyllabusLearnerKeys.next_button);
    const viewAnswerKeyButton = new ByValueKey(SyllabusLearnerKeys.viewAnswerKeyButton);
    const backButton = new ByValueKey(SyllabusLearnerKeys.back_button);

    await learner.instruction(
        `At Completed screen, tap next button`,
        async function (this: LearnerInterface) {
            await learner.flutterDriver!.tap(nextButton);
        }
    );

    await learner.instruction(
        `At Learning Finished Topic Screen, tap view key answer button`,
        async function (this: LearnerInterface) {
            await learner.flutterDriver!.tap(viewAnswerKeyButton);
        }
    );

    await learner.instruction(
        `At Exam LO Screen, tap back button`,
        async function (this: LearnerInterface) {
            await learner.flutterDriver!.tap(backButton);
        }
    );
};

export const studentSeesAndDoesLOQuestionsWithCorrectQuizzes = async (
    learner: LearnerInterface,
    correctQuizzes: number,
    totalQuizzes: number,
    quizzesList: Quiz[]
) => {
    for (let i = 0; i < correctQuizzes; i++) {
        await studentSeesAndDoesMCQQuestionCorrect(learner, quizzesList[i].externalId);
        await studentSubmitsQuizAnswer(learner, quizzesList[i].externalId);
    }
    for (let i = correctQuizzes; i < totalQuizzes; i++) {
        await studentSeesAndDoesMCQQuestion(learner, quizzesList[i].externalId);
        await studentSubmitsQuizAnswer(learner, quizzesList[i].externalId);
    }
};

export const studentDoesFlashCardWithCorrectQuizzes = async (
    context: ScenarioContext,
    learner: LearnerInterface,
    correctQuizzes: number,
    totalQuizzes: number,
    quizzesList: Quiz[]
) => {
    for (let i = 0; i < correctQuizzes; i++) {
        const answer = context.get<string>(
            aliasQuizAnswerByQuestionName(quizzesList[i].externalId)
        );
        await studentFillFlashcardQuestion(learner, answer);
        await studentSubmitsQuizAnswer(learner, quizzesList[i].externalId);
    }
    for (let i = correctQuizzes; i < totalQuizzes; i++) {
        await studentFillFlashcardQuestion(learner, `Answer ${i} not correct`);
        await studentSubmitsQuizAnswer(learner, quizzesList[i].externalId);
    }
};

export const teacherSeesAverageGradeOfStudyPlanItem = async (
    teacher: TeacherInterface,
    averageGrade: string,
    studyPlanItemName: string
) => {
    const averageGradeKey = new ByValueKey(
        SyllabusTeacherKeys.courseStatisticsStudyPlanItemAverageGrade(
            averageGrade,
            studyPlanItemName
        )
    );
    await teacher.flutterDriver!.waitFor(averageGradeKey);
};

export const teacherSeesCompletedStudentOfStudyPlanItem = async (
    teacher: TeacherInterface,
    completedStudent: string,
    studyPlanItemName: string
) => {
    const averageGradeKey = new ByValueKey(
        SyllabusTeacherKeys.courseStatisticsStudyPlanItemCompletedStudent(
            completedStudent,
            studyPlanItemName
        )
    );
    await teacher.flutterDriver!.waitFor(averageGradeKey);
};

export const teacherSeesAverageGradeOfTopic = async (
    teacher: TeacherInterface,
    averageGrade: string,
    topicName: string
) => {
    const averageGradeKey = new ByValueKey(
        SyllabusTeacherKeys.courseStatisticsTopicAverageGrade(averageGrade, topicName)
    );
    await teacher.flutterDriver!.waitFor(averageGradeKey);
};

export const teacherSeesCompletedStudentOfTopic = async (
    teacher: TeacherInterface,
    completedStudent: string,
    topicName: string
) => {
    const averageGradeKey = new ByValueKey(
        SyllabusTeacherKeys.courseStatisticsTopicCompletedStudent(completedStudent, topicName)
    );
    await teacher.flutterDriver!.waitFor(averageGradeKey);
};

export const teacherGoesToStudyPlanItemDetailsCourseStatisticsFlow = async (
    teacher: TeacherInterface,
    studyPlanItemName: string
) => {
    const studyPlanItemNameKey = new ByValueKey(
        SyllabusTeacherKeys.courseStatisticsStudyPlanItemName(studyPlanItemName)
    );

    await teacher.flutterDriver!.scrollIntoView(studyPlanItemNameKey, 0.0);
    await teacher.flutterDriver!.tap(studyPlanItemNameKey);
};

export const teacherSeesCompletedDateOfStudyPlanItem = async (
    teacher: TeacherInterface,
    userName: string,
    date: string
) => {
    const studyPlanItemCompletedDateKey = new ByValueKey(
        SyllabusTeacherKeys.studyPlanItemCompletedDate(userName, date)
    );
    await teacher.flutterDriver!.waitFor(studyPlanItemCompletedDateKey);
};

export const teacherSeesGradeOfStudyPlanItem = async (
    teacher: TeacherInterface,
    studentName: string,
    grade: string
) => {
    const studyPlanItemGradeKey = new ByValueKey(
        SyllabusTeacherKeys.courseStudyPlanItemGradeText(studentName, grade)
    );
    await teacher.flutterDriver!.waitFor(studyPlanItemGradeKey, 5000);
};

export const teacherGoesToSubmissionCourseStatisticsFlow = async (
    teacher: TeacherInterface,
    studentName: string
) => {
    const studyPlanItemKey = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemRow(studentName)
    );
    await teacher.flutterDriver!.tap(studyPlanItemKey);
};
