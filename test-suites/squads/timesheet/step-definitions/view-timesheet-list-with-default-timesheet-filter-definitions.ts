import { schoolAdminOpenFilterAdvanced } from '@legacy-step-definitions/cms-common-definitions';
import {
    buttonNextPageTable,
    tableCellIndex,
    tableFooterCaption,
} from '@legacy-step-definitions/cms-selectors/cms-keys';

import { CMSInterface, AccountRoles } from '@supports/app-types';
import {
    dateIsSameOrAfter,
    formatDate,
    getFirstDayOfMonth,
    getLastDayOfMonth,
} from '@supports/utils/time/time';

import { filterAdvancedPopupBackdrop } from '../common/cms-selectors/common';
import { TimesheetStatusExtend } from '../common/types';
import { getCountInStatusTab } from '../common/utils';
import {
    getTimesheetStatusTabSelector,
    waitForTimesheetTableRenderRows,
} from './apply-status-filter-name-search-and-date-filter-definitions';
import * as TimesheetListSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-list';

export async function openTimesheetFilterAdvanced(cms: CMSInterface) {
    await schoolAdminOpenFilterAdvanced(cms);
}

export async function closeTimesheetFilterAdvanced(cms: CMSInterface) {
    await cms.page?.click(filterAdvancedPopupBackdrop);
}

export async function assertDateFilterIsDefault(cms: CMSInterface, role: AccountRoles) {
    const defaultFromDate = getFirstDayOfMonth();
    const defaultToDate = getLastDayOfMonth();
    const selectorFromDate =
        role === 'teacher'
            ? TimesheetListSelectors.staffFilterAdvancedFromDateInput
            : TimesheetListSelectors.filterAdvancedFromDateInput;
    const selectorToDate =
        role === 'teacher'
            ? TimesheetListSelectors.staffFilterAdvancedToDateInput
            : TimesheetListSelectors.filterAdvancedToDateInput;
    checkInputToEqualValue(cms, selectorFromDate, formatDate(defaultFromDate, 'YYYY/MM/DD'));
    checkInputToEqualValue(cms, selectorToDate, formatDate(defaultToDate, 'YYYY/MM/DD'));
}

export async function assertTimesheetIsFilterByDefaultDateFilter(
    cms: CMSInterface,
    role: AccountRoles
) {
    const selectorDateLink =
        role === 'teacher'
            ? TimesheetListSelectors.staffTimesheetDateLink
            : TimesheetListSelectors.timesheetDateLink;
    const timesheetDateRows = await cms.page!.$$(selectorDateLink);
    for (let i = 0; i < timesheetDateRows.length; i++) {
        const dateStr = await timesheetDateRows[i]?.textContent();
        const date = new Date(dateStr || '');
        weExpect(date < getLastDayOfMonth()).toBeTruthy();
        weExpect(date > getFirstDayOfMonth()).toBeTruthy();
    }
}

export async function assertTimesheetCountOfStatusTabMatchWithTotalRows(
    cms: CMSInterface,
    status: TimesheetStatusExtend
) {
    const page = cms.page!;
    const statusTab = await page.textContent(getTimesheetStatusTabSelector(status));
    const countInStatusTab = getCountInStatusTab(statusTab || '');
    if (countInStatusTab !== '0') {
        await goToTheLastPageOfTable(cms);
        await waitScrollPageToBottom(cms);

        const indexCells = await page.$$(tableCellIndex);

        const lastRowIndex = await indexCells[indexCells.length - 1].textContent();

        const footerCaption = await page.textContent(tableFooterCaption);

        weExpect(countInStatusTab).toEqual(lastRowIndex);
        weExpect(footerCaption?.includes(` ${countInStatusTab}`)).toEqual(true);
    } else {
        const isNoDataIconVisible = await cms.page?.isVisible(TimesheetListSelectors.noDataIcon);
        weExpect(isNoDataIconVisible).toEqual(true);
    }
}

export async function assertTimesheetIsOrderByDateDesc(cms: CMSInterface, role: AccountRoles) {
    const selectorDateLink =
        role === 'teacher'
            ? TimesheetListSelectors.staffTimesheetDateLink
            : TimesheetListSelectors.timesheetDateLink;
    const timesheetDateRows = await cms.page!.$$(selectorDateLink);
    for (let i = 0; i < timesheetDateRows.length - 1; i++) {
        const currentTimesheetDate = new Date((await timesheetDateRows[i]?.textContent()) || '');
        const nextTimesheetDate = new Date((await timesheetDateRows[i]?.textContent()) || '');
        weExpect(dateIsSameOrAfter(currentTimesheetDate, nextTimesheetDate)).toBeTruthy();
    }
}

export async function assertNotSeeTimesheetDateFilterChips(cms: CMSInterface) {
    const isDateFilterVisible = await cms.page?.isVisible(TimesheetListSelectors.dateFilterChip);
    weExpect(isDateFilterVisible).toEqual(false);
}

export async function checkInputToEqualValue(cms: CMSInterface, selector: string, value: string) {
    await cms.instruction(`Check input ${selector} to equal ${value}`, async function () {
        const input = await cms.page!.inputValue(selector);
        weExpect(input).toEqual(value);
    });
}

export async function goToTheLastPageOfTable(cms: CMSInterface) {
    const page = cms.page!;
    let isEnabled = true;
    while (isEnabled) {
        const nextButton = await page.waitForSelector(buttonNextPageTable);
        isEnabled = await nextButton.isEnabled();
        if (isEnabled) await nextButton.click();
        await waitForTimesheetTableRenderRows(cms);
    }
}

const waitScrollPageToBottom = async (cms: CMSInterface) => {
    await cms.page?.evaluate(() => {
        const mainEl = document.getElementsByTagName('main')[0];
        mainEl.scroll(0, mainEl.scrollHeight);
    });
};
