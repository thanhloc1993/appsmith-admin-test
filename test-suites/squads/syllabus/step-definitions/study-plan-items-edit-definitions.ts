import {
    getRandomElement,
    randomInteger,
    randomUniqueIntegers,
} from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@supports/utils/time/time';

import {
    aliasBulkEditAction,
    aliasBulkEditPostponeAdvanceDate,
    aliasEnteredStudyPlanItemFields,
    aliasStudyPlanItemDateTypeValue,
    aliasStudyPlanItemValue,
    aliasStudyPlanItemValues,
    aliasStudyPlanItemYear,
    aliasStudyPlanRowsWithTopicNameIds,
    aliasStudyPlanSelectedItemIds,
} from './alias-keys/syllabus';
import {
    studyPlanItemTableAction as studyPlanItemTableActionSelector,
    studyPlanItemTableTopicName,
} from './cms-selectors/cms-keys';
import { dropdownMenuButton, getBulkEditDialogTabInput } from './cms-selectors/study-plan';
import { timePickerInput } from './cms-selectors/syllabus';
import {
    fullDateTimePattern,
    schoolAdminIsAtStudyPlanDetailsPage,
    schoolAdminWaitingStudyPlanDetailLoading,
    shortDateTimePattern,
    StudyPlanPageType,
} from './syllabus-study-plan-common-definitions';
import {
    getFirstStudyPlanItemFields,
    getFirstStudyPlanItemValues,
    getStudyPlanItemFieldsByName,
    schoolAdminWaitingUpdateStudyPlanItems,
} from './syllabus-study-plan-item-common-definitions';
import { assertStudyPlanItemDateError, enterStudyPlanItemDates } from './syllabus-utils';
import { schoolAdminChooseTabInCourseDetail } from 'test-suites/common/step-definitions/course-definitions';
import { StudyPlanItemTimeField } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import {
    schoolAdminGoToCourseDetail,
    schoolAdminIsOnCoursePage,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-add-book-to-course-definitions';

export type StudyPlanItemDisplayAction = 'selects' | 'deselects';
export type StudyPlanItemStatus = 'active and archived' | 'active';

export type StudyPlanItemDateField =
    | 'Available From'
    | 'Available Until'
    | 'Start Date'
    | 'Due Date';

export type BulkEditStudyPlanItemOption =
    | 'Edit Available From'
    | 'Edit Available Until'
    | 'Edit Start Date'
    | 'Edit Due Date';

export type BulkEditStudyPlanItemTab = 'postpone' | 'advance';

export type TopicSelectionSet = 'all' | 'many' | 'one';

export type StudyPlanType = 'master' | 'individual';

export type StudyPlanDurationDate = 'start date' | 'end date';

export type StudyPlanDurationTime = 'start time' | 'end time';

export type ValueType = 'text' | 'incorrect format' | 'special characters';

export const getStudyPlanItemDateTimeFieldName = (
    action: BulkEditStudyPlanItemOption
): StudyPlanItemTimeField => {
    switch (action) {
        case 'Edit Available From':
            return 'availableFrom';
        case 'Edit Available Until':
            return 'availableTo';
        case 'Edit Start Date':
            return 'startDate';
        case 'Edit Due Date':
            return 'endDate';
    }
};

const getStudyPlanItemTableColumnsByFieldName = (action: BulkEditStudyPlanItemOption) => {
    const fieldName = getStudyPlanItemDateTimeFieldName(action);

    return `StudyPlanItemTableColumns__${fieldName}`;
};

const getStudyPlanItemInputValueByFieldName = async ({
    cms,
    fieldId,
    action,
}: {
    cms: CMSInterface;
    fieldId: string;
    action: BulkEditStudyPlanItemOption;
}) => {
    const fieldName = getStudyPlanItemDateTimeFieldName(action);
    const inputName = `studyPlanItem.${fieldId}.${fieldName}`;

    const value = await cms.getValueOfInput(`input[name='${inputName}']`);

    return value;
};

const availableFieldIndices: Record<StudyPlanItemDateField, number> = {
    'Available From': 0,
    'Available Until': 1,
    'Start Date': 2,
    'Due Date': 3,
};

const getCurrentStudyPlanItemValuesAfterBulkUpdated = async (
    cms: CMSInterface,
    updatedFieldName: string
) => {
    const currentValues: string[] = [];

    const values = (await cms.page!.$$eval(`td[data-testid="${updatedFieldName}"]`, (nodes) =>
        nodes.map((n) => n.textContent)
    )) as string[];

    currentValues.concat(values);

    return currentValues;
};

const studyPlanSelectedItemsCount = async (cms: CMSInterface, ids: string[]) => {
    let counter = 0;
    for (let i = 0; i < ids.length; i++) {
        const itemId = ids[i];

        const checkbox = await cms.page?.waitForSelector(
            `tr[data-value="${itemId}"] >> input[type=checkbox]`
        );

        if (checkbox) {
            const isCheckboxChecked = await checkbox.isChecked();
            if (isCheckboxChecked) {
                counter++;
            }
        }
    }

    return counter;
};

const studyPlanItemIdsByTopicGroup = async (cms: CMSInterface) => {
    const allItemRows = await cms.page!.$$("tr[data-testid='TableBase__row']");
    const rowsWithTopicNameIds = [];
    // get row indices grouped by topic name. i.e [0, 5, 7, 13]
    const topicGroupStartIndices = [];

    for (let i = 0; i < allItemRows.length; i++) {
        const item = allItemRows[i];
        const itemId = await item.getAttribute('data-value');

        // all study plan item with topic name rows
        const firstTd = await item.$('td:first-child');
        const topicName = await firstTd?.innerText();

        if (topicName) {
            rowsWithTopicNameIds.push(itemId);
            topicGroupStartIndices.push(i);
        }
    }

    return {
        allItemRows,
        rowsWithTopicNameIds,
        topicGroupStartIndices,
    };
};

export const setAvailableDateAndTimeToStudy = (
    context: ScenarioContext,
    date: StudyPlanDurationDate,
    time?: StudyPlanDurationTime
) => {
    const selectedDate = date === 'end date' ? getLastDayOfMonth() : getFirstDayOfMonth();

    let selectedTime: string | undefined;

    const action: BulkEditStudyPlanItemOption = context.get(aliasBulkEditAction);
    const isDefaultEndTimeOfDay = action === 'Edit Available Until' || action === 'Edit Due Date';

    selectedTime = isDefaultEndTimeOfDay ? '23:59' : '00:00';

    // update if time changed
    if (time) {
        selectedTime = time === 'start time' ? '07:30' : '17:30'; // whatever it is, just valid start & end time to select
    }

    const selectedDateAndTime = `${formatDate(selectedDate, 'MM/DD')}, ${selectedTime}`;
    context.set(aliasStudyPlanItemDateTypeValue, selectedDate);
    context.set(aliasStudyPlanItemValue, selectedDateAndTime);

    return {
        selectedDate,
        selectedTime,
    };
};

export const setPostponeAdvanceDateTimeValue = (
    context: ScenarioContext,
    changedDate: Date,
    currentTime: string
) => {
    context.set(aliasBulkEditPostponeAdvanceDate, changedDate);
    const updatedValue = `${formatDate(changedDate, 'MM/DD')},${currentTime}`;
    context.set(aliasStudyPlanItemValue, updatedValue);
};

export const activeDropdownMenu = async (cms: CMSInterface) => {
    await cms.page?.click(dropdownMenuButton);
};

export async function schoolAdminSelectTimePicker(cms: CMSInterface, timeValue: string) {
    await cms.page!.fill(timePickerInput, timeValue);
    await cms.chooseOptionInAutoCompleteBoxByText(timeValue);
}

export const schoolAdminActsOnDisplayHiddenItems = async (
    cms: CMSInterface,
    studyPlanItemDisplayAction: StudyPlanItemDisplayAction
) => {
    const displayHiddenItemsOption = await cms.page!.waitForSelector('text="Display hidden items"');

    if (studyPlanItemDisplayAction === 'selects') {
        return await displayHiddenItemsOption.check();
    }

    await displayHiddenItemsOption.uncheck();
};

export const schoolAdminEditsStudyPlanItems = (cms: CMSInterface) =>
    cms.selectAButtonByAriaLabel('Edit', {
        parentSelector: studyPlanItemTableActionSelector,
    });

export const schoolAdminSeesAllEditActionsDisabled = async (cms: CMSInterface) => {
    const menuItems = await cms.page!.$$("li[role='menuitem']");
    menuItems.forEach(async (menuItem) => {
        weExpect(await menuItem.getAttribute('aria-disabled')).toBe('true');
    });
};

export const schoolAdminSelectsStudyPlanTopics = async (
    cms: CMSInterface,
    context: ScenarioContext,
    topicSet: TopicSelectionSet
) => {
    const { allItemRows, rowsWithTopicNameIds, topicGroupStartIndices } =
        await studyPlanItemIdsByTopicGroup(cms);

    const checkbox = 'input[type=checkbox]';
    const selectedItemIds = [];

    context.set(aliasStudyPlanRowsWithTopicNameIds, rowsWithTopicNameIds);

    const topic1 = `[data-value="${rowsWithTopicNameIds[0]}"]`;
    const topic2 = `[data-value="${rowsWithTopicNameIds[1]}"]`;

    switch (topicSet) {
        case 'all': {
            // all study plan items
            for (let i = 0; i < allItemRows.length; i++) {
                const item = allItemRows[i];
                const itemId = await item.getAttribute('data-value');
                selectedItemIds.push(itemId);
            }
            context.set(aliasStudyPlanSelectedItemIds, selectedItemIds);

            // select all items by select on table topic name header
            await cms.selectElementWithinWrapper(studyPlanItemTableTopicName, checkbox);

            break;
        }

        case 'many': {
            // selected study plan items in topic 1 & 2
            // so we get the row index in topicGroupStartIndices 2 minus 1 (start of next group)
            const selectedRows = topicGroupStartIndices[2] - 1;

            for (let i = 0; i < selectedRows; i++) {
                const item = allItemRows[i];
                const itemId = await item.getAttribute('data-value');
                selectedItemIds.push(itemId);
            }
            context.set(aliasStudyPlanSelectedItemIds, selectedItemIds);

            await cms.selectElementWithinWrapper(topic1, checkbox);
            await cms.selectElementWithinWrapper(topic2, checkbox);

            break;
        }
        case 'one': {
            // study plan items in topic 1
            const selectedRows = topicGroupStartIndices[1] - 1;
            for (let i = 0; i < selectedRows; i++) {
                const item = allItemRows[i];
                const itemId = await item.getAttribute('data-value');
                selectedItemIds.push(itemId);
            }
            context.set(aliasStudyPlanSelectedItemIds, selectedItemIds);

            await cms.selectElementWithinWrapper(topic1, checkbox);
            break;
        }
        default:
            throw new Error("'topicSet' must be one of 'all', 'many','one'");
    }
};

export const schoolAdminSelectsStudyPlanItems = async (
    cms: CMSInterface,
    context: ScenarioContext,
    numberOfItems: number,
    numberOfTopics: number
) => {
    const { allItemRows, topicGroupStartIndices } = await studyPlanItemIdsByTopicGroup(cms);

    const checkbox = 'input[type=checkbox]';

    // array of items in topic group 1
    let randomItemIndices = randomUniqueIntegers(topicGroupStartIndices[1] - 1, numberOfItems);

    if (numberOfTopics > 1) {
        const randomIndex1 = randomInteger(0, topicGroupStartIndices[1] - 1);
        const randomIndex2 = randomInteger(
            topicGroupStartIndices[1],
            topicGroupStartIndices[2] - 1
        );
        randomItemIndices = [randomIndex1, randomIndex2];
    }

    const selectedItems = [];

    for (let i = 0; i < numberOfItems; i++) {
        const item = allItemRows[randomItemIndices[i]];

        const itemId = await item.getAttribute('data-value');
        selectedItems.push(itemId);

        await cms.selectElementWithinWrapper(`[data-value="${itemId}"] td:nth-child(2)`, checkbox);
    }

    context.set(aliasStudyPlanSelectedItemIds, selectedItems);

    return;
};

export const schoolAdminClicksOnBulkEditMenuButton = async (cms: CMSInterface) => {
    return await activeDropdownMenu(cms);
};

// Select bulk edit option in bulk action dropdown menu.
export const schoolAdminSelectBulkEditAction = async (
    cms: CMSInterface,
    action: BulkEditStudyPlanItemOption
) => {
    await activeDropdownMenu(cms);

    const bulkEditAction = await cms.page!.waitForSelector(`text="${action}"`);
    return bulkEditAction.click();
};

export const schoolAdminPostponeAdvanceUpdate = async (
    cms: CMSInterface,
    {
        tab,
        tabIndex,
        duration,
    }: { tab: BulkEditStudyPlanItemTab; tabIndex: number; duration: number }
) => {
    const tabs = await cms.page!.$$(`[role=tab]`);

    if (!tabs) throw new Error('Bulk edit tabs does not exist');

    await tabs[tabIndex].click();
    const input = await cms.page!.$(getBulkEditDialogTabInput(tab));

    return input?.type(String(duration), { delay: 100 });
};

export const schoolAdminSeesStudyPlanItemsPostponeAdvance = async (
    cms: CMSInterface,
    {
        itemIds,
        currentDateValue,
        changedDate,
        action,
    }: {
        itemIds: string[];
        currentDateValue: string;
        changedDate: Date;
        action: BulkEditStudyPlanItemOption;
    }
) => {
    const currentTime = currentDateValue.split(',')[1];
    const updatedValue = `${formatDate(changedDate, 'YYYY/MM/DD')},${currentTime}`;

    for (let i = 0; i < itemIds.length; i++) {
        const itemId = itemIds[i];
        const value = await getStudyPlanItemInputValueByFieldName({
            cms,
            fieldId: itemId,
            action,
        });

        weExpect(value).toEqual(updatedValue);
    }
};

export const schoolAdminBulkEditAcceptChange = async (cms: CMSInterface) => {
    const bulkEditButton = await cms.page!.waitForSelector('text="Update"');
    return bulkEditButton.click();
};

export const schoolAdminSeesStudyPlanTopicsSelected = async (
    cms: CMSInterface,
    rowsWithTopicNameIds: string[],
    topicSet: TopicSelectionSet
) => {
    const selectedTopicsCount = await studyPlanSelectedItemsCount(cms, rowsWithTopicNameIds);

    switch (topicSet) {
        case 'one':
            weExpect(selectedTopicsCount).toBe(1);
            break;
        case 'many':
            weExpect(selectedTopicsCount).toBe(2);
            break;
        case 'all':
            weExpect(selectedTopicsCount).toBe(rowsWithTopicNameIds.length);
            break;
    }
};

export const schoolAdminSeesStudyPlanItemsSelected = async (
    cms: CMSInterface,
    studyPlanItemIds: string[]
) => {
    for (let i = 0; i < studyPlanItemIds.length; i++) {
        const itemId = studyPlanItemIds[i];

        const checkbox = await cms.page?.waitForSelector(
            `tr[data-value="${itemId}"] >> input[type=checkbox]`
        );

        if (checkbox) {
            const isCheckboxChecked = await checkbox.isChecked();
            weExpect(isCheckboxChecked).toBe(true);
        }
    }
};

export const schoolAdminCountStudyPlanItemsSelected = async (
    cms: CMSInterface,
    numberOfItems: number,
    studyPlanItemIds: string[]
) => {
    const counter = await studyPlanSelectedItemsCount(cms, studyPlanItemIds);

    weExpect(counter).toBe(numberOfItems);
};

export const schoolAdminSeesBulkDateTimeChanged = async (
    cms: CMSInterface,
    fieldNames: string[],
    value: string
) => {
    fieldNames.forEach(async (fieldName) => {
        const dateFields = await cms.page!.$$(`input[name$=${fieldName}]`);
        const areDateFieldsChanged = dateFields.every(async (dateField) => {
            return (await dateField.inputValue()) === value;
        });

        weExpect(
            areDateFieldsChanged,
            `study plan items field ${fieldName} are changed with ${value}`
        ).toBe(true);
    });
};

export const schoolAdminSeesStudyItemDatesEmpty = async (
    cms: CMSInterface,
    studyPlanItemStatus: StudyPlanItemStatus
) => {
    const dateFields = await cms.page!.$$('input[type="text"]');
    const dateFieldsByPlaceholder = await cms.page!.$$('input[placeholder="yyyy/mm/dd, hh:mm"]');
    const areDateFieldsEmpty = dateFields.every(
        async (dateField) => (await dateField.inputValue()) === ''
    );

    weExpect(
        dateFields.length === dateFieldsByPlaceholder.length,
        'study plan item date fields to have correct placeholders'
    ).toEqual(true);
    weExpect(areDateFieldsEmpty, 'study plan item dates to be empty').toEqual(true);

    if (studyPlanItemStatus === 'active') {
        const lastCellStyles = await cms.page!.$$eval('tbody tr td:last-child', (elements) =>
            elements.map((element) => window.getComputedStyle(element))
        );
        const isAnyItemArchived = lastCellStyles.some(
            ({ backgroundColor }) => backgroundColor === 'rgb(245, 245, 245)'
        );

        weExpect(isAnyItemArchived, 'all visible study plan items to be active').toEqual(false);
    }
};

export const schoolAdminEntersStarDueOutOfRange = async (cms: CMSInterface) => {
    const inputs = await getFirstStudyPlanItemFields(cms);
    const availableFrom = new Date();
    const availableUntil = new Date(
        availableFrom.getFullYear(),
        availableFrom.getMonth(),
        availableFrom.getDate() + 7
    );
    const start = new Date(availableFrom);
    const due = new Date(availableUntil);
    const date = getRandomElement([1, -1]);

    start.setDate(start.getDate() + date);
    due.setDate(due.getDate() + date);

    await enterStudyPlanItemDates(inputs, [availableFrom, availableUntil, start, due]);
};

export const schoolAdminSavesStudyPlanItems = async (
    cms: CMSInterface,
    context: ScenarioContext
) => {
    const errorMessage =
        'Date format is not correct or invalid. Please mouse over a cell to see the reason for the errors.';

    await cms.selectAButtonByAriaLabel('Save', {
        parentSelector: studyPlanItemTableActionSelector,
    });

    try {
        await cms.page!.waitForSelector(`text="${errorMessage}"`, { timeout: 1000 });
    } catch (_err) {
        // No validation error
        await cms.selectAButtonByAriaLabel('Update', { parentSelector: '[role="dialog"]' });
        await schoolAdminWaitingUpdateStudyPlanItems(cms);
        context.set(aliasStudyPlanItemValues, await getFirstStudyPlanItemValues(cms));
    }
};

export const schoolAdminSeesStartDueOutOfAvailableDate = async (cms: CMSInterface) => {
    const [availableFromInput, availableUntilInput, startInput, dueInput] =
        await getFirstStudyPlanItemFields(cms);
    const [availableFrom, availableUntil, start, due] = (
        await Promise.all([
            availableFromInput.inputValue(),
            availableUntilInput.inputValue(),
            startInput.inputValue(),
            dueInput.inputValue(),
        ])
    ).map((value) => new Date(value));

    if (start < availableFrom) {
        await assertStudyPlanItemDateError(
            cms,
            startInput,
            'Start Date cannot be earlier than Available From'
        );
    }

    if (due > availableUntil) {
        await assertStudyPlanItemDateError(
            cms,
            dueInput,
            'Due Date cannot be later than Available Until'
        );
    }
};

export const schoolAdminEntersFieldLaterThanOtherField = async (
    cms: CMSInterface,
    field: Extract<StudyPlanItemDateField, 'Available From' | 'Start Date'>,
    otherField: Extract<StudyPlanItemDateField, 'Available Until' | 'Due Date'>
) => {
    const [availableFromInput, availableUntilInput, startInput, dueInput] =
        await getFirstStudyPlanItemFields(cms);
    const referenceDate = new Date();
    const laterDate = new Date(referenceDate);

    laterDate.setDate(laterDate.getDate() + 1);

    if (field === 'Available From' && otherField === 'Available Until') {
        return await enterStudyPlanItemDates(
            [availableFromInput, availableUntilInput],
            [laterDate, referenceDate]
        );
    }

    await enterStudyPlanItemDates([startInput, dueInput], [laterDate, referenceDate]);
};

export const schoolAdminSeesErrorFieldAndOtherField = async (
    cms: CMSInterface,
    field: Extract<StudyPlanItemDateField, 'Available From' | 'Start Date'>,
    otherField: Extract<StudyPlanItemDateField, 'Available Until' | 'Due Date'>
) => {
    const [availableFromInput, availableUntilInput, startInput, dueInput] =
        await getFirstStudyPlanItemFields(cms);

    if (field === 'Available From' && otherField === 'Available Until') {
        await assertStudyPlanItemDateError(
            cms,
            availableFromInput,
            `${field} cannot be later than ${otherField}`
        );
        await assertStudyPlanItemDateError(
            cms,
            availableUntilInput,
            `${otherField} cannot be earlier than ${field}`
        );

        return;
    }

    await assertStudyPlanItemDateError(
        cms,
        startInput,
        `${field} cannot be later than ${otherField}`
    );
    await assertStudyPlanItemDateError(
        cms,
        dueInput,
        `${otherField} cannot be earlier than ${field}`
    );
};

export const schoolAdminEntersStudyPlanItemValueByType = async (
    cms: CMSInterface,
    valueType: ValueType
) => {
    const inputs = await getFirstStudyPlanItemFields(cms);
    const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '()', '-_', '=+', '?'];
    const valuesByType: Record<ValueType, string[]> = {
        text: ['this', 'is', 'a', 'test'],
        'incorrect format': ['2022-01-14', '00:00', '01/14', '2022/01/14 00:00'],
        'special characters': randomUniqueIntegers(specialCharacters.length - 1, 4).map(
            (index) => specialCharacters[index]
        ),
    };

    for (let i = 0; i < inputs.length; i++) {
        await inputs[i].type(valuesByType[valueType][i]);
        await inputs[i].press('Tab');
    }
};

