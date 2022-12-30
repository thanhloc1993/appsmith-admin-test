import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import {
    aliasAllParentLocations,
    aliasChildLocation,
    aliasChildrenLocation,
    aliasOrgLocation,
    aliasParentLocation,
} from './alias-keys/lesson';
import { profileButtonSelector } from './cms-selectors/appbar';
import {
    checkBoxCheckedIcon,
    checkBoxIndeterminateIcon,
    checkBoxLocation,
    selectLocationField,
    userMenuSettingButton,
} from './cms-selectors/cms-keys';
import { retrieveLocations, retrieveLowestLocations } from './utils';
import { clickOnSaveInDialog } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export type LocationSelectedLevel = 'one child' | 'all children' | 'one parent' | 'all parents';
// Hardcode location
export const orgLocationName = 'End-to-end';

export const parentLocationName = 'Ho Chi Minh City';
export const parentLocationNames = ['E2E Testing', 'Ha Noi', parentLocationName, 'Da Nang'];
export const oneChildLocationName = 'Center Go Vap';
export const allChildrenLocationNames = [
    'Center District 1',
    'Center District 2',
    'Center District 3',
    'Center District 4',
    'Center District 5',
    'Center District 6',
    'Center District 7',
    'Center District 8',
    'Center District 9',
    'Center District 10',
    'Center Go Vap',
    'Center Binh Thanh',
    'Center Phu Nhuan',
    'Center Tan Binh',
    'Center Tan Phu',
];

export async function schoolAdminOpensLocationSettingsInNavBar(cms: CMSInterface) {
    await cms.selectElementByDataTestId(profileButtonSelector);
    await cms.selectElementByDataTestId(userMenuSettingButton);
}

export async function schoolAdminSelectsOrgLocation(cms: CMSInterface, scenario: ScenarioContext) {
    const orgLocation = await getLocationByName(cms, orgLocationName);
    scenario.set(aliasOrgLocation, orgLocation);
    await cms.selectElementByDataTestId(checkBoxLocation(orgLocation?.locationId));
}

export async function schoolAdminSelectsParentLocation(
    cms: CMSInterface,
    scenario: ScenarioContext,
    type: LocationSelectedLevel
) {
    switch (type) {
        case 'one parent': {
            const parentLocation = await getLocationByName(cms, parentLocationName);
            scenario.set(aliasParentLocation, parentLocation);
            await cms.selectElementByDataTestId(checkBoxLocation(parentLocation?.locationId));
            break;
        }
        case 'all parents': {
            const parentLocations = await getLocationByNames(cms, parentLocationNames);
            scenario.set(aliasAllParentLocations, parentLocations);
            for (const location of parentLocations) {
                await cms.selectElementByDataTestId(checkBoxLocation(location.locationId));
            }
            break;
        }
    }
}

export async function schoolAdminSelectsLocationOfParentLocation(
    cms: CMSInterface,
    scenario: ScenarioContext,
    type: LocationSelectedLevel
) {
    const oneChildLocation = await getLocationByName(cms, oneChildLocationName);
    const allChildrenLocation = await getLocationByNames(cms, allChildrenLocationNames);
    const parentLocation = await getParentLocationByName(cms, `${oneChildLocation?.name}`);

    scenario.set(aliasParentLocation, parentLocation);
    scenario.set(aliasChildLocation, oneChildLocation);
    scenario.set(aliasChildrenLocation, allChildrenLocation);

    switch (type) {
        case 'one child':
            await cms.selectElementByDataTestId(checkBoxLocation(oneChildLocation?.locationId));
            break;

        case 'all children':
            for (const location of allChildrenLocation) {
                await cms.selectElementByDataTestId(checkBoxLocation(location.locationId));
            }
            break;
    }
}

