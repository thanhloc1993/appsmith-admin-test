import { ElementHandle } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { dateIsAfter, getDateAfterDuration, formatDate } from '@supports/utils/time/time';

import { aliasQuestionnaireTable } from './alias-keys/communication';
import * as CommunicationSelectors from './cms-selectors/communication';
import { DEFAULT_NUMBER_OF_QUESTION } from './communication-constants';
import { QuestionType } from 'manabuf/common/v1/notifications_pb';

export type TextBoxType = 'blank' | 'valid';
export type QuestionTypeParams = keyof typeof QuestionType;
export type ArrowType = 'Up Arrow' | 'Down Arrow';
export type ToggleViewButtonType = 'View More' | 'View Less';
export type AccordionStatus = 'expand' | 'collapse';

export interface QuestionnaireTable {
    numberOfQuestions: string;
    numberOfAnswersEach: string;
    questionType: QuestionTypeParams;
    questionTextBox?: TextBoxType;
    answerTextBox?: TextBoxType;
    questionSection?: string;
}

export interface QuestionnaireFormData {
    questionContent: string;
    answerContents: string[];
    questionType: QuestionTypeParams;
}

export interface AnswersDataTableRow {
    questionSection: string;
    answer: string;
}

export interface QuestionnaireAnswerTable {
    'Responder Name': string;
    [index: string]: string;
}

export type MappedQuestionnaireTable = Omit<
    QuestionnaireTable,
    'numberOfQuestions' | 'numberOfAnswersEach'
> & {
    numberOfAnswersEach: number;
};

/**
 * map questionnaire table to list of specific questions
 * @param questionnaireTable questionnaire table
 * @returns list of specific questions
 * example: 
 * questionnaireTable = [
        {
            numberOfQuestions: 1,
            numberOfAnswersEach: 10,
            questionType: 'QUESTION_TYPE_MULTIPLE_CHOICE',
        },
        {
            numberOfQuestions: 2,
            numberOfAnswersEach: 0,
            questionType: 'QUESTION_TYPE_FREE_TEXT',
        },
    ]
    mapQuestionnaireTable(questionnaireTable) = [
        {
            numberOfAnswersEach: 10,
            questionType: 'QUESTION_TYPE_MULTIPLE_CHOICE',
        },
        {
            numberOfAnswersEach: 0,
            questionType: 'QUESTION_TYPE_FREE_TEXT',
        },
        {
            numberOfAnswersEach: 0,
            questionType: 'QUESTION_TYPE_FREE_TEXT',
        },
    ]
 */

export const mapQuestionnaireTable = (
    questionnaireTable: QuestionnaireTable[]
): MappedQuestionnaireTable[] => {
    return questionnaireTable.reduce<MappedQuestionnaireTable[]>(
        (
            previousValue,
            {
                numberOfQuestions,
                numberOfAnswersEach,
                questionType,
                questionTextBox,
                answerTextBox,
                questionSection,
            }
        ) => {
            const fillNumber = questionSection
                ? DEFAULT_NUMBER_OF_QUESTION
                : Number(numberOfQuestions);

            const mappedType: MappedQuestionnaireTable[] = Array(fillNumber).fill({
                numberOfAnswersEach: Number(numberOfAnswersEach),
                questionType,
                questionTextBox: questionTextBox || 'valid',
                answerTextBox: answerTextBox || 'valid',
                questionSection,
            });

            return [...previousValue, ...mappedType];
        },
        []
    );
};

export async function clickAddQuestionButton(cms: CMSInterface) {
    await cms.instruction(`Click Add Question`, async function () {
        await cms.selectElementByDataTestId(CommunicationSelectors.addQuestionButton);
    });
}

export async function getQuestionTitleInQuestionSection(
    questionSectionElement: ElementHandle<SVGElement | HTMLElement>
) {
    const questionTitleElement = await questionSectionElement.$(
        CommunicationSelectors.questionTitle
    );
    if (!questionTitleElement) throw Error('Cannot find question title in question section');

    const questionTitleContent = await questionTitleElement.textContent();

    return questionTitleContent;
}

export async function getQuestionInputValueInQuestionSection(
    questionSectionElement: ElementHandle<SVGElement | HTMLElement>
) {
    const questionInputElement = await questionSectionElement.$(
        CommunicationSelectors.questionInput
    );
    if (!questionInputElement) throw Error('Cannot find question input in question section');

    const questionInputValue = await questionInputElement.inputValue();

    return questionInputValue;
}

