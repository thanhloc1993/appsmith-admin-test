import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasCourseName } from 'step-definitions/alias-keys/lesson';
import { courseDetailsSettingTab } from 'step-definitions/cms-selectors/course';
import {
    LocationCheckBoxMode,
    LocationLevel,
    openLocationPopup,
    saveLocationPopup,
    schoolAdminSelectLocationOfParentLocation,
} from 'step-definitions/lesson-create-course-with-teaching-method-definitions';
import {
    schoolAdminNotSeesParentLocationInLocationField,
    schoolAdminSeesLocationChildrenWithTypeInSelectedField,
    schoolAdminSeesChildrenLocationInLocationField,
    schoolAdminSeesLocationParentWithTypeMatchModeInCourse,
    schoolAdminSeesLocationParentWithTypeNotInSelectedField,
    schoolAdminSeesLocationWithTypeMatchModeInCourse,
    schoolAdminSeesLocationInCourseDetail,
    schoolAdminNotSeesLocationInCourseDetail,
} from 'step-definitions/lesson-select-and-view-location-in-location-popup-definitions';
import { getCMSInterfaceByRole } from 'step-definitions/utils';
import { schoolAdminGoToCourseDetail } from 'test-suites/common/step-definitions/course-definitions';

Given(
    '{string} has opened location popup',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} has opened location popup`, async function () {
            await openLocationPopup(cms);
        });
    }
);

When(
    '{string} selects {string} location of parent location in location popup',
    async function (this: IMasterWorld, role: AccountRoles, locationLevel: LocationLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} selects ${locationLevel} location of parent location in location popup`,
            async function () {
                await schoolAdminSelectLocationOfParentLocation(cms, scenario, locationLevel);
            }
        );
    }
);

Then(
    '{string} sees {string} location is in checked mode in Course',
    async function (this: IMasterWorld, role: AccountRoles, locationLevel: LocationLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees ${locationLevel} location is in checked mode in Course`,
            async function () {
                await schoolAdminSeesLocationWithTypeMatchModeInCourse(
                    cms,
                    scenario,
                    locationLevel,
                    'checked'
                );
            }
        );
    }
);

Then(
    '{string} sees their parent location of {string} is in {string} mode',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        locationLevel: LocationLevel,
        mode: LocationCheckBoxMode
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees their parent location of '${locationLevel}' is in '${mode}' mode`,
            async function () {
                await schoolAdminSeesLocationParentWithTypeMatchModeInCourse(
                    cms,
                    scenario,
                    locationLevel,
                    mode
                );
            }
        );
    }
);

Then(
    '{string} sees {string} location in selected field in Course',
    async function (this: IMasterWorld, role: AccountRoles, locationLevel: LocationLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees ${locationLevel} location in selected field in Course`,
            async function () {
                await schoolAdminSeesLocationChildrenWithTypeInSelectedField(
                    cms,
                    scenario,
                    locationLevel
                );
            }
        );
    }
);

When(
    `{string} saves selected location in location popup`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} saves selected location in location popup`,
            async function () {
                await saveLocationPopup(cms);
            }
        );
    }
);

When(
    `{string} sees {string} location in location field`,
    {
        timeout: 90000,
    },
    async function (this: IMasterWorld, role: AccountRoles, locationLevel: LocationLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await cms.instruction(
            `${role} sees ${locationLevel} location in location field`,
            async function () {
                await schoolAdminSeesChildrenLocationInLocationField(cms, scenario, locationLevel);
            }
        );
    }
);

Then(
    `{string} does not see their parent location of {string} in location field`,
    {
        timeout: 90000,
    },
    async function (this: IMasterWorld, role: AccountRoles, locationLevel: LocationLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await cms.instruction(
            `${role} does not see their parent location of ${locationLevel} in location field`,
            async function () {
                await schoolAdminNotSeesParentLocationInLocationField(cms, scenario, locationLevel);
            }
        );
    }
);

Then(
    '{string} does not see parent location of {string} in selected field in Course',
    async function (this: IMasterWorld, role: AccountRoles, locationLevel: LocationLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} does not see parent location of ${locationLevel} in selected field in Course`,
            async function () {
                await schoolAdminSeesLocationParentWithTypeNotInSelectedField(
                    cms,
                    scenario,
                    locationLevel
                );
            }
        );
    }
);

When(
    '{string} goes to detail course page under setting tab',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        const courseName = this.scenario.get<string>(aliasCourseName);

        await cms.instruction(`${role} goes to detail course page`, async function () {
            await schoolAdminGoToCourseDetail(cms, courseName);
        });

        await cms.instruction(`${role} goes to setting tab`, async function () {
            await cms.selectElementByDataTestId(courseDetailsSettingTab);
        });
    }
);

Then(
    '{string} sees {string} in location field in detail course page',
    async function (this: IMasterWorld, role: AccountRoles, locationLevel: LocationLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees ${locationLevel} in location field in detail course page`,
            async function () {
                await schoolAdminSeesLocationInCourseDetail(cms, scenario, locationLevel);
            }
        );
    }
);

Then(
    '{string} does not see their parent location of {string} in detail course page',
    async function (this: IMasterWorld, role: AccountRoles, locationLevel: LocationLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees ${locationLevel} in location field in detail course page`,
            async function () {
                await schoolAdminNotSeesLocationInCourseDetail(cms, scenario, locationLevel);
            }
        );
    }
);
