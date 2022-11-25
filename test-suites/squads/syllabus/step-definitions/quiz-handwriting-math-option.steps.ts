import { createNumberArrayWithLength } from '@legacy-step-definitions/utils';
import { asyncForEach } from '@syllabus-utils/common';

import { Then, When } from '@cucumber/cucumber';

import { genId } from '@drivers/message-formatter/utils';

import {
    aliasContentBookLOQuestionQuantity,
    aliasHandwritingSelectedOptions,
    aliasQuizAnswers,
    aliasQuizMaterialName,
    aliasQuizOCRAvailableFields,
    aliasQuizQuestionContent,
} from './alias-keys/syllabus';
import { schoolAdminChooseHandwritingAnswerInFIB } from './syllabus-create-fill-in-blank-question-with-handwriting-definitions';
import {
    schoolAdminCountAnswerInputOfFillInBlankQuestion,
    schoolAdminFillAnswerOfFillInBlank,
    schoolAdminGetAnswerFIBLabelPrefixInputValue,
} from './syllabus-create-fill-in-blank-question.definitions';
import { schoolAdminFillQuizQuestionData } from './syllabus-create-question-definitions';
import {
    QuizAnswer,
    schoolAdminClickAddMoreAnswerInQuestion,
} from './syllabus-question-create-multiple-choice.definitions';
import {
    AnswerFIBConfig,
    defaultHandwritingOptions,
    HandwritingOption,
    HandwritingOptionKey,
    HandwritingOptionValue,
    QuizOCROption,
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminScansOCR,
    schoolAdminSubmitQuestion,
    schoolAdminUploadsQuizMaterial,
} from './syllabus-question-utils';
import { QuizItemAttributeConfig } from 'manabuf/common/v1/contents_pb';

When(
    'school admin creates a fill in the blank question with all handwriting settings',
    async function () {
        const questionQuantity = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);
        const questionContent = `Question ${genId()} with all handwriting settings`;
        const questionAnswers: Record<string, QuizAnswer> = {};

        const mathOption: HandwritingOption = {
            key: QuizItemAttributeConfig.MATH_CONFIG,
            value: 'Math',
        };

        const selectedHandwritingOptions = [...defaultHandwritingOptions, mathOption];

        const answerFIBConfig: AnswerFIBConfig = {
            addingQuantity: selectedHandwritingOptions.length - 1,
            selectedHandwritingOptions,
        };

        await this.cms.instruction(
            'school admin chooses the fill in the blank question type',
            async () => {
                await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'fill in the blank');
            }
        );

        await this.cms.instruction('school admin fills the question', async () => {
            await schoolAdminFillQuizQuestionData(this.cms, questionContent);
        });

        await this.cms.instruction(
            `school admin adds ${answerFIBConfig.addingQuantity} more answers`,
            async () => {
                await schoolAdminClickAddMoreAnswerInQuestion(
                    this.cms,
                    answerFIBConfig.addingQuantity
                );
            }
        );

        const totalAnswerInput = await schoolAdminCountAnswerInputOfFillInBlankQuestion(this.cms);

        const totalAnswerInputArr = createNumberArrayWithLength(totalAnswerInput);

        await asyncForEach(totalAnswerInputArr, async (_, index) => {
            const answerSelectedHandwritingOption =
                answerFIBConfig.selectedHandwritingOptions[index];
            const answerNumber = index + 1;
            const answerContent = `Answer ${answerNumber} with handwriting is ${answerSelectedHandwritingOption.value}`;
            const answerLabelPrefix = await schoolAdminGetAnswerFIBLabelPrefixInputValue(
                this.cms,
                answerNumber
            );
            const answer: QuizAnswer = {
                content: answerContent,
                correct: false,
                label: answerLabelPrefix,
                attribute: { configs: [answerSelectedHandwritingOption.key] },
            };

            await this.cms.instruction(
                `school admin chooses ${answerSelectedHandwritingOption.value} option for handwriting answer ${answerNumber}`,
                async () => {
                    await schoolAdminChooseHandwritingAnswerInFIB(
                        this.cms,
                        answerNumber,
                        answerSelectedHandwritingOption.key
                    );
                }
            );

            if (answerSelectedHandwritingOption.key !== QuizItemAttributeConfig.MATH_CONFIG) {
                await this.cms.instruction(
                    `school admin fills ${answerContent} for answer ${answerNumber}`,
                    async () => {
                        await schoolAdminFillAnswerOfFillInBlank(
                            this.cms,
                            answerNumber,
                            answerContent
                        );
                    }
                );
            }

            questionAnswers[`Answer ${answerNumber}`] = answer;
        });

        this.scenario.set(aliasQuizQuestionContent, questionContent);
        this.scenario.set(aliasQuizAnswers, questionAnswers);
        this.scenario.set(
            aliasHandwritingSelectedOptions,
            answerFIBConfig.selectedHandwritingOptions
        );
        this.scenario.set(aliasContentBookLOQuestionQuantity, questionQuantity + 1);
    }
);

