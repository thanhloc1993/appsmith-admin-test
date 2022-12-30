import { CMSInterface } from '@supports/app-types';

import {
    appBarProfileButton,
    locationSettingCheckboxById,
    locationSettingDialog,
    locationSettingOption,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { waitRetrieveLocationsResponse } from 'test-suites/squads/lesson/utils/grpc-responses';

export async function openLocationSettingOnCMS(cms: CMSInterface) {
    const page = cms.page!;
    await page.locator(appBarProfileButton).click();

    await Promise.all([
        waitRetrieveLocationsResponse(cms),
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
    await clickLocationCheckbox(cms, locationId);
    await cms.selectAButtonByAriaLabel('Save');
}
