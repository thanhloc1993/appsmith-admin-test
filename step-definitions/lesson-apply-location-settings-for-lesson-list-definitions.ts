import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';
import { dialogWithHeaderFooterButtonExit } from '@user-common/cms-selectors/students-page';

import { Page } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasLessonId } from './alias-keys/lesson';
import { profileButtonSelector } from './cms-selectors/appbar';
import {
    buttonPreviousPageTable,
    cancelDialogButton,
    checkBoxLocation,
    saveDialogButton,
    selectedLocationSelector,
    tableBaseRowWithId,
    tableFooterCaption,
    userMenuSettingButton,
} from './cms-selectors/cms-keys';
import {
    convertOneOfStringTypeToArray,
    getUserProfileFromContext,
    pick1stElement,
    randomInteger,
    retrieveLocations,
} from './utils';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';

export async function openLocationSettingInCMS(cms: CMSInterface) {
    await cms.selectElementByDataTestId(profileButtonSelector);
    await cms.selectElementByDataTestId(userMenuSettingButton);
}

export async function appliedLocation(cms: CMSInterface, locationId: string, type: string) {
    await cms.waitForSkeletonLoading();
    await selectLocation(cms, locationId, type);
    await cms.selectElementByDataTestId(saveDialogButton);
}

export async function selectLocation(cms: CMSInterface, locationId: string, type: string) {
    const page = cms.page!;
    switch (type) {
        case 'one child location of parent': {
            await clickLocationCheckbox(page, locationId);
            break;
        }
        case 'all child locations of parent': {
            await handleAllChildLocationsOfParent(cms, locationId);
            break;
        }
        case 'one parent': {
            await handleOnParent(cms, locationId);
            break;
        }
        case 'org': {
            await handleOrg(cms);
            break;
        }
    }
}

export async function checkFirstLessonPage(cms: CMSInterface) {
    const page = cms.page!;
    const buttonPreviousPaging = await page.waitForSelector(buttonPreviousPageTable);
    const isDisabledButtonPreviousPaging = await buttonPreviousPaging?.isDisabled();
    weExpect(isDisabledButtonPreviousPaging).toEqual(true);

    const caption = await cms.getTextContentElement(tableFooterCaption);
    weExpect(caption, 'is first lesson page').toContain('1-');
}

export async function checkLocationNameDisplayUnderProfileName(
    cms: CMSInterface,
    locationId: string,
    order: string
) {
    const page = cms.page!;
    const selectedLocation = await page.waitForSelector(selectedLocationSelector);
    const selectedLocationText = await selectedLocation.textContent();
    let expectedText = '';
    switch (order) {
        case 'one child': {
            expectedText = await handleOneChildOrder(cms, locationId);
            break;
        }
        case 'one smallest id child location along with number of remained child': {
            expectedText = await handleAllChildLocationsOfParentOrder(cms, locationId);
            break;
        }
        case 'one parent location and one smallest id child location along with number of remained child': {
            expectedText = await handleOneParentOrder(cms, locationId);
            break;
        }
        case 'org and one smallest id parent location along with number of remained parent and one smallest id child location along with number of remained child': {
            expectedText = await handleOrgOrder(cms, locationId);
            break;
        }
    }
    weExpect(selectedLocationText).toEqual(expectedText);
}

export async function cancelApplyingLocation(cms: CMSInterface, option: string) {
    const page = cms.page!;
    const randIndex = randomInteger(0, 1);
    switch (getCancelOption(option, randIndex)) {
        case 'cancel button': {
            const cancelButton = await page.waitForSelector(cancelDialogButton);
            await cancelButton.click();
            break;
        }
        case 'X button': {
            const closeButton = await page.waitForSelector(dialogWithHeaderFooterButtonExit);
            await closeButton.click();
            break;
        }
    }
}

