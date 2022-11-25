import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import moment from 'moment';
import {
    submitTimesheet,
    approveTimesheet,
} from 'test-suites/squads/timesheet/step-definitions/approver-views-timesheet-list-definitions';
import {
    goToTimesheetDetail,
    goToLessonDetail,
} from 'test-suites/squads/timesheet/step-definitions/auto-remove-lesson-hours-in-timesheet-definitions';
import { createTimesheet } from 'test-suites/squads/timesheet/step-definitions/default-date-filter-for-requester-definitions';
import {
    cancelApprovalTimesheet,
    cancelSubmissionTimesheet,
    getTimesheetContextKey,
    getTimesheetIdFromURL,
    assertTimesheetStateChangedCorrectly,
    createPublishedLesson,
    completeLesson,
    getLessonContextKey,
    assertNotSeeTimesheetDetailActions,
    assertActionsButtonTimesheetIsEnabled,
    assertActionsButtonTimesheetIsDisabled,
} from 'test-suites/squads/timesheet/step-definitions/switch-state-without-reverse-definitions';

export type TimesheetReferenceData = {
    id: string;
    date: Date;
};

Given(
    '{string} creates a draft timesheet {string} for yesterday',
    async function (this: IMasterWorld, role: AccountRoles, timesheetKey: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const yesterday = moment().tz('Asia/Tokyo').subtract(1, 'day').toDate();
        await cms.instruction(`Create draft timesheet ${timesheetKey}`, async () => {
            const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
            await createTimesheet(cms, this.scenario, role, yesterday, firstGrantedLocation.name);

            context.set(getTimesheetContextKey(timesheetKey), {
                id: getTimesheetIdFromURL(cms),
                date: yesterday,
            });
        });
    }
);

Given(
    '{string} creates a draft timesheet {string} for today',
    async function (this: IMasterWorld, role: AccountRoles, timesheetKey: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const today = moment().tz('Asia/Tokyo').toDate();
        await cms.instruction(`Create draft timesheet ${timesheetKey}`, async () => {
            const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
            await createTimesheet(cms, this.scenario, role, today, firstGrantedLocation.name);

            context.set(getTimesheetContextKey(timesheetKey), {
                id: getTimesheetIdFromURL(cms),
                date: today,
            });
        });
    }
);

Given(
    '{string} creates a completed lesson {string} for timesheet {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonKey: string,
        timesheetKey: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction(
            `${role} creates a Published lesson ${lessonKey} for timesheet ${timesheetKey}`,
            async () => {
                const { date: timesheetDate } = context.get<TimesheetReferenceData>(
                    getTimesheetContextKey(timesheetKey)
                );

                await createPublishedLesson({
                    cms,
                    context,
                    lessonKey,
                    lessonData: {
                        startTime: '23:30',
                        endTime: '23:45',
                        date: timesheetDate,
                    },
                });
            }
        );
        await cms.instruction(`${role} goes to the lesson ${lessonKey} detail page`, async () => {
            const lessonId = context.get<string>(getLessonContextKey(lessonKey));

            await goToLessonDetail(cms, lessonId);
        });

        await cms.instruction(`${role} complete lesson ${lessonKey}`, async () => {
            await completeLesson(cms);
        });
    }
);

When(
    '{string} goes to the timesheet {string} detail page',
    async function (this: IMasterWorld, role: AccountRoles, timesheetKey: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const { id: timesheetId } = context.get<TimesheetReferenceData>(
            getTimesheetContextKey(timesheetKey)
        );
        await cms.instruction(
            `${role} goes to the timesheet ${timesheetKey} detail page`,
            async () => {
                await goToTimesheetDetail(cms, timesheetId);
            }
        );
    }
);

When(
    `{string} clicks {string} button`,
    async function (this: IMasterWorld, role: AccountRoles, actionBtn: string) {
        const cms = getCMSInterfaceByRole(this, role);
        switch (actionBtn) {
            case 'Submit':
                await cms.instruction(`${role} clicks ${actionBtn} button`, async () => {
                    await submitTimesheet(cms);
                });

                break;
            case 'Cancel Submission':
                await cms.instruction(`${role} clicks ${actionBtn} button`, async () => {
                    await cancelSubmissionTimesheet(cms);
                });

                break;
            case 'Approve':
                await cms.instruction(`${role} clicks ${actionBtn} button`, async () => {
                    await approveTimesheet(cms);
                });

                break;
            case 'Cancel Approval':
                await cms.instruction(`${role} clicks ${actionBtn} button`, async () => {
                    await cancelApprovalTimesheet(cms);
                });

                break;
        }
    }
);

Then(
    '{string} sees the timesheet state changed correctly to {string}',
    async function (this: IMasterWorld, role: AccountRoles, timesheetStatus: string) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees the timesheet state changed correctly to ${timesheetStatus}`,
            async function (cms) {
                await assertTimesheetStateChangedCorrectly(cms, timesheetStatus);
            }
        );
    }
);

Then(
    '{string} does not see the {string} button',
    async function (this: IMasterWorld, role: AccountRoles, actionsBtn: string) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} does not see the ${actionsBtn} button`,
            async function (cms) {
                await assertNotSeeTimesheetDetailActions(cms, actionsBtn);
            }
        );
    }
);

Then(
    '{string} sees the {string} button is disabled',
    async function (this: IMasterWorld, role: AccountRoles, actionsBtn: string) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees the ${actionsBtn} button is disabled`,
            async function (cms) {
                await assertActionsButtonTimesheetIsDisabled(cms, actionsBtn);
            }
        );
    }
);

Then(
    '{string} sees the {string} button is enabled',
    async function (this: IMasterWorld, role: AccountRoles, actionsBtn: string) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees the ${actionsBtn} button is enabled`,
            async function (cms) {
                await assertActionsButtonTimesheetIsEnabled(cms, actionsBtn);
            }
        );
    }
);
