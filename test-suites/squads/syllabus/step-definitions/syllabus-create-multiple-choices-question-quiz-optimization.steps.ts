import {
    asyncForEach,
    createNumberArrayWithLength,
    genId,
    getRandomElements,
} from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { aliasQuizBaseInfo, aliasQuizQuestionContent } from './alias-keys/syllabus';
import {
    quizAnswerDescriptionEditorInputValidation,
    quizAnswerEditorInputValidation,
} from './cms-selectors/cms-keys';
import {
    schoolAdminCountAnswerInput,
    schoolAdminFillQuizBaseInfo,
} from './syllabus-create-multiple-answers-question-quiz-optimization.definitions';
import {
    schoolAdminFillContentDataAndChooseCorrectAnswer,
    schoolAdminPrepareForRandomAnswerInput,
} from './syllabus-create-multiple-choices-question-quiz-optimization.definitions';
import {
    schoolAdminFillQuizExplanationData,
    schoolAdminFillQuizQuestionData,
} from './syllabus-create-question-definitions';
import {
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminFillAnswerQuestion,
    schoolAdminSeesQuizAnswersValidation,
    schoolAdminSubmitQuestion,
} from './syllabus-question-utils';
import {
    QuizBaseInfo,
    QuizDifficultyLevels,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    'school admin creates multiple choices question with {string} answers',
    async function (answerAction: 'many' | 'one' | 'add more' | 'delete some') {
        const baseInfo: QuizBaseInfo = {
            difficultyLevel: QuizDifficultyLevels.THREE,
            kind: 'multiple choice',
            taggedLONames: [],
        };

        await this.cms.instruction(
            `school admin choose change question base info ${JSON.stringify(baseInfo)}`,
            async () => {
                await schoolAdminFillQuizBaseInfo(this.cms, baseInfo);
            }
        );

        const questionContent = `Question ${genId()}`;

        await schoolAdminFillQuizQuestionData(this.cms, questionContent);
        await schoolAdminFillQuizExplanationData(this.cms, 'EXP');

        await schoolAdminPrepareForRandomAnswerInput(this.cms, answerAction);

        await schoolAdminFillContentDataAndChooseCorrectAnswer(this.cms, this.scenario);
        await schoolAdminSubmitQuestion(this.cms);

        this.scenario.set(aliasQuizBaseInfo, baseInfo);
        this.scenario.set(aliasQuizQuestionContent, questionContent);
    }
);

When(
    'school admin creates multiple choices question with {string}',
    async function (missingCase: 'empty description' | 'all empty answers' | 'any empty answer') {
        await this.cms.instruction(
            'school admin choose multiple choice question type',
            async () => {
                await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'multiple choice');
            }
        );

        if (missingCase !== 'empty description') {
            await schoolAdminFillQuizQuestionData(this.cms, 'Question');
        }

        const totalAnswerInput = await schoolAdminCountAnswerInput(this.cms);

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

        const randomAnswers =
            missingCase === 'empty description'
                ? totalAnswerInputArr
                : getRandomElements(totalAnswerInputArr);

        const finalAnswersSelected = missingCase === 'all empty answers' ? [] : randomAnswers;

        await this.cms.instruction(
            `school admin fill content for answers ${finalAnswersSelected}`,
            async () => {
                await asyncForEach(finalAnswersSelected, async (answerIndex) => {
                    await schoolAdminFillAnswerQuestion(
                        this.cms,
                        answerIndex + 1,
                        `${answerIndex}: Question`
                    );
                });
            }
        );
    }
);

Then(
    'school admin sees validation error on {string}',
    async function (missingCase: 'empty description' | 'all empty answers' | 'any empty answer') {
        await this.cms.instruction('school admin submit to create question', async () => {
            await schoolAdminSubmitQuestion(this.cms);
        });

        const validationText = 'This field is required';

        if (missingCase === 'empty description') {
            const errSelector = await this.cms.page!.waitForSelector(
                quizAnswerDescriptionEditorInputValidation
            );

            await schoolAdminSeesQuizAnswersValidation(errSelector, validationText);
            return;
        }

        const listAnswerItemValidation = await this.cms.page!.$$(quizAnswerEditorInputValidation);

        if (!listAnswerItemValidation.length) {
            throw new Error('There is no answer validation');
        }

        await asyncForEach(listAnswerItemValidation, async (item) => {
            await schoolAdminSeesQuizAnswersValidation(item, validationText);
        });
    }
);