export const schoolAdminSeesErrorMessageEachField = async (cms: CMSInterface) => {
    const inputs = await getFirstStudyPlanItemFields(cms);

    for (const input of inputs) {
        await assertStudyPlanItemDateError(cms, input, 'Date format is not correct or invalid');
    }
};

export const schoolAdminSeesStudyPlanItemValuesUnchanged = async (
    cms: CMSInterface,
    context: ScenarioContext
) => {
    const originalValues = context.get<string[]>(aliasStudyPlanItemValues);
    const currentValues = await getFirstStudyPlanItemValues(cms);
    const areValuesEqual = currentValues.every((value, index) => value === originalValues[index]);

    weExpect(areValuesEqual).toEqual(true);
};

export const schoolAdminEntersRandomStudyPlanItemFields = async (
    cms: CMSInterface,
    options: {
        values: 'date' | 'date and time';
        fields: StudyPlanItemDateField[];
        year: 'current year' | 'another year';
    }
) => {
    const { values, fields, year } = options;

    const referenceDate = new Date();
    const laterDate = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        referenceDate.getDate() + 1
    );
    const fieldIndices = fields.map((field) => availableFieldIndices[field]);
    const firstStudyPlanItemFields = await getFirstStudyPlanItemFields(cms);
    const fieldsToEnter = firstStudyPlanItemFields.filter((_, index) =>
        fieldIndices.includes(index)
    );
    const datesToEnter = [referenceDate, laterDate, referenceDate, laterDate].filter((_, index) =>
        fieldIndices.includes(index)
    );

    if (year === 'another year') {
        referenceDate.setFullYear(referenceDate.getFullYear() + 1);
        laterDate.setFullYear(laterDate.getFullYear() + 1);
    }

    await enterStudyPlanItemDates(fieldsToEnter, datesToEnter, values === 'date and time');
};

