import { Page } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasLessonReportData } from 'test-suites/squads/lesson/common/alias-keys';
import {
    autocompleteInput,
    autocompleteInputValue,
    autocompleteOptionByDataValue,
    autocompleteOptionByLabel,
    autocompleteOptionList,
    cancelSubmitGroupReportButton,
    confirmSubmitGroupReportButton,
    groupLessonReportFormContainer,
    GroupLessonReportTabs,
    createLessonReportButton,
    lessonReportDetailPageContainer,
    lessonReportPercentageField,
    lessonReportStatusTag,
    lessonReportTextAreaField,
    lessonReportTextField,
    lessonReportUpsertDialog,
    saveDraftIndividualReportButton,
    selectIconGroupLessonReport,
    submitGroupReportButton,
    submitIndReportButton,
    confirmSubmitIndReportButton,
    buttonEditIndReport,
    upsertDialogLessonReportInd,
    saveDraftGroupReportButton,
    buttonSaveDraftLessonReportGrp,
    groupLessonReportDetailPageContainer,
    buttonEditGrpReport,
    LessonDetailTabs,
    contentTextAreaGroupLessonReport,
    homeworkTextAreaGroupLessonReport,
    announcementTextAreaGroupLessonReport,
    numberSeedingInLessonQuizInput,
    remarkTextAreaGroupLessonReport,
    remarkInternalOnlyTextAreaGroupLessonReport,
    textAreaValueGroupReport,
    tableValueGroupReport,
    autocompleteHomeworkCompletion,
    dialogFullScreenContent,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { defaultText, updatedText } from 'test-suites/squads/lesson/common/constants';
import {
    AutocompleteLessonReportValues,
    GroupLessonReportField,
    HomeworkCompletionValues,
    LessonReportStatus,
    LessonTimeValueType,
    LessonType,
    MethodSavingType,
    TeachingMethodValueType,
    UpsertType,
} from 'test-suites/squads/lesson/common/types';
import {
    waitSaveDraftGroupReportResponse,
    waitSubmitGroupReportResponse,
} from 'test-suites/squads/lesson/utils/grpc-responses';
import { arrayHasItem, CreateLessonTimeType } from 'test-suites/squads/lesson/utils/lesson-upsert';

export function getDivElementByLabel(params: { page: Page; label: string }) {
    const { page, label } = params;

    return page.locator('div', { has: page.locator(`label:has-text("${label}")`) }).last();
}

export function getDivElementByChildDivText(params: { cms: CMSInterface; label: string }) {
    const { cms, label } = params;
    const page = cms.page!;

    return page.locator('div', { has: page.locator(selectIconGroupLessonReport(label)) }).last();
}

export async function fillLessonReportAutocomplete<
    T extends keyof AutocompleteLessonReportValues
>(params: { cms: CMSInterface; type: T; value: AutocompleteLessonReportValues[T] }) {
    const { cms, type, value } = params;
    const page = cms.page!;

    let autocompleteLabel = '';

    switch (type) {
        case 'STATUS':
            autocompleteLabel = 'Attendance Status';
            break;

        case 'NOTICE':
            autocompleteLabel = 'Attendance Notice';
            break;

        case 'REASON':
            autocompleteLabel = 'Reason';
            break;

        case 'UNDERSTANDING':
            autocompleteLabel = 'Understanding';
            break;
    }

    const autocomplete = getDivElementByLabel({ page, label: autocompleteLabel });

    await autocomplete.locator(autocompleteInput).click();
    const optionList = cms.page!.locator(autocompleteOptionList);
    await optionList.locator(autocompleteOptionByLabel(value)).click();
    await autocomplete.locator(autocompleteInputValue(value)).waitFor();
}

export async function fillLessonReportTextAreas(params: { cms: CMSInterface; value: string }) {
    const { cms, value } = params;

    const textAreaLocators = cms.page!.locator(lessonReportTextAreaField);
    const textAreas = await textAreaLocators.elementHandles();

    for (const textarea of textAreas) {
        await textarea.fill(value);
    }
}

export async function fillLessonReportTextFields(params: { cms: CMSInterface; value: string }) {
    const { cms, value } = params;

    const textFieldsLocators = cms.page!.locator(lessonReportTextField);
    const textFields = await textFieldsLocators.elementHandles();

    for (const textField of textFields) {
        await textField.fill(value);
    }
}

export async function fillLessonReportNumberFields(params: { cms: CMSInterface; value: number }) {
    const { cms, value } = params;

    const numberFieldsLocators = cms.page!.locator(lessonReportPercentageField);
    const numberFields = await numberFieldsLocators.elementHandles();

    for (const numberField of numberFields) {
        await numberField.fill(`${value}`);
    }
}

export async function fillLessonReportIconSelects(params: {
    cms: CMSInterface;
    value: HomeworkCompletionValues;
    reportType?: TeachingMethodValueType;
}) {
    const { cms, value, reportType = 'Individual' } = params;
    const page = cms.page!;

    const selectLocator =
        reportType === 'Individual'
            ? getDivElementByLabel({ page, label: 'Homework Completion' })
            : getDivElementByChildDivText({ cms, label: 'Homework Completion' });

    const selectElements = await selectLocator.elementHandles();

    for (const select of selectElements) {
        await select.click();
        const optionList = page.locator(autocompleteOptionList);
        await optionList.locator(autocompleteOptionByDataValue(value)).click();
        await select.waitForSelector(autocompleteInputValue(value));
    }
}

export async function fulfillIndividualLessonReport(cms: CMSInterface) {
    await fillLessonReportAutocomplete({ cms, type: 'STATUS', value: 'Absent' });
    await fillLessonReportAutocomplete({ cms, type: 'NOTICE', value: 'In Advance' });
    await fillLessonReportAutocomplete({ cms, type: 'REASON', value: 'Physical condition' });
    await fillLessonReportAutocomplete({ cms, type: 'UNDERSTANDING', value: 'D' });
    await fillLessonReportTextAreas({ cms, value: 'Sample Text' });
    await fillLessonReportTextFields({ cms, value: 'Sample Text' });
    await fillLessonReportNumberFields({ cms, value: 99 });
    await fillLessonReportIconSelects({ cms, value: 'INCOMPLETE' });
}

export async function clearAllFieldIndLessonReport(cms: CMSInterface) {
    await fillLessonReportAutocomplete({ cms, type: 'STATUS', value: 'Absent' });
    await fillLessonReportAutocomplete({ cms, type: 'NOTICE', value: 'In Advance' });
    await fillLessonReportAutocomplete({ cms, type: 'REASON', value: 'Physical condition' });
    await fillLessonReportAutocomplete({ cms, type: 'UNDERSTANDING', value: 'D' });
    await fillLessonReportTextAreas({ cms, value: 'Sample Text' });
    await fillLessonReportTextFields({ cms, value: 'Sample Text' });
    await fillLessonReportNumberFields({ cms, value: 99 });
    await fillLessonReportIconSelects({ cms, value: 'INCOMPLETE' });
}

export async function updateIndividualLessonReport(cms: CMSInterface) {
    await fillLessonReportTextAreas({ cms, value: updatedText });
    await fillLessonReportTextFields({ cms, value: updatedText });
}

export async function saveDraftIndividualLessonReport(cms: CMSInterface) {
    await cms.page!.locator(saveDraftIndividualReportButton).click();
}

export async function submitGroupLessonReport(cms: CMSInterface) {
    await cms.page!.locator(submitGroupReportButton).click();
}

export async function confirmSubmitGroupLessonReport(cms: CMSInterface) {
    await Promise.all([
        waitSubmitGroupReportResponse(cms),
        cms.page!.locator(confirmSubmitGroupReportButton).click(),
    ]);
}

export async function cancelSubmitGroupLessonReport(cms: CMSInterface) {
    await cms.page!.locator(cancelSubmitGroupReportButton).click();
}

export async function saveDraftGroupLessonReport(cms: CMSInterface) {
    await Promise.all([
        waitSaveDraftGroupReportResponse(cms),
        cms.page!.locator(saveDraftGroupReportButton).click(),
    ]);
}

export async function userOnLessonReportIndDetailPage(page: Page) {
    await page.waitForSelector(lessonReportDetailPageContainer);
}

export async function userOnLessonReportGrpDetailPage(page: Page) {
    await page.waitForSelector(groupLessonReportDetailPageContainer);
}

export async function assertLessonReportStatus(params: {
    cms: CMSInterface;
    status: LessonReportStatus;
}) {
    const { cms, status } = params;
    await cms.page!.waitForSelector(lessonReportStatusTag(status));
}

export async function fillGroupLessonReportField(params: {
    cms: CMSInterface;
    field: GroupLessonReportField;
}) {
    const { cms, field } = params;
    const page = cms.page!;

    switch (field) {
        case 'Content':
        case 'Homework':
        case 'Remark (Internal Only)':
        case 'Announcement': {
            const fieldLocator = getDivElementByLabel({ page, label: field });
            await fieldLocator.locator(lessonReportTextAreaField).fill('Sample Text');
            break;
        }

        case 'Homework Completion': {
            await page.locator(GroupLessonReportTabs.PERFORMANCE).click();
            await fillLessonReportIconSelects({ cms, reportType: 'Group', value: 'INCOMPLETE' });
            break;
        }

        case 'In-lesson Quiz': {
            await page.locator(GroupLessonReportTabs.PERFORMANCE).click();
            await fillLessonReportNumberFields({ cms, value: 99 });
            break;
        }

        case 'Remark': {
            await page.locator(GroupLessonReportTabs.REMARK).click();
            await fillLessonReportTextFields({ cms, value: 'Sample Text' });
            break;
        }
    }
}

export async function userIsOnGroupReportUpsertPage(cms: CMSInterface) {
    await cms.page!.waitForSelector(groupLessonReportFormContainer);
}

export async function openLessonReportIndUpsertDialog(cms: CMSInterface) {
    await cms.selectElementByDataTestId(createLessonReportButton);
    await cms.waitForDataTestId(lessonReportUpsertDialog);
}

export const parseAfterThatLessonTime = (params: {
    lessonTime: LessonTimeValueType;
    methodSaving: MethodSavingType;
}): CreateLessonTimeType => {
    const { lessonTime, methodSaving } = params;
    switch (true) {
        case lessonTime === 'future' && methodSaving === 'One Time':
            return 'more than 10 minutes from now';
        case lessonTime === 'past' && methodSaving === 'One Time':
            return 'completed over 24 hours';
        case lessonTime === 'future' && methodSaving === 'Weekly Recurring':
            return 'after future weekly recurring';
        case lessonTime === 'past' && methodSaving === 'Weekly Recurring':
            return 'after past weekly recurring';
        default:
            return 'future';
    }
};

export async function submitIndLessonReport(page: Page) {
    await page.locator(submitIndReportButton).click();
}

export async function confirmSubmitIndLessonReport(page: Page) {
    await page.locator(confirmSubmitIndReportButton).click();
}

export async function userIsOnLessonReportIndUpsertDialog(page: Page) {
    await page.waitForSelector(upsertDialogLessonReportInd);
}

export async function userIsOnLessonReportGrpUpsertDialog(page: Page) {
    await page.waitForSelector(groupLessonReportFormContainer);
}

export async function openEditingLessonReportIndPage(page: Page) {
    await userOnLessonReportIndDetailPage(page);
    await page.locator(buttonEditIndReport).click();
    await userIsOnLessonReportIndUpsertDialog(page);
}

export async function openEditingLessonReportGrpPage(page: Page) {
    await userOnLessonReportGrpDetailPage(page);
    await page.locator(buttonEditGrpReport).click();
    await userIsOnLessonReportGrpUpsertDialog(page);
}

export async function openCreatingLessonReportPage(page: Page) {
    await page.locator(createLessonReportButton).click();
}

export async function saveDraftLessonReportGrp(page: Page) {
    await page.locator(buttonSaveDraftLessonReportGrp).click();
}

export async function submitAllLessonReportGrp(page: Page) {
    await page.locator(submitGroupReportButton).click();
}

export async function openLessonReportUpsertDialog(params: {
    page: Page;
    lessonType: LessonType;
    upsertType: UpsertType;
}) {
    const { page, lessonType, upsertType } = params;
    if (upsertType === 'creating') {
        await openCreatingLessonReportPage(page);
    } else {
        // user open editing lesson report
        if (lessonType === 'group') {
            await openEditingLessonReportGrpPage(page);
        } else {
            await openEditingLessonReportIndPage(page);
        }
    }

    // assert user is on report upsert dialog
    if (lessonType === 'group') {
        await userIsOnLessonReportGrpUpsertDialog(page);
    } else {
        await userIsOnLessonReportIndUpsertDialog(page);
    }
}

export async function openEditingLessonReport(cms: CMSInterface, scenario: ScenarioContext) {
    const page = cms.page!;
    await page.locator(LessonDetailTabs.LESSON_REPORT).click();
    await cms.instruction('Save lesson report data', async function () {
        const currentLessonReportData: string[] = await getLessonReportDataFromDetailPage(cms);
        scenario.set(aliasLessonReportData, currentLessonReportData);
    });
    await page.locator(buttonEditGrpReport).click();
}

export async function fillValueGroupLessonReport(params: {
    cms: CMSInterface;
    fields?: GroupLessonReportField[];
    index?: number;
    text?: string;
}) {
    const { cms, fields = [], index = 0, text = updatedText } = params;
    const dialog = cms.page!.locator(dialogFullScreenContent);

    if (!arrayHasItem(fields)) {
        cms.attach('There is no field need to update');
        return;
    }

    for (const field of fields) {
        switch (field) {
            case 'Content':
                await dialog.locator(contentTextAreaGroupLessonReport).fill(text);
                break;
            case 'Remark (Internal Only)':
                await dialog.locator(remarkInternalOnlyTextAreaGroupLessonReport).fill(text);
                break;
            case 'Homework':
                await dialog.locator(homeworkTextAreaGroupLessonReport).fill(text);
                break;
            case 'Announcement':
                await dialog.locator(announcementTextAreaGroupLessonReport).fill(text);
                break;
            case 'Homework Completion':
                await dialog.locator(autocompleteHomeworkCompletion).click();
                await cms.chooseOptionInAutoCompleteBoxByOrder(index);
                break;
            case 'In-lesson Quiz':
                await dialog.locator(numberSeedingInLessonQuizInput).fill('50');
                break;
            case 'Remark':
                await dialog.locator(GroupLessonReportTabs.REMARK).click();
                await dialog.locator(remarkTextAreaGroupLessonReport).fill(text);
                break;
        }
    }
}

export async function clearValueGroupLessonReport(params: {
    cms: CMSInterface;
    fields?: GroupLessonReportField[];
}) {
    const { cms, fields = [] } = params;
    const dialog = cms.page!.locator(dialogFullScreenContent);

    if (!arrayHasItem(fields)) {
        cms.attach('There is no field need to update');
        return;
    }

    for (const field of fields) {
        switch (field) {
            case 'Content':
                await dialog.locator(contentTextAreaGroupLessonReport).fill('');
                break;
            case 'Remark (Internal Only)':
                await dialog.locator(remarkInternalOnlyTextAreaGroupLessonReport).fill('');
                break;
            case 'Homework':
                await dialog.locator(homeworkTextAreaGroupLessonReport).fill('');
                break;
            case 'Announcement':
                await dialog.locator(announcementTextAreaGroupLessonReport).fill('');
                break;
            case 'In-lesson Quiz':
                await dialog.locator(numberSeedingInLessonQuizInput).fill('');
                break;
            case 'Remark':
                await dialog.locator(GroupLessonReportTabs.REMARK).click();
                await dialog.locator(remarkTextAreaGroupLessonReport).fill('');
                break;
        }
    }
}

export async function compareOldAndNewLessonReportData(
    cms: CMSInterface,
    oldLessonReportData: string[],
    shouldBeSame: boolean
) {
    const newLessonReportData = await getLessonReportDataFromDetailPage(cms);
    if (shouldBeSame) {
        weExpect(
            newLessonReportData.toString(),
            `New lesson report data: ${newLessonReportData.toString()}\nEqual to old lesson report data: ${oldLessonReportData.toString()}`
        ).toEqual(oldLessonReportData.toString());
        return;
    }

    weExpect(
        newLessonReportData.toString(),
        `New lesson report data: ${newLessonReportData.toString()}\nNot Equal to old lesson report data: ${oldLessonReportData.toString()}`
    ).not.toEqual(oldLessonReportData.toString());
}

async function getLessonReportDataFromDetailPage(cms: CMSInterface): Promise<string[]> {
    const page = cms.page!;

    const textAreaContents = await page.locator(textAreaValueGroupReport).allTextContents();
    const tableValueContents = await page.locator(tableValueGroupReport).allTextContents();
    return [textAreaContents.toString(), tableValueContents.toString()];
}

export async function createGroupLessonReport(cms: CMSInterface) {
    await openLessonReportUpsertDialog({
        page: cms.page!,
        lessonType: 'group',
        upsertType: 'creating',
    });
    await fillValueGroupLessonReport({
        cms,
        index: 2,
        fields: [
            'Content',
            'Remark (Internal Only)',
            'Homework',
            'Announcement',
            'Homework Completion',
            'In-lesson Quiz',
            'Remark',
        ],
        text: defaultText,
    });
    await submitGroupLessonReport(cms);
    await confirmSubmitGroupLessonReport(cms);
}
