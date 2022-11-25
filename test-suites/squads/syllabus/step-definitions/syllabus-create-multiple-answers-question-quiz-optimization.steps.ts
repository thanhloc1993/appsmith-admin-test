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

import { Given, Then, When } from '@cucumber/cucumber';

import {
    aliasLOName,
    aliasQuizAnswers,
    aliasQuizBaseInfo,
    aliasQuizQuestionContent,
} from './alias-keys/syllabus';
import {
    draftEditor,
    quizAnswerCorrectCheckboxNth,
    quizAnswerDescriptionEditorInputValidation,
    quizAnswerEditorInputValidation,
} from './cms-selectors/cms-keys';
import {
    schoolAdminClickAddMoreAnswer,
    schoolAdminCountAnswerInput,
    schoolAdminDeleteInputAnswers,
    schoolAdminDeselectAllCorrectAnswer,
    schoolAdminFillQuizBaseInfo,
    schoolAdminSelectCorrectAnswer,
} from './syllabus-create-multiple-answers-question-quiz-optimization.definitions';
import {
    schoolAdminFillQuizExplanationData,
    schoolAdminFillQuizQuestionData,
} from './syllabus-create-question-definitions';
import { schoolAdminDeselectAllCorrectAnswerOfMultipleAnswerQuestion } from './syllabus-question-create-multiple-answer.definitions';
import { QuizAnswer } from './syllabus-question-create-multiple-choice.definitions';
import {
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminClickCreateQuestion,
    schoolAdminFillAnswerQuestion,
    schoolAdminSeesQuizAnswersValidation,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import {
    QuizBaseInfo,
    QuizDifficultyLevels,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given('school admin goes to the new create question page', async function () {
    const loName = this.scenario.get(aliasLOName);

    await schoolAdminClickLOByName(this.cms, loName);

    await this.cms.waitingForLoadingIcon();

    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction('school admin see LO detail page', async () => {
        await schoolAdminWaitingQuizTableInTheLODetail(this.cms);
    });

    await this.cms.instruction('school admin choose add new question in LO', async () => {
        await schoolAdminClickCreateQuestion(this.cms);
    });

    await this.cms.waitingForLoadingIcon();

    await this.cms.instruction('school admin see create question page', async () => {
        await this.cms.page?.waitForSelector(draftEditor);
    });
});

When(
    'school admin creates multiple answers question with {string} answers',
    async function (answerAction: 'many' | 'one' | 'add more' | 'delete some') {
        const baseInfo: QuizBaseInfo = {
            difficultyLevel: QuizDifficultyLevels.FOUR,
            kind: 'multiple answer',
            taggedLONames: [],
        };

        const questionContent = `Question ${genId()}`;

        await this.cms.instruction(
            `school admin change question base info ${JSON.stringify(baseInfo)}`,
            async () => {
                await schoolAdminFillQuizBaseInfo(this.cms, baseInfo);
            }
        );
        await schoolAdminFillQuizQuestionData(this.cms, questionContent);
        await schoolAdminFillQuizExplanationData(this.cms, 'EXP');

        const totalInitAnswerInput = await schoolAdminCountAnswerInput(this.cms);

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

            await this.cms.instruction(
                `school admin deletes ${deleteAnswerQuantity} answers`,
                async () => {
                    await schoolAdminDeleteInputAnswers(
                        this.cms,
                        randomAnswersIndex.sort().reverse()
                    );
                }
            );
        }

        if (answerAction === 'add more') {
            const randomAnswerQuantity = randomInteger(1, 3);
            await this.cms.instruction(
                `school admin adds more ${randomAnswerQuantity} answers`,
                async () => {
                    await schoolAdminClickAddMoreAnswer(this.cms, randomAnswerQuantity);
                }
            );
        }

        const answers: QuizAnswer[] = [];

        const totalAnswerInput = await schoolAdminCountAnswerInput(this.cms);

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

        const randomCorrectAnswerIndexes = getRandomElementsWithLength(
            totalAnswerInputArr,
            randomInteger(1, totalAnswerInputArr.length - 1)
        );

        await this.cms.instruction(
            `school admin fill content ${totalAnswerInputArr.length} answers ${totalAnswerInputArr}`,
            async () => {
                await asyncForEach(totalAnswerInputArr, async (_, index) => {
                    const answer: QuizAnswer = {
                        content: `${index}: Answer`,
                        correct: randomCorrectAnswerIndexes.includes(index),
                    };

                    await schoolAdminFillAnswerQuestion(this.cms, index + 1, answer.content);

                    answers.push(answer);
                });
            }
        );

        await schoolAdminDeselectAllCorrectAnswerOfMultipleAnswerQuestion(this.cms);

        await this.cms.instruction(
            `school admin select answers ${randomCorrectAnswerIndexes} are correct`,
            async () => {
                await asyncForEach(randomCorrectAnswerIndexes, async (answerIndex) => {
                    await this.cms.page
                        ?.locator(quizAnswerCorrectCheckboxNth(answerIndex + 1))
                        .check();
                });
            }
        );

        await schoolAdminSubmitQuestion(this.cms);

        this.scenario.set(aliasQuizAnswers, answers);
        this.scenario.set(aliasQuizBaseInfo, baseInfo);
        this.scenario.set(aliasQuizQuestionContent, questionContent);
    }
);

When(
    'school admin creates multiple answers question with {string}',
    async function (
        missingCase:
            | 'empty description'
            | 'all empty answers'
            | 'any empty answer'
            | 'no correct answers'
    ) {
        await this.cms.instruction(
            'school admin change question type to multiple answer',
            async () => {
                await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'multiple answer');
            }
        );

        const totalAnswerInput = await schoolAdminCountAnswerInput(this.cms);

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

        if (missingCase !== 'empty description') {
            await this.cms.instruction('school admin fill question field', async () => {
                await schoolAdminFillQuizQuestionData(this.cms, 'Question');
            });
        }

        const shouldFillAllAnswers =
            missingCase === 'empty description' || missingCase === 'no correct answers';

        const randomAnswers = shouldFillAllAnswers
            ? totalAnswerInputArr
            : getRandomElements(totalAnswerInputArr);

        const finalAnswersSelected = missingCase === 'all empty answers' ? [] : randomAnswers;
        const correctIndex = getRandomElement(finalAnswersSelected);

        await this.cms.instruction(
            `school admin fill content for answers ${finalAnswersSelected} and select answers ${correctIndex}, etc... are correct`,
            async () => {
                await asyncForEach(finalAnswersSelected, async (answerIndex) => {
                    const isCorrectAnswer = answerIndex === correctIndex || randomBoolean();

                    await schoolAdminFillAnswerQuestion(
                        this.cms,
                        answerIndex + 1,
                        `${answerIndex}: Question`
                    );
                    if (isCorrectAnswer) {
                        await schoolAdminSelectCorrectAnswer(this.cms, answerIndex + 1);
                    }
                });
            }
        );

        if (missingCase === 'no correct answers') {
            await this.cms.instruction('school admin uncheck all answers are correct', async () => {
                await schoolAdminDeselectAllCorrectAnswer(this.cms);
            });
        }
    }
);

Then(
    'school admin sees the error message {string} in case {string}',
    async function (
        message,
        missingCase:
            | 'empty description'
            | 'any empty answer'
            | 'all empty answers'
            | 'no correct answers'
    ) {
        await this.cms.instruction('school admin submit to create question', async () => {
            await schoolAdminSubmitQuestion(this.cms);
        });

        if (missingCase === 'empty description') {
            const errSelector = await this.cms.page!.waitForSelector(
                quizAnswerDescriptionEditorInputValidation
            );

            await schoolAdminSeesQuizAnswersValidation(errSelector, message);
            return;
        }

        if (missingCase === 'no correct answers') {
            await this.cms.assertNotification(message);
            return;
        }

        const listAnswerItemValidation = await this.cms.page!.$$(quizAnswerEditorInputValidation);

        if (!listAnswerItemValidation.length) {
            throw new Error('There is no answer validation');
        }

        await asyncForEach(listAnswerItemValidation, async (item) => {
            await schoolAdminSeesQuizAnswersValidation(item, message);
        });
    }
);