export async function schoolAdminModifiesStudyPlanItemsForAvailable(
    cms: CMSInterface,
    studyPlanItemName: string
) {
    const fields: StudyPlanItemDateField[] = [
        'Available From',
        'Available Until',
        'Start Date',
        'Due Date',
    ];

    await schoolAdminEntersStudyPlanItemFields(cms, {
        values: 'date',
        fields,
        year: 'current year',
        studyPlanItemName: studyPlanItemName,
    });
}

export const schoolAdminEntersStudyPlanItemFields = async (
    cms: CMSInterface,
    options: {
        values: 'date' | 'date and time';
        fields: StudyPlanItemDateField[];
        year: 'current year' | 'another year';
        studyPlanItemName: string;
    }
) => {
    const { values, fields, year, studyPlanItemName: studyPlanItemId } = options;
    const referenceDate = new Date();
    const laterDate = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        referenceDate.getDate() + 1
    );
    const fieldIndices = fields.map((field) => availableFieldIndices[field]);
    const firstStudyPlanItemFields = await getStudyPlanItemFieldsByName(cms, studyPlanItemId);
    const fieldsToEnter = firstStudyPlanItemFields.filter((_, index) =>
        fieldIndices.includes(index)
    );
    const datesToEnter = [referenceDate, laterDate, referenceDate, laterDate].filter((_, index) =>
        fieldIndices.includes(index)
    );

    if (year === 'another year') {
        referenceDate.setFullYear(referenceDate.getFullYear() + 1);
        laterDate.setFullYear(laterDate.getFullYear() + 1);
    }

    await enterStudyPlanItemDates(fieldsToEnter, datesToEnter, values === 'date and time');
};

