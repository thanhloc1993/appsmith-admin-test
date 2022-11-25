import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasLOName, aliasTopicName } from './alias-keys/syllabus';
import {
    deleteOption,
    optionsButton,
    questionListTable,
    questionRow,
    tableBaseRow,
} from './cms-selectors/cms-keys';
import {
    getAllQuizQuestionsNameInTable,
    schoolAdminCreateLOQuestion,
    studentGoesToLODetailsPage,
    studentSeesAndDoesLOQuestionsWithIncorrectQuizzes,
    teacherGoesToStudyPlanItemDetails,
} from './syllabus-create-question-definitions';
import {
    studentSeesLOAchievement,
    studentSeesLOQuestionsResult,
    studentSeesTopicProgress,
} from './syllabus-do-lo-quiz-definitions';
import { schoolAdminWaitingQuestionDataSync } from './syllabus-migration-temp';
import {
    schoolAdminSelectCreateQuiz,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import { studentTapButtonOnScreen } from './syllabus-utils';
import { delay } from 'flutter-driver-x';
import { ByValueKey } from 'flutter-driver-x';

export async function deletesGrpcQuizzes(cms: CMSInterface) {
    const quizQuestionTable = await cms.page!.waitForSelector(questionListTable);

    const quizQuestionListItem = await quizQuestionTable.$$(questionRow);

    const numberOfQuiz = quizQuestionListItem.length;

    for (let i = 0; i < numberOfQuiz; i++) {
        const quizOptionsButton = await cms.page!.waitForSelector(
            `${tableBaseRow} ${optionsButton}`
        );
        await quizOptionsButton.click();

        await cms.page!.waitForSelector(deleteOption);
        await cms.selectAButtonByAriaLabel('Delete');

        await cms.selectAButtonByAriaLabel('Confirm');
        await delay(1000);
    }
}

export async function createNewQuizzes(
    cms: CMSInterface,
    scenario: ScenarioContext,
    quizzesCount: number
) {
    for (let i = 0; i < quizzesCount; i++) {
        await schoolAdminSelectCreateQuiz(cms);

        await schoolAdminCreateLOQuestion(cms, 'fill in the blank', scenario);
        await cms.waitingForLoadingIcon();
        await delay(1000);
    }

    await schoolAdminWaitingQuestionDataSync(cms);
    await cms.waitingForLoadingIcon();
    await cms.waitForSkeletonLoading();
    await schoolAdminWaitingQuizTableInTheLODetail(cms);

    await getAllQuizQuestionsNameInTable(cms, scenario);
}

export async function doQuizWithIncorrectQuizzesAndBack(
    scenario: ScenarioContext,
    learner: LearnerInterface,
    incorrectQuizCount: number
) {
    const context = scenario;
    const topicName = scenario.get<string>(aliasTopicName);
    const loName = scenario.get<string>(aliasLOName);
    const studyPlanItemName = scenario.get<string>(aliasLOName);
    await learner.instruction(
        `Student does questions of this LO ${studyPlanItemName} on Learner App with ${incorrectQuizCount} incorrect response`,
        async function (learner) {
            await studentSeesAndDoesLOQuestionsWithIncorrectQuizzes(
                learner,
                context,
                incorrectQuizCount
            );
        }
    );
    await learner.instruction(`student sees LO questions result`, async function (learner) {
        await studentSeesLOQuestionsResult(learner, scenario, loName);
    });

    await learner.instruction(
        `student goes next to quiz achievement screen`,
        async function (learner) {
            const learningQuizFinishedScreen = SyllabusLearnerKeys.quiz_finished_screen(loName);
            const nextButton = SyllabusLearnerKeys.next_button;
            await studentTapButtonOnScreen(learner, learningQuizFinishedScreen, nextButton);
        }
    );

    await learner.instruction(
        `student sees crown equivalent to quiz achievement`,
        async function (learner) {
            await studentSeesLOAchievement(learner, scenario, loName);
        }
    );

    await learner.instruction(
        `student goes next to topic progress screen`,
        async function (learner) {
            const learningFinishedAchievementScreen =
                SyllabusLearnerKeys.quiz_finished_achievement_screen(loName);
            const nextButton = SyllabusLearnerKeys.next_button;
            await studentTapButtonOnScreen(learner, learningFinishedAchievementScreen, nextButton);
        }
    );

    await learner.instruction(`student sees topic progress`, async function (learner) {
        await studentSeesTopicProgress(learner, scenario);
    });

    await learner.instruction(
        'student goes back to Topic List from Quiz Finish Topic Progress Screen',
        async function (learner) {
            const backToListButton = SyllabusLearnerKeys.back_to_list_text;
            const quizFinishTopicProgressScreen =
                SyllabusLearnerKeys.learning_finished_topic_screen(topicName);
            await studentTapButtonOnScreen(
                learner,
                quizFinishTopicProgressScreen,
                backToListButton
            );
        }
    );

    await learner.instruction(
        `Student goes to ${studyPlanItemName} detail`,
        async function (learner) {
            await studentGoesToLODetailsPage(learner, topicName, studyPlanItemName);
        }
    );
}

export async function teacherSeesLatestQuizResult(
    teacher: TeacherInterface,
    latestResult: string,
    courseId: string,
    studentId: string,
    studyPlanItemName: string
) {
    const numerator = latestResult.split('/')[0];
    const denominator = latestResult.split('/')[1];
    let teacherNumerator = numerator;
    let teacherDenominator = denominator;
    if (numerator.charAt(0) === '0') {
        teacherNumerator = numerator.substring(1);
    }
    if (denominator.charAt(0) === '0') {
        teacherDenominator = denominator.substring(1);
    }
    const latestQuizSetResultFinder = new ByValueKey(
        SyllabusTeacherKeys.quizSetResult(0, `${teacherNumerator}/${teacherDenominator}`)
    );
    try {
        await teacher.flutterDriver!.waitFor(latestQuizSetResultFinder);
    } catch (e) {
        await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
        await teacherGoesToStudyPlanItemDetails(teacher, studyPlanItemName);
        await teacher.flutterDriver!.waitFor(latestQuizSetResultFinder, 20000);
    }
}
