import { createNumberArrayWithLength } from '@legacy-step-definitions/utils';
import { asyncForEach } from '@syllabus-utils/common';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { ByValueKey } from 'flutter-driver-x';
import { aliasExamLOFinishedQuestionCount } from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import {
    getQuizTypeNumberFromAliasRandomQuizzes,
    studentDoesQuizQuestion,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-create-question-definitions';
import { studentGoesToNextQuestionAtExamLO } from 'test-suites/squads/syllabus/step-definitions/syllabus-do-exam-lo-definitions';

export const studentDoesSomeQuestionInExamLo = async (
    scenario: ScenarioContext,
    learner: LearnerInterface,
    numberOfLearningQuestions: number,
    quizQuestionNames: string[]
) => {
    await asyncForEach(createNumberArrayWithLength(numberOfLearningQuestions), async (_, index) => {
        const quizTypeNumber = getQuizTypeNumberFromAliasRandomQuizzes(
            scenario,
            quizQuestionNames[index]
        );
        await studentDoesQuizQuestion(learner, quizTypeNumber!, quizQuestionNames[index]);

        await studentGoesToNextQuestionAtExamLO(learner, index, numberOfLearningQuestions);
    });

    scenario.set(aliasExamLOFinishedQuestionCount, numberOfLearningQuestions);
};

export const studentGoesToTopicDetailScreenFromQuizFinishedScreen = async (
    learner: LearnerInterface
) => {
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.next_button));
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.viewAnswerKeyButton));
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
};