export async function clickAddAnswerButton(
    cms: CMSInterface,
    questionSectionElement: ElementHandle<SVGElement | HTMLElement>
) {
    const questionInputValue = await getQuestionInputValueInQuestionSection(questionSectionElement);
    const questionTitleContent = await getQuestionTitleInQuestionSection(questionSectionElement);

    const answerButtonElement = await questionSectionElement.$(
        CommunicationSelectors.addAnswerButton
    );
    if (!answerButtonElement) throw Error(`Cannot find answer button in ${questionTitleContent}`);

    await cms.instruction(
        `Click add answer button in ${questionTitleContent} has question content ${questionInputValue}`,
        async function () {
            await answerButtonElement.click();
        }
    );
}

export async function fillQuestionTitleInQuestionnaire(
    cms: CMSInterface,
    questionSectionElement: ElementHandle<SVGElement | HTMLElement>,
    questionInputValue: string
) {
    const questionTitleContent = await getQuestionTitleInQuestionSection(questionSectionElement);

    const questionInputElement = await questionSectionElement.$(
        CommunicationSelectors.questionInput
    );
    if (!questionInputElement) throw Error(`Cannot find question input in ${questionTitleContent}`);

    await cms.instruction(
        `Fill question input value ${questionInputValue} in ${questionTitleContent}`,
        async function () {
            await questionInputElement.fill(questionInputValue);
        }
    );
}

export async function fillAnswerContentInQuestionnaire(
    cms: CMSInterface,
    questionSectionElement: ElementHandle<SVGElement | HTMLElement>,
    answerIndex: number,
    answerContent: string
) {
    const questionTitleContent = await getQuestionTitleInQuestionSection(questionSectionElement);

    const answerItemElement = await questionSectionElement.$(
        CommunicationSelectors.getAnswerItemSelectorByAnswerIndex(answerIndex)
    );
    if (!answerItemElement)
        throw Error(`Cannot find answer input at index ${answerIndex} in ${questionTitleContent}`);

    const answerInputElement = await answerItemElement.$(CommunicationSelectors.answerInput);
    if (!answerInputElement)
        throw Error(
            `Cannot find answer input in question item ${answerIndex} in ${questionTitleContent}`
        );

    await cms.instruction(
        `Fill answer input value ${answerContent} in ${questionTitleContent}`,
        async function () {
            await answerInputElement.fill(answerContent);
        }
    );
}

export async function selectQuestionTypeInQuestionnaire(
    cms: CMSInterface,
    questionSectionElement: ElementHandle<SVGElement | HTMLElement>,
    questionType: QuestionTypeParams
) {
    const questionTitleContent = await getQuestionTitleInQuestionSection(questionSectionElement);

    const questionTypeSelectElement = await questionSectionElement.$(
        CommunicationSelectors.questionTypeSelect
    );
    if (!questionTypeSelectElement)
        throw Error(`Cannot find question type select in ${questionTitleContent}`);

    await cms.instruction(
        `Select question type to ${questionType} in ${questionTitleContent}`,
        async function () {
            await questionTypeSelectElement.click();
            await cms.chooseOptionInAutoCompleteBoxByDataValue(questionType);
        }
    );
}

export async function deleteQuestionSection(cms: CMSInterface, questionIndex: number) {
    const questionSectionElement = await cms.page!.$(
        CommunicationSelectors.getQuestionSectionSelectorByQuestionIndex(questionIndex)
    );
    if (!questionSectionElement) throw Error('Cannot find question section in questionnaire');

    const questionTitleContent = await getQuestionTitleInQuestionSection(questionSectionElement);

    const deleteQuestionButtonElement = await questionSectionElement.$(
        CommunicationSelectors.deleteQuestionButton
    );
    if (!deleteQuestionButtonElement)
        throw Error(`Cannot find delete question button in ${questionTitleContent}`);

    await cms.instruction(`Delete ${questionTitleContent} in questionnaire`, async function () {
        await deleteQuestionButtonElement.click();
    });
}

export async function deleteAnswerItem(
    cms: CMSInterface,
    questionIndex: number,
    answerIndex: number
) {
    const questionSectionElement = await cms.page!.$(
        CommunicationSelectors.getQuestionSectionSelectorByQuestionIndex(questionIndex)
    );
    if (!questionSectionElement) throw Error('Cannot find question section in questionnaire');

    const questionTitleContent = await getQuestionTitleInQuestionSection(questionSectionElement);

    const answerItemElement = await questionSectionElement.$(
        CommunicationSelectors.getAnswerItemSelectorByAnswerIndex(answerIndex)
    );
    if (!answerItemElement) throw Error(`Cannot find answer item in ${questionTitleContent}`);

    const deleteAnswerButtonElement = await answerItemElement.$(
        CommunicationSelectors.deleteAnswerButton
    );
    if (!deleteAnswerButtonElement)
        throw Error(`Cannot find delete answer button in ${questionTitleContent}`);

    await cms.instruction(
        `Delete answer item ${answerIndex + 1} at ${questionTitleContent}`,
        async function () {
            await deleteAnswerButtonElement.click();
        }
    );
}