export const schoolAdminSeesStudyPlanItemValuesChanged = async (
    cms: CMSInterface,
    context: ScenarioContext
) => {
    const enteredFields = context.get<StudyPlanItemDateField[]>(aliasEnteredStudyPlanItemFields);
    const year = context.get<'current year' | 'another year'>(aliasStudyPlanItemYear);

    const enteredFieldIndices = enteredFields.map((field) => availableFieldIndices[field]);
    const currentStudyPlanItemValues = await getFirstStudyPlanItemValues(cms);
    const areValuesCorrect = enteredFieldIndices.every((fieldIndex) =>
        year === 'current year'
            ? shortDateTimePattern.test(currentStudyPlanItemValues[fieldIndex])
            : fullDateTimePattern.test(currentStudyPlanItemValues[fieldIndex])
    );

    weExpect(areValuesCorrect).toEqual(true);
};

export const schoolAdminSeesStudyPlanBulkItemValuesChanged = async (
    cms: CMSInterface,
    context: ScenarioContext
) => {
    const bulkAction: BulkEditStudyPlanItemOption = context.get(aliasBulkEditAction);

    const currentValues = await getCurrentStudyPlanItemValuesAfterBulkUpdated(
        cms,
        getStudyPlanItemTableColumnsByFieldName(bulkAction)
    );

    const updatedValue = context.get(aliasStudyPlanItemValue);
    const areValuesEqual = currentValues.every((value) => value === updatedValue);
    weExpect(areValuesEqual).toEqual(true);
};

