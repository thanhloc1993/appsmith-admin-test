import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import { dialogWithHeaderFooterWrapper } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    endTimeInputV3,
    lessonEndDateV3,
    lessonInputLessonDateV3,
    lessonInputLessonEndDateV3,
    startTimeInputV3,
    upsertLessonFormV3,
} from '../common/cms-selectors';
import {
    lessonDateV3,
    lessonErrorInputDateTime,
    lessonIconPenEditDate,
    tableAddStudentAddButton,
    tableStudentAddAction,
    timePickerOKButtonV2,
} from '../common/cms-selectors';
import moment from 'moment-timezone';
import { aliasStartDate } from 'test-suites/squads/lesson/common/alias-keys';

export type OptionCompareLessonDateAndEndDate = 'end date < lesson date' | 'end date = lesson date';

export async function changeLessonDateWithFromUpsertV3(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    dateRange = 1
) {
    const inputDateTime = moment().subtract(dateRange, 'days').format('YYYY/MM/DD');

    await cms.instruction('Open date picker', async function () {
        const page = cms.page!;
        await page.click(lessonDateV3);
        await page.click(lessonIconPenEditDate);
        await page.fill(lessonInputLessonDateV3, inputDateTime);
        await applyTimePickerV3(page);
        /*
        Use save context: some function using startTime get in response create lesson with GRPC
        But some step create lesson with UI haven't response
        ex: BDD create group lesson missing some field and use fn assertLessonVisibleOnLearnerApp with startTime get in response GRPC
        */
        scenarioContext.set(aliasStartDate, inputDateTime);
    });
}

export async function changeLessonEndDateWithFromUpsertV3(cms: CMSInterface, dateRange = 1) {
    const inputDateTime = moment().subtract(dateRange, 'days').format('YYYY/MM/DD');

    await cms.instruction('Open date picker', async function () {
        const page = cms.page!;
        await page.click(lessonEndDateV3);
        await page.click(lessonIconPenEditDate);
        await page.locator(lessonInputLessonEndDateV3).fill(inputDateTime);

        await applyTimePickerV3(page);
    });
}

export async function applyTimePickerV3(page: CMSInterface['page']) {
    await page!.click(timePickerOKButtonV2);
}

export async function assertErrorLessonDateMustBeforeEndDate(page: CMSInterface['page']) {
    await page!.waitForSelector(lessonErrorInputDateTime);
}

export async function changeTimeLesson(cms: CMSInterface, startTime: string, endTime: string) {
    await changeStartTimeLesson(cms, startTime);
    await changeEndTimeLesson(cms, endTime);
}

export async function changeStartTimeLesson(cms: CMSInterface, startTime: string) {
    const page = cms.page!;
    await page.click(startTimeInputV3);
    await cms.chooseOptionInAutoCompleteBoxByText(startTime);
}

export async function changeEndTimeLesson(cms: CMSInterface, endTime: string) {
    const page = cms.page!;
    await page.click(endTimeInputV3);
    await cms.chooseOptionInAutoCompleteBoxByText(endTime);
}

export async function openDialogAddStudent(cms: CMSInterface) {
    await cms.instruction('Open dialog student', async function () {
        await cms.page!.click(tableStudentAddAction);
        await cms.page!.waitForSelector(dialogWithHeaderFooterWrapper);
        await cms.waitForSkeletonLoading();
    });
}

export async function selectStudent(params: { cms: CMSInterface; studentName?: string }) {
    const { cms, studentName } = params;
    const page = cms.page!;

    await openDialogAddStudent(cms);
    if (studentName) {
        await cms.instruction(`Searching student ${studentName}`, async function () {
            await page.fill(CMSKeys.formFilterAdvancedTextFieldSearchInput, studentName);
            await Promise.all([
                cms.waitForHasuraResponse('StudentsMany'),
                cms.waitForHasuraResponse('CoursesMany'),
                page.keyboard.press('Enter'),
            ]);
        });
    }

    await cms.instruction('Add student', async function () {
        await page.click(tableAddStudentAddButton);
    });
}

export async function checkInputToEqualValue(cms: CMSInterface, selector: string, value: string) {
    await cms.instruction(`Check input ${selector} to equal ${value}`, async function () {
        const input = await cms.page!.inputValue(selector);
        weExpect(input).toEqual(value);
    });
}

export async function checkValueTableToEqualValue(
    cms: CMSInterface,
    selector: string,
    value: string
) {
    await cms.instruction(`Check table ${selector} to equal ${value}`, async function () {
        const tableRowData = await cms.page!.textContent(selector);
        weExpect(tableRowData).toEqual(value);
    });
}

export async function isOnLessonUpsertDialogV3(cms: CMSInterface) {
    await cms.page!.waitForSelector(upsertLessonFormV3);
}
