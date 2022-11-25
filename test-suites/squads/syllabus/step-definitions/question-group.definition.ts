import { CMSInterface } from '@supports/app-types';

import { QuestionGroupDetail, QuestionUpsertFormValue } from './cms-models/question-group';
import {
    questionGroupAccordion,
    questionGroupAddQuestionButton,
    questionGroupDescriptionInput,
    questionGroupNameInput,
    questionListHeaderAction,
} from './cms-selectors/syllabus';
import {
    schoolAdminFillQuizExplanationData,
    schoolAdminFillQuizQuestionData,
} from './syllabus-create-question-definitions';
import {
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminFillsAllAnswersByQuestionType,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingUpsertQuestionDialog,
} from './syllabus-question-utils';

export const schoolAdminGetQuestionGroupAccordionElementByName = async (
    cms: CMSInterface,
    questionGroupName: string
) => {
    return await cms.waitForSelectorHasText(questionGroupAccordion, questionGroupName);
};

export const schoolAdminClickAddQuestionOrQuestionGroupActionPanel = async (
    cms: CMSInterface,
    actionType: 'createQuestion' | 'createQuestionGroup' = 'createQuestion'
) => {
    const actionLabel =
        actionType === 'createQuestion' ? 'Create Question' : 'Create Question Group';

    const questionGroupListActionPanel = await cms.page!.waitForSelector(questionListHeaderAction);

    await questionGroupListActionPanel.click();

    const actionButton = await cms.waitForSelectorHasText('[role="menuitem"]', actionLabel);

    await actionButton?.click();
};

export const schoolAdminFillUpsertQuestionForm = async (
    cms: CMSInterface,
    { selectedTypeTitle, questionName, explanationContent }: QuestionUpsertFormValue
) => {
    await schoolAdminWaitingUpsertQuestionDialog(cms);

    await schoolAdminChooseToCreateQuizWithTypeV2(cms, selectedTypeTitle);

    await schoolAdminFillQuizQuestionData(cms, questionName);

    await schoolAdminFillsAllAnswersByQuestionType(cms, selectedTypeTitle);

    await schoolAdminFillQuizExplanationData(cms, explanationContent);

    await schoolAdminSubmitQuestion(cms);
};

export const schoolAdminFillQuestionGroupNameInput = async (
    cms: CMSInterface,
    nameValue: string
) => {
    const page = cms.page!;

    const questionGroupNameInputElement = await page.waitForSelector(questionGroupNameInput);

    await questionGroupNameInputElement.fill(nameValue);
};

export const schoolAdminFillQuestionGroupDescriptionInput = async (
    cms: CMSInterface,
    descriptionValue: string
) => {
    const page = cms.page!;

    const questionGroupDescriptionInputElement = await page.waitForSelector(
        questionGroupDescriptionInput
    );

    await questionGroupDescriptionInputElement.fill(descriptionValue);
};

export const schoolAdminFillUpsertQuestionGroupForm = async (
    cms: CMSInterface,
    { questionGroupName, questionGroupDescription }: QuestionGroupDetail
) => {
    await schoolAdminFillQuestionGroupNameInput(cms, questionGroupName);

    await schoolAdminFillQuestionGroupDescriptionInput(cms, questionGroupDescription);

    await schoolAdminSubmitQuestion(cms);
};

export const schoolAdminClickCreateQuestionInQuestionGroup = async (
    cms: CMSInterface,
    questionGroupName: string
) => {
    const questionGroupAccordionElement = await schoolAdminGetQuestionGroupAccordionElementByName(
        cms,
        questionGroupName
    );

    const addQuestionButton = await questionGroupAccordionElement!.waitForSelector(
        questionGroupAddQuestionButton
    );

    await addQuestionButton.click();
};

export const schoolAdminAssertQuestionGroupDetail = async (
    cms: CMSInterface,
    { questionGroupName, questionGroupDescription }: QuestionGroupDetail
) => {
    await cms.waitForSelectorHasText(questionGroupAccordion, questionGroupName);
    await cms.waitForSelectorHasText(questionGroupAccordion, questionGroupDescription);
};
