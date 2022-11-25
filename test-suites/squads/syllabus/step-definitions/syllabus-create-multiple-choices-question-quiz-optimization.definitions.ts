import {
    asyncForEach,
    createNumberArrayWithLength,
    getRandomElement,
    getRandomElementsWithLength,
    randomInteger,
} from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasQuizAnswers } from './alias-keys/syllabus';
import { quizAnswerMultipleChoiceCorrectRadio } from './cms-selectors/cms-keys';
import {
    schoolAdminClickAddMoreAnswer,
    schoolAdminCountAnswerInput,
    schoolAdminDeleteInputAnswers,
} from './syllabus-create-multiple-answers-question-quiz-optimization.definitions';
import { QuizAnswer, QuizForm } from './syllabus-question-create-multiple-choice.definitions';
import { schoolAdminFillAnswerQuestion } from './syllabus-question-utils';

export const schoolAdminSelectCorrectAnswerOfMultipleChoiceQuestion = async (
    cms: CMSInterface,
    index: number
) => {
    await cms.page?.click(quizAnswerMultipleChoiceCorrectRadio(index + 1));
};

export const schoolAdminPrepareForRandomAnswerInput = async (
    cms: CMSInterface,
    answerAction: 'many' | 'one' | 'add more' | 'delete some'
) => {
    const totalInitAnswerInput = await schoolAdminCountAnswerInput(cms);

    const totalAnswerInputIndexArray = createNumberArrayWithLength(totalInitAnswerInput);

    if (answerAction === 'one' || answerAction === 'delete some') {
        const deleteAnswerQuantity =
            answerAction === 'one'
                ? totalInitAnswerInput - 1
                : randomInteger(1, totalInitAnswerInput - 2);

        const randomAnswersIndex = getRandomElementsWithLength(
            totalAnswerInputIndexArray,
            deleteAnswerQuantity
        );

        await cms.instruction(`school admin deletes ${deleteAnswerQuantity} answers`, async () => {
            await schoolAdminDeleteInputAnswers(cms, randomAnswersIndex.sort().reverse());
        });
    }

    if (answerAction === 'add more') {
        const randomAnswerQuantity = randomInteger(1, 3);
        await cms.instruction(
            `school admin adds more ${randomAnswerQuantity} answers`,
            async () => {
                await schoolAdminClickAddMoreAnswer(cms, randomAnswerQuantity);
            }
        );
    }
};

export const schoolAdminFillContentDataAndChooseCorrectAnswer = async (
    cms: CMSInterface,
    scenario: ScenarioContext
) => {
    const answers: QuizForm['answers'] = [];

    const totalAnswerInput = await schoolAdminCountAnswerInput(cms);

    const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

    const randomAnswerCorrect = getRandomElement(totalAnswerInputArr);

    await cms.instruction(`school admin fill content answers ${totalAnswerInputArr}`, async () => {
        await asyncForEach(totalAnswerInputArr, async (_, index) => {
            const answer: QuizAnswer = {
                content: `${index}: Answer`,
                correct: index === randomAnswerCorrect,
            };

            await schoolAdminFillAnswerQuestion(cms, index + 1, answer.content);

            answers.push(answer);
        });
    });

    await cms.instruction(
        `school admin choose answer ${randomAnswerCorrect} is correct`,
        async () => {
            await schoolAdminSelectCorrectAnswerOfMultipleChoiceQuestion(cms, randomAnswerCorrect);
        }
    );

    scenario.set(aliasQuizAnswers, answers);
};
