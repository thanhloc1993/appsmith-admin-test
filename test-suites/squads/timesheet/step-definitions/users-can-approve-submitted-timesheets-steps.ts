import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';
import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import moment from 'moment';
import { getLocationFromParent } from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';
import { searchTimesheetByStaffName } from 'test-suites/squads/timesheet/step-definitions/apply-status-filter-name-search-and-date-filter-definitions';
import { submitTimesheet } from 'test-suites/squads/timesheet/step-definitions/approver-views-timesheet-list-definitions';
import { getLessonContextKey } from 'test-suites/squads/timesheet/step-definitions/auto-create-not-created-by-draft-lessons-definition';
import { goToLessonDetail } from 'test-suites/squads/timesheet/step-definitions/auto-remove-lesson-hours-in-timesheet-definitions';
import { goToTimesheetDetail } from 'test-suites/squads/timesheet/step-definitions/auto-remove-lesson-hours-in-timesheet-definitions';
import { createTimesheet } from 'test-suites/squads/timesheet/step-definitions/default-date-filter-for-requester-definitions';
import {
    getTimesheetContextKey,
    getTimesheetIdFromURL,
} from 'test-suites/squads/timesheet/step-definitions/switch-state-without-reverse-definitions';
import {
    revertToPublishedLesson,
    proceedToApproveTimesheets,
    assertTimesheetStatus,
    assertTimesheetRowIsSelected,
    assertTimesheetRowIsNotSelected,
    grantLocationsByParentLocationNameForStaff,
} from 'test-suites/squads/timesheet/step-definitions/users-can-approve-submitted-timesheets-definitions';
import { createLessonByStatus } from 'test-suites/squads/timesheet/step-definitions/users-can-cancel-any-submitted-timesheets-definitions';
import { selectAllOnTable } from 'test-suites/squads/timesheet/step-definitions/view-locations-list-with-updated-confirmation-status-definitions';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

type TimesheetContextData = {
    id: string;
    date: Date;
    location: string;
};

const parentLocationName = 'Ha Noi';

Given(
    '{string} grants locations to that requestor',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const staff = getUserProfileFromContext(
            context,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );
        await grantLocationsByParentLocationNameForStaff(cms, staff, parentLocationName);
    }
);

Given(
    '{string} creates and submits timesheet {string} with cancelled lesson {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        timesheetKey: string,
        lessonKey: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const today = moment().tz('Asia/Tokyo').toDate();
        const locationIndex = Number(timesheetKey);

        const location = await getLocationFromParent(cms, parentLocationName, locationIndex);

        await cms.instruction('Create draft timesheet for requestor', async function (cms) {
            await createTimesheet(cms, context, role, today, location.name);

            context.set(getTimesheetContextKey(timesheetKey), {
                id: getTimesheetIdFromURL(cms),
                date: today,
                location: location.name,
            } as TimesheetContextData);
        });

        await cms.instruction('Create cancelled lesson for timesheet', async function (cms) {
            const lessonData = {
                startTime: '23:30',
                endTime: '23:45',
                date: today,
                location: location.name,
            };
            await createARandomStudentGRPC(cms, {
                locations: [location],
                studentPackageProfileLength: 1,
            });
            await createLessonByStatus({
                cms,
                context,
                lessonKey,
                lessonStatus: 'Cancelled',
                lessonData,
            });
        });

        await cms.instruction(
            'Go to timesheet detail page and submit the timesheet',
            async function (cms) {
                const { id: timesheetId } = context.get<TimesheetContextData>(
                    getTimesheetContextKey(timesheetKey)
                );
                await goToTimesheetDetail(cms, timesheetId);
                await submitTimesheet(cms);
            }
        );
    }
);

Given(
    '{string} reverts cancelled lesson {string} of timesheet {string} to published',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonKey: string,
        timesheetKey: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction(
            `revert cancelled lesson of timesheet ${timesheetKey} to published`,
            async function (cms) {
                const lessonId = context.get<string>(getLessonContextKey(lessonKey));
                await goToLessonDetail(cms, lessonId);
                await revertToPublishedLesson(cms);
            }
        );
    }
);

