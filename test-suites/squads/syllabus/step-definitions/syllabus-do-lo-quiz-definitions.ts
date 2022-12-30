import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { LearnerInterface, LOType, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    aliasDecimalHighestQuizResult,
    aliasDecimalQuizResult,
    aliasHighestQuizResult,
    aliasQuizResult,
    aliasTopicName,
    aliasTotalQuestionCount,
} from './alias-keys/syllabus';
import { studentGoesToLODetailsPage } from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { studentStartExamLOFromInstructionScreen } from './syllabus-exam-lo-common-definition';
import {
    studentScanWhiteboard,
    studentSketchesWhiteboardMath,
} from './syllabus-sketch-whiteboard-definitions';
import { selectedStudyPlanItemNamesByTopicIdWithSelectMode } from './syllabus-update-study-plan-item-time-definitions';
import {
    searchingStudyPlanItemNamesByTopicId,
    studentGoesBackToHomeScreenFromCourseDetails,
    studentGoesToTodosScreen,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    studentTapButtonOnScreen,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

/* TODO
Refactor this function because find quizProgressFinder is not stabled
*/
export async function studentSeesLOQuestionsResult(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    loName: string
) {
    const learningQuizFinishedScreenFinder = new ByValueKey(
        SyllabusLearnerKeys.quiz_finished_screen(loName)
    );
    await learner.flutterDriver?.waitFor(learningQuizFinishedScreenFinder);
    let calculatedResult = 1;
    let loQuestionsResult = '';

    try {
        const quizProgressFinder = new ByValueKey(
            SyllabusLearnerKeys.quizCircularProgressFractionResult
        );
        await learner.flutterDriver?.waitFor(quizProgressFinder);

        loQuestionsResult = await learner.flutterDriver!.getText(quizProgressFinder);
        const [rightAnswerNum, totalQuizNum] = loQuestionsResult!.split('/').map(parseFloat);
        loQuestionsResult = formatNumberString(loQuestionsResult);
        calculatedResult = rightAnswerNum / totalQuizNum;
    } catch {
        console.log('Correct All');
        const questionCount = scenario.get<number>(aliasTotalQuestionCount) ?? 0;
        loQuestionsResult = `${formatNumber(questionCount)}/${formatNumber(questionCount)}`;
    }
    const currentHighestQuizResult = scenario.get<number>(aliasDecimalHighestQuizResult) ?? 0;
    if (calculatedResult > currentHighestQuizResult) {
        scenario.context.set(aliasDecimalHighestQuizResult, calculatedResult);
        scenario.context.set(aliasHighestQuizResult, loQuestionsResult);
    }

    scenario.set(aliasQuizResult, loQuestionsResult);
    scenario.set(aliasDecimalQuizResult, calculatedResult);
}

export function formatNumber(number: number): string {
    let numString = '';
    if (number < 10) {
        numString = `0${number}`;
    } else {
        numString = `${number}`;
    }
    return numString;
}
export function formatNumberString(numberString: string): string {
    // add 0 to numberString, ex: 1/4 -> 01/04
    let numString = '';
    const [rightNum, leftNum] = numberString!.split('/').map(parseFloat);
    numString = `${formatNumber(rightNum)}/${formatNumber(leftNum)}`;
    return numString;
}
export function reformatNumberString(numberString: string): string {
    // remove 0 out of numberString, ex: 01/04 -> 1/4
    let numString = '';
    const [rightAnswerNum, totalQuizNum] = numberString!.split('/').map(parseFloat);
    numString = `${rightAnswerNum}/${totalQuizNum}`;
    return numString;
}

export async function studentSeesLOAchievement(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    loName: string
): Promise<void> {
    const learningFinishedAchievementScreen = new ByValueKey(
        SyllabusLearnerKeys.quiz_finished_achievement_screen(loName)
    );
    await learner.flutterDriver?.waitFor(learningFinishedAchievementScreen);

    const calculatedResult = scenario.get<number>(aliasDecimalQuizResult);

    let crownFinder = SyllabusLearnerKeys.goldCrown;

    if (calculatedResult < 0.6) {
        crownFinder = SyllabusLearnerKeys.noColorCrown;
    } else if (0.6 <= calculatedResult && calculatedResult < 0.8) {
        crownFinder = SyllabusLearnerKeys.bronzeCrown;
    } else if (0.8 <= calculatedResult && calculatedResult < 1) {
        crownFinder = SyllabusLearnerKeys.silverCrown;
    }
    await learner.flutterDriver?.waitFor(new ByValueKey(crownFinder));
}

export const studentSeesFinishedTopicProgressTitle = async (learner: LearnerInterface) => {
    const topicProgressFinder = new ByValueKey(SyllabusLearnerKeys.quizFinishedTopicProgressTitle);
    await learner.flutterDriver?.waitFor(topicProgressFinder);
};

export async function studentSeesTopicProgress(
    learner: LearnerInterface,
    scenario: ScenarioContext
): Promise<void> {
    const topicProgressFinder = new ByValueKey(SyllabusLearnerKeys.quizFinishedTopicProgressTitle);
    await studentSeesFinishedTopicProgressTitle(learner);
    const topicProgress = await learner.flutterDriver?.getText(topicProgressFinder);

    const studyPlanItemList = await selectedStudyPlanItemNamesByTopicIdWithSelectMode(
        scenario,
        'all'
    );
    const topicName = scenario.get<string>(aliasTopicName);
    const topicId = topicName.split(' ')[1];

    let numOfTotalTopicItems = 1;
    const numOfFinishedTopicItems = 1;
    if (studyPlanItemList.find((item) => item.topicId.includes(topicId)) != null) {
        numOfTotalTopicItems = searchingStudyPlanItemNamesByTopicId(
            studyPlanItemList,
            topicId
        ).length;
    }

    if (numOfTotalTopicItems === 1) {
        weExpect(
            topicProgress,
            `Topic progress is ${numOfFinishedTopicItems}/${numOfTotalTopicItems}`
        ).toEqual(`Topic Completed`);
        return;
    }

    weExpect(
        topicProgress,
        `Topic progress is ${numOfFinishedTopicItems}/${numOfTotalTopicItems}`
    ).toEqual(`${numOfFinishedTopicItems}/${numOfTotalTopicItems} Completed`);
}

export async function studentSeesLOOnTodo(
    learner: LearnerInterface,
    topicName: string,
    loName: string
): Promise<void> {
    await studentSeesFinishedTopicProgressTitle(learner);

    await learner.instruction(
        'Goes back to Topic List from Quiz Finish Topic Progress Screen',
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
        'Goes back to Course detail from Topic List Screen',
        async function (learner) {
            const backButton = SyllabusLearnerKeys.back_button;
            const topicListScreen = SyllabusLearnerKeys.lo_list_screen(topicName);
            await studentTapButtonOnScreen(learner, topicListScreen, backButton);
        }
    );

    await learner.instruction(
        'Goes back to Home Screen from Course detail',
        async function (learner) {
            await studentGoesBackToHomeScreenFromCourseDetails(learner);
        }
    );

    await learner.instruction(`Goes to Todo Screen`, async function (learner) {
        await studentGoesToTodosScreen(learner);
    });

    await learner.instruction('Goes to Completed Page on Todo Screen', async function (learner) {
        await learner.clickOnTab(
            SyllabusLearnerKeys.completed_tab,
            SyllabusLearnerKeys.completed_page
        );
    });

    await learner.instruction(`See LO ${loName} on Completed Page`, async function (learner) {
        const listKey = new ByValueKey(SyllabusLearnerKeys.completed_page);
        const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(loName));
        await learner.flutterDriver!.waitFor(listKey, 10000);
        await learner.flutterDriver!.scrollUntilVisible(listKey, itemKey, 0.0, 0.0, -100, 20000);
    });
}

