import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasLOName } from './alias-keys/syllabus';
import {
    studentSeesAndDoesLOQuestionsWithIncorrectQuizzes,
    studentSeesAndDoesLOQuestionsWithRandomIncorrectQuizzes,
} from './syllabus-create-question-definitions';
import {
    studentSeesLOAchievement,
    studentSeesLOQuestionsResult,
} from './syllabus-do-lo-quiz-definitions';
import {
    studentGoesToTabInToDoScreen,
    studentGoToStudyPlanItemDetailsFromTodo,
    studentTapButtonOnScreen,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export async function studentClickPracticeAgainButton(learner: LearnerInterface) {
    const practiceAllButtonFinder = new ByValueKey(SyllabusLearnerKeys.practiceAllButton);
    await learner.flutterDriver!.tap(practiceAllButtonFinder);
}

export async function doQuizWithIncorrectQuizzesAndBackFromTodo(
    scenario: ScenarioContext,
    learner: LearnerInterface,
    incorrectQuizCount: number
) {
    const context = scenario;
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

    await learner.instruction(`student goes next to todo screen`, async function (learner) {
        const learningFinishedAchievementScreen =
            SyllabusLearnerKeys.quiz_finished_achievement_screen(loName);
        const nextButton = SyllabusLearnerKeys.next_button;
        await studentTapButtonOnScreen(learner, learningFinishedAchievementScreen, nextButton);
    });

    await learner.instruction(
        `Student goes to ${studyPlanItemName} detail`,
        async function (learner) {
            await studentGoesToTabInToDoScreen(learner, context, 'completed');
            await studentGoToStudyPlanItemDetailsFromTodo(learner, loName, 'completed');
        }
    );
}

export async function doQuizWithRandomIncorrectQuizzesAndBackFromTodo(
    scenario: ScenarioContext,
    learner: LearnerInterface,
    incorrectQuizCount: number
) {
    const context = scenario;
    const loName = scenario.get<string>(aliasLOName);
    const studyPlanItemName = scenario.get<string>(aliasLOName);
    await learner.instruction(
        `Student does questions of this LO ${studyPlanItemName} on Learner App with ${incorrectQuizCount} incorrect response`,
        async function (learner) {
            await studentSeesAndDoesLOQuestionsWithRandomIncorrectQuizzes(
                learner,
                context,
                incorrectQuizCount,
                true,
                false
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

    await learner.instruction(`student goes next to todo screen`, async function (learner) {
        const learningFinishedAchievementScreen =
            SyllabusLearnerKeys.quiz_finished_achievement_screen(loName);
        const nextButton = SyllabusLearnerKeys.next_button;
        await studentTapButtonOnScreen(learner, learningFinishedAchievementScreen, nextButton);
    });

    await learner.instruction(
        `Student goes to ${studyPlanItemName} detail`,
        async function (learner) {
            await studentGoesToTabInToDoScreen(learner, context, 'completed');
            await studentGoToStudyPlanItemDetailsFromTodo(learner, loName, 'completed');
        }
    );
}
