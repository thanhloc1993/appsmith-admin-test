import { asyncForEach } from '@syllabus-utils/common';

import { CMSInterface } from '@supports/app-types';
import { ActionOptions, MoveDirection } from '@supports/types/cms-types';

import { QuestionGroupDetail, QuestionUpsertFormValue } from './cms-models/question-group';
import { moveDownBase, moveUpBase } from './cms-selectors/cms-keys';
import {
    getQuestionAccordionByName,
    getQuestionItemName,
    questionGroupAccordion,
    questionGroupAddQuestionButton,
    questionGroupDescription,
    questionGroupDescriptionEditor,
    questionGroupListItemByText,
    questionGroupName,
    questionGroupNameInput,
    questionInQuestionGroupItemByText,
    questionItem,
    questionItemDescription,
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
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

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

    const questionGroupDescriptionEditorElement = await page.waitForSelector(
        questionGroupDescriptionEditor
    );

    await questionGroupDescriptionEditorElement.fill(descriptionValue);
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

export const schoolAdminChooseQuestionsToSwitch = async (
    cms: CMSInterface,
    direction: MoveDirection
) => {
    const cmsPage = cms.page!;
    const questionGroups = await cmsPage.$$(questionGroupAccordion);

    let selectedQuestionName: string | null = '';
    let selectedQuestionGroupName: string | null = '';
    let moveIndex = 0;

    await asyncForEach(questionGroups, async (questionGroup) => {
        const questions = await questionGroup.$$(questionItem);
        const numberOfQuestions = questions.length;

        if (numberOfQuestions >= 2) {
            moveIndex =
                direction === 'up'
                    ? randomInteger(1, numberOfQuestions - 1)
                    : randomInteger(0, numberOfQuestions - 2);

            const selectedQuestion = questions[moveIndex];

            const selectedQuestionDescriptionElement = await selectedQuestion.waitForSelector(
                questionItemDescription
            );
            const selectedQuestionGroupNameElement = await questionGroup.waitForSelector(
                questionGroupName
            );

            selectedQuestionName = await selectedQuestionDescriptionElement.textContent();
            selectedQuestionGroupName = await selectedQuestionGroupNameElement.textContent();

            if (!selectedQuestionName) throw Error(`No question group found at index ${moveIndex}`);
        }
    });

    return { moveIndex, selectedQuestionName, selectedQuestionGroupName };
};

export const schoolAdminMoveQuestionInsideQuestionGroupInDirection = async (
    cms: CMSInterface,
    questionName: string,
    questionGroupName: string,
    direction: MoveDirection
) => {
    const selectedQuestionGroup = await cms.page!.waitForSelector(
        getQuestionAccordionByName(questionGroupName)
    );

    const selectedQuestion = await selectedQuestionGroup.waitForSelector(
        getQuestionItemName(questionName)
    );

    const moveButtonSelector = direction === 'down' ? moveDownBase : moveUpBase;

    const moveButton = await selectedQuestion.waitForSelector(moveButtonSelector);

    await moveButton.click();
};

export const schoolAdminSeeQuestionsMoveAccordingly = async (
    cms: CMSInterface,
    questionGroupName: string,
    questionName: string,
    expectedQuestionGroupIndex: number
) => {
    const selectedQuestionGroup = await cms.page!.waitForSelector(
        getQuestionAccordionByName(questionGroupName)
    );

    const questions = await selectedQuestionGroup.$$(questionItem);

    const selectedQuestion = questions[expectedQuestionGroupIndex];

    const selectedQuestionDescriptionElement = await selectedQuestion.waitForSelector(
        questionItemDescription
    );

    const selectedQuestionName = await selectedQuestionDescriptionElement.textContent();

    if (!selectedQuestionName)
        throw Error(`Question ${questionName} not found at index ${expectedQuestionGroupIndex}!`);

    weExpect(selectedQuestionName).toEqual(questionName);
};

export const schoolAdminChooseQuestionsGroupToSwitch = async (
    cms: CMSInterface,
    direction: MoveDirection
) => {
    const cmsPage = cms.page!;
    const questionGroups = await cmsPage.$$(questionGroupAccordion);

    let moveIndex = randomInteger(0, questionGroups.length - 2);
    if (direction === 'up') moveIndex = randomInteger(1, questionGroups.length - 1);

    if (questionGroups.length < 2) throw Error('There are not enough question groups to move!');

    const selectedQuestionGroup = questionGroups[moveIndex];

    const selectedQuestionGroupNameElement = await selectedQuestionGroup.waitForSelector(
        questionGroupName
    );

    const selectedQuestionGroupName = await selectedQuestionGroupNameElement.textContent();

    if (!selectedQuestionGroupName) throw Error(`No question group found at index ${moveIndex}`);

    return { selectedQuestionGroupName, moveIndex };
};

export const schoolAdminMoveQuestionGroupInDirection = async (
    cms: CMSInterface,
    questionGroupName: string,
    direction: MoveDirection
) => {
    const selectedMoveButton = direction === 'up' ? moveUpBase : moveDownBase;

    const selectedQuestionGroup = await cms.page!.waitForSelector(
        getQuestionAccordionByName(questionGroupName)
    );

    const moveButtonOfQuestionGroup = await selectedQuestionGroup.waitForSelector(
        selectedMoveButton
    );

    await moveButtonOfQuestionGroup.click();
};

export const schoolAdminSeeQuestionGroupMovedToIndex = async (
    cms: CMSInterface,
    selectedQuestionGroupName: string,
    expectedQuestionGroupIndex: number
) => {
    const cmsPage = cms.page!;
    const questionGroups = await cmsPage.$$(questionGroupAccordion);

    const questionGroupNameElement = await questionGroups[
        expectedQuestionGroupIndex
    ].waitForSelector(questionGroupName);

    const questionGroupNameValue = await questionGroupNameElement.textContent();

    if (!questionGroupNameValue)
        throw Error(`No question group found at index ${expectedQuestionGroupIndex}!`);

    weExpect(selectedQuestionGroupName).toEqual(questionGroupNameValue);
};

export const schoolAdminWaitingUpsertQuestionGroupDialog = async (cms: CMSInterface) => {
    const cmsPage = cms.page!;

    await cms.waitingForLoadingIcon();
    await cmsPage.waitForSelector(questionGroupDescription);
};

export const schoolAdminGoesToEditQuestionGroupPage = async (
    cms: CMSInterface,
    questionGroupName: string
) => {
    const wrapperSelector = questionGroupListItemByText(questionGroupName);

    await cms.selectActionButton(ActionOptions.EDIT, {
        target: 'actionPanelTrigger',
        wrapperSelector,
    });

    await schoolAdminWaitingUpsertQuestionGroupDialog(cms);
};

export const schoolAdminGoesToEditQuestionPageInQuestionGroup = async (
    cms: CMSInterface,
    questionContent: string
) => {
    await cms.selectActionButton(ActionOptions.EDIT, {
        target: 'actionPanelTrigger',
        wrapperSelector: questionInQuestionGroupItemByText(questionContent),
    });

    await schoolAdminWaitingUpsertQuestionDialog(cms);
};