export async function clickRequiredQuestionToggle(
    cms: CMSInterface,
    questionSectionElement: ElementHandle<SVGElement | HTMLElement>
) {
    const questionTitleContent = await getQuestionTitleInQuestionSection(questionSectionElement);

    const requiredQuestionToggleElement = await questionSectionElement.$(
        CommunicationSelectors.requiredQuestionToggle
    );
    if (!requiredQuestionToggleElement)
        throw Error(`Cannot find required question toggle in ${questionTitleContent}`);

    await cms.instruction(
        `Click required question toggle in ${questionTitleContent}`,
        async function () {
            await requiredQuestionToggleElement.click();
        }
    );
}

export async function clickAllowResubmissionToggle(cms: CMSInterface) {
    const allowResubmissionToggleElement = await cms.page?.$(
        CommunicationSelectors.allowResubmissionToggle
    );
    if (!allowResubmissionToggleElement)
        throw Error('Cannot find allow resubmission toggle in questionnaire');

    await cms.instruction('Click allow resubmission in questionnaire', async function () {
        await allowResubmissionToggleElement.click();
    });
}

export async function clickImportantNotificationToggle(cms: CMSInterface) {
    const importantNotificationToggleElement = await cms.page?.$(
        CommunicationSelectors.importantNotificationToggle
    );
    if (!importantNotificationToggleElement)
        throw Error('Cannot find important notification toggle in questionnaire');

    await cms.instruction(
        'Click important notification toggle in questionnaire',
        async function () {
            await importantNotificationToggleElement.click();
        }
    );
}

export async function changeScheduleDate(cms: CMSInterface, selectDate: Date) {
    const defaultScheduleDate = new Date();

    await cms.instruction(
        `Change schedule date to ${formatDate(selectDate, 'YYYY/MM/DD')}`,
        async function () {
            await cms.selectDatePickerMonthAndDay({
                day: selectDate.getDate(),
                monthDiff: selectDate.getMonth() - defaultScheduleDate.getMonth(),
                datePickerSelector: CommunicationSelectors.notificationScheduleDatePicker,
            });
        }
    );
}

export async function changeScheduleTime(cms: CMSInterface, timeValue: string) {
    await cms.instruction(`Change schedule time to ${timeValue}`, async function () {
        await cms.page!.fill(CommunicationSelectors.timePickerInput, timeValue);
        await cms.chooseOptionInAutoCompleteBoxByText(timeValue);
    });
}

export async function changeExpirationDate(cms: CMSInterface, selectDate: Date) {
    const defaultExpirationDate = getDateAfterDuration(7);

    await cms.instruction(
        `Change expiration date to ${formatDate(selectDate, 'YYYY/MM/DD')}`,
        async function () {
            await cms.selectDatePickerMonthAndDay({
                day: selectDate.getDate(),
                monthDiff: selectDate.getMonth() - defaultExpirationDate.getMonth(),
                datePickerSelector: CommunicationSelectors.expirationDatePicker,
            });
        }
    );
}

export async function changeExpirationTime(cms: CMSInterface, timeValue: string) {
    await cms.instruction(`Change expiration time to ${timeValue}`, async function () {
        await cms.page!.fill(CommunicationSelectors.expirationTimePickerInput, timeValue);
        await cms.chooseOptionInAutoCompleteBoxByText(timeValue);
    });
}

export async function checkAddQuestionIsHidden(cms: CMSInterface) {
    await cms.instruction('Check add question button is hidden', async function () {
        await cms.page!.waitForSelector(CommunicationSelectors.addQuestionButton, {
            state: 'hidden',
        });
    });
}

export async function checkAddAnswerQuestionIsHidden(
    cms: CMSInterface,
    questionSectionElement: ElementHandle<SVGElement | HTMLElement>
) {
    const questionTitleContent = await getQuestionTitleInQuestionSection(questionSectionElement);

    await cms.instruction(
        `Check add answer button is hidden in ${questionTitleContent}`,
        async function () {
            await questionSectionElement
                .asElement()
                .waitForSelector(CommunicationSelectors.addAnswerButton, { state: 'hidden' });
        }
    );
}

