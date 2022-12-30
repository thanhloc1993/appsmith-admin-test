import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import moment from 'moment';
import { submitTimesheet } from 'test-suites/squads/timesheet/step-definitions/approver-views-timesheet-list-definitions';
import { goToTimesheetDetail } from 'test-suites/squads/timesheet/step-definitions/auto-remove-lesson-hours-in-timesheet-definitions';
import { createTimesheet } from 'test-suites/squads/timesheet/step-definitions/default-date-filter-for-requester-definitions';
import {
    getTimesheetContextKey,
    getTimesheetIdFromURL,
} from 'test-suites/squads/timesheet/step-definitions/switch-state-without-reverse-definitions';
import { TimesheetReferenceData } from 'test-suites/squads/timesheet/step-definitions/switch-state-without-reverse-steps';
import { createLessonByStatus } from 'test-suites/squads/timesheet/step-definitions/users-can-cancel-any-submitted-timesheets-definitions';

Given(
    '{string} creates and submits timesheet {string} without lesson hours',
    async function (this: IMasterWorld, role: AccountRoles, timesheetKey: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const today = moment().tz('Asia/Tokyo').toDate();

        await cms.instruction('Create and submit timesheet', async function (cms) {
            const firstGrantedLocation =
                scenario.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
            await createTimesheet(cms, scenario, role, today, firstGrantedLocation.name);
            await submitTimesheet(cms);

            scenario.set(getTimesheetContextKey(timesheetKey), {
                id: getTimesheetIdFromURL(cms),
                date: today,
                location: firstGrantedLocation.name,
            });
        });
    }
);

Given(
    '{string} creates and submits timesheet {string} with {string} lesson {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        timesheetKey: string,
        lessonStatus: 'Completed' | 'Cancelled',
        lessonKey: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const today = moment().tz('Asia/Tokyo').toDate();

        await cms.instruction('Create timesheet with Draft status', async function (cms) {
            const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
            await createTimesheet(cms, context, role, today, firstGrantedLocation.name);

            context.set(getTimesheetContextKey(timesheetKey), {
                id: getTimesheetIdFromURL(cms),
                date: today,
            });
        });

        await cms.instruction(`Create ${lessonStatus} lesson for timesheet`, async function (cms) {
            const lessonData = { startTime: '23:30', endTime: '23:45', date: today };

            await createLessonByStatus({ cms, context, lessonKey, lessonStatus, lessonData });
        });

        await cms.instruction(
            'Go to timesheet detail page and submit the timesheet',
            async function (cms) {
                const { id: timesheetId } = context.get<TimesheetReferenceData>(
                    getTimesheetContextKey(timesheetKey)
                );
                await goToTimesheetDetail(cms, timesheetId);
                await submitTimesheet(cms);
            }
        );
    }
);
