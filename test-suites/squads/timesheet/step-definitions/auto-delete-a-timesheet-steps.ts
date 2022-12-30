import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import {
    timesheetAutoDeleteTestLocationsListAlias,
    timesheetAutoDeleteTestTimesheetIdsAlias,
} from 'test-suites/squads/timesheet/common/alias-keys';
import { LocationIndex } from 'test-suites/squads/timesheet/common/types';
import { submitTimesheet } from 'test-suites/squads/timesheet/step-definitions/approver-views-timesheet-list-definitions';
import {
    addOtherWorkingHoursForTimesheet,
    createAndPublishLessonsForGrantedLocation,
    createStudentsForGrantedLocations,
    get4GrantedLocations,
    mapLocationIndex,
    requestorSeesTodayTimesheetsAutoCreated,
    deletesAllLessonsOfTimesheet,
    changesAllLessonsOfTimesheetToDraft,
    assertTodayTimesheetCountForOneLocation,
} from 'test-suites/squads/timesheet/step-definitions/auto-delete-a-timesheet-definitions';
import {
    changeAllLessonStatusOfTimesheetToCompleted,
    goToTimesheetDetail,
} from 'test-suites/squads/timesheet/step-definitions/auto-remove-lesson-hours-in-timesheet-definitions';

Given(
    '{string} creates and publishes 4 lessons for today in 4 different locations A, B, C, D',
    { timeout: 120000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const cms2 = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        await get4GrantedLocations(cms, context);
        await createStudentsForGrantedLocations(cms, context);

        await createAndPublishLessonsForGrantedLocation(cms2, context);
        await requestorSeesTodayTimesheetsAutoCreated(cms2, context);
    }
);

Given(
    '{string} add other working hours for timesheet {string}',
    async function (this: IMasterWorld, role: AccountRoles, locationIndex: LocationIndex) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const timesheetIds = context.get<Array<string>>(timesheetAutoDeleteTestTimesheetIdsAlias);

        await addOtherWorkingHoursForTimesheet(cms, timesheetIds[mapLocationIndex(locationIndex)]);
    }
);

Given(
    '{string} submits timesheets {string}',

    async function (this: IMasterWorld, role: AccountRoles, locationIndex: LocationIndex) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const timesheetIds = context.get<Array<string>>(timesheetAutoDeleteTestTimesheetIdsAlias);
        const timesheetIdTobeSubmit = timesheetIds[mapLocationIndex(locationIndex)];
        await changeAllLessonStatusOfTimesheetToCompleted(cms, context, timesheetIdTobeSubmit);

        await cms.instruction(
            `${role} submits timesheet ${timesheetIdTobeSubmit}`,
            async function () {
                await goToTimesheetDetail(cms, timesheetIdTobeSubmit);
                await submitTimesheet(cms);
            }
        );
    }
);

When(
    '{string} deletes the lesson {string}',
    async function (this: IMasterWorld, role: AccountRoles, locationIndex: LocationIndex) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const timesheetIds = context.get<Array<string>>(timesheetAutoDeleteTestTimesheetIdsAlias);
        const timesheetId = timesheetIds[mapLocationIndex(locationIndex)];

        await cms.instruction(
            `${role} deletes lesson of timesheet ${timesheetId}`,
            async function () {
                await deletesAllLessonsOfTimesheet(cms, context, timesheetId);
            }
        );
    }
);

When(
    '{string} changes the lesson {string} status to draft',
    async function (this: IMasterWorld, role: AccountRoles, locationIndex: LocationIndex) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const timesheetIds = context.get<Array<string>>(timesheetAutoDeleteTestTimesheetIdsAlias);
        const timesheetId = timesheetIds[mapLocationIndex(locationIndex)];

        await cms.instruction(
            `${role} change all lesson status of timesheet ${timesheetId} to draft`,
            async function () {
                await changesAllLessonsOfTimesheetToDraft(cms, context, timesheetId);
            }
        );
    }
);

Then(
    '{string} sees that the timesheet {string} deleted',
    async function (this: IMasterWorld, role: AccountRoles, locationIndex: LocationIndex) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const locations = context.get<Array<LocationInfoGRPC>>(
            timesheetAutoDeleteTestLocationsListAlias
        );
        const location = locations[mapLocationIndex(locationIndex)];

        await assertTodayTimesheetCountForOneLocation(cms, context, role, location, 0);
    }
);

Then(
    '{string} sees that the timesheet {string} remained',
    async function (this: IMasterWorld, role: AccountRoles, locationIndex: LocationIndex) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const locations = context.get<Array<LocationInfoGRPC>>(
            timesheetAutoDeleteTestLocationsListAlias
        );
        const location = locations[mapLocationIndex(locationIndex)];

        await assertTodayTimesheetCountForOneLocation(cms, context, role, location, 1);
    }
);