export async function schoolAdminSeesLocationIsInCheckedModeWithType(
    cms: CMSInterface,
    scenario: ScenarioContext,
    type: LocationSelectedLevel,
    checked: boolean
) {
    switch (type) {
        case 'one child': {
            const location = scenario.get<LocationInfoGRPC>(aliasChildLocation);
            await schoolAdminSeesLocationIsInCheckedMode(cms, location.locationId, checked);
            break;
        }
        case 'all children': {
            const locations = scenario.get<LocationInfoGRPC[]>(aliasChildrenLocation);
            for (const location of locations)
                await schoolAdminSeesLocationIsInCheckedMode(cms, location.locationId, checked);
            break;
        }
        case 'one parent': {
            const location = scenario.get<LocationInfoGRPC>(aliasParentLocation);
            await schoolAdminSeesLocationIsInCheckedMode(cms, location.locationId, checked);
            break;
        }
        case 'all parents': {
            const locations = scenario.get<LocationInfoGRPC[]>(aliasAllParentLocations);
            for (const location of locations)
                await schoolAdminSeesLocationIsInCheckedMode(cms, location.locationId, checked);
            break;
        }
    }
}

export async function schoolAdminSeesAllParentOfOrgLocationIsInCheckedMode(
    cms: CMSInterface,
    checked: boolean
) {
    const parentLocations = await getLocationByNames(cms, parentLocationNames);
    for (const location of parentLocations) {
        await schoolAdminSeesLocationIsInCheckedMode(cms, location.locationId, checked);
    }
}

export async function schoolAdminSeesAllChildrenOfOrgLocationIsInCheckedMode(
    cms: CMSInterface,
    checked: boolean
) {
    const locations = await retrieveLowestLocations(cms);
    for (const location of locations) {
        await schoolAdminSeesLocationIsInCheckedMode(cms, location.locationId, checked);
    }
}

export async function schoolAdminSeesChildrenLocationIsInCheckedModeWithType(
    cms: CMSInterface,
    scenario: ScenarioContext,
    type: LocationSelectedLevel,
    checked: boolean
) {
    const locations = await retrieveLowestLocations(cms);
    switch (type) {
        case 'one parent': {
            const allChildrenLocation: LocationInfoGRPC[] = [];
            for (const location of locations) {
                if (allChildrenLocationNames.includes(location.name))
                    allChildrenLocation.push(location);
            }
            scenario.set(aliasChildrenLocation, allChildrenLocation);
            for (const location of allChildrenLocation) {
                await schoolAdminSeesLocationIsInCheckedMode(cms, location.locationId, checked);
            }
            break;
        }
        case 'all parents': {
            scenario.set(aliasChildrenLocation, locations);
            for (const location of locations)
                await schoolAdminSeesLocationIsInCheckedMode(cms, location.locationId, checked);
            break;
        }
    }
}

export async function schoolAdminSeesLocationIsInCheckedMode(
    cms: CMSInterface,
    locationId: string,
    checked: boolean
) {
    const page = cms.page!;
    const checkBox = await page.waitForSelector(checkBoxLocation(locationId));
    if (checked) {
        await checkBox.waitForSelector(checkBoxCheckedIcon);
    } else {
        await checkBox.waitForSelector(checkBoxCheckedIcon, { state: 'hidden' });
    }
}

export async function schoolAdminSeesLocationIsInIndeterminateMode(
    cms: CMSInterface,
    locationId: string,
    indeterminate: boolean
) {
    const page = cms.page!;
    const checkBox = await page.waitForSelector(checkBoxLocation(locationId));
    await checkBox.waitForSelector(checkBoxIndeterminateIcon(indeterminate));
}

export async function schoolAdminSeesSelectedLocationInSelectFieldWithType(
    cms: CMSInterface,
    scenario: ScenarioContext,
    type: LocationSelectedLevel
) {
    const locations: LocationInfoGRPC[] = [];
    switch (type) {
        case 'one child': {
            const location = scenario.get<LocationInfoGRPC>(aliasChildLocation);
            locations.push(location);
            break;
        }
        case 'all children': {
            const childrenLocation = scenario.get<LocationInfoGRPC[]>(aliasChildrenLocation);
            for (const child of childrenLocation) {
                locations.push(child);
            }
            break;
        }
        case 'one parent': {
            const location = scenario.get<LocationInfoGRPC>(aliasParentLocation);
            locations.push(location);
            break;
        }
        case 'all parents': {
            const parentLocations = scenario.get<LocationInfoGRPC[]>(aliasAllParentLocations);
            for (const child of parentLocations) {
                locations.push(child);
            }
            break;
        }
    }
    await cms.instruction(
        `School Admin sees ${type} location in selected field`,
        async function () {
            for (const location of locations) {
                await schoolAdminSeesSelectedLocationInSelectField(cms, location.name, true);
            }
        }
    );
}

