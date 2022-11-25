import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import { aliasChildrenLocation, aliasOrgLocation, aliasParentLocation } from './alias-keys/lesson';
import {
    getLocationByName,
    LocationSelectedLevel,
    orgLocationName,
    schoolAdminOpensLocationSettingsInNavBar,
    schoolAdminSeesAllChildrenOfOrgLocationIsInCheckedMode,
    schoolAdminSeesAllParentOfOrgLocationIsInCheckedMode,
    schoolAdminSeesChildrenLocationIsInCheckedModeWithType,
    schoolAdminSeesChildrenLocationOfOrgLocationInSelectField,
    schoolAdminSeesLocationIsInCheckedMode,
    schoolAdminSeesLocationIsInCheckedModeWithType,
    schoolAdminSeesLocationIsInIndeterminateMode,
    schoolAdminSeesParentLocationOfOrgLocationInSelectField,
    schoolAdminSeesSelectedChildrenLocationInSelectField,
    schoolAdminSeesSelectedLocationInSelectField,
    schoolAdminSeesSelectedLocationInSelectFieldWithType,
    schoolAdminSelectsLocationOfParentLocation,
    schoolAdminSelectsOrgLocation,
    schoolAdminSelectsParentLocation,
} from './lesson-select-and-view-location-in-location-setting-popup-navbar-definitions';
import { getCMSInterfaceByRole } from './utils';

Given('{string} has open location settings in nav bar on CMS', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(
        `${role} has open location settings in nav bar on CMS`,
        async function () {
            await schoolAdminOpensLocationSettingsInNavBar(cms);
        }
    );
});

When(
    '{string} selects {string} location of parent location in location setting',
    async function (role: AccountRoles, type: LocationSelectedLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await cms.instruction(
            `${role} selects ${type} location of parent location in location setting`,
            async function () {
                await schoolAdminSelectsLocationOfParentLocation(cms, scenario, type);
            }
        );
    }
);

When(
    '{string} selects {string} location in location setting',
    async function (role: AccountRoles, type: LocationSelectedLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await cms.instruction(
            `${role} selects ${type} location in location setting`,
            async function () {
                await schoolAdminSelectsParentLocation(cms, scenario, type);
            }
        );
    }
);

When('{string} selects org location in location setting', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;
    await cms.instruction(`${role} selects org location in location setting`, async function () {
        await schoolAdminSelectsOrgLocation(cms, scenario);
    });
});

Then(
    '{string} sees {string} location is in checked mode',
    async function (role: AccountRoles, type: LocationSelectedLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario!;
        await cms.instruction(
            `${role} sees ${type} location is in checked mode`,
            async function () {
                await schoolAdminSeesLocationIsInCheckedModeWithType(cms, scenario, type, true);
            }
        );
    }
);

Then('{string} sees org location is in checked mode', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const orgLocation = this.scenario!.get<LocationInfoGRPC>(aliasOrgLocation);
    await cms.instruction(`${role} sees org location is in checked mode`, async function () {
        await schoolAdminSeesLocationIsInCheckedMode(cms, orgLocation.locationId, true);
    });
});

Then(
    '{string} sees all parent of org locations is in checked mode',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees all parent of org locations is in checked mode`,
            async function () {
                await schoolAdminSeesAllParentOfOrgLocationIsInCheckedMode(cms, true);
            }
        );
    }
);

Then(
    '{string} sees all children of org locations is in checked mode',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees all children of org locations is in checked mode`,
            async function () {
                await schoolAdminSeesAllChildrenOfOrgLocationIsInCheckedMode(cms, true);
            }
        );
    }
);

Then(
    '{string} sees {string} children location is in checked mode',
    async function (role: AccountRoles, type: LocationSelectedLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario!;
        await cms.instruction(
            `${role} sees ${type} children location is in checked mode`,
            async function () {
                await schoolAdminSeesChildrenLocationIsInCheckedModeWithType(
                    cms,
                    scenario,
                    type,
                    true
                );
            }
        );
    }
);

Then(
    '{string} sees their parent location is in indeterminate mode',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const parentLocation = this.scenario!.get<LocationInfoGRPC>(aliasParentLocation);
        await cms.instruction(
            `${role} sees their parent location is in indeterminate mode`,
            async function () {
                await schoolAdminSeesLocationIsInIndeterminateMode(
                    cms,
                    parentLocation.locationId,
                    true
                );
            }
        );
    }
);

Then('{string} sees org location is in indeterminate mode', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} sees org location is in indeterminate mode`, async function () {
        const orgLocation = await getLocationByName(cms, orgLocationName);
        await schoolAdminSeesLocationIsInIndeterminateMode(cms, orgLocation!.locationId, true);
    });
});

Then(
    '{string} sees {string} location in selected field',
    async function (role: AccountRoles, type: LocationSelectedLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario!;
        await schoolAdminSeesSelectedLocationInSelectFieldWithType(cms, scenario, type);
    }
);

Then(
    '{string} does not see their parent location in selected field',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const parentLocation = this.scenario!.get<LocationInfoGRPC>(aliasParentLocation);
        await cms.instruction(
            `${role} does not see their parent location in selected field`,
            async function () {
                await schoolAdminSeesSelectedLocationInSelectField(cms, parentLocation.name, false);
            }
        );
    }
);

Then(
    '{string} does not see {string} children location in selected field',
    async function (role: AccountRoles, type: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const childrenLocation = this.scenario!.get<LocationInfoGRPC[]>(aliasChildrenLocation);
        const childrenLocationNames = childrenLocation.map((element) => element.name);
        await cms.instruction(
            `${role} does not see ${type} children location in selected field`,
            async function () {
                await schoolAdminSeesSelectedChildrenLocationInSelectField(
                    cms,
                    childrenLocationNames,
                    false
                );
            }
        );
    }
);

Then('{string} sees org location in selected field', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} sees org location in selected field`, async function () {
        await schoolAdminSeesSelectedLocationInSelectField(cms, orgLocationName, true);
    });
});

Then('{string} does not see org location in selected field', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} does not see org location in selected field`, async function () {
        await schoolAdminSeesSelectedLocationInSelectField(cms, orgLocationName, false);
    });
});

Then(
    '{string} does not see parent location of org location in selected field',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} does not see parent location of org location in selected field`,
            async function () {
                await schoolAdminSeesParentLocationOfOrgLocationInSelectField(cms, false);
            }
        );
    }
);

Then(
    '{string} does not see children location of org location in selected field',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} does not see children location of org location in selected field`,
            async function () {
                await schoolAdminSeesChildrenLocationOfOrgLocationInSelectField(cms, false);
            }
        );
    }
);
