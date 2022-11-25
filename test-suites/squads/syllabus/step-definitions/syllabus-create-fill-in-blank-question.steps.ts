import {
    asyncForEach,
    convertOneOfStringTypeToArray,
    createNumberArrayWithLength,
    getRandomElement,
    randomEnumKey,
    randomInteger,
} from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { genId } from '@drivers/message-formatter/utils';

import {
    aliasQuizAnswers,
    aliasQuizBaseInfo,
    aliasQuizQuestionContent,
    aliasQuizLabelType,
} from './alias-keys/syllabus';
import {
    schoolAdminCheckMadeAnswerToListFillInBlankQuestion,
    schoolAdminClickAddMoreAlternativeFillInBlankQuestion,
    schoolAdminCountAnswerInputOfFillInBlankQuestion,
    schoolAdminDeleteAnswerOfFillInBlank,
    schoolAdminFillAlternativeOfAnswerFillInBlank,
    schoolAdminFillAnswerLabelPrefixOfQuestion,
    schoolAdminFillAnswerOfFillInBlank,
    schoolAdminNotSeeAnyAnswerPrefixLabelOfQuestion,
    schoolAdminSeeAnswerPrefixLabelOfQuestion,
    schoolAdminSeeLabelTypeForQuestion,
    schoolAdminSelectEditInPreviewQuestion,
    schoolAdminSelectMadeAnswerToListFillInBlankQuestion,
    schoolSelectLabelTypeForQuestion,
} from './syllabus-create-fill-in-blank-question.definitions';
import {
    schoolAdminFillBaseInfoOfQuizV2,
    schoolAdminFillQuizQuestionData,
    schoolAdminSeeBaseInfoOfQuestionInPreview,
    schoolAdminSeeQuestionInTable,
    schoolAdminSelectPreviewQuestionInTable,
} from './syllabus-create-question-definitions';
import {
    QuizAnswer,
    QuizLabelTypeKeys,
    QuizLabelTypes,
    schoolAdminClickAddMoreAnswerInQuestion,
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

type AnswerAlternativeCase = 'none' | 'multiple';

When(
    'school admin creates a fill in the blank question with {string} answers and {string} alternative',
    async function (answerActionCase: 'default' | 'multiple', answerAlternativeCase: string) {
        const baseInfo: QuizBaseInfo = {
            difficultyLevel: QuizDifficultyLevels.FIVE,
            kind: 'fill in the blank',
            taggedLONames: [],
        };

        const alternativeCase = getRandomElement(
            convertOneOfStringTypeToArray<AnswerAlternativeCase>(answerAlternativeCase)
        );

        const questionContent = `Question ${genId()}`;

        await this.cms.instruction(
            `school admin choose change question base info ${JSON.stringify(baseInfo)}`,
            async () => {
                await schoolAdminFillBaseInfoOfQuizV2(this.cms, baseInfo);
            }
        );

        let totalAddMoreQuestion = 0;

        if (answerActionCase === 'multiple') {
            totalAddMoreQuestion = randomInteger(1, 3);
        }

        await schoolAdminFillQuizQuestionData(this.cms, questionContent);

        await schoolAdminClickAddMoreAnswerInQuestion(this.cms, totalAddMoreQuestion);

        const totalAnswerInput = await schoolAdminCountAnswerInputOfFillInBlankQuestion(this.cms);

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

        await this.cms.instruction(`school admin fills ${totalAnswerInput} answers`, async () => {
            await asyncForEach(totalAnswerInputArr, async (_, index) => {
                await schoolAdminFillAnswerOfFillInBlank(this.cms, index + 1, `Answer ${index}`);
            });
        });

        await asyncForEach(totalAnswerInputArr, async (_, answerIndex) => {
            if (alternativeCase === 'none') return;

            const randomAlternativeQuantity = randomInteger(1, 4);

            await this.cms.instruction(
                `school admin add more ${randomAlternativeQuantity} alternatives for answer ${answerIndex}`,
                async () => {
                    await schoolAdminClickAddMoreAlternativeFillInBlankQuestion(
                        this.cms,
                        answerIndex + 1,
                        randomAlternativeQuantity
                    );
                }
            );

            await this.cms.instruction(
                `school admin fills alternatives of answer ${answerIndex}`,
                async () => {
                    await asyncForEach(
                        createNumberArrayWithLength(randomAlternativeQuantity),
                        async (_, index) => {
                            await schoolAdminFillAlternativeOfAnswerFillInBlank(
                                this.cms,
                                answerIndex + 1,
                                index,
                                `Alternative: ${index} of Answer ${answerIndex}`
                            );
                        }
                    );
                }
            );
        });

        await schoolAdminSubmitQuestion(this.cms);

        this.scenario.set(aliasQuizBaseInfo, baseInfo);
        this.scenario.set(aliasQuizQuestionContent, questionContent);
    }
);

Then('school admin sees the newly created fill in the blank question', async function () {
    const baseInfo = this.scenario.get<QuizBaseInfo>(aliasQuizBaseInfo);
    const questionContent = this.scenario.get(aliasQuizQuestionContent);

    await this.cms.waitingForLoadingIcon();

    await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

    await this.cms.instruction(`school admin sees newly question ${questionContent}`, async () => {
        await schoolAdminSeeQuestionInTable(this.cms, questionContent);
    });

    await this.cms.instruction('school admin clicks preview question', async () => {
        await schoolAdminSelectPreviewQuestionInTable(this.cms, questionContent);
    });

    await this.cms.instruction(
        `school admin sees question base info in preview ${JSON.stringify(baseInfo)}`,
        async () => {
            await schoolAdminSeeBaseInfoOfQuestionInPreview(this.cms, baseInfo);
        }
    );
});

When(
    'school admin creates a fill in the blank question with missing {string}',
    async function (missingCase: 'question' | 'answer' | 'alternative' | 'answer label') {
        await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'fill in the blank');

        if (missingCase !== 'question') {
            await this.cms.instruction('school admin fill question field', async () => {
                await schoolAdminFillQuizQuestionData(this.cms, 'Question');
            });
        }

        if (missingCase === 'answer label') {
            await this.cms.instruction('school admin changes label type to custom', async () => {
                await schoolSelectLabelTypeForQuestion(this.cms, 'CUSTOM');
            });
        }

        if (missingCase !== 'answer') {
            await this.cms.instruction('school admin fills answer field', async () => {
                await schoolAdminFillAnswerOfFillInBlank(this.cms, 1, 'Answer');
            });
        }

        const randomAlternativeQuantity = randomInteger(1, 3);

        await schoolAdminClickAddMoreAlternativeFillInBlankQuestion(
            this.cms,
            1,
            randomAlternativeQuantity
        );

        if (missingCase !== 'alternative') {
            await this.cms.instruction(
                `school admin fills ${randomAlternativeQuantity} alternatives`,
                async () => {
                    await asyncForEach(
                        createNumberArrayWithLength(randomAlternativeQuantity),
                        async (_, index) => {
                            await schoolAdminFillAlternativeOfAnswerFillInBlank(
                                this.cms,
                                1,
                                index,
                                `Alter ${index}`
                            );
                        }
                    );
                }
            );
        }
    }
);