Given(
    '{string} creates and submits timesheet {string} with cancelled lessons {string} and {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        timesheetKey: string,
        lessonKey1: string,
        lessonKey2: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const today = moment().tz('Asia/Tokyo').toDate();
        const locationIndex = Number(timesheetKey);
        const lessonKeys = [lessonKey1, lessonKey2];
        const location = await getLocationFromParent(cms, parentLocationName, locationIndex);

        await createARandomStudentGRPC(cms, {
            locations: [location],
            studentPackageProfileLength: 1,
        });

        await cms.instruction('Create draft timesheet', async function (cms) {
            await createTimesheet(cms, context, role, today, location.name);

            context.set(getTimesheetContextKey(timesheetKey), {
                id: getTimesheetIdFromURL(cms),
                date: today,
                location: location.name,
            } as TimesheetContextData);
        });

        await cms.instruction('Create cancelled lessons for timesheet', async function (cms) {
            for (const lessonKey of lessonKeys) {
                const lessonData = {
                    startTime: '23:30',
                    endTime: '23:45',
                    date: today,
                    location: location.name,
                };
                await createLessonByStatus({
                    cms,
                    context,
                    lessonKey,
                    lessonStatus: 'Cancelled',
                    lessonData,
                });
            }
        });

        await cms.instruction(
            'Go to timesheet detail page and submit the timesheet',
            async function (cms) {
                const { id: timesheetId } = context.get<TimesheetContextData>(
                    getTimesheetContextKey(timesheetKey)
                );
                await goToTimesheetDetail(cms, timesheetId);
                await submitTimesheet(cms);
            }
        );
    }
);

When(
    '{string} searches timesheets for that requestor',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const { name: staffName } = getUserProfileFromContext(
            context,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );
        await cms.instruction(`Search timesheets by ${staffName}`, async function (cms) {
            await searchTimesheetByStaffName(cms, context, staffName);
            await cms.page!.waitForTimeout(1500);
            await cms.waitForSkeletonLoading();
        });
    }
);

When(
    '{string} selects all valid rows on the timesheet list table',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} selects all valid rows on the location list table`,
            async () => {
                await selectAllOnTable(cms, 'TableHeaderWithCheckbox__checkboxHeader');
            }
        );
    }
);

Then(
    '{string} sees timesheet {string} and {string} is selected',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        timesheetKey1: string,
        timesheetKey2: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const timesheetKeys = [timesheetKey1, timesheetKey2];

        for (const timesheetKey of timesheetKeys) {
            const { location: timesheetLocation } = context.get<TimesheetContextData>(
                getTimesheetContextKey(timesheetKey)
            );

            await cms.instruction(`Sees timesheet ${timesheetKey} is selected`, async () => {
                await assertTimesheetRowIsSelected(cms, timesheetLocation);
            });
        }
    }
);

Then(
    '{string} sees timesheet {string} and {string} is not selected',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        timesheetKey1: string,
        timesheetKey2: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        const timesheetKeys = [timesheetKey1, timesheetKey2];

        for (const timesheetKey of timesheetKeys) {
            const { location: timesheetLocation } = context.get<TimesheetContextData>(
                getTimesheetContextKey(timesheetKey)
            );

            await cms.instruction(`Sees timesheet ${timesheetKey} is not selected`, async () => {
                await assertTimesheetRowIsNotSelected(cms, timesheetLocation);
            });
        }
    }
);

Then(
    '{string} approves the selected timesheets',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await proceedToApproveTimesheets(cms);
    }
);

Then(
    '{string} sees timesheet {string} and {string} status changed to Approved',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        timesheetKey1: string,
        timesheetKey2: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const timesheetKeys = [timesheetKey1, timesheetKey2];
        for (const timesheetKey of timesheetKeys) {
            await cms.instruction(`go to timesheet ${timesheetKey} detail page`, async () => {
                const { id: timesheetId } = context.get<TimesheetContextData>(
                    getTimesheetContextKey(timesheetKey)
                );
                await goToTimesheetDetail(cms, timesheetId);
                await assertTimesheetStatus(cms, 'Approved');
            });
        }
    }
);

Then(
    '{string} sees timesheet {string} and {string} status remained as Submitted',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        timesheetKey1: string,
        timesheetKey2: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        const timesheetKeys = [timesheetKey1, timesheetKey2];
        for (const timesheetKey of timesheetKeys) {
            await cms.instruction(`go to timesheet ${timesheetKey} detail page`, async () => {
                const { id: timesheetId } = context.get<TimesheetContextData>(
                    getTimesheetContextKey(timesheetKey)
                );
                await goToTimesheetDetail(cms, timesheetId);
                await assertTimesheetStatus(cms, 'Submitted');
            });
        }
    }
);
