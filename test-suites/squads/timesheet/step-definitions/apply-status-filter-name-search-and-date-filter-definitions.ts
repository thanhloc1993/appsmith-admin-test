import {
    schoolAdminApplyFilterAdvanced,
    schoolAdminOpenFilterAdvanced,
} from '@legacy-step-definitions/cms-common-definitions';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    timesheetFromDateFilterAlias,
    timesheetStaffNameFilterAlias,
    timesheetStatusFilterAlias,
    timesheetToDateFilterAlias,
} from '../common/alias-keys';
import { datePickerWithValue } from '../common/cms-selectors/common';
import { TimesheetStatusExtend } from '../common/types';
import moment from 'moment-timezone';
import * as TimesheetListSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-list';
import { applyTimePicker } from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';

export function getTimesheetStatusTabSelector(status: TimesheetStatusExtend) {
    switch (status) {
        case 'All':
            return TimesheetListSelectors.timesheetStatusTabAll;
        case 'Draft':
            return TimesheetListSelectors.timesheetStatusTabDraft;
        case 'Submitted':
            return TimesheetListSelectors.timesheetStatusTabSubmitted;
        case 'Approved':
            return TimesheetListSelectors.timesheetStatusTabApproved;
        case 'Confirmed':
            return TimesheetListSelectors.timesheetStatusTabConfirmed;
    }
}

export async function selectTimesheetStatusTab(
    cms: CMSInterface,
    scenario: ScenarioContext,
    status: TimesheetStatusExtend
) {
    await cms.page?.click(getTimesheetStatusTabSelector(status));
    scenario.set(timesheetStatusFilterAlias, status);

    await cms.waitForSkeletonLoading();
}

export async function searchTimesheetByStaffName(
    cms: CMSInterface,
    scenario: ScenarioContext,
    staffName: string
) {
    const cmsPage = cms.page!;
    await cmsPage.fill(TimesheetListSelectors.formFilterAdvancedTextFieldInput, staffName);
    await cmsPage.keyboard.press('Enter');
    scenario.set(timesheetStaffNameFilterAlias, staffName);
}

export async function selectTimesheetDateFilter(
    cms: CMSInterface,
    scenario: ScenarioContext,
    fromDate: Date,
    toDate: Date,
    role: AccountRoles
) {
    const page = cms.page!;
    if (role === 'school admin') {
        await schoolAdminOpenFilterAdvanced(cms);
    }

    const selectorFromDate =
        role === 'teacher'
            ? TimesheetListSelectors.staffFilterAdvancedFromDate
            : TimesheetListSelectors.filterAdvancedFromDateInput;
    const selectorToDate =
        role === 'teacher'
            ? TimesheetListSelectors.staffFilterAdvancedToDate
            : TimesheetListSelectors.filterAdvancedToDateInput;

    const currentDate = new Date();
    const currentDateMonth = currentDate.getMonth() + 1;
    const toDateMonth = toDate.getMonth() + 1;
    const fromDateMonth = fromDate.getMonth() + 1;
    const toDateMonthDuration =
        toDateMonth >= currentDateMonth && toDate.getFullYear() === currentDate.getFullYear()
            ? toDateMonth - currentDateMonth
            : currentDateMonth - (currentDateMonth - toDateMonth) + (12 - currentDateMonth);
    const fromDateMonthDuration =
        fromDateMonth <= currentDateMonth && fromDate.getFullYear() === currentDate.getFullYear()
            ? currentDateMonth - fromDateMonth
            : fromDateMonth - (fromDateMonth - currentDateMonth) + (12 - fromDateMonth);

    await page.click(selectorFromDate);
    await pressPreviousMonthButton(cms, fromDateMonthDuration);
    await page.click(datePickerWithValue(fromDate.getDate()));
    await applyTimePicker(page);

    await page.click(selectorToDate);
    await pressNextMonthButton(cms, toDateMonthDuration);
    await page.click(datePickerWithValue(toDate.getDate()));
    await applyTimePicker(page);

    if (role === 'school admin') {
        await schoolAdminApplyFilterAdvanced(cms);
    }

    scenario.set(timesheetFromDateFilterAlias, fromDate);
    scenario.set(timesheetToDateFilterAlias, toDate);
}

