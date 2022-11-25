import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import {
    assertLocationIsSelected,
    deselectLocationById,
    schoolAdminSeesFirstGrantedLocation,
    schoolAdminSeesListStudentMatchLocation,
    seeErrorSnackbar,
    seeLocationSettingDialog,
} from './architecture-auto-select-first-granted-location-definitions';

Then(
    '{string} sees first granted location name under user name',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await cms.instruction(
            `${role} sees first granted location name under user name`,
            async function () {
                await schoolAdminSeesFirstGrantedLocation(cms, scenario);
            }
        );
    }
);

Then(
    '{string} sees student list which matches first granted location',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const firstGrantedLocation = scenario.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

        await cms.instruction(
            `${role} sees student list which matches first granted location`,
            async function () {
                await schoolAdminSeesListStudentMatchLocation(
                    cms,
                    firstGrantedLocation?.name || ''
                );
            }
        );
    }
);

Then(
    '{string} sees first granted location is checked',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const firstGrantedLocation = scenario.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

        await cms.instruction(`${role} sees first granted location is checked`, async function () {
            await assertLocationIsSelected(cms, firstGrantedLocation.locationId);
        });
    }
);

When(
    '{string} deselects first granted location',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const firstGrantedLocation = scenario.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

        await cms.instruction(`${role} deselects first granted location`, async function () {
            await deselectLocationById(cms, firstGrantedLocation.locationId);
        });
    }
);

When(
    '{string} save location setting dialog',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} save location setting dialog`, async function () {
            await cms.confirmDialogAction();
        });
    }
);

Then(
    '{string} still sees location setting dialog',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} still sees location setting dialog`, async function () {
            await seeLocationSettingDialog(cms);
        });
    }
);

Then('{string} sees error snackbar', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} sees snackbar error message`, async function () {
        await seeErrorSnackbar(cms);
    });
});