export const schoolAdminSeesStudyPlanBulkItemValuesUnChanged = async (
    cms: CMSInterface,
    context: ScenarioContext
) => {
    const updatedValue = context.get(aliasStudyPlanItemValue);

    const bulkAction: BulkEditStudyPlanItemOption = context.get(aliasBulkEditAction);

    const cells = await cms.page!.$$(
        `td[data-testid="${getStudyPlanItemTableColumnsByFieldName(bulkAction)}"]`
    );

    for (let i = 0; i < cells.length; i++) {
        const value = await cells[i].innerText();
        weExpect(value).not.toEqual(updatedValue);
    }
};

export const schoolAdminSeesIndividualStudyPlanItemsChanged = async (
    cms: CMSInterface,
    context: ScenarioContext
) => {
    const courseItemValues = context.get<string[]>(aliasStudyPlanItemValues);
    const individualItemValues = await getFirstStudyPlanItemValues(cms);
    const isItemEqual = individualItemValues.every(
        (value, index) => value === courseItemValues[index]
    );

    weExpect(isItemEqual).toEqual(true);
};

export const schoolAdminSeesDueDateSevensDayLater = async (cms: CMSInterface) => {
    const [, , startValue, dueValue] = await getFirstStudyPlanItemValues(cms);
    const expectedDate = new Date(startValue);
    const dueDate = new Date(dueValue);

    expectedDate.setDate(expectedDate.getDate() + 7);
    expectedDate.setHours(23);
    expectedDate.setMinutes(59);

    weExpect(dueDate.getTime(), 'Due date to equal seven days from Start date').toEqual(
        expectedDate.getTime()
    );
};

export const schoolAdminSeesCourseStudyPlanItemEmptyTimes = async (cms: CMSInterface) => {
    const firstStudyPlanItemValues = await getFirstStudyPlanItemValues(cms);
    const expectedValues = ['--', '--', '--', '--'];

    weExpect(firstStudyPlanItemValues).toEqual(expectedValues);
};

export async function schoolAdminGoToStudyPlanDetail(
    cms: CMSInterface,
    studyPlanPageType: StudyPlanPageType,
    courseName: string,
    studyPlanName: string
) {
    await schoolAdminIsOnCoursePage(cms);
    await schoolAdminGoToCourseDetail(cms, courseName);
    await schoolAdminChooseTabInCourseDetail(cms, 'studyPlan');
    await schoolAdminIsAtStudyPlanDetailsPage(cms, studyPlanName, studyPlanPageType);
}

export const schoolAdminGoToStudyPlanDetailViaUrl = async (
    cms: CMSInterface,
    studyPlanId: string,
    courseId: string
) => {
    const url = `${cms.origin}syllabus/study_plans/${studyPlanId}/show?courseId=${courseId}`;

    await cms.page!.goto(url);
    await schoolAdminWaitingStudyPlanDetailLoading(cms);
};
