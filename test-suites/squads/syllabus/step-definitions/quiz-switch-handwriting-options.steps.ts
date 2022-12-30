import { Then, When } from '@cucumber/cucumber';

import {
    aliasCurrentAnswerNumber,
    aliasQuizSwitchHandwritingOptionFrom,
    aliasQuizSwitchHandwritingOptionTo,
} from './alias-keys/syllabus';
import { quizAnswerFillInBlankEditorInputNthV3, saveDialogButton } from './cms-selectors/cms-keys';
import {
    draftEditorContainer,
    getAnswerFIBHandwritingSettingNthV2,
    quizFibHandwritingChangeConfirmDialog,
} from './cms-selectors/syllabus';
import { schoolAdminChooseHandwritingAnswerInFIB } from './syllabus-create-fill-in-blank-question-with-handwriting-definitions';
import { schoolAdminFillAnswerOfFillInBlank } from './syllabus-create-fill-in-blank-question.definitions';
import {
    HandwritingOptionValue,
    schoolAdminChooseToCreateQuizWithTypeV2,
    defaultHandwritingOptions,
    HandwritingOption,
    schoolAdminUploadsQuizMaterial,
    schoolAdminScansOCR,
} from './syllabus-question-utils';
import { QuizItemAttributeConfig } from 'manabuf/common/v1/contents_pb';

const defaultHandwritingOptionsWithMath: HandwritingOption[] = [
    ...defaultHandwritingOptions,
    {
        key: QuizItemAttributeConfig.MATH_CONFIG,
        value: 'Math',
    },
];

When(
    'school admin selects fill in the blank question with handwriting option {string}',
    async function (handwritingOption: HandwritingOptionValue) {
        this.scenario.set(aliasQuizSwitchHandwritingOptionFrom, handwritingOption);
        const selectedOption = defaultHandwritingOptionsWithMath.find(
            (option) => option.value === handwritingOption
        );

        if (!selectedOption)
            throw Error(`Handwriting option ${handwritingOption} is not available`);

        const currentAnswerNumber = 1;

        await this.cms.instruction(
            'school admin chooses the fill in the blank question type',
            async () => {
                await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'fill in the blank');
            }
        );

        await this.cms.instruction(
            `school admin choose handwriting option ${handwritingOption}`,
            async () => {
                await schoolAdminChooseHandwritingAnswerInFIB(
                    this.cms,
                    currentAnswerNumber,
                    selectedOption.key
                );
            }
        );

        await this.cms.instruction('school admin fill answer content', async () => {
            if (handwritingOption !== 'Math') {
                await schoolAdminFillAnswerOfFillInBlank(
                    this.cms,
                    currentAnswerNumber,
                    `Handwriting ${handwritingOption}`
                );
            } else {
                await schoolAdminUploadsQuizMaterial(this.cms);
                await schoolAdminScansOCR(this.cms, 'Latex', `Answer ${currentAnswerNumber}`);
            }
        });

        this.scenario.set(aliasCurrentAnswerNumber, currentAnswerNumber);
    }
);

When(
    'school admin switches handwriting option to {string}',
    async function (handwritingOption: HandwritingOptionValue) {
        this.scenario.set(aliasQuizSwitchHandwritingOptionTo, handwritingOption);
        const currentAnswerNumber = this.scenario.get<number>(aliasCurrentAnswerNumber);

        const selectedOption = defaultHandwritingOptionsWithMath.find(
            (option) => option.value === handwritingOption
        );

        if (!selectedOption)
            throw Error(`Handwriting option ${handwritingOption} is not available`);

        await this.cms.instruction(
            `school admin switches handwriting option to ${handwritingOption}`,
            async () => {
                await this.cms.page!.click(
                    getAnswerFIBHandwritingSettingNthV2(currentAnswerNumber)
                );

                await this.cms.selectElementByDataValue(selectedOption.key.toString());

                await this.cms.page!.waitForTimeout(100); // wait a little bit for confirm modal open (if it will)
            }
        );
    }
);

Then('school admin sees confirm change handwriting dialog', async function () {
    const confirmDialog = await this.cms.page!.$(quizFibHandwritingChangeConfirmDialog);

    weExpect(confirmDialog).toBeTruthy();
});

Then('school admin sees answer content is deleted', async function () {
    const currentAnswerNumber = this.scenario.get<number>(aliasCurrentAnswerNumber);
    const targetHandwritingOption = this.scenario.get<HandwritingOptionValue>(
        aliasQuizSwitchHandwritingOptionTo
    );

    await this.cms.selectElementWithinWrapper(
        quizFibHandwritingChangeConfirmDialog,
        saveDialogButton
    );

    const answerField = await this.cms.page!.$(
        quizAnswerFillInBlankEditorInputNthV3(currentAnswerNumber)
    );

    if (!answerField)
        throw Error(`Could not select answer field at answer number ${currentAnswerNumber}`);

    let fieldValue: string;
    if (targetHandwritingOption !== 'Math') {
        // FiB answer is an input field by default
        fieldValue = await answerField.inputValue();
    } else {
        // It is WYSWYG editor when choosing Math
        fieldValue = await answerField.$eval(
            draftEditorContainer,
            (container) => container.textContent || ''
        );
    }

    weExpect(fieldValue).toBe('');
});