When('school admin uploads quiz material', async function () {
    await this.cms.instruction('school admin uploads sample quiz material', async () => {
        const fileName = await schoolAdminUploadsQuizMaterial(this.cms);

        this.scenario.set(aliasQuizMaterialName, fileName);
    });
});

When(
    'school admin scans {string} from the quiz material and capture available options',
    async function (ocrOptionsText: string) {
        const ocrOptions = ocrOptionsText.split('/') as QuizOCROption[];
        const answers = this.scenario.get<Record<string, QuizAnswer>>(aliasQuizAnswers);

        const result: Partial<Record<QuizOCROption, string[]>> = {};

        await asyncForEach(ocrOptions, async (option) => {
            await this.cms.instruction(
                `school admin scans OCR with option: ${option}`,
                async () => {
                    let selectedField: string | undefined = undefined;
                    if (option === 'Latex') {
                        const mathAnswerEntry = Object.entries(answers).find(
                            ([, ans]) =>
                                ans.attribute?.configs[0] === QuizItemAttributeConfig.MATH_CONFIG
                        );
                        if (mathAnswerEntry) {
                            selectedField = mathAnswerEntry[0];
                        }
                    }
                    const availableFields = await schoolAdminScansOCR(
                        this.cms,
                        option,
                        selectedField
                    );

                    result[option] = availableFields.filter(
                        (field) => !['Question', 'Explanation'].includes(field)
                    ); // just check available answers
                    await this.cms.selectElementByDataTestId('QuizMain__container');
                }
            );
        });

        this.scenario.set(aliasQuizOCRAvailableFields, result);
    }
);

When('school admin clicks save question', async function () {
    await this.cms.instruction(`school admin saves question`, async () => {
        await schoolAdminSubmitQuestion(this.cms);
    });
});

Then(
    'school admin cannot scan {string} for answers with handwriting setting is {string}',
    async function (ocrOptionsText: string, handwritingOption: HandwritingOptionValue) {
        const ocrAvailableFields = this.scenario.get<Partial<Record<QuizOCROption, string[]>>>(
            aliasQuizOCRAvailableFields
        );
        const answers = this.scenario.get<Record<string, QuizAnswer>>(aliasQuizAnswers);
        const ocrOptions = ocrOptionsText.split('/') as QuizOCROption[];

        const handwritingOptionKeysByOptionValue: Record<
            HandwritingOptionValue,
            HandwritingOptionKey
        > = {
            Off: QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_NONE,
            English: QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG,
            Japanese: QuizItemAttributeConfig.LANGUAGE_CONFIG_JP,
            Math: QuizItemAttributeConfig.MATH_CONFIG,
        };

        await asyncForEach(ocrOptions, async (option) => {
            const availableAnswerNames = ocrAvailableFields[option];

            if (!availableAnswerNames) {
                return;
            }

            await this.cms.instruction(
                `school admin cannot select ${option} when handwriting is ${handwritingOption}`,
                async () => {
                    const handwritingOptionKey =
                        handwritingOptionKeysByOptionValue[handwritingOption];

                    const availableAnswers = availableAnswerNames
                        .map((name) => {
                            return answers[name];
                        })
                        .filter(Boolean);

                    weExpect(
                        availableAnswers.map(
                            (ans) =>
                                ans.attribute?.configs[0] ||
                                QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_NONE
                        )
                    ).not.toContain(handwritingOptionKey);
                }
            );
        });
    }
);
