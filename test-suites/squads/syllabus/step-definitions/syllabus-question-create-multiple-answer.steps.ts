import {
    asyncForEach,
    createNumberArrayWithLength,
    genId,
    getRandomElement,
    getRandomElements,
    getRandomElementsWithLength,
    randomBoolean,
    randomInteger,
} from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import {
    aliasQuizAnswers,
    aliasQuizBaseInfo,
    aliasQuizQuestionContent,
} from './alias-keys/syllabus';
import {
    schoolAdminFillBaseInfoOfQuiz,
    schoolAdminFillQuizExplanationData,
    schoolAdminFillQuizQuestionData,
    schoolAdminSeeBaseInfoOfQuestionInPreview,
    schoolAdminSeeQuestionInTable,
    schoolAdminSelectPreviewQuestionInTable,
} from './syllabus-create-question-definitions';
import {
    schoolAdminGetAllAnswerInPreviewMultipleAnswerQuestion,
    schoolAdminCountAnswerInputOfMultipleAnswerQuestion,
    schoolAdminDeleteAnswersOfMultipleAnswerQuestion,
    schoolAdminDeselectAllCorrectAnswerOfMultipleAnswerQuestion,
    schoolAdminFillAnswerOfMultipleAnswerQuestion,
    schoolAdminSelectCorrectAnswerOfMultipleAnswerQuestion,
} from './syllabus-question-create-multiple-answer.definitions';
import {
    schoolAdminClickAddMoreAnswerInQuestion,
    QuizAnswer,
} from './syllabus-question-create-multiple-choice.definitions';
import {
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';
import {
    QuizBaseInfo,
    QuizDifficultyLevels,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    'school admin creates a multiple answers question with {string} answers',
    async function (answerActionCase: 'default' | 'one' | 'add more' | 'delete some') {
        const baseInfo: QuizBaseInfo = {
            difficultyLevel: QuizDifficultyLevels.FOUR,
            kind: 'multiple answer',
            taggedLONames: [],
        };

        const questionContent = `Question ${genId()}`;

        await this.cms.instruction(
            `school admin choose change question base info ${JSON.stringify(baseInfo)}`,
            async () => {
                await schoolAdminFillBaseInfoOfQuiz(this.cms, baseInfo);
            }
        );

        await schoolAdminFillQuizQuestionData(this.cms, questionContent);
        await schoolAdminFillQuizExplanationData(this.cms, 'EXP');

        const totalInitAnswerInput = await schoolAdminCountAnswerInputOfMultipleAnswerQuestion(
            this.cms
        );

        const totalAnswerInputIndexArray = createNumberArrayWithLength(totalInitAnswerInput);

        if (answerActionCase === 'one' || answerActionCase === 'delete some') {
            const deleteAnswerQuantity =
                answerActionCase === 'one'
                    ? totalInitAnswerInput - 1
                    : randomInteger(1, totalInitAnswerInput - 2);

            const randomAnswersIndex = getRandomElementsWithLength(
                totalAnswerInputIndexArray,
                deleteAnswerQuantity
            ).map((i) => i + 1);

            await this.cms.instruction(
                `school admin will delete ${deleteAnswerQuantity} answers`,
                async () => {
                    await schoolAdminDeleteAnswersOfMultipleAnswerQuestion(
                        this.cms,
                        randomAnswersIndex.sort().reverse()
                    );
                }
            );
        }

        if (answerActionCase === 'add more') {
            const randomAnswerQuantity = randomInteger(1, 3);
            await this.cms.instruction(
                `school admin will add more ${randomAnswerQuantity} answers`,
                async () => {
                    await schoolAdminClickAddMoreAnswerInQuestion(this.cms, randomAnswerQuantity);
                }
            );
        }

        const totalAnswerInput = await schoolAdminCountAnswerInputOfMultipleAnswerQuestion(
            this.cms
        );

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

        const randomCorrectAnswerIndexes = getRandomElementsWithLength(
            totalAnswerInputArr,
            randomInteger(1, totalAnswerInputArr.length - 1)
        );

        const answers: QuizAnswer[] = [];
        await this.cms.instruction(
            `school admin fill content ${totalAnswerInputArr.length} answers ${totalAnswerInputArr}`,
            async () => {
                await asyncForEach(totalAnswerInputArr, async (_, index) => {
                    const answer: QuizAnswer = {
                        content: `${index}: Answer`,
                        correct: randomCorrectAnswerIndexes.includes(index),
                    };

                    await schoolAdminFillAnswerOfMultipleAnswerQuestion(
                        this.cms,
                        index + 1,
                        answer.content
                    );

                    answers.push(answer);
                });
            }
        );

        await schoolAdminDeselectAllCorrectAnswerOfMultipleAnswerQuestion(this.cms);

        await this.cms.instruction(
            `school admin select answers ${randomCorrectAnswerIndexes} are correct`,
            async () => {
                await asyncForEach(randomCorrectAnswerIndexes, async (answerIndex) => {
                    await schoolAdminSelectCorrectAnswerOfMultipleAnswerQuestion(
                        this.cms,
                        answerIndex
                    );
                });
            }
        );

        await schoolAdminSubmitQuestion(this.cms);

        this.scenario.set(aliasQuizAnswers, answers);
        this.scenario.set(aliasQuizBaseInfo, baseInfo);
        this.scenario.set(aliasQuizQuestionContent, questionContent);
    }
);

Then('school admin will see the newly created multiple answers question', async function () {
    const questionContent = this.scenario.get(aliasQuizQuestionContent);
    const baseInfo = this.scenario.get<QuizBaseInfo>(aliasQuizBaseInfo);
    const answers = this.scenario.get<QuizAnswer[]>(aliasQuizAnswers);

    await this.cms.waitingForLoadingIcon();

    await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

    await this.cms.instruction(`school admin see newly question ${questionContent}`, async () => {
        await schoolAdminSeeQuestionInTable(this.cms, questionContent);
    });

    await this.cms.instruction('school admin click preview question', async () => {
        await schoolAdminSelectPreviewQuestionInTable(this.cms, questionContent);
    });

    await this.cms.instruction(
        `school admin see question base info in preview ${JSON.stringify(baseInfo)}`,
        async () => {
            await schoolAdminSeeBaseInfoOfQuestionInPreview(this.cms, baseInfo);
        }
    );

    await this.cms.instruction(
        `school admin will see total ${answers.length} answers in question`,
        async () => {
            const total = await schoolAdminGetAllAnswerInPreviewMultipleAnswerQuestion(this.cms);

            weExpect(total).toHaveLength(answers.length);
        }
    );
});

When('school admin creates a multiple answers question without the answer', async function () {
    await this.cms.instruction('school admin change question type to multiple answer', async () => {
        await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'multiple answer');
    });

    await schoolAdminFillQuizQuestionData(this.cms, 'Question');

    await this.cms.instruction('school admin delete all answers in this question', async () => {
        const totalAnswerInput = await schoolAdminCountAnswerInputOfMultipleAnswerQuestion(
            this.cms
        );

        await schoolAdminDeleteAnswersOfMultipleAnswerQuestion(
            this.cms,
            createNumberArrayWithLength(totalAnswerInput)
                .map((i) => i + 1)
                .sort()
                .reverse()
        );
    });

    await this.cms.instruction(
        `school admin see question don't have any answer field`,
        async () => {
            const totalAnswerInput = await schoolAdminCountAnswerInputOfMultipleAnswerQuestion(
                this.cms
            );

            weExpect(totalAnswerInput, `shouldn't have any answer field`).toEqual(0);
        }
    );
});

