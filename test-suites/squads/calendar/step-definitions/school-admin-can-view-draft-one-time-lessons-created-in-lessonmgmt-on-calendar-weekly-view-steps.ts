import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, Locations } from '@supports/app-types';

import {
    calendarGoToDay,
    checkCalendarViewSelected,
    userSeesFullDayTime,
    userSeesLessonInTodayCell,
    userSeesStyleDateLabelToday,
    userSelectCenterInLocationType,
    userSelectLocationByName,
} from './school-admin-can-view-draft-one-time-lessons-created-in-lessonmgmt-on-calendar-weekly-view-definitions';
import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod, LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import { menuItem } from 'test-suites/squads/calendar/common/cms-selectors';
import {
    CalendarViewType,
    LessonType,
    LocationType,
} from 'test-suites/squads/calendar/common/types';
import { applyHighestLevelLocationOnCMS } from 'test-suites/squads/calendar/helpers/locations';
import { createLessonWithGRPC } from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has saved draft an one time {string} lesson with lesson date of today and {string} in lessonmgmt',
    async function (role: AccountRoles, lessonType: LessonType, location: Locations) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a one time ${lessonType} lesson draft in today and ${location}`,
            async function () {
                const teachingMethod: LessonTeachingMethod =
                    lessonType === 'individual'
                        ? LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL
                        : LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP;

                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    teachingMedium: 'Online',
                    createLessonTime: 'now',
                    teachingMethod,
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME,
                    schedulingStatus: LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT,
                });
            }
        );
    }
);

Given('{string} has gone to Calendar tab', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const page = cms.page!;

    await cms.instruction(`School admin selects menu item Calendar in sidebar`, async function () {
        await applyHighestLevelLocationOnCMS(cms);
        await page.click(menuItem('Calendar'));
    });
});

When(
    '{string} chooses {string} as location type',
    async function (role: AccountRoles, locationType: LocationType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} select "${locationType}" as location type`,
            async function () {
                await userSelectCenterInLocationType(cms);
            }
        );
    }
);

When(
    '{string} chooses {string} as previous lesson location in location list',
    async function (role: AccountRoles, location: Locations) {
        const scenarioContext = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} find and select "${location}" in location list`,
            async function () {
                await cms.waitingForLoadingIcon();
                await userSelectLocationByName(cms, scenarioContext);
            }
        );
    }
);

Then(
    '{string} sees {string} view is selected',
    async function (role: AccountRoles, calendarView: CalendarViewType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees "${calendarView}" view is selected`, async function () {
            await cms.waitingForLoadingIcon();
            await checkCalendarViewSelected(cms, calendarView);
        });
    }
);

Then('{string} sees current weekly date in weekly view', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} go today in calendar weekly`, async function () {
        await calendarGoToDay(cms);
    });
});

Then("{string} sees today's date with grey outlined circle", async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} sees today's date with grey outlined circle`, async function () {
        await userSeesStyleDateLabelToday(cms);
    });
});

Then('{string} sees day time from 00:00 to 23:00', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} sees day time from 00:00 to 23:00`, async function () {
        await userSeesFullDayTime(cms);
    });
});

Then(
    '{string} sees lesson is displayed in today cell with light blue outline',
    async function (role: AccountRoles) {
        const scenarioContext = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} lesson is displayed in today cell`, async function () {
            await cms.waitingForLoadingIcon();
            await userSeesLessonInTodayCell(
                cms,
                scenarioContext,
                LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT
            );
        });
    }
);
