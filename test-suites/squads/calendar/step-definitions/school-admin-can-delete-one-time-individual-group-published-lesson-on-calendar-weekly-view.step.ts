import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, Locations } from '@supports/app-types';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import {
    cancelDeleteLesson,
    checkLessonDrawerVisible,
    checkLessonItemVisible,
    deleteLesson,
    fillLessonPublishForm,
    openLessonDrawer,
    savePublishLesson,
} from './school-admin-can-delete-one-time-individual-group-published-lesson-on-calendar-weekly-view.definition';
import {
    checkAndShowMoreLessonItemInCellByDate,
    userSelectCenterInLocationType,
    userSelectLocationByName,
} from './school-admin-can-view-draft-one-time-lessons-created-in-lessonmgmt-on-calendar-weekly-view-definitions';
import { aliasLocationId, aliasLocationName } from 'test-suites/squads/calendar/common/alias-keys';
import { LessonType, LocationType } from 'test-suites/squads/calendar/common/types';

Given(
    '{string} has created an one time {string} lesson with lesson date of today and {string} by Add button',
    async function (role: AccountRoles, lessonType: LessonType, location: Locations) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
        const locationId = firstGrantedLocation.locationId;
        const locationName = firstGrantedLocation.name;

        context.set(aliasLocationId, locationId);
        context.set(aliasLocationName, locationName);

        await cms.instruction(
            `${role} fill lesson publish form with location ${location}`,
            async function () {
                await fillLessonPublishForm(context, cms, lessonType);
            }
        );

        await cms.instruction(`${role} admin saves lesson as publish`, async function () {
            await savePublishLesson(cms, context);
        });
    }
);

Given(
    '{string} has chosen {string} as location type',
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

Given(
    '{string} has chosen {string} as previous lesson location in location list',
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

When('{string} opens lessons drawer', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;

    await cms.instruction(`${role} opens lessons drawer`, async function () {
        await checkAndShowMoreLessonItemInCellByDate(cms, context);
        await openLessonDrawer(cms, context);
    });
});

When('{string} deletes lesson', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} deletes lesson`, async function () {
        await deleteLesson(cms);
    });
});

When('{string} does not see previous opened lesson drawer', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;

    await cms.instruction(`${role} does not see previous opened lesson drawer`, async function () {
        await checkAndShowMoreLessonItemInCellByDate(cms, context);
        await checkLessonDrawerVisible(cms, false);
    });
});

When(
    '{string} does not see lesson item with blue filled is displayed exactly at the time and weekday in calendar',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction(
            `${role} does not see lesson item with blue filled is displayed exactly at the time and weekday in calendar`,
            async function () {
                await checkAndShowMoreLessonItemInCellByDate(cms, context);
                await checkLessonItemVisible(cms, context, false);
            }
        );
    }
);

When('{string} cancels deleting lesson', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} cancels deletes lesson`, async function () {
        await cancelDeleteLesson(cms);
    });
});

Then('{string} still sees previous opened lesson drawer', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;

    await cms.instruction(`${role} still sees previous opened lesson drawer`, async function () {
        await checkAndShowMoreLessonItemInCellByDate(cms, context);
        await checkLessonDrawerVisible(cms, true);
    });
});

Then(
    '{string} still sees lesson item with blue filled is displayed exactly at the time and weekday in calendar',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction(
            `${role} still sees lesson item with blue filled is displayed exactly at the time and weekday in calendar`,
            async function () {
                await checkLessonItemVisible(cms, context, true);
            }
        );
    }
);