export async function assertScheduleDateAndQuestionnaireDate(cms: CMSInterface) {
    const notificationScheduleDatePicker = await cms.page!.inputValue(
        CommunicationSelectors.notificationScheduleDatePicker
    );

    const notificationScheduleTime = await cms.page!.inputValue(
        CommunicationSelectors.timePickerInput
    );

    const notificationScheduleDateTime = new Date(
        `${notificationScheduleDatePicker} ${notificationScheduleTime}`
    );

    const notificationExpirationDatePicker = await cms.page!.inputValue(
        CommunicationSelectors.expirationDatePicker
    );

    const notificationExpirationTime = await cms.page!.inputValue(
        CommunicationSelectors.expirationTimePickerInput
    );

    const notificationExpirationDateTime = new Date(
        `${notificationExpirationDatePicker} ${notificationExpirationTime}`
    );

    await cms.attach(
        `Assert Questionnaire
        - Schedule date time ${formatDate(notificationScheduleDateTime, 'YYYY/MM/DD, HH:mm')}
        - Expiration date time ${formatDate(notificationExpirationDateTime, 'YYYY/MM/DD, HH:mm')}`
    );

    weExpect(dateIsAfter(notificationExpirationDateTime, notificationScheduleDateTime)).toEqual(
        true
    );
}

export async function checkErrorMessageInTextField(
    cms: CMSInterface,
    textFieldElement: ElementHandle<SVGElement | HTMLElement>,
    errorMessage: string
) {
    const textFieldParentElement = await textFieldElement.getProperty('parentNode');
    const textFieldContainerElement = await textFieldParentElement.getProperty('parentNode');

    await cms.instruction(`Check error message ${errorMessage} in text field`, async function () {
        await textFieldContainerElement
            .asElement()
            ?.waitForSelector(
                CommunicationSelectors.getTextFieldErrorMessageSelector(errorMessage)
            );
    });
}

export async function checkErrorMessageInDatePicker(
    cms: CMSInterface,
    textFieldElement: ElementHandle<SVGElement | HTMLElement>,
    errorMessage: string
) {
    const textFieldParentElement = await textFieldElement.getProperty('parentNode');
    const textFieldContainerElement = await textFieldParentElement.getProperty('parentNode');

    await textFieldContainerElement.asElement()?.scrollIntoViewIfNeeded();

    await cms.instruction(`Check error message ${errorMessage} in text field`, async function () {
        await textFieldContainerElement
            .asElement()
            ?.waitForSelector(CommunicationSelectors.getDateErrorMessageSelector(errorMessage));
    });
}

export async function checkQuestionTitleErrorMessage(
    cms: CMSInterface,
    scenario: ScenarioContext,
    errorMessage: string
) {
    const questionnaireTable: MappedQuestionnaireTable[] = scenario.get(aliasQuestionnaireTable);

    for (const [questionnaireIndex, questionnaire] of questionnaireTable.entries()) {
        if (questionnaire.questionTextBox === 'blank') {
            const questionSectionElement = await cms.page!.$(
                CommunicationSelectors.getQuestionSectionSelectorByQuestionIndex(questionnaireIndex)
            );
            if (!questionSectionElement)
                throw Error('Cannot find question section in questionnaire');

            const questionTitleContent = await getQuestionTitleInQuestionSection(
                questionSectionElement
            );

            const questionInputElement = await questionSectionElement.$(
                CommunicationSelectors.questionInput
            );
            if (!questionInputElement)
                throw Error(`Cannot find question input in ${questionTitleContent}`);

            await checkErrorMessageInTextField(cms, questionInputElement, errorMessage);
        }
    }
}

export async function checkAnswerContentErrorMessage(
    cms: CMSInterface,
    scenario: ScenarioContext,
    errorMessage: string
) {
    const questionnaireData: MappedQuestionnaireTable[] = scenario.get(aliasQuestionnaireTable);

    for (const [questionnaireIndex, questionnaire] of questionnaireData.entries()) {
        if (questionnaire.answerTextBox === 'blank') {
            const questionSectionElement = await cms.page!.$(
                CommunicationSelectors.getQuestionSectionSelectorByQuestionIndex(questionnaireIndex)
            );
            if (!questionSectionElement)
                throw Error('Cannot find question section in questionnaire');

            const questionTitleContent = await getQuestionTitleInQuestionSection(
                questionSectionElement
            );

            const questionInputElements = await questionSectionElement.$$(
                CommunicationSelectors.answerInput
            );
            if (questionInputElements.length === 0)
                throw Error(`Cannot find question input in ${questionTitleContent}`);

            for (const questionInputElement of questionInputElements) {
                await checkErrorMessageInTextField(cms, questionInputElement, errorMessage);
            }
        }
    }
}