When('school admin creates a fill in the blank question without the answer', async function () {
    await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'fill in the blank');
    const totalAnswerInput = await schoolAdminCountAnswerInputOfFillInBlankQuestion(this.cms);

    const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

    await this.cms.instruction(`school admin deletes all answers`, async () => {
        await asyncForEach(totalAnswerInputArr, async (_, index) => {
            await schoolAdminDeleteAnswerOfFillInBlank(this.cms, index + 1);
        });
    });

    await this.cms.instruction(
        `school admin sees question don't have any answer field`,
        async () => {
            const totalAnswerInput = await schoolAdminCountAnswerInputOfFillInBlankQuestion(
                this.cms
            );

            weExpect(totalAnswerInput, `shouldn't have any answer field`).toEqual(0);
        }
    );
});

When(
    'school admin creates a fill in blank question with label type {string}',
    async function (labelTypeCase: 'random' | 'without label') {
        await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'fill in the blank');

        const shouldWithoutLabel = labelTypeCase === 'without label';

        const questionContent = `Question ${genId()}`;
        await schoolAdminFillQuizQuestionData(this.cms, questionContent);

        const randomAddMoreAnswerQuantity = randomInteger(1, 3);

        await schoolAdminClickAddMoreAnswerInQuestion(this.cms, randomAddMoreAnswerQuantity);

        if (labelTypeCase === 'without label') {
            await schoolAdminSelectMadeAnswerToListFillInBlankQuestion(this.cms, false);
        }

        const labelType = randomEnumKey(QuizLabelTypes);
        if (labelTypeCase === 'random') {
            await this.cms.instruction(
                `school admin selects label type: ${labelTypeCase}`,
                async () => {
                    await schoolSelectLabelTypeForQuestion(this.cms, labelType);
                }
            );

            this.scenario.set(aliasQuizLabelType, labelType);
        }

        const totalAnswerInput = await schoolAdminCountAnswerInputOfFillInBlankQuestion(this.cms);

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);
        const answers: QuizAnswer[] = [];
        const isCustomLabel = !shouldWithoutLabel && labelType === 'CUSTOM';

        await asyncForEach(totalAnswerInputArr, async (_, index) => {
            const answer: QuizAnswer = {
                content: `Answer ${index}`,
                correct: false,
                label: isCustomLabel ? `A_b_${index}` : undefined,
            };
            await this.cms.instruction(
                `school admin fills ${JSON.stringify(answer)} for answer at ${index}`,
                async () => {
                    await schoolAdminFillAnswerOfFillInBlank(this.cms, index + 1, answer.content);
                    if (isCustomLabel) {
                        await schoolAdminFillAnswerLabelPrefixOfQuestion(
                            this.cms,
                            index,
                            answer.label || ''
                        );
                    }
                }
            );

            answers.push(answer);
        });

        await schoolAdminSubmitQuestion(this.cms);

        this.scenario.set(aliasQuizQuestionContent, questionContent);
        this.scenario.set(aliasQuizAnswers, answers);
    }
);