When(
    'school admin creates a multiple answers question with missing {string}',
    async function (
        missingCase: 'question' | 'random answers' | 'all answers' | 'correct answers'
    ) {
        await this.cms.instruction(
            'school admin change question type to multiple answer',
            async () => {
                await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'multiple answer');
            }
        );

        const totalAnswerInput = await schoolAdminCountAnswerInputOfMultipleAnswerQuestion(
            this.cms
        );

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

        if (missingCase !== 'question') {
            await this.cms.instruction('school admin fill question field', async () => {
                await schoolAdminFillQuizQuestionData(this.cms, 'Question');
            });
        }

        const shouldFillAllAnswers =
            missingCase === 'question' || missingCase === 'correct answers';

        const randomAnswers = shouldFillAllAnswers
            ? totalAnswerInputArr
            : getRandomElements(totalAnswerInputArr);

        const finalAnswersSelected = missingCase === 'all answers' ? [] : randomAnswers;
        const correctIndex = getRandomElement(finalAnswersSelected);

        await this.cms.instruction(
            `school admin fill content for answers ${finalAnswersSelected} and select answers ${correctIndex}, etc... are correct`,
            async () => {
                await asyncForEach(finalAnswersSelected, async (answerIndex) => {
                    const isCorrectAnswer = answerIndex === correctIndex || randomBoolean();

                    await schoolAdminFillAnswerOfMultipleAnswerQuestion(
                        this.cms,
                        answerIndex + 1,
                        `${answerIndex}: Question`
                    );
                    if (isCorrectAnswer) {
                        await schoolAdminSelectCorrectAnswerOfMultipleAnswerQuestion(
                            this.cms,
                            answerIndex
                        );
                    }
                });
            }
        );

        if (missingCase === 'correct answers') {
            await this.cms.instruction('school admin uncheck all answers are correct', async () => {
                await schoolAdminDeselectAllCorrectAnswerOfMultipleAnswerQuestion(this.cms);
            });
        }
    }
);
