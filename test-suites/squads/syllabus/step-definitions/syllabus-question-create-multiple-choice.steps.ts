import {
    asyncForEach,
    createNumberArrayWithLength,
    getRandomElement,
    getRandomElements,
    getRandomElementsWithLength,
} from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { genId } from '@drivers/message-formatter/utils';

import {
    aliasQuizAnswers,
    aliasQuizBaseInfo,
    aliasQuizQuestionContent,
} from './alias-keys/syllabus';
import { quizPreviewAnswerContent } from './cms-selectors/cms-keys';
import {
    schoolAdminFillBaseInfoOfQuiz,
    schoolAdminFillQuizExplanationData,
    schoolAdminFillQuizQuestionData,
    schoolAdminSeeBaseInfoOfQuestionInPreview,
    schoolAdminSeeQuestionInTable,
    schoolAdminSelectPreviewQuestionInTable,
} from './syllabus-create-question-definitions';
import {
    QuizAnswer,
    QuizForm,
    schoolAdminCheckCorrectAnswerInPreviewMultipleChoiceQuestion,
    schoolAdminClickAddMoreAnswerInQuestion,
    schoolAdminCountAnswerInputOfMultipleChoiceQuestion,
    schoolAdminDeleteAnswersOfMultipleChoiceQuestion,
    schoolAdminFillAnswerOfMultipleChoiceQuestion,
    schoolAdminSelectCorrectAnswerOfMultipleChoiceQuestion,
} from './syllabus-question-create-multiple-choice.definitions';
import {
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';
import {
    QuizBaseInfo,
    QuizDifficultyLevels,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

When(
    'school admin creates a multiple choices question with {string} answers',
    async function (answerActionCase: 'default' | 'one' | 'add more' | 'delete some') {
        const baseInfo: QuizBaseInfo = {
            difficultyLevel: QuizDifficultyLevels.THREE,
            kind: 'multiple choice',
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

        const answers: QuizForm['answers'] = [];

        const totalInitAnswerInput = await schoolAdminCountAnswerInputOfMultipleChoiceQuestion(
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
                `school admin deletes ${deleteAnswerQuantity} answers`,
                async () => {
                    await schoolAdminDeleteAnswersOfMultipleChoiceQuestion(
                        this.cms,
                        randomAnswersIndex.sort().reverse()
                    );
                }
            );
        }

        if (answerActionCase === 'add more') {
            const randomAnswerQuantity = randomInteger(1, 3);
            await this.cms.instruction(
                `school admin adds more ${randomAnswerQuantity} answers`,
                async () => {
                    await schoolAdminClickAddMoreAnswerInQuestion(this.cms, randomAnswerQuantity);
                }
            );
        }

        const totalAnswerInput = await schoolAdminCountAnswerInputOfMultipleChoiceQuestion(
            this.cms
        );

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

        const randomAnswerCorrect = getRandomElement(totalAnswerInputArr);

        await this.cms.instruction(
            `school admin fill content answers ${totalAnswerInputArr}`,
            async () => {
                await asyncForEach(totalAnswerInputArr, async (_, index) => {
                    const answer: QuizAnswer = {
                        content: `${index}: Answer`,
                        correct: index === randomAnswerCorrect,
                    };

                    await schoolAdminFillAnswerOfMultipleChoiceQuestion(
                        this.cms,
                        index + 1,
                        answer.content
                    );

                    answers.push(answer);
                });
            }
        );

        await this.cms.instruction(
            `school admin choose answer ${randomAnswerCorrect} is correct`,
            async () => {
                await schoolAdminSelectCorrectAnswerOfMultipleChoiceQuestion(
                    this.cms,
                    randomAnswerCorrect
                );
            }
        );

        await schoolAdminSubmitQuestion(this.cms);

        this.scenario.set(aliasQuizAnswers, answers);
        this.scenario.set(aliasQuizBaseInfo, baseInfo);
        this.scenario.set(aliasQuizQuestionContent, questionContent);
    }
);

Then('school admin sees the newly created multiple choices question', async function () {
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

    const answerElements = await this.cms.page?.$$(quizPreviewAnswerContent);

    if (!answerElements || !answerElements.length)
        throw new Error('Answer field in preview not found');

    await this.cms.instruction(
        `school admin will see total ${answerElements.length} answers in question`,
        async () => {
            weExpect(answerElements.length).toEqual(answers.length);

            await asyncForEach(answers, async (answer, index) => {
                await answerElements[index].waitForSelector(`:has-text("${answer.content}")`);
            });
        }
    );

    const correctAnswer = answers.find((i) => i.correct) as QuizAnswer;
    await this.cms.instruction(
        `school admin will see an answer ${correctAnswer.content} is correct`,
        async () => {
            await schoolAdminCheckCorrectAnswerInPreviewMultipleChoiceQuestion(
                this.cms,
                correctAnswer.content
            );
        }
    );
});

When('school admin creates a multiple choices question without the answer', async function () {
    await schoolAdminFillQuizQuestionData(this.cms, 'Question');

    await this.cms.instruction('school admin delete all answers in this question', async () => {
        const totalAnswerInput = await schoolAdminCountAnswerInputOfMultipleChoiceQuestion(
            this.cms
        );

        await schoolAdminDeleteAnswersOfMultipleChoiceQuestion(
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
            const totalAnswerInput = await schoolAdminCountAnswerInputOfMultipleChoiceQuestion(
                this.cms
            );

            weExpect(totalAnswerInput, `shouldn't have any answer field`).toEqual(0);
        }
    );
});

When(
    'school admin creates a multiple choices question with missing {string}',
    async function (missingCase: 'question' | 'random answers' | 'all answers') {
        const totalAnswerInput = await schoolAdminCountAnswerInputOfMultipleChoiceQuestion(
            this.cms
        );

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

        if (missingCase !== 'question') {
            await schoolAdminFillQuizQuestionData(this.cms, 'Question');
        }

        const randomAnswers =
            missingCase === 'question'
                ? totalAnswerInputArr
                : getRandomElements(totalAnswerInputArr);

        const finalAnswersSelected = missingCase === 'all answers' ? [] : randomAnswers;

        await this.cms.instruction(
            `school admin fill content for answers ${finalAnswersSelected}`,
            async () => {
                await asyncForEach(finalAnswersSelected, async (answerIndex) => {
                    await schoolAdminFillAnswerOfMultipleChoiceQuestion(
                        this.cms,
                        answerIndex + 1,
                        `${answerIndex}: Question`
                    );
                });
            }
        );
    }
);
