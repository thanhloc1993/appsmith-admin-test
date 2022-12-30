import {
    asyncForEach,
    createNumberArrayWithLength,
    genId,
    getRandomElement,
    randomEnumKey,
} from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import {
    aliasQuizAnswers,
    aliasQuizBaseInfo,
    aliasQuizLabelType,
    aliasQuizQuestionContent,
} from './alias-keys/syllabus';
import {
    quizAnswerDescriptionEditorInputValidation,
    quizAnswerFormHelperText,
    quizAnswerLabelPrefixValidationText,
} from './cms-selectors/cms-keys';
import {
    schoolAdminAddMoreAlternativeFIBAnswer,
    schoolAdminCannotSeeAnyPrefixLabel,
    schoolAdminCheckFIBQuestionMadeIntoListStatus,
    schoolAdminCountFillInBlankInputAnswer,
    schoolAdminFillAnswerPrefixLabel,
    schoolAdminFillFIBAlternativeAnswer,
    schoolAdminFillFIBAnswer,
    schoolAdminSeeQuestionLabelType,
    schoolAdminSeeQuestionPrefixLabel,
    schoolAdminSelectQuestionLabelType,
    schoolAdminSelectMadeIntoListQuestion,
} from './syllabus-create-fib-answers-question-quiz-optimization.definitions';
import { schoolAdminSelectEditInPreviewQuestion } from './syllabus-create-fill-in-blank-question.definitions';
import {
    schoolAdminClickAddMoreAnswer,
    schoolAdminFillQuizBaseInfo,
} from './syllabus-create-multiple-answers-question-quiz-optimization.definitions';
import {
    schoolAdminFillQuizQuestionData,
    schoolAdminSeeBaseInfoOfQuestionInPreview,
    schoolAdminSeeQuestionInTable,
    schoolAdminSelectPreviewQuestionInTable,
} from './syllabus-create-question-definitions';
import {
    QuizAnswer,
    QuizLabelTypeKeys,
    QuizLabelTypes,
} from './syllabus-question-create-multiple-choice.definitions';
import {
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminSeesQuizAnswersValidation,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';
import {
    QuizBaseInfo,
    QuizDifficultyLevels,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import {
    convertOneOfStringTypeToArray,
    randomInteger,
} from 'test-suites/squads/syllabus/utils/common';

type LabelTypeCase = 'random label type' | 'no label type';
type AnswerAlternativeCase = 'none' | 'multiple';

When(
    'school admin creates fill in blank question with label type {string}',
    async function (labelTypeCase: string) {
        const randomLabelTypeCase = getRandomElement(
            convertOneOfStringTypeToArray<LabelTypeCase>(labelTypeCase)
        );

        await this.cms.instruction(
            'school admin changes question type to fill in the blank',
            async () => {
                await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'fill in the blank');
            }
        );

        const shouldWithoutLabel = randomLabelTypeCase === 'no label type';

        const questionContent = `Question ${genId()}`;
        await schoolAdminFillQuizQuestionData(this.cms, questionContent);

        const randomAddMoreAnswerQuantity = randomInteger(1, 3);

        await this.cms.instruction(
            `school admin will add more ${randomAddMoreAnswerQuantity} answers`,
            async () => {
                await schoolAdminClickAddMoreAnswer(this.cms, randomAddMoreAnswerQuantity);
            }
        );

        if (randomLabelTypeCase === 'no label type') {
            await schoolAdminSelectMadeIntoListQuestion(this.cms, false);
        }

        const labelType = randomEnumKey(QuizLabelTypes);
        if (randomLabelTypeCase === 'random label type') {
            await this.cms.instruction(
                `school admin selects label type: ${randomLabelTypeCase}`,
                async () => {
                    await schoolAdminSelectQuestionLabelType(this.cms, labelType);
                }
            );

            this.scenario.set(aliasQuizLabelType, labelType);
        }

        const totalAnswerInput = await schoolAdminCountFillInBlankInputAnswer(this.cms);

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);
        const answers: QuizAnswer[] = [];
        const isCustomLabel = !shouldWithoutLabel && labelType === 'CUSTOM';

        await asyncForEach(totalAnswerInputArr, async (_, index) => {
            const answer: QuizAnswer = {
                content: `Answer ${index}`,
                correct: false,
                label: isCustomLabel
                    ? index % 2 === 0
                        ? `A_b_${index}`
                        : `${index}_A_b`
                    : undefined,
            };
            await this.cms.instruction(
                `school admin fills ${JSON.stringify(answer)} for answer at ${index}`,
                async () => {
                    await schoolAdminFillFIBAnswer(this.cms, index + 1, answer.content);
                    if (isCustomLabel) {
                        await schoolAdminFillAnswerPrefixLabel(this.cms, index, answer.label || '');
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

When(
    'school admin creates fill in the blank answers question with missing {string}',
    async function (
        missingCase: 'question description' | 'prefix label' | 'main answer' | 'alternative answer'
    ) {
        await this.cms.instruction(
            'school admin changes question type to fill in the blank',
            async () => {
                await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'fill in the blank');
            }
        );

        if (missingCase !== 'question description') {
            await this.cms.instruction('school admin fill question field', async () => {
                await schoolAdminFillQuizQuestionData(this.cms, 'Question description');
            });
        }

        if (missingCase === 'prefix label') {
            await this.cms.instruction('school admin changes label type to custom', async () => {
                await schoolAdminSelectQuestionLabelType(this.cms, 'CUSTOM');
            });
        }

        if (missingCase !== 'main answer') {
            await this.cms.instruction('school admin fills answer field', async () => {
                await schoolAdminFillFIBAnswer(this.cms, 1, 'Answer');
            });
        }

        const randomAlternativeQuantity = randomInteger(1, 3);

        await schoolAdminAddMoreAlternativeFIBAnswer(this.cms, 1, randomAlternativeQuantity);

        if (missingCase !== 'alternative answer') {
            await this.cms.instruction(
                `school admin fills ${randomAlternativeQuantity} alternatives`,
                async () => {
                    await asyncForEach(
                        createNumberArrayWithLength(randomAlternativeQuantity),
                        async (_, index) => {
                            await schoolAdminFillFIBAlternativeAnswer(
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

Then(
    'school admin sees error message on {string}',
    async function (
        missingCase: 'prefix label' | 'main answer' | 'alternative answer' | 'question description'
    ) {
        await this.cms.instruction('school admin submit to create question', async () => {
            await schoolAdminSubmitQuestion(this.cms);
        });

        const validationText = 'This field is required';

        if (missingCase === 'question description') {
            const errSelector = await this.cms.page!.waitForSelector(
                quizAnswerDescriptionEditorInputValidation
            );

            await schoolAdminSeesQuizAnswersValidation(errSelector, validationText);
            return;
        }

        if (missingCase === 'prefix label') {
            const errSelector = await this.cms.page!.waitForSelector(
                quizAnswerLabelPrefixValidationText
            );

            await schoolAdminSeesQuizAnswersValidation(errSelector, validationText);

            return;
        }

        const listAnswerItemValidation = await this.cms.page!.$$(quizAnswerFormHelperText);

        if (!listAnswerItemValidation.length) {
            throw new Error('There is no answer validation');
        }

        await asyncForEach(listAnswerItemValidation, async (item) => {
            await schoolAdminSeesQuizAnswersValidation(item, validationText);
        });
    }
);

When(
    'school admin creates fill in the blank question with {string} answers and {string} option',
    async function (answerActionCase: 'one' | 'multiple', answerAlternativeCase: string) {
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
                await schoolAdminFillQuizBaseInfo(this.cms, baseInfo);
            }
        );

        let totalAddMoreQuestion = 0;

        if (answerActionCase === 'multiple') {
            totalAddMoreQuestion = randomInteger(1, 3);
        }

        await schoolAdminFillQuizQuestionData(this.cms, questionContent);

        await schoolAdminClickAddMoreAnswer(this.cms, totalAddMoreQuestion);

        const totalAnswerInput = await schoolAdminCountFillInBlankInputAnswer(this.cms);

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

        await this.cms.instruction(`school admin fills ${totalAnswerInput} answers`, async () => {
            await asyncForEach(totalAnswerInputArr, async (_, index) => {
                await schoolAdminFillFIBAnswer(this.cms, index + 1, `Answer ${index}`);
            });
        });

        await asyncForEach(totalAnswerInputArr, async (_, answerIndex) => {
            if (alternativeCase === 'none') return;

            const randomAlternativeQuantity = randomInteger(1, 4);

            await this.cms.instruction(
                `school admin add more ${randomAlternativeQuantity} alternatives for answer ${answerIndex}`,
                async () => {
                    await schoolAdminAddMoreAlternativeFIBAnswer(
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
                            await schoolAdminFillFIBAlternativeAnswer(
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

Then('school admin sees the newly created fill in the blank answers question', async function () {
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

    if (baseInfo) {
        await this.cms.instruction(
            `school admin sees question base info in preview ${JSON.stringify(baseInfo)}`,
            async () => {
                await schoolAdminSeeBaseInfoOfQuestionInPreview(this.cms, baseInfo);
            }
        );

        return;
    }
    const answers = this.scenario.get<QuizAnswer[]>(aliasQuizAnswers);
    const labelType = this.scenario.get<QuizLabelTypeKeys>(aliasQuizLabelType);
    const shouldWithoutLabel = !labelType;

    await this.cms.instruction('school admin click edit button to go to edit page', async () => {
        await schoolAdminSelectEditInPreviewQuestion(this.cms);
    });

    await this.cms.waitingForLoadingIcon();
    await this.cms.waitForSkeletonLoading();
    await this.cms.waitingForLoadingIcon();

    await this.cms.instruction(
        `school admin sees made to list checked: ${!shouldWithoutLabel}`,
        async () => {
            await schoolAdminCheckFIBQuestionMadeIntoListStatus(this.cms, !shouldWithoutLabel);
        }
    );

    if (shouldWithoutLabel) {
        await this.cms.instruction(`school admin cannot see any answer prefix label`, async () => {
            await schoolAdminCannotSeeAnyPrefixLabel(this.cms);
        });
        return;
    }

    await this.cms.instruction(`school admin sees label type is ${labelType}`, async () => {
        await schoolAdminSeeQuestionLabelType(this.cms, labelType);
    });

    if (labelType === 'CUSTOM') {
        await asyncForEach(answers, async (answer, index) => {
            await this.cms.instruction(
                `school admin sees label ${answer.label} for answer at ${index}`,
                async () => {
                    if (!answer.label) throw new Error('Label not found');
                    await schoolAdminSeeQuestionPrefixLabel(this.cms, index, answer.label);
                }
            );
        });
    }
});
