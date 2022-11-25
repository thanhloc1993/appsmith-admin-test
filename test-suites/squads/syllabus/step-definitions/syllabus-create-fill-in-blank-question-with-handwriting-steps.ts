import { asyncForEach, createNumberArrayWithLength } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { genId } from '@drivers/message-formatter/utils';

import {
    aliasContentBookLOQuestionQuantity,
    aliasHandwritingSelectedOptions,
    aliasQuizAnswers,
    aliasQuizQuestionContent,
} from './alias-keys/syllabus';
import { getAnswerFIBHandwritingSettingInputNthV2 } from './cms-selectors/syllabus';
import {
    schoolAdminChooseHandwritingAnswerInFIB,
    schoolAdminSeeMatchedHandwritingAnswerInFIB,
} from './syllabus-create-fill-in-blank-question-with-handwriting-definitions';
import {
    schoolAdminCountAnswerInputOfFillInBlankQuestion,
    schoolAdminFillAnswerOfFillInBlank,
    schoolAdminGetAnswerFIBLabelPrefixInputValue,
} from './syllabus-create-fill-in-blank-question.definitions';
import {
    schoolAdminFillQuizQuestionData,
    schoolAdminSeeQuestionInTable,
} from './syllabus-create-question-definitions';
import {
    QuizAnswer,
    schoolAdminClickAddMoreAnswerInQuestion,
} from './syllabus-question-create-multiple-choice.definitions';
import {
    AnswerFIBConfig,
    defaultHandwritingOptions,
    HandwritingOption,
    HandwritingSettingCase,
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminFocusOnAnswerInput,
    schoolAdminGoesToEditQuestionPage,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';
import shuffle from 'lodash/shuffle';

When(
    'school admin creates a fill in the blank question with {string} handwriting answers',
    async function (handwritingSettingCase: HandwritingSettingCase) {
        const questionQuantity = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);
        const questionContent = `Question ${genId()} with ${handwritingSettingCase} handwriting answers`;
        const questionAnswerList: QuizAnswer[] = [];
        let answerFIBConfig: AnswerFIBConfig = {
            addingQuantity: 1,
            selectedHandwritingOptions: defaultHandwritingOptions,
        };

        if (handwritingSettingCase === 'multiple') {
            answerFIBConfig = {
                addingQuantity: defaultHandwritingOptions.length - 1,
                selectedHandwritingOptions: shuffle(defaultHandwritingOptions),
            };
        }

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
                `school admin fills ${answerContent} for answer ${answerNumber}`,
                async () => {
                    await schoolAdminFillAnswerOfFillInBlank(this.cms, answerNumber, answerContent);
                }
            );

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

            questionAnswerList.push(answer);
        });

        await this.cms.instruction(`school admin saves question`, async () => {
            await schoolAdminSubmitQuestion(this.cms);
        });

        this.scenario.set(aliasQuizQuestionContent, questionContent);
        this.scenario.set(aliasQuizAnswers, questionAnswerList);
        this.scenario.set(
            aliasHandwritingSelectedOptions,
            answerFIBConfig.selectedHandwritingOptions
        );
        this.scenario.set(aliasContentBookLOQuestionQuantity, questionQuantity + 1);
    }
);

Then(
    'school admin sees the fill in the blank question with matched handwriting answers',
    async function () {
        const questionContent = this.scenario.get<string>(aliasQuizQuestionContent);
        const selectedHandwritingOptions = this.scenario.get<HandwritingOption[]>(
            aliasHandwritingSelectedOptions
        );

        await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

        await this.cms.instruction(
            `school admin sees the FIB question ${questionContent} in question list`,
            async () => {
                await schoolAdminSeeQuestionInTable(this.cms, questionContent);
            }
        );

        await this.cms.instruction(
            `school admin goes to edit question ${questionContent} page`,
            async () => {
                await schoolAdminGoesToEditQuestionPage(this.cms, questionContent);
                await schoolAdminFocusOnAnswerInput(
                    this.cms,
                    getAnswerFIBHandwritingSettingInputNthV2(1)
                );
            }
        );

        await asyncForEach(selectedHandwritingOptions, async (option, index) => {
            const answerNumber = index + 1;

            await this.cms.instruction(
                `school admin sees handwriting answer ${answerNumber} is ${option.value} `,
                async () => {
                    await schoolAdminSeeMatchedHandwritingAnswerInFIB(
                        this.cms,
                        answerNumber,
                        option.value
                    );
                }
            );
        });
    }
);