//     TODO: This is for V1 only
// export async function teacherSeesStudyPlanProgress(
//     teacher: TeacherInterface,
//     scenario: ScenarioContext
// ): Promise<void> {
//     const studyPlanItem = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemList);
//     await teacher.flutterDriver?.waitFor(studyPlanItem);

//     const learningProgress = new ByValueKey(SyllabusTeacherKeys.totalLearningProgress);
//     await teacher.flutterDriver?.waitFor(learningProgress);

//     const loNames = scenario.get<any>(aliasRandomStudyPlanItems);
//     const numOfStudyPlanItems = loNames.length;

//     const studyPlanProgress = await teacher.flutterDriver?.getText(learningProgress);

//     await weExpect(studyPlanProgress, `Study Plan Progress is 1/${numOfStudyPlanItems}`).toEqual(
//         `1/${numOfStudyPlanItems} Completed`
//     );
// }

export async function teacherSeesLatestQuizResultOnStudyPlanTable(
    teacher: TeacherInterface,
    studyPlanItemName: string,
    quizResult: string
): Promise<void> {
    const loProgressInStudyPlanTable = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemGradeText(studyPlanItemName).trim()
    );

    const teacherDriver = teacher.flutterDriver!;

    await teacherDriver.waitFor(loProgressInStudyPlanTable, 20000);

    let quizLatestResult = await teacherDriver.getText(loProgressInStudyPlanTable);

    while (quizLatestResult === '--') {
        quizLatestResult = await teacherDriver.getText(loProgressInStudyPlanTable);
    }

    quizLatestResult = formatNumberString(quizLatestResult!);

    await weExpect(
        quizLatestResult,
        `Quiz latest result on Study Plan Table is updated to ${quizLatestResult}`
    ).toEqual(quizResult);
}

