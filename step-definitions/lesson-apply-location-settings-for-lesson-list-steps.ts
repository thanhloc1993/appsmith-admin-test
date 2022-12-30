import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasLocationId } from './alias-keys/lesson';
import { selectedLocationSelector } from './cms-selectors/cms-keys';
import {
    appliedLocation,
    cancelApplyingLocation,
    checkExistLesson,
    checkFirstLessonPage,
    checkLocationNameDisplayUnderProfileName,
    openLocationSettingInCMS,
    selectLocation,
} from './lesson-apply-location-settings-for-lesson-list-definitions';
import { getCMSInterfaceByRole } from './utils';
import { notificationDialogConfirmDiscardButton } from 'test-suites/squads/communication/step-definitions/cms-selectors/communication';
import { assertLessonListByLessonTime } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

When(
    `{string} opens location settings in nav bar on CMS`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} opens location settings in nav bar on CMS`,
            async function () {
                await openLocationSettingInCMS(cms);
            }
        );
    }
);

When(
    `{string} applies {string} location which matches location of {string} lesson`,
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        type: string,
        lessonTime: LessonManagementLessonTime
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await cms.instruction(
            `${role} applies ${type} location which matches location of ${lessonTime} lesson`,
            async function () {
                const locationId = scenario.get(aliasLocationId);
                await appliedLocation(cms, locationId, type);
            }
        );
    }
);

Then(
    `{string} is redirected to the first page of {string} lesson list page`,
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} is redirected to the first page of ${lessonTime} lesson list page`,
            async function () {
                await checkFirstLessonPage(cms);
                await assertLessonListByLessonTime(cms, lessonTime);
            }
        );
    }
);

Then(
    `{string} sees {string} location name under school admin's name`,
    async function (this: IMasterWorld, role: AccountRoles, order: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await cms.instruction(
            `${role} sees ${order} location name under school admin's name`,
            async function () {
                const locationId = scenario.get(aliasLocationId);
                await checkLocationNameDisplayUnderProfileName(cms, locationId, order);
            }
        );
    }
);

Then(
    `{string} sees lesson which has location is included in selected location settings`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;
        const scenario = this.scenario;
        await cms.instruction(
            `${role} sees lesson which has location is included in selected location settings`,
            async function () {
                await checkExistLesson(page, scenario);
            }
        );
    }
);

Given(
    `{string} has opened location settings in nav bar on CMS`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} has opened location settings in nav bar on CMS`,
            async function () {
                await openLocationSettingInCMS(cms);
            }
        );
    }
);

Given(
    `{string} has selected {string} location`,
    async function (this: IMasterWorld, role: AccountRoles, type: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await cms.instruction(`${role} has selected ${type} location`, async function () {
            const locationId = scenario.get(aliasLocationId);
            await selectLocation(cms, locationId, type);
        });
    }
);

Given(
    `{string} has cancelled applying location by {string}`,
    async function (this: IMasterWorld, role: AccountRoles, option: string) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} has cancelled applying location by ${option}`,
            async function () {
                await cancelApplyingLocation(cms, option);
            }
        );
    }
);

When(
    `{string} confirms to cancel applying location`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;
        await cms.instruction(`${role} confirms to cancel applying location`, async function () {
            await page.click(notificationDialogConfirmDiscardButton);
        });
    }
);

Then(
    `{string} sees full {string} lesson list`,
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const page = cms.page!;
        await cms.instruction(`${role} sees full ${lessonTime} lesson list`, async function () {
            await assertLessonListByLessonTime(cms, lessonTime);
            await checkExistLesson(page, scenario);
        });
    }
);

Then(
    `{string} does not see any location name under school admin's name`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;
        await cms.instruction(
            `${role} does not see any location name under school admin's name`,
            async function () {
                weExpect(await page.locator(selectedLocationSelector).isVisible()).toEqual(false);
            }
        );
    }
);
