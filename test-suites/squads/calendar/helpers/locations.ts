import { retrieveLocations } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';

import {
    appBarProfileButton,
    locationCheckBox,
    locationSettingCheckboxById,
    locationSettingDialog,
    locationSettingOption,
} from 'test-suites/squads/calendar/common/cms-selectors';
import { waitRetrieveLocationsResponse } from 'test-suites/squads/calendar/helpers/grpc-responses';

export async function openLocationSettingOnCMS(cms: CMSInterface) {
    const page = cms.page!;
    await page.locator(appBarProfileButton).click();

    await Promise.all([
        waitRetrieveLocationsResponse(cms),
        cms.waitForSkeletonLoading(),
        page.waitForSelector(locationSettingDialog),
        page.locator(locationSettingOption).click(),
    ]);
}

export async function clickLocationCheckbox(cms: CMSInterface, locationId: string) {
    const locationCheckbox = cms.page!.locator(locationSettingCheckboxById(locationId));
    await locationCheckbox.scrollIntoViewIfNeeded();
    await locationCheckbox.click();
}

export async function applyLocationOnCMS(cms: CMSInterface, locationId: string) {
    await openLocationSettingOnCMS(cms);

    const checkBox = await cms.page!.waitForSelector(locationCheckBox(locationId));

    if (!checkBox) throw new Error("Can't get checkbox value");

    const isChecked = await checkBox.isChecked();

    if (!isChecked) await clickLocationCheckbox(cms, locationId);

    await cms.selectAButtonByAriaLabel('Save');
}

export async function applyHighestLevelLocationOnCMS(cms: CMSInterface) {
    const locationsList = await retrieveLocations(cms);
    const highestLevelLocation = locationsList.find((location) => !location.parentLocationId);

    if (highestLevelLocation?.locationId) {
        await applyLocationOnCMS(cms, highestLevelLocation.locationId);
    }
}