export async function assertNotificationWithoutQuestionnaire(cms: CMSInterface) {
    await cms.attach(`Question Sections do not exist in page`);
    const questionSectionElement = await cms.page?.$$(CommunicationSelectors.questionSection);
    weExpect(questionSectionElement).toHaveLength(0);

    await cms.attach(`Allow Resubmission Toggle does not exist in page`);
    const allowResubmissionToggle = await cms.page?.$(
        CommunicationSelectors.allowResubmissionToggle
    );
    weExpect(allowResubmissionToggle).toBeNull();

    await cms.attach(`Expiration Date Picker does not exist in page`);
    const expirationDatePicker = await cms.page?.$(CommunicationSelectors.expirationDatePicker);
    weExpect(expirationDatePicker).toBeNull();

    await cms.attach(`Expiration Time Picker Input does not exist in page`);
    const expirationTimePickerInput = await cms.page?.$(
        CommunicationSelectors.expirationTimePickerInput
    );
    weExpect(expirationTimePickerInput).toBeNull();
}

export async function checkDisableDeleteAnswerIconOfQuestionnaire(
    cms: CMSInterface,
    questionSectionElement: ElementHandle<SVGElement | HTMLElement>,
    { isDisabled }: { isDisabled: boolean }
) {
    const deleteAnswerButtonListElement = await questionSectionElement.$$(
        CommunicationSelectors.deleteAnswerButton
    );

    if (deleteAnswerButtonListElement.length === 0)
        throw Error(`Cannot find delete answer questionnaire button`);

    await cms.attach(
        `Check ${deleteAnswerButtonListElement.length} disable delete answer icon buttons`
    );

    for (const deleteAnswerButton of deleteAnswerButtonListElement) {
        const deleteAnswerButtonElementDisable = await deleteAnswerButton.isDisabled();

        weExpect(deleteAnswerButtonElementDisable).toEqual(isDisabled);
    }
}

export async function assertNotificationQuestionAndAnswerWithQuestionnaire(
    cms: CMSInterface,
    scenario: ScenarioContext
) {
    const questionnaireTable: MappedQuestionnaireTable[] = scenario.get(aliasQuestionnaireTable);

    for (const [questionnaireIndex, questionnaire] of questionnaireTable.entries()) {
        const questionSectionElement = await cms.page!.$(
            CommunicationSelectors.getQuestionSectionSelectorByQuestionIndex(questionnaireIndex)
        );

        if (!questionSectionElement) throw Error('Cannot find question section in questionnaire');

        const questionFormData: QuestionnaireFormData = scenario.get(
            questionnaire.questionSection || ''
        );

        const questionInputValue = await getQuestionInputValueInQuestionSection(
            questionSectionElement
        );

        await cms.instruction(
            `Questionnaire Form Data Full Value: ${JSON.stringify(questionFormData)}
                    Questionnaire Input Value ${questionInputValue}
                    Questionnaire Form Data question content: ${questionFormData.questionContent}`,
            async () => {
                await questionSectionElement.scrollIntoViewIfNeeded();

                weExpect(questionInputValue).toEqual(questionFormData.questionContent);
            }
        );

        if (questionnaire.questionType !== 'QUESTION_TYPE_FREE_TEXT') {
            for (
                let answerIndex = 0;
                answerIndex < questionnaire.numberOfAnswersEach;
                answerIndex++
            ) {
                const answerItemElement = await questionSectionElement.$(
                    CommunicationSelectors.getAnswerItemSelectorByAnswerIndex(answerIndex)
                );

                if (!answerItemElement) throw Error('Cannot find answer section in questionnaire');

                const answerInputValue = await getAnswerInputValueInQuestionAnswerSection(
                    answerItemElement
                );

                await cms.instruction(
                    `
                        Answer Input Value ${answerInputValue}
                        Answer Form Data Answer content: ${questionFormData.answerContents[answerIndex]}`,
                    async () => {
                        await answerItemElement.scrollIntoViewIfNeeded();

                        weExpect(answerInputValue).toEqual(
                            questionFormData.answerContents[answerIndex]
                        );
                    }
                );
            }
        }
    }
}

export async function getAnswerInputValueInQuestionAnswerSection(
    answerItemElement: ElementHandle<SVGElement | HTMLElement>
) {
    const answerInputElement = await answerItemElement.$(CommunicationSelectors.answerInput);
    if (!answerInputElement) throw Error('Cannot find answer input in answer section');

    const answerInputValue = await answerInputElement.inputValue();

    return answerInputValue;
}
