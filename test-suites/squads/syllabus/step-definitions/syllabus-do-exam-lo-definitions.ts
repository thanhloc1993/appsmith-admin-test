import { delay } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { QuizTypeTitle } from '@supports/types/cms-types';

import {
    aliasCorrectedAnswerExamLO,
    aliasCorrectedAnswerExamLOList,
    aliasLOCurrentQuestionIndex,
    aliasQuizDescriptions,
    aliasTotalAttempts,
} from './alias-keys/syllabus';
import { QuizDescription } from './cms-models/quiz';
import {
    examLOAddQuestionButton,
    examLODetailsTab,
    examLOQuestionsTab,
} from './cms-selectors/exam-lo';
import { schoolAdminClickAddQuestionOrQuestionGroupActionPanel } from './question-group.definition';
import {
    getAllQuizQuestionsNameInTable,
    schoolAdminCreateLOQuestion,
    studentSeesAndDoesFIBQuestion,
    studentSeesAndDoesFIBQuestionCorrectly,
    studentSeesAndDoesMAQQuestion,
    studentSeesAndDoesMAQQuestionCorrect,
    studentSeesAndDoesMCQQuestion,
    studentSeesAndDoesMCQQuestionCorrect,
    teacherGoesToStudyPlanItemDetails,
} from './syllabus-create-question-definitions';
import { checkIsQuestionGroupEnabled } from './syllabus-migration-temp';
import { getQuestionTypeNumberFromQuizDescriptions } from './syllabus-question-utils';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { QuizType } from 'manabuf/common/v1/contents_pb';

export async function studentSelectIndexedQuestion(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    indexedQuestion: number
): Promise<void> {
    await learner.flutterDriver?.tap(
        new ByValueKey(SyllabusLearnerKeys.quizProgressIndex(indexedQuestion + 1))
    );

    scenario.context.set(aliasLOCurrentQuestionIndex, indexedQuestion);
}

export async function studentSubmitExamLO(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    examLoName: string
): Promise<void> {
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.submit_button));
    await learner.flutterDriver?.waitFor(
        new ByValueKey(SyllabusLearnerKeys.submitAnswerConfirmDialog)
    );
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.confirm_button));
    await learner.flutterDriver?.waitFor(
        new ByValueKey(SyllabusLearnerKeys.quiz_finished_screen(examLoName))
    );

    const totalAttempts = scenario.get<number>(aliasTotalAttempts) ?? 0;
    const newTotalAttempts = totalAttempts + 1;
    await scenario.set(aliasTotalAttempts, newTotalAttempts);
}

export async function studentSubmitExamLOWhenOpenTimeLimitPopup(
    learner: LearnerInterface,
    examLoName: string
): Promise<void> {
    await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.submitButtonAtBottomSheet));
    await learner.flutterDriver!.waitFor(
        new ByValueKey(SyllabusLearnerKeys.quiz_finished_screen(examLoName))
    );
}

export async function studentBackToHomeScreenFromExamLOQuizFinished(
    learner: LearnerInterface,
    topicName: string,
    examLoName: string
): Promise<void> {
    await learner.flutterDriver?.waitFor(
        new ByValueKey(SyllabusLearnerKeys.quiz_finished_screen(examLoName))
    );
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.next_button));
    await learner.flutterDriver?.waitFor(
        new ByValueKey(SyllabusLearnerKeys.quiz_finished_achievement_screen(examLoName))
    );
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.viewAnswerKeyButton));
    await learner.flutterDriver?.waitFor(
        new ByValueKey(SyllabusLearnerKeys.exam_lo_quiz_screen(examLoName))
    );
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
    await learner.flutterDriver?.waitFor(
        new ByValueKey(SyllabusLearnerKeys.lo_list_screen(topicName))
    );
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
    await learner.flutterDriver?.waitFor(new ByValueKey(SyllabusLearnerKeys.book_detail_screen));
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
    await learner.flutterDriver?.waitFor(new ByValueKey(SyllabusLearnerKeys.homeScreen));
}

export async function createNewQuizzesForMultipleType(
    cms: CMSInterface,
    scenario: ScenarioContext,
    quizzesCount: number,
    quizTypeTitles: QuizTypeTitle[]
) {
    const isGroupOfQuestionEnabled = await checkIsQuestionGroupEnabled();

    for (const quizTypeTitle of quizTypeTitles) {
        for (let i = 0; i < quizzesCount; i++) {
            await cms.waitForSkeletonLoading();

            if (isGroupOfQuestionEnabled) {
                await schoolAdminClickAddQuestionOrQuestionGroupActionPanel(cms, 'createQuestion');
            } else {
                await cms.page?.click(examLOAddQuestionButton);
            }

            await cms.waitingForLoadingIcon();
            await cms.waitingForProgressBar();
            await schoolAdminCreateLOQuestion(cms, quizTypeTitle, scenario);
            await delay(1000);
        }
    }

    await getAllQuizQuestionsNameInTable(cms, scenario);
}

