import { CMSInterface } from '@supports/app-types';

import { saveDraftIndividualLessonReport } from './lesson-teacher-save-draft-individual-lesson-report-definitions';
import {
    fillAllPercentageFields,
    fillAllTextAreaFields,
    fillAllTextFields,
    selectValueLessonReportAutocomplete,
    openLessonReportUpsertDialog,
    submitIndividualLessonReport,
} from './lesson-teacher-submit-individual-lesson-report-definitions';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';

export async function fulfillSampleTextLessonReportForm(cms: CMSInterface) {
    await selectValueLessonReportAutocomplete({
        cms,
        chooseItemAt: 1,
        shouldSelectAutocomplete: 'all',
    });
    await fillAllTextFields(cms, 'Sample Text');
    await fillAllPercentageFields(cms, 99);
    await fillAllTextAreaFields(cms, 'Sample Text');
}

export async function createAnIndividualLessonReport(cms: CMSInterface) {
    await cms.instruction('Open lesson report upsert dialog', async function () {
        await openLessonReportUpsertDialog(cms);
    });

    await cms.instruction('Fulfill lesson report fields', async function () {
        await cms.waitingForLoadingIcon();
        await fulfillSampleTextLessonReportForm(cms);
    });

    await cms.instruction('Submit lesson report', async function () {
        await submitIndividualLessonReport(cms, true);
    });
}

export async function compareOldAndNewLessonReportData(params: {
    cms: CMSInterface;
    oldLessonReportData: string[];
    shouldBeSame: boolean;
}) {
    const { cms, oldLessonReportData, shouldBeSame } = params;
    const lessonReportData = await getLessonReportDataFromDetailPage(cms);

    if (shouldBeSame) {
        weExpect(lessonReportData.toString()).toEqual(oldLessonReportData.toString());
        return;
    }

    weExpect(lessonReportData.toString()).not.toEqual(oldLessonReportData.toString());
}

export async function clearAttendanceStatus(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction('Make sure attendance status has value', async function () {
        const attendanceStatus = await page.inputValue(
            LessonManagementKeys.attendanceStatusAutocompleteInput
        );

        weExpect(attendanceStatus).not.toBeNull();
    });

    await cms.instruction('Clear attendance status autocomplete value', async function () {
        await page.click(LessonManagementKeys.attendanceStatusAutocompleteInput);
        await page.click(LessonManagementKeys.autocompleteClearButton);
        await page.keyboard.press('Escape');
    });
}

export async function createAnDraftIndividualLessonReport(
    cms: CMSInterface,
    shouldFulfillLessonReportForm = false
) {
    await cms.instruction('Open lesson report upsert dialog', async function () {
        await openLessonReportUpsertDialog(cms);
    });

    if (shouldFulfillLessonReportForm) {
        await cms.instruction('Fulfill lesson report fields', async function () {
            await cms.waitingForLoadingIcon();
            await fulfillSampleTextLessonReportForm(cms);
        });
    }

    await cms.instruction('Save draft lesson report', async function () {
        await Promise.all([
            cms.waitForHasuraResponse('LessonReportByLessonId'),
            saveDraftIndividualLessonReport(cms),
        ]);
    });
}

export async function openEditLessonReportDialog(cms: CMSInterface) {
    await cms.selectElementByDataTestId(LessonManagementKeys.editLessonReportButton);
}

export async function getLessonReportDataFromDetailPage(cms: CMSInterface) {
    const page = cms.page!;

    const attendanceStatusValue = await page.$$(LessonManagementKeys.attendanceStatusDetailValue);
    const attendanceRemarkValue = await page.$$(LessonManagementKeys.attendanceRemarkDetailValue);
    const allDynamicFieldValues = await page.$$(LessonManagementKeys.lessonReportDetailValues);

    const allLessonReportDetailValues = [
        ...attendanceStatusValue,
        ...attendanceRemarkValue,
        ...allDynamicFieldValues,
    ];

    const data: string[] = [];

    for (const field of allLessonReportDetailValues) {
        const fieldValue = await field.$('p');
        const textOfField = await fieldValue?.textContent();
        data.push(textOfField || '');
    }

    return data;
}
