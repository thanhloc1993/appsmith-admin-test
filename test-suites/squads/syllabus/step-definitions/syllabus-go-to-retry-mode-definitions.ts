import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasLOName, aliasTopicName } from './alias-keys/syllabus';
import {
    studentGoesToLODetailsPage,
    studentSeesAndDoesLOQuestionsWithRandomIncorrectQuizzes,
} from './syllabus-create-question-definitions';
import {
    studentSeesLOAchievement,
    studentSeesLOQuestionsResult,
    studentSeesTopicProgress,
} from './syllabus-do-lo-quiz-definitions';
import { studentTapButtonOnScreen } from './syllabus-utils';

export async function doQuizWithRandomIncorrectQuizzesAndBack(
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