export async function schoolAdminSeesSelectedLocationInSelectField(
    cms: CMSInterface,
    locationName: string,
    visible: boolean
) {
    if (visible) {
        await cms.waitForSelectorHasText(selectLocationField, locationName);
    } else {
        await cms.waitForSelectorHasTextWithOptions(selectLocationField, locationName, {
            state: 'hidden',
        });
    }
}

export async function schoolAdminSeesSelectedChildrenLocationInSelectField(
    cms: CMSInterface,
    locationName: string[],
    visible: boolean
) {
    for (const location of locationName) {
        if (visible) {
            await cms.waitForSelectorHasText(selectLocationField, location);
        } else {
            await cms.waitForSelectorHasTextWithOptions(selectLocationField, location, {
                state: 'hidden',
            });
        }
    }
}

export async function schoolAdminSeesParentLocationOfOrgLocationInSelectField(
    cms: CMSInterface,
    visible: boolean
) {
    const parentLocations = await getLocationByNames(cms, parentLocationNames);
    for (const location of parentLocations) {
        if (visible) {
            await cms.waitForSelectorHasText(selectLocationField, location.name);
        } else {
            await cms.waitForSelectorHasTextWithOptions(selectLocationField, location.name, {
                state: 'hidden',
            });
        }
    }
}

export async function schoolAdminSeesChildrenLocationOfOrgLocationInSelectField(
    cms: CMSInterface,
    visible: boolean
) {
    const locations = await retrieveLowestLocations(cms);
    for (const location of locations) {
        if (visible) {
            await cms.waitForSelectorHasText(selectLocationField, location.name);
        } else {
            await cms.waitForSelectorHasTextWithOptions(selectLocationField, location.name, {
                state: 'hidden',
            });
        }
    }
}

export async function getLocationByName(cms: CMSInterface, locationName: string) {
    const locations = await retrieveLocations(cms);
    for (const location of locations) {
        if (locationName === location.name) return location;
    }
    return undefined;
}

export async function getLocationByNames(cms: CMSInterface, locationNames: string[]) {
    const result: LocationInfoGRPC[] = [];
    const locations = await retrieveLocations(cms);
    for (const location of locations) {
        if (locationNames.includes(location.name)) result.push(location);
    }
    return result;
}

export async function getParentLocationByName(cms: CMSInterface, locationName: string) {
    const locations = await retrieveLocations(cms);
    const childLocation = locations.find((location) => location.name === locationName);
    if (!childLocation) throw Error('something');

    const parentLocation = locations.find(
        (location) => location.locationId === childLocation.parentLocationId
    );
    return parentLocation;
}

export async function getParentLocationByNames(cms: CMSInterface, locationNames: string[]) {
    const result: LocationInfoGRPC[] = [];
    const locations = await retrieveLocations(cms);
    const parentLocationIds: string[] = [];
    for (const location of locations) {
        if (locationNames?.includes(location.name)) {
            parentLocationIds.push(location.parentLocationId);
        }
    }
    for (const location of locations) {
        if (parentLocationIds.includes(location.locationId)) result.push(location);
    }
    return result;
}

export async function selectOneLocation(cms: CMSInterface, locationId: string) {
    await schoolAdminOpensLocationSettingsInNavBar(cms);

    const checkBox = await cms.page!.waitForSelector(checkBoxLocation(locationId));

    await checkBox?.scrollIntoViewIfNeeded();

    await cms.selectElementByDataTestId(checkBoxLocation(locationId));

    await clickOnSaveInDialog(cms);
}