Then(
    'school admin sees the newly created fill in the blank question with label type {string}',
    async function (labelTypeCase: 'random' | 'without label') {
        const questionContent = this.scenario.get(aliasQuizQuestionContent);
        const answers = this.scenario.get<QuizAnswer[]>(aliasQuizAnswers);
        const labelType = this.scenario.get<QuizLabelTypeKeys>(aliasQuizLabelType);
        const shouldWithoutLabel = labelTypeCase === 'without label';

        await this.cms.waitingForLoadingIcon();

        await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

        await this.cms.instruction(
            `school admin see newly question ${questionContent}`,
            async () => {
                await schoolAdminSeeQuestionInTable(this.cms, questionContent);
            }
        );

        await this.cms.instruction('school admin click preview question', async () => {
            await schoolAdminSelectPreviewQuestionInTable(this.cms, questionContent);
        });

        await schoolAdminSelectEditInPreviewQuestion(this.cms);

        await this.cms.waitingForLoadingIcon();
        await this.cms.waitForSkeletonLoading();
        await this.cms.waitingForLoadingIcon();

        await this.cms.instruction(
            `school admin sees made to list checked: ${!shouldWithoutLabel}`,
            async () => {
                await schoolAdminCheckMadeAnswerToListFillInBlankQuestion(
                    this.cms,
                    !shouldWithoutLabel
                );
            }
        );

        if (labelTypeCase === 'without label') {
            await this.cms.instruction(
                `school admin don't see any answer prefix label`,
                async () => {
                    await schoolAdminNotSeeAnyAnswerPrefixLabelOfQuestion(this.cms);
                }
            );
            return;
        }

        await this.cms.instruction(`school admin sees label type is ${labelType}`, async () => {
            await schoolAdminSeeLabelTypeForQuestion(this.cms, labelType);
        });

        if (labelType === 'CUSTOM') {
            await asyncForEach(answers, async (answer, index) => {
                await this.cms.instruction(
                    `school admin sees label ${answer.label} for answer at ${index}`,
                    async () => {
                        if (!answer.label) throw new Error('Label not found');
                        await schoolAdminSeeAnswerPrefixLabelOfQuestion(
                            this.cms,
                            index,
                            answer.label
                        );
                    }
                );
            });
        }
    }
);
