import { lookingForIcon } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';

import { timesheetIdAlias, staffNameAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import { confirmDialogButtonSave } from 'test-suites/squads/timesheet/common/cms-selectors/common';
import * as TimesheetDetailSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-detail';
import {
    staffTimesheetDateLink,
    timesheetDateLink,
} from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-list';
import { assertElementExists } from 'test-suites/squads/timesheet/common/step-definitions/common-assertion-definitions';
import {
    waitForCreateTimesheetResponse,
    waitForDeleteTimesheetResponse,
} from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';
import { searchTimesheetByStaffName } from 'test-suites/squads/timesheet/step-definitions/apply-status-filter-name-search-and-date-filter-definitions';
import {
    openCreateTimesheetPage,
    fillGeneralInfoSection,
    addOtherWorkingHours,
    fillRemarksSection,
    saveTimesheet,
} from 'test-suites/squads/timesheet/step-definitions/create-timesheet-with-transportation-expense-definitions';
import { getTimesheetIdFromURL } from 'test-suites/squads/timesheet/step-definitions/switch-state-without-reverse-definitions';
import { clickTimesheetActionPanel } from 'test-suites/squads/timesheet/step-definitions/view-locations-list-with-updated-confirmation-status-definitions';

export const createTimesheetWithWorkingHoursAndRemarks = async ({
    cms,
    role,
    scenario,
    staffName,
    locationName,
}: {
    cms: CMSInterface;
    role: AccountRoles;
    scenario: ScenarioContext;
    staffName?: string;
    locationName?: string;
}) => {
    const currentDate = new Date();

    await cms.instruction(`${role} select Timesheet Management in side bar`, async () => {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
    });

    await cms.instruction('Open create timesheet page', async () => {
        openCreateTimesheetPage(cms, role);
    });

    await fillGeneralInfoSection({
        cms,
        timesheetDate: currentDate,
        location: locationName,
        staff: staffName,
    });

    await addOtherWorkingHours(cms, [
        {
            workingType: 'Office',
            startTime: '09:00',
            endTime: '10:00',
        },
    ]);
    await fillRemarksSection(cms, scenario);

    await cms.instruction('Click save button', async () => {
        await Promise.all([waitForCreateTimesheetResponse(cms, scenario), saveTimesheet(cms)]);
    });

    await cms.waitForSelectorHasText(TimesheetDetailSelectors.timesheetStatusChip, 'Draft');

    const timesheetId = getTimesheetIdFromURL(cms);

    scenario.set(timesheetIdAlias, timesheetId);
    scenario.set(staffNameAlias, staffName);
};

export const openDeleteTimesheetConfirmation = async (cms: CMSInterface) => {
    const page = cms.page!;
    await clickTimesheetActionPanel(cms);
    await cms.instruction('click delete button', async () => {
        const deleteButton = page.locator(TimesheetDetailSelectors.deleteTimesheetButton);
        deleteButton.click();
    });

    await cms.assertTheDialogTitleByDataTestId(
        'DialogWithHeaderFooter__dialogTitle',
        'Delete Timesheet'
    );
};

export const clickDeleteTimesheetButton = async (
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) => {
    const page = cms.page!;

    await cms.instruction('click delete button', async () => {
        await page.waitForSelector(confirmDialogButtonSave);

        const deleteButton = page.locator(confirmDialogButtonSave);
        const timesheetId = scenarioContext.get(timesheetIdAlias);

        await Promise.all([
            waitForDeleteTimesheetResponse(cms, scenarioContext, timesheetId),
            deleteButton.click(),
        ]);
    });
};

export const deleteTimesheet = async (cms: CMSInterface, scenarioContext: ScenarioContext) => {
    await cms.instruction('Delete timesheet', async () => {
        await openDeleteTimesheetConfirmation(cms);
        await clickDeleteTimesheetButton(cms, scenarioContext);
    });
};

export const assertTimesheetDeletedOnTimesheetList = async (
    cms: CMSInterface,
    role: AccountRoles,
    scenario: ScenarioContext
) => {
    const timesheetId = scenario.get(timesheetIdAlias);
    const staffName = scenario.get(staffNameAlias);

    const timesheetDateLinkSelector =
        role === 'school admin' ? timesheetDateLink : staffTimesheetDateLink;

    await cms.waitForSkeletonLoading();

    if (role === 'school admin') {
        await cms.instruction(`Search timesheet for ${staffName}`, async function (cms) {
            await searchTimesheetByStaffName(cms, scenario, staffName);
        });
        await cms.waitForSkeletonLoading();
    }

    const timesheetDateRows = await cms.page!.$$(timesheetDateLinkSelector);

    if (timesheetDateRows.length) {
        const timesheetIds: string[] = [];
        for (const timesheetDateRow of timesheetDateRows) {
            const timesheetId = await timesheetDateRow.getAttribute('href');
            timesheetIds.push(timesheetId!);
        }

        weExpect(timesheetIds.includes(timesheetId)).toBe(false);
    }

    await cms.instruction('Assert table is empty', async () => {
        await cms.page!.waitForTimeout(5000);
        await assertElementExists(cms, lookingForIcon);
    });
};
