import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasChildLocation, aliasChildrenLocation } from 'step-definitions/alias-keys/lesson';
import * as CMSKeys from 'step-definitions/cms-selectors/cms-keys';
import {
    getLocationByLocationId,
    LocationCheckBoxMode,
    LocationLevel,
    LocationResponse,
} from 'step-definitions/lesson-create-course-with-teaching-method-definitions';
import { retrieveLocations } from 'step-definitions/utils';

export const limitLocationSelected = 5;
export const limitLocationInLocationField = 10;

export function getLocationsByLocationLevel(
    scenarioContext: ScenarioContext,
    locationLevel: LocationLevel
) {
    const locations =
        locationLevel === 'one child'
            ? [scenarioContext.get<LocationResponse>(aliasChildLocation)]
            : scenarioContext.get<LocationResponse[]>(aliasChildrenLocation);

    if (!locations) throw new Error('locations not found');

    return locations;
}

export async function checkLocationCheckBoxMatchMode(
    cms: CMSInterface,
    locations: LocationResponse[],
    mode: LocationCheckBoxMode
) {
    if (mode === 'indeterminate') {
        await cms.page!.waitForSelector(CMSKeys.checkBoxIndeterminateIcon(true));
    } else {
        for (const location of locations) {
            const checkBox = await cms.page!.waitForSelector(
                CMSKeys.locationCheckBox(location.locationId)
            );

            if (!checkBox) throw new Error("Can't get checkbox value");

            const isChecked = await checkBox.isChecked();
            weExpect(isChecked, 'location checkbox should be checked').toEqual(true);
        }
    }
}

export async function getParentLocationByChildrenLocation(
    cms: CMSInterface,
    childrenLocation: LocationResponse[]
) {
    const locationIds = await retrieveLocations(cms);

    const parentLocation: LocationResponse[] = [];
    const parentLocationIds: string[] = [];

    for (const location of childrenLocation) {
        const locationDetail = getLocationByLocationId(locationIds, location.parentLocationId);

        if (parentLocationIds.includes(locationDetail.locationId)) {
            parentLocationIds.push(locationDetail.locationId);
            parentLocation.push(locationDetail);
        }
    }

    return parentLocation;
}

export async function checkLocationIsInSelectedField(
    cms: CMSInterface,
    locations: LocationResponse[],
    visible: boolean,
    isPopup: boolean
) {
    const locationFieldKey = isPopup
        ? CMSKeys.locationSelectedField
        : CMSKeys.locationSelectorCreateCourse;
    const content = await cms.getTextContentElement(locationFieldKey);

    if (!content) throw new Error('UI not display location selected');

    const locationLength = locations.length;
    const displayLimit = isPopup ? limitLocationSelected : limitLocationInLocationField;
    let locationIndex = 0;

    for (const location of locations) {
        weExpect(
            visible,
            `${location.name} is ${visible ? 'not' : ''} in the location field`
        ).toEqual(content.includes(location.name));

        locationIndex++;
        if (locationIndex === displayLimit) break;
    }

    if (locationLength > locationIndex) {
        const [limitLocationStr] = content.match(/\+[0-9]*$/g) || [];

        if (!limitLocationStr) throw new Error('UI not display location chip limit');

        const locationChipLimitValue = parseInt(limitLocationStr.replace('+', ''));

        weExpect(locationChipLimitValue).toEqual(locationLength - locationIndex);
    }
}

export async function locationIsInCourseDetail(
    cms: CMSInterface,
    locations: LocationResponse[],
    visible: boolean
) {
    const content = await cms.getTextContentElement(CMSKeys.locationSettingTa);

    if (!content) throw new Error('UI not display location selected');

    for (const location of locations) {
        weExpect(
            visible,
            `${location.name} is ${visible ? 'not' : ''} in the location field`
        ).toEqual(content.includes(location.name));
    }
}

export async function schoolAdminSeesLocationWithTypeMatchModeInCourse(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locationLevel: LocationLevel,
    mode: LocationCheckBoxMode
) {
    const locations = getLocationsByLocationLevel(scenarioContext, locationLevel);
    await checkLocationCheckBoxMatchMode(cms, locations, mode);
}

export async function schoolAdminSeesLocationParentWithTypeMatchModeInCourse(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locationLevel: LocationLevel,
    mode: LocationCheckBoxMode
) {
    const childrenLocation = getLocationsByLocationLevel(scenarioContext, locationLevel);
    const parentLocation = await getParentLocationByChildrenLocation(cms, childrenLocation);
    await checkLocationCheckBoxMatchMode(cms, parentLocation, mode);
}

export async function schoolAdminSeesLocationChildrenWithTypeInSelectedField(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locationLevel: LocationLevel
) {
    const locations = getLocationsByLocationLevel(scenarioContext, locationLevel);
    await checkLocationIsInSelectedField(cms, locations, true, true);
}

export async function schoolAdminSeesLocationParentWithTypeNotInSelectedField(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locationLevel: LocationLevel
) {
    const childrenLocation = getLocationsByLocationLevel(scenarioContext, locationLevel);
    const parentLocation = await getParentLocationByChildrenLocation(cms, childrenLocation);
    await checkLocationIsInSelectedField(cms, parentLocation, false, true);
}

export async function schoolAdminSeesChildrenLocationInLocationField(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locationLevel: LocationLevel
) {
    const selectedLocations = getLocationsByLocationLevel(scenarioContext, locationLevel);
    await checkLocationIsInSelectedField(cms, selectedLocations, true, false);
}

export async function schoolAdminNotSeesParentLocationInLocationField(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locationLevel: LocationLevel
) {
    const childrenLocation = getLocationsByLocationLevel(scenarioContext, locationLevel);
    const parentLocation = await getParentLocationByChildrenLocation(cms, childrenLocation);
    await checkLocationIsInSelectedField(cms, parentLocation, false, false);
}

export async function schoolAdminSeesLocationInCourseDetail(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locationLevel: LocationLevel
) {
    const selectedLocations = getLocationsByLocationLevel(scenarioContext, locationLevel);
    await locationIsInCourseDetail(cms, selectedLocations, true);
}

export async function schoolAdminNotSeesLocationInCourseDetail(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locationLevel: LocationLevel
) {
    const childrenLocation = getLocationsByLocationLevel(scenarioContext, locationLevel);
    const parentLocation = await getParentLocationByChildrenLocation(cms, childrenLocation);
    await locationIsInCourseDetail(cms, parentLocation, false);
}