export async function studentSeesAndDoesExamLOQuestionsWithCorrectQuizzes(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    correctQuizzesCount: number,
    learningQuizzesCount: number,
    totalQuizQuestions: number,
    quizType?: QuizType
): Promise<void> {
    const quizQuestionNames = await learner.getQuizNameList();
    const correctAnswerExamLOList = scenario.get<number[]>(aliasCorrectedAnswerExamLOList) ?? [];
    const quizDescriptions = scenario.get<QuizDescription[]>(aliasQuizDescriptions);
    correctAnswerExamLOList.push(correctQuizzesCount);
    scenario.set(aliasCorrectedAnswerExamLO, correctQuizzesCount);
    scenario.set(aliasCorrectedAnswerExamLOList, correctAnswerExamLOList);
    let questionIndexList = Array.from(Array(totalQuizQuestions).keys());
    //shuffle list for randomize
    questionIndexList = questionIndexList.sort(() => Math.random() - 0.5);
    for (let i = 0; i < correctQuizzesCount; i++) {
        const shuffleIndex = questionIndexList[i];
        const quizTypeNumber =
            quizType ??
            getQuestionTypeNumberFromQuizDescriptions(
                quizQuestionNames[shuffleIndex],
                quizDescriptions
            );

        if (quizTypeNumber == null) throw new Error('Not found quizType');

        await learner.flutterDriver?.tap(
            new ByValueKey(SyllabusLearnerKeys.quizProgressIndex(shuffleIndex + 1))
        );
        switch (quizTypeNumber) {
            case QuizType.QUIZ_TYPE_FIB:
                await studentSeesAndDoesFIBQuestionCorrectly(
                    learner,
                    quizQuestionNames[shuffleIndex]
                );
                break;
            case QuizType.QUIZ_TYPE_MAQ:
                await studentSeesAndDoesMAQQuestionCorrect(
                    learner,
                    quizQuestionNames[shuffleIndex]
                );
                break;
            case QuizType.QUIZ_TYPE_MCQ:
                await studentSeesAndDoesMCQQuestionCorrect(
                    learner,
                    quizQuestionNames[shuffleIndex]
                );
                break;
        }
    }

    // Do the remaining quizzes incorrectly
    for (let i = correctQuizzesCount; i < learningQuizzesCount; i++) {
        const shuffleIndex = questionIndexList[i];
        const quizTypeNumber =
            quizType ??
            getQuestionTypeNumberFromQuizDescriptions(
                quizQuestionNames[shuffleIndex],
                quizDescriptions
            );

        if (quizTypeNumber == null) throw 'Not found quizType';

        await learner.flutterDriver?.tap(
            new ByValueKey(SyllabusLearnerKeys.quizProgressIndex(shuffleIndex + 1))
        );
        switch (quizTypeNumber) {
            case QuizType.QUIZ_TYPE_FIB:
                await studentSeesAndDoesFIBQuestion(learner, quizQuestionNames[shuffleIndex]);
                break;
            case QuizType.QUIZ_TYPE_MAQ:
                await studentSeesAndDoesMAQQuestion(learner, quizQuestionNames[shuffleIndex]);
                break;
            case QuizType.QUIZ_TYPE_MCQ:
                await studentSeesAndDoesMCQQuestion(learner, quizQuestionNames[shuffleIndex]);
                break;
        }
    }
}

export async function teacherSeesLearningRecordPopupAtIndex(
    teacher: TeacherInterface,
    correctCount: number,
    totalCount: number,
    index: number
) {
    const learningRecordResultFinder = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanHistoryPopupLearningRecord(index)
    );
    await teacher.flutterDriver!.waitFor(learningRecordResultFinder);
    const result = await teacher.flutterDriver!.getText(learningRecordResultFinder);
    weExpect(result).toEqual(`${correctCount}/${totalCount}`);
}

export async function studentGoesToNextQuestionAtExamLO(
    learner: LearnerInterface,
    index: number,
    numberOfLearningQuestions: number
) {
    if (index != numberOfLearningQuestions - 1) {
        await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.next_button));
    }
}

export async function teacherSeesQuizResultAtIndex(
    teacher: TeacherInterface,
    courseId: string,
    studentId: string,
    studyPlanItemName: string,
    correctCount: number,
    totalCount: number,
    index: number
) {
    const quizSetResultFinder = new ByValueKey(
        SyllabusTeacherKeys.quizSetResult(index, `${correctCount}/${totalCount}`)
    );
    try {
        await teacher.flutterDriver!.waitFor(quizSetResultFinder);
    } catch (e) {
        await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
        await teacherGoesToStudyPlanItemDetails(teacher, studyPlanItemName);
        await teacher.flutterDriver?.tap(new ByValueKey(SyllabusTeacherKeys.quizHistoryDropdown));
        await teacher.flutterDriver!.waitFor(quizSetResultFinder, 20000);
    }
}

export async function schoolAdminSelectTabInExamLODetail(
    cms: CMSInterface,
    tab: 'Questions' | 'Details'
) {
    const selectedTab = tab === 'Questions' ? examLOQuestionsTab : examLODetailsTab;

    await cms.page?.click(selectedTab);
}

export async function studentWaitAutoSubmitExamLO(
    learner: LearnerInterface,
    examLoName: string,
    timeLimit: number
) {
    await learner.flutterDriver!.waitForAbsent(
        new ByValueKey(SyllabusLearnerKeys.exam_lo_quiz_screen(examLoName)),
        timeLimit * 60000
    );
}

export async function studentSeeForceSubmitExamLOScreen(learner: LearnerInterface) {
    await learner.flutterDriver!.waitFor(
        new ByValueKey(SyllabusLearnerKeys.forceSubmitExamQuizScreen)
    );
}