export async function learnerTapToHandwritingFIBAnswerAtPosition(
    learner: LearnerInterface,
    position: number
) {
    const driver = learner.flutterDriver!;

    const fibAnswerInputKey = new ByValueKey(
        SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(position)
    );
    await driver.scrollIntoView(fibAnswerInputKey, 0, 1000);

    await driver.tap(fibAnswerInputKey);
}

export async function learnerTypeToFIBAnswerAtPosition(
    learner: LearnerInterface,
    text: string,
    position: number
) {
    const driver = learner.flutterDriver!;
    const size = driver.webDriver!.page.viewportSize()!;
    const height = size.height;

    const fibAnswerInputKey = new ByValueKey(
        SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(position)
    );

    await driver.webDriver!.page.mouse.click(1, height / 2); // Out focus on everything else
    await driver.tap(fibAnswerInputKey);
    await learnerLeaveHandwritingMode(learner);
    await driver.enterText(text);
}

export async function learnerAnswerMathAtPosition(learner: LearnerInterface, position: number) {
    const driver = learner.flutterDriver!;

    const fibAnswerInputKey = new ByValueKey(
        SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(position)
    );
    await driver.tap(fibAnswerInputKey);
    await studentSketchesWhiteboardMath(learner);
    await studentScanWhiteboard(learner);
}

export async function studentSeeFillInTheBlankQuestionTitle(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.fillInTheBlankQuestionTitle));
}

export async function studentCannotSeeWhiteboard(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitForAbsent(new ByValueKey(SyllabusLearnerKeys.whiteboard));
}

export async function studentCanSeeWhiteboard(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.whiteboard));
}

export async function studentCannotSeeButtonChangeToKeyboard(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitForAbsent(new ByValueKey(SyllabusLearnerKeys.changeToKeyboardButton));
}

export async function studentCannotSeeButtonChangeToHandwriting(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitForAbsent(new ByValueKey(SyllabusLearnerKeys.changeToHandWritingButton));
}

export async function learnerEnterHandwritingMode(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    try {
        await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.whiteboard), 1000);
    } catch {
        await driver.tap(new ByValueKey(SyllabusLearnerKeys.changeToHandWritingButton));
        await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.whiteboard));
    }
}

export async function learnerLeaveHandwritingMode(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    try {
        await driver.waitForAbsent(new ByValueKey(SyllabusLearnerKeys.whiteboard), 1000);
    } catch {
        await driver.tap(new ByValueKey(SyllabusLearnerKeys.changeToKeyboardButton));
        await driver.waitForAbsent(new ByValueKey(SyllabusLearnerKeys.whiteboard));
    }
}

export async function studentTapCloseButtonOnWhiteboard(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const closeButtonKey = new ByValueKey(SyllabusLearnerKeys.closeWhiteboardButton);
    await driver.tap(closeButtonKey);
}

export async function studentSeesSubmitButton(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const submitButtonKey = new ByValueKey(SyllabusLearnerKeys.submit_button_unenabled);
    await driver.waitFor(submitButtonKey);
}

export async function studentSeesNextButton(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const nextButtonKey = new ByValueKey(SyllabusLearnerKeys.nextButtonUnenabled);
    await driver.waitFor(nextButtonKey);
}

export async function studentGoesToLearningMaterial(
    learner: LearnerInterface,
    courseName: string,
    topicName: string,
    studyPlanItemName: string,
    loType: LOType
): Promise<void> {
    await learner.instruction('Student refreshes home screen', async () => {
        await studentRefreshHomeScreen(learner);
    });

    await learner.instruction(`Student goes to ${courseName} detail`, async () => {
        await studentGoToCourseDetail(learner, courseName);
    });

    await learner.instruction(`Student goes to ${topicName} detail`, async () => {
        await studentGoToTopicDetail(learner, topicName);
    });

    await learner.instruction(`Student goes to ${studyPlanItemName} detail`, async () => {
        await studentGoesToLODetailsPage(learner, topicName, studyPlanItemName);
        if (loType == 'exam LO') {
            await studentStartExamLOFromInstructionScreen(learner);
        }
    });
}

export async function studentGoesToTopicDetailScreen(
    learner: LearnerInterface,
    courseName: string,
    topicName: string
): Promise<void> {
    await learner.instruction('Student refreshes home screen', async () => {
        await studentRefreshHomeScreen(learner);
    });

    await learner.instruction(`Student goes to ${courseName} detail`, async () => {
        await studentGoToCourseDetail(learner, courseName);
    });

    await learner.instruction(`Student goes to ${topicName} detail`, async () => {
        await studentGoToTopicDetail(learner, topicName);
    });
}