export async function pressNextMonthButton(cms: CMSInterface, repeat: number) {
    let monthDiff = repeat;
    const page = cms.page!;

    while (monthDiff > 0) {
        await cms.selectAButtonByAriaLabel('Next month');
        await page.waitForTimeout(500);
        monthDiff--;
    }
}

export async function pressPreviousMonthButton(cms: CMSInterface, repeat: number) {
    let monthDiff = repeat;
    const page = cms.page!;

    while (monthDiff > 0) {
        await cms.selectAButtonByAriaLabel('Previous month');
        await page.waitForTimeout(500);
        monthDiff--;
    }
}

export async function assertSeeTimesheetStatusTabSelected(
    cms: CMSInterface,
    status: TimesheetStatusExtend
) {
    const isSelected = await cms.page?.getAttribute(
        getTimesheetStatusTabSelector(status),
        'aria-pressed'
    );
    weExpect(isSelected).toEqual('true');
}

export async function assertTimesheetListRowsMatchedTheFilter(
    cms: CMSInterface,
    scenario: ScenarioContext,
    role: AccountRoles
) {
    await assertTimesheetListRowsMatchTheSelectedDate(cms, scenario, role);

    await assertTimesheetListRowsMatchTheSelectedStatus(cms, scenario, role);

    await assertTimesheetListRowsMatchTheInputStaffName(cms, scenario, role);
}

export async function assertTimesheetListRowsMatchTheSelectedDate(
    cms: CMSInterface,
    scenario: ScenarioContext,
    role: AccountRoles
) {
    const fromDateFilter = scenario.get<Date>(timesheetFromDateFilterAlias);
    const toDateFilter = scenario.get<Date>(timesheetToDateFilterAlias);

    const selectorDateLink =
        role === 'teacher'
            ? TimesheetListSelectors.staffTimesheetDateLink
            : TimesheetListSelectors.timesheetDateLink;
    const timesheetDateRows = await cms.page!.$$(selectorDateLink);
    for (let i = 0; i < timesheetDateRows.length; i++) {
        const dateStr = await timesheetDateRows[i]?.textContent();
        const date = moment(dateStr, 'YYYY/MM/DD');
        weExpect(date.isSameOrBefore(moment(toDateFilter))).toBeTruthy();
        weExpect(date.isSameOrAfter(moment(fromDateFilter))).toBeTruthy();
    }
}

export async function assertTimesheetListRowsMatchTheSelectedStatus(
    cms: CMSInterface,
    scenario: ScenarioContext,
    role: AccountRoles
) {
    const status = scenario.get<TimesheetStatusExtend>(timesheetStatusFilterAlias);

    const selectorStatus =
        role === 'teacher'
            ? TimesheetListSelectors.staffTimesheetStatusCell
            : TimesheetListSelectors.timesheetStatusCell;
    const statusRows = await cms.page!.$$(selectorStatus);
    for (let i = 0; i < statusRows.length; i++) {
        const statusStr = await statusRows[i]?.textContent();
        if (status !== 'All') {
            weExpect(statusStr).toEqual(status);
        }
    }
}

export async function assertTimesheetListRowsMatchTheInputStaffName(
    cms: CMSInterface,
    scenario: ScenarioContext,
    role: AccountRoles
) {
    const staffNameFilter = scenario.get<string>(timesheetStaffNameFilterAlias);

    if (role === 'school admin') {
        const staffNameRows = await cms.page!.$$(TimesheetListSelectors.timesheetStaffNameCell);
        for (let i = 0; i < staffNameRows.length; i++) {
            const staffName = await staffNameRows[i]?.textContent();
            weExpect(staffName?.includes(staffNameFilter)).toBeTruthy();
        }
    }
}

export async function assertSeeTimesheetDateFilterChips(cms: CMSInterface) {
    await cms.page?.waitForSelector(TimesheetListSelectors.dateFilterChip);
}

export async function waitForTimesheetTableRenderRows(cms: CMSInterface) {
    await cms.page!.waitForSelector(
        `${TimesheetListSelectors.timesheetDateLink}, ${TimesheetListSelectors.staffTimesheetDateLink}, ${TimesheetListSelectors.noDataIcon}`,
        { timeout: 10000 }
    );
}
