import {
    asyncForEach,
    createNumberArrayWithLength,
    genId,
    getRandomElement,
    randomUniqueIntegers,
} from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import {
    aliasQuizAnswers,
    aliasQuizBaseInfo,
    aliasQuizExplanation,
    aliasQuizQuestionName,
} from './alias-keys/syllabus';
import { QuizBaseInfo } from './cms-models/content';
import {
    schoolAdminFillQuizExplanationData,
    schoolAdminFillQuizQuestionData,
} from './create-question-definitions';
import { schoolAdminSeeAnswerOfMultipleQuestionCorrectInPreview } from './edit-multiple-answer-question-definitions';
import { schoolAdminSeesAnswerErrOfMultipleChoiceQuestion } from './edit-multiple-choices-question.definitions';
import { schoolAdminSelectCorrectAnswerOfMultipleChoiceQuestion } from './syllabus-create-multiple-choices-question-quiz-optimization.definitions';
import {
    schoolAdminSeeBaseInfoOfQuestionInPreview,
    schoolAdminSelectPreviewQuestionInTable,
} from './syllabus-create-question-definitions';
import { ASSERT_EDIT_MULTIPLE_CHOICE_QUESTION } from './syllabus-migration-temp';
import { schoolAdminGetAllAnswerInPreviewMultipleAnswerQuestion } from './syllabus-question-create-multiple-answer.definitions';
import { QuizAnswer } from './syllabus-question-create-multiple-choice.definitions';
import {
    genRandomQuestionDifficultLevel,
    schoolAdminFillAnswerQuestion,
    schoolAdminGoesToEditQuestionPage,
    schoolAdminSeesDescriptionQuestionErr,
    schoolAdminSeesExplanationOnQuestionPreview,
    schoolAdminSubmitQuestion,
} from './syllabus-question-utils';
import {
    schoolAdminClickAddMoreAnswer,
    schoolAdminCountAnswerInput,
    schoolAdminDeleteInputAnswers,
    schoolAdminFillQuizBaseInfo,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-create-multiple-answers-question-quiz-optimization.definitions';
import {
    convertOneOfStringTypeToArray,
    randomInteger,
} from 'test-suites/squads/syllabus/utils/common';

type EditMultipleChoiceQuestionInvalidAction =
    | 'empty description'
    | 'all empty answers'
    | 'any empty answer'
    | 'add new empty answer';

const aliasEditMultipleChoicesQuestionInvalidAction =
    'aliasEditMultipleAnswersQuestionInvalidAction';

const aliasIndexOfAnswerInvalid = 'aliasIndexOfAnswerInvalid';

When('school admin edits a multiple choices question', async function () {
    const questionName = this.scenario.get(aliasQuizQuestionName);

    const baseInfo: QuizBaseInfo = {
        difficultyLevel: genRandomQuestionDifficultLevel(),
        kind: 'multiple choice',
        taggedLONames: [],
    };

    await this.cms.instruction(
        `School admin goes to edit question page: ${questionName}`,
        async () => {
            await schoolAdminGoesToEditQuestionPage(this.cms, questionName);
        }
    );

    const totalInitAnswerInput = await schoolAdminCountAnswerInput(this.cms);
    if (!totalInitAnswerInput) throw new Error("Don't have any answer");

    await this.cms.instruction(
        `School admin change question base info ${JSON.stringify(baseInfo)}`,
        async () => {
            await schoolAdminFillQuizBaseInfo(this.cms, baseInfo);
        }
    );

    const questionContent = `Question edited ${genId()}`;

    await this.cms.instruction(
        `School admin updates description to ${questionContent}`,
        async () => {
            await schoolAdminFillQuizQuestionData(this.cms, questionContent);
        }
    );

    const randomAnswerQuantity = randomInteger(0, 5);

    await this.cms.instruction(
        `School admin adds more ${randomAnswerQuantity} empty answer`,
        async () => {
            await schoolAdminClickAddMoreAnswer(this.cms, randomAnswerQuantity);
        }
    );

    const totalAnswerAfterAddMore = await schoolAdminCountAnswerInput(this.cms);
    const deleteAnswerQuantity = randomInteger(1, totalAnswerAfterAddMore - 1);

    const randomAnswerIndexes = randomUniqueIntegers(
        totalAnswerAfterAddMore - 1,
        deleteAnswerQuantity
    );

    await this.cms.instruction(`School admin deletes answers ${randomAnswerIndexes}`, async () => {
        await schoolAdminDeleteInputAnswers(this.cms, randomAnswerIndexes.sort().reverse());
    });

    const totalAnswerInput = await schoolAdminCountAnswerInput(this.cms);
    const randomCorrectAnswerIndexes = randomUniqueIntegers(totalAnswerInput - 1, 1);

    const answers: QuizAnswer[] = [];

    await asyncForEach(createNumberArrayWithLength(totalAnswerInput), async (index) => {
        const answer: QuizAnswer = {
            content: `${index}: Answer`,
            correct: randomCorrectAnswerIndexes.includes(index),
        };
        await this.cms.instruction(
            `School admin fill content answer at index ${index} with correct is ${answer.correct}`,
            async () => {
                await schoolAdminFillAnswerQuestion(this.cms, index + 1, answer.content);

                if (answer.correct) {
                    await schoolAdminSelectCorrectAnswerOfMultipleChoiceQuestion(this.cms, index);
                }
            }
        );

        answers.push(answer);
    });

    const explanation = `Explanation edited ${genId()}`;
    await schoolAdminFillQuizExplanationData(this.cms, explanation);

    await this.cms.instruction('School admin submits question', async () => {
        await schoolAdminSubmitQuestion(this.cms);
    });

    this.scenario.set(aliasQuizBaseInfo, baseInfo);
    this.scenario.set(aliasQuizQuestionName, questionContent);
    this.scenario.set(aliasQuizExplanation, explanation);
    this.scenario.set(aliasQuizAnswers, answers);
});

Then(
    'school admin sees that multiple choices question updated',
    {
        timeout: ASSERT_EDIT_MULTIPLE_CHOICE_QUESTION,
    },
    async function () {
        const explanation = this.scenario.get(aliasQuizExplanation);
        const questionName = this.scenario.get(aliasQuizQuestionName);
        const baseInfo = this.scenario.get<QuizBaseInfo>(aliasQuizBaseInfo);
        const answers = this.scenario.get<QuizAnswer[]>(aliasQuizAnswers);

        await this.cms.instruction(
            `School admin clicks preview question: ${questionName}`,
            async () => {
                await schoolAdminSelectPreviewQuestionInTable(this.cms, questionName);
            }
        );

        await this.cms.instruction(
            `School admin sees question base info in preview ${JSON.stringify(baseInfo)}`,
            async () => {
                await schoolAdminSeeBaseInfoOfQuestionInPreview(this.cms, baseInfo);
            }
        );

        await this.cms.instruction(
            `School admin sees question explanation ${explanation}`,
            async () => {
                await schoolAdminSeesExplanationOnQuestionPreview(this.cms, explanation);
            }
        );

        await this.cms.instruction(
            `School admin sees total ${answers.length} answers in question`,
            async () => {
                const totalAnswer = await schoolAdminGetAllAnswerInPreviewMultipleAnswerQuestion(
                    this.cms
                );

                weExpect(totalAnswer).toHaveLength(answers.length);
            }
        );

        await asyncForEach(answers, async (answer) => {
            const { content, correct } = answer;
            await this.cms.instruction(
                `School admin sees answer ${content} is correct: ${correct}`,
                async () => {
                    await schoolAdminSeeAnswerOfMultipleQuestionCorrectInPreview(
                        this.cms,
                        content,
                        correct
                    );
                }
            );
        });
    }
);

When(
    'school admin edits a multiple choices question with invalid action {string}',
    async function (oneOfInvalidAction: string) {
        const questionName = this.scenario.get(aliasQuizQuestionName);

        await this.cms.instruction(
            `School admin goes to edit question page: ${questionName}`,
            async () => {
                await schoolAdminGoesToEditQuestionPage(this.cms, questionName);
            }
        );

        const invalidActions =
            convertOneOfStringTypeToArray<EditMultipleChoiceQuestionInvalidAction>(
                oneOfInvalidAction
            );

        const invalidAction = getRandomElement(invalidActions);
        const totalInitAnswerInput = await schoolAdminCountAnswerInput(this.cms);

        if (!totalInitAnswerInput) {
            throw new Error("Multiple answers question don't have any answer");
        }

        switch (invalidAction) {
            case 'any empty answer': {
                const index = randomInteger(0, totalInitAnswerInput - 1);
                await this.cms.instruction(
                    `School admin clears content of answer at index ${index}`,
                    async () => {
                        await schoolAdminFillAnswerQuestion(this.cms, index + 1, '');
                    }
                );

                this.scenario.set(aliasIndexOfAnswerInvalid, index);
                break;
            }
            case 'empty description': {
                await this.cms.instruction('School admin clears question description', async () => {
                    await schoolAdminFillQuizQuestionData(this.cms, '');
                });
                break;
            }
            case 'all empty answers': {
                await this.cms.instruction('School admin clears all answer content', async () => {
                    await asyncForEach(
                        createNumberArrayWithLength(totalInitAnswerInput),
                        async (index) => {
                            await schoolAdminFillAnswerQuestion(this.cms, index + 1, '');
                        }
                    );
                });

                break;
            }
            case 'add new empty answer': {
                await this.cms.instruction(`School admin adds new 1 empty answer`, async () => {
                    await schoolAdminClickAddMoreAnswer(this.cms, 1);
                });
                break;
            }
            default: {
                throw new Error(`Please catch/write test when ${invalidAction}`);
            }
        }

        await this.cms.instruction('School admin submits question', async () => {
            await schoolAdminSubmitQuestion(this.cms);
        });

        this.scenario.set(aliasEditMultipleChoicesQuestionInvalidAction, invalidAction);
    }
);

Then('school admin cannot update that multiple choices question', async function () {
    const invalidAction = this.scenario.get<EditMultipleChoiceQuestionInvalidAction>(
        aliasEditMultipleChoicesQuestionInvalidAction
    );

    const totalInitAnswerInput = await schoolAdminCountAnswerInput(this.cms);

    switch (invalidAction) {
        case 'empty description': {
            await this.cms.instruction('School admin sees question description error', async () => {
                await schoolAdminSeesDescriptionQuestionErr(this.cms);
            });
            break;
        }
        case 'all empty answers': {
            await this.cms.instruction('School admin sees error for each answer', async () => {
                const arr = createNumberArrayWithLength(totalInitAnswerInput);
                await asyncForEach(arr, async (index) => {
                    await schoolAdminSeesAnswerErrOfMultipleChoiceQuestion(this.cms, index);
                });
            });

            break;
        }

        case 'any empty answer': {
            const indexOfAnswerInvalid = this.scenario.get<number>(aliasIndexOfAnswerInvalid);

            await this.cms.instruction(
                `School admin sees error of answer at index ${indexOfAnswerInvalid}`,
                async () => {
                    await schoolAdminSeesAnswerErrOfMultipleChoiceQuestion(
                        this.cms,
                        indexOfAnswerInvalid
                    );
                }
            );

            break;
        }
        case 'add new empty answer': {
            await this.cms.instruction('School admin sees error on the last answer', async () => {
                await schoolAdminSeesAnswerErrOfMultipleChoiceQuestion(
                    this.cms,
                    totalInitAnswerInput - 1
                );
            });
            break;
        }

        default: {
            throw new Error(`Please catch/write test when ${invalidAction}`);
        }
    }
});
