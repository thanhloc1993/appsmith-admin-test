import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { CMSInterface, AccountRoles } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';

import * as TimesheetDetailSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-detail';
import { waitForCreateTimesheetResponse } from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';
import {
    getStaffNewLocation,
    addOtherWorkingHours,
    fillGeneralInfoSection,
    openCreateTimesheetPage,
    saveTimesheet,
} from 'test-suites/squads/timesheet/step-definitions/create-timesheet-with-transportation-expense-definitions';

export const createTimesheet = async (
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    role: AccountRoles,
    date: Date,
    location?: string
) => {
    await cms.instruction(`${role} select Timesheet Management in side bar`, async () => {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
    });

    await cms.instruction('Open create timesheet page', async () => {
        openCreateTimesheetPage(cms, role);
    });

    await cms.instruction('Fill in general info section', async () => {
        const staffProfile = getUserProfileFromContext(
            scenarioContext,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );
        const staffName = staffProfile.name;
        await cms.instruction(
            `${role} fills in general info form fields for teacher with location: ${
                location ? location : 'new location'
            }, date: ${date.toDateString()}, staff: ${staffName}`,
            async function () {
                let locationName = location;
                if (!locationName) {
                    locationName = (await getStaffNewLocation(cms)).name;
                }
                await fillGeneralInfoSection({
                    cms,
                    location: locationName,
                    timesheetDate: date,
                    staff: staffName,
                });
            }
        );
    });

    await cms.instruction('Fill other working hours', async () => {
        await addOtherWorkingHours(cms, [
            {
                workingType: 'Office',
                startTime: '10:00',
                endTime: '11:30',
            },
        ]);
    });

    await cms.instruction('Click save button', async () => {
        await Promise.all([
            waitForCreateTimesheetResponse(cms, scenarioContext),
            saveTimesheet(cms),
        ]);
    });

    await cms.instruction('Wait for contents to be visible', async () => {
        await cms.waitForSelectorHasText(TimesheetDetailSelectors.timesheetStatusChip, 'Draft');
    });
};

export const createTimesheetsForMutipleDate = async (
    cms: CMSInterface,
    role: AccountRoles,
    scenario: ScenarioContext,
    numTimesheets: number
) => {
    const someDate = new Date();
    const dateArr = [];
    for (let i = 0; i < numTimesheets; i++) {
        const tomorrow = {
            date: new Date(someDate.setDate(someDate.getDate() + 1)),
        };

        dateArr.push(tomorrow);
    }

    for (let k = 0; k < dateArr.length; k++) {
        const { date } = dateArr[k];
        await createTimesheet(cms, scenario, role, date);
    }
};
