import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { createTimesheet } from './default-date-filter-for-requester-definitions';
import {
    assertLessonHoursTableEmpty,
    assertTimesheetsForLessonsAutoCreated,
    createDraftLesson,
    LessonContextData,
    publishLesson,
} from './flag-off-to-on-auto-create-timesheet-definition';
import {
    getLessonContextKey,
    getTimesheetContextKey,
    getTimesheetIdFromURL,
} from './switch-state-without-reverse-definitions';
import moment from 'moment';

type TimesheetContextData = {
    id: string;
    date: Date;
};

Given(
    '{string} creates a draft timesheet {string} for a past date',
    async function (this: IMasterWorld, role: AccountRoles, timesheetKey: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const pastDate = moment().tz('Asia/Tokyo').subtract(5, 'days').toDate();
        await cms.instruction(`Create draft timesheet ${timesheetKey}`, async () => {
            const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
            await createTimesheet(cms, this.scenario, role, pastDate, firstGrantedLocation.name);

            context.set(getTimesheetContextKey(timesheetKey), {
                id: getTimesheetIdFromURL(cms),
                date: pastDate,
            });
        });
    }
);

Given(
    '{string} creates a draft lesson {string} for timesheet {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonKey: string,
        timesheetKey: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const { date: timesheetDate } = context.get<TimesheetContextData>(
            getTimesheetContextKey(timesheetKey)
        );

        await cms.instruction(
            `${role} creates a draft lesson ${lessonKey} for timesheet ${timesheetKey}`,
            async () => {
                await createDraftLesson({
                    cms,
                    context,
                    lessonKey,
                    lessonData: {
                        startTime: '11:00',
                        endTime: '11:15',
                        date: timesheetDate,
                    },
                });
            }
        );
    }
);

Given(
    '{string} creates a draft lesson {string} for a past date',
    async function (this: IMasterWorld, role: AccountRoles, lessonKey: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const pastDate = moment().tz('Asia/Tokyo').subtract(5, 'days').toDate();

        await cms.instruction(
            `${role} creates a draft lesson ${lessonKey} for a past date ${pastDate}`,
            async () => {
                await createDraftLesson({
                    cms,
                    context,
                    lessonKey,
                    lessonData: {
                        startTime: '11:00',
                        endTime: '11:15',
                        date: pastDate,
                    },
                });
            }
        );
    }
);

Given(
    '{string} creates a draft lesson {string} for a future date',
    async function (this: IMasterWorld, role: AccountRoles, lessonKey: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const futureDate = moment().tz('Asia/Tokyo').add(5, 'days').toDate();

        await cms.instruction(
            `${role} creates a draft lesson ${lessonKey} for a future date ${futureDate}`,
            async () => {
                await createDraftLesson({
                    cms,
                    context,
                    lessonKey,
                    lessonData: {
                        startTime: '11:00',
                        endTime: '11:15',
                        date: futureDate,
                    },
                });
            }
        );
    }
);

Given(
    '{string} creates a custom draft lesson {string} for today with start time 5 to 10 minutes from now',
    async function (this: IMasterWorld, role: AccountRoles, lessonKey: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const today = moment().tz('Asia/Tokyo').toDate();
        const nearestStartTime = moment(today).add(10, 'minutes').format('HH:mm');
        const nearestEndTime = moment(today).add(25, 'minutes').format('HH:mm');

        await cms.instruction(
            `${role} creates a draft lesson ${lessonKey} for today with start time 5 to 10 minutes from now`,
            async () => {
                await createDraftLesson({
                    cms,
                    context,
                    lessonKey,
                    lessonData: {
                        startTime: nearestStartTime,
                        endTime: nearestEndTime,
                        date: today,
                    },
                });
            }
        );
    }
);

Given(
    '{string} creates a custom draft lesson {string} for today with start time 00:00 and end time 23:59',
    async function (this: IMasterWorld, role: AccountRoles, lessonKey: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const today = moment().tz('Asia/Tokyo').toDate();

        await cms.instruction(
            `${role} creates a custom draft lesson ${lessonKey} for today with start time 00:00 and end time 23:59`,
            async () => {
                await createDraftLesson({
                    cms,
                    context,
                    lessonKey,
                    lessonData: {
                        startTime: '00:00',
                        endTime: '23:59',
                        date: today,
                    },
                });
            }
        );
    }
);

When(
    '{string} publishes the following lessons {string}',
    { timeout: 180000 },
    async function (this: IMasterWorld, role: AccountRoles, lessonKeys: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const formattedLessonKeys: string[] = lessonKeys.split(',').map((key) => key.trim());

        for (const lessonKey of formattedLessonKeys) {
            await cms.instruction(`${role} publishes the lesson ${lessonKey}`, async () => {
                const { id: lessonId } = context.get<LessonContextData>(
                    getLessonContextKey(lessonKey)
                );
                await publishLesson(cms, lessonId);
            });
        }
    }
);

Then(
    '{string} sees no lesson hours on timesheet {string}',
    async function (this: IMasterWorld, role: AccountRoles, timesheetKey: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        const { id } = context.get<TimesheetContextData>(getTimesheetContextKey(timesheetKey));

        await cms.instruction(
            `${role} sees no lesson hours on timesheet ${timesheetKey}`,
            async () => {
                await assertLessonHoursTableEmpty(cms, id);
            }
        );
    }
);

Then(
    '{string} sees timesheets for lessons {string} is auto created',
    { timeout: 180000 },
    async function (this: IMasterWorld, role: AccountRoles, lessonKeys: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const formattedLessonKeys: string[] = lessonKeys.split(',').map((key) => key.trim());

        await cms.instruction(
            `${role} sees timesheets for lesson ${formattedLessonKeys.join(',')} is auto created`,
            async () => {
                await assertTimesheetsForLessonsAutoCreated({
                    cms,
                    context,
                    lessonKeys: formattedLessonKeys,
                    role,
                });
            }
        );
    }
);