export async function checkExistLesson(page: Page, scenario: ScenarioContext) {
    const id = scenario.get(aliasLessonId);
    const learnerProfile = getUserProfileFromContext(
        scenario,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    const input = await page.waitForSelector(LessonManagementKeys.lessonFilterAdvancedSearchInput);
    await input.fill(learnerProfile.name);
    await page.keyboard.press('Enter');
    await page.waitForSelector(tableBaseRowWithId(id));
}

export async function clickLocationCheckbox(page: Page, id: string) {
    const locationCheckbox = await page.waitForSelector(checkBoxLocation(id));
    await locationCheckbox.click();
}

async function handleAllChildLocationsOfParent(cms: CMSInterface, locationId: string) {
    const page = cms.page!;
    const locationList = await retrieveLocations(cms);
    const currentLocation = locationList.find((location) => location.locationId === locationId);
    if (currentLocation) {
        // select parent to select all child
        await clickLocationCheckbox(page, currentLocation.parentLocationId);
        // deselect current location to deselected parent
        await clickLocationCheckbox(page, locationId);
        // select current location
        await clickLocationCheckbox(page, locationId);
    }
}

async function handleOnParent(cms: CMSInterface, locationId: string) {
    const page = cms.page!;
    const locationList = await retrieveLocations(cms);
    const currentLocation = locationList.find((location) => location.locationId === locationId);
    if (currentLocation) {
        await clickLocationCheckbox(page, currentLocation.parentLocationId);
    }
}

async function handleOrg(cms: CMSInterface) {
    const page = cms.page!;
    const locationList = await retrieveLocations(cms);
    const org = locationList.find((location) => location.parentLocationId === '');
    if (org) {
        await clickLocationCheckbox(page, org.locationId);
    }
}

async function handleOneChildOrder(cms: CMSInterface, locationId: string): Promise<string> {
    const locationList = await retrieveLocations(cms);
    const currentLocation = locationList.find((location) => location.locationId === locationId);
    return currentLocation?.name ?? '';
}

async function handleAllChildLocationsOfParentOrder(
    cms: CMSInterface,
    locationId: string
): Promise<string> {
    const locationList = await retrieveLocations(cms);
    const currentLocation = locationList.find((location) => location.locationId === locationId);
    if (currentLocation) {
        const sameParentLocations = locationList.filter(
            (location) => location.parentLocationId === currentLocation.parentLocationId
        );
        const firstLocation = pick1stElement(sameParentLocations);
        let remainedChild = '';
        if (sameParentLocations.length - 1 > 0) {
            remainedChild = ` (+${sameParentLocations.length - 1})`;
        }
        return `${firstLocation?.name ?? ''}${remainedChild}`;
    }
    return '';
}

async function handleOneParentOrder(cms: CMSInterface, locationId: string): Promise<string> {
    const locationList = await retrieveLocations(cms);
    const currentLocation = locationList.find((location) => location.locationId === locationId);
    if (currentLocation) {
        const parentLocation = locationList.find(
            (location) => location.locationId === currentLocation.parentLocationId
        );
        const sameParentLocations = locationList.filter(
            (location) => location.parentLocationId === currentLocation.parentLocationId
        );
        const firstLocation = pick1stElement(sameParentLocations);
        let remainedChild = '';
        if (sameParentLocations.length - 1 > 0) {
            remainedChild = ` (+${sameParentLocations.length - 1})`;
        }
        return `${parentLocation?.name ?? ''} · ${firstLocation?.name ?? ''}${remainedChild}`;
    }
    return '';
}

async function handleOrgOrder(cms: CMSInterface, locationId: string): Promise<string> {
    const locationList = await retrieveLocations(cms);
    const org = locationList.find((location) => location.parentLocationId === '');
    const currentLocation = locationList.find((location) => location.locationId === locationId);
    if (currentLocation) {
        const sameOrgLocations = locationList.filter(
            (location) => location.parentLocationId === org?.locationId
        );
        const firstParent = pick1stElement(sameOrgLocations);

        const sameParentLocations = locationList.filter(
            (location) => location.parentLocationId === firstParent?.locationId
        );
        const firstLocation = pick1stElement(sameParentLocations);

        let remainedChild = '';
        let remainedParent = '';
        const remainedChildNumber = locationList.length - 1 - sameOrgLocations.length - 1;
        if (sameOrgLocations.length - 1 > 0) {
            remainedParent = ` (+${sameOrgLocations.length - 1})`;
        }
        if (remainedChildNumber > 0) {
            remainedChild = ` (+${remainedChildNumber})`;
        }

        return `${org?.name ?? ''} · ${firstParent?.name ?? ''}${remainedParent} · ${
            firstLocation?.name ?? ''
        }${remainedChild}`;
    }
    return '';
}

export function getCancelOption(pages: string, index: number): CancelOption {
    const sections = convertOneOfStringTypeToArray(pages);
    const section = sections[index] as CancelOption;
    return section;
}

export type CancelOption = 'cancel button' | 'X button';
