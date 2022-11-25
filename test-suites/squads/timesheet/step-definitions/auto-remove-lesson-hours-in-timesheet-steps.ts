import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    aliasLocationGRPC,
    aliasLocationId,
    aliasLocationName,
} from 'test-suites/squads/timesheet/common/alias-keys';
import { getFirstGrantedLocation } from 'test-suites/squads/timesheet/common/utils';
import {
    assertTodayTimesheetHasOnly1LessonOnDetailPage,
    assertTodayTimesheetHasOnly1LessonOnTimesheetManagementPage,
    createAndPublish3LessonsForToday,
    createStudentForLocation,
    enableAutoCreateForStaff,
    requestorSeesTodayTimesheetDetailPage,
    schoolAdminChangeAllLessonStatusToCompleted,
    schoolAdminDeletes2Of3CreatedLessons,
    submitTodayTimesheet,
} from 'test-suites/squads/timesheet/step-definitions/auto-remove-lesson-hours-in-timesheet-definitions';

Given(
    '{string} enables auto-create flag for that requestor',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const staff = context.get<UserProfileEntity>(
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );
        await enableAutoCreateForStaff(cms, staff);
    }
);

Given(
    '{string} creates and publishes 3 lessons for today',
    { timeout: 120000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenarioContext = this.scenario;
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const cms2 = getCMSInterfaceByRole(this, role);
        const location = await getFirstGrantedLocation(cms2);
        scenarioContext.set(aliasLocationGRPC, location);
        scenarioContext.set(aliasLocationId, location.locationId);
        scenarioContext.set(aliasLocationName, location.name);
        await createStudentForLocation(cms, location);

        await createAndPublish3LessonsForToday(cms2, this.scenario);
    }
);

Given(
    `{string} sees 3 lessons are auto-created in today's timesheet`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await requestorSeesTodayTimesheetDetailPage(cms, this.scenario);
    }
);

When(
    `{string} deletes 2 of 3 created lessons`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await schoolAdminDeletes2Of3CreatedLessons(cms, this.scenario);
    }
);

When(
    `{string} changes all lessons status to Completed in Lesson management`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await schoolAdminChangeAllLessonStatusToCompleted(cms, this.scenario);
    }
);

When(
    `{string} submits the today's timesheet`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await submitTodayTimesheet(cms, this.scenario);
    }
);

Then(
    `{string} sees the "teacher" today's timesheet only has 1 lesson on the timesheet detail page`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await assertTodayTimesheetHasOnly1LessonOnDetailPage(cms, this.scenario);
    }
);

Then(
    `{string} sees the today's timesheet only has 1 lesson on the timesheet detail page`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await assertTodayTimesheetHasOnly1LessonOnDetailPage(cms, this.scenario);
    }
);

Then(
    `{string} sees the "teacher" today's timesheet only has 1 lesson on the timesheet management page`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await assertTodayTimesheetHasOnly1LessonOnTimesheetManagementPage(cms, this.scenario, role);
    }
);

Then(
    `{string} sees the today's timesheet only has 1 lesson on the timesheet management page`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await assertTodayTimesheetHasOnly1LessonOnTimesheetManagementPage(cms, this.scenario, role);
    }
);
