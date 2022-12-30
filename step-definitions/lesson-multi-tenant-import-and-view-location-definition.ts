import { Page } from 'playwright';

import { CMSInterface, Tenant } from '@supports/app-types';
import { LocationItemCheckBoxStatus, Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';

import { ByValueKey, FlutterDriver } from 'flutter-driver-x';
import { RetrieveLocationsResponse } from 'manabuf/bob/v1/masterdata_pb';
import {
    aliasLocationIdWithTenant,
    aliasLocationNameWithTenant,
    aliasLocationsListWithTenant,
} from 'step-definitions/alias-keys/lesson';
import { checkBoxLocation } from 'step-definitions/cms-selectors/cms-keys';
import { locationLabelInLocationPopupOfCourse } from 'step-definitions/cms-selectors/lesson';
import { locationsLowestLevelAutocompleteInput } from 'step-definitions/cms-selectors/lesson-management';
import {
    openCreateCoursePage,
    openLocationPopup,
} from 'step-definitions/lesson-create-course-with-teaching-method-definitions';
import {
    focusAnFillKeywordToInputFieldCenterLocations,
    selectCenterFromOptionInAutoCompleteBoxByPosition,
} from 'step-definitions/lesson-search-center-in-center-field-of-lesson-definitions';
import { TeacherKeys } from 'step-definitions/teacher-keys/teacher-keys';
import { retrieveLocations } from 'step-definitions/utils';
import { openCreateLessonPage } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { createRandomLocations } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export async function userImportLocationWithTenant(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    tenant: Tenant
) {
    const { importLocations, locationGRPC } = await createRandomLocations(cms, 1);
    const locationsList = await retrieveLocations(cms); // for checking the other tenant location's exist in a certain tenant

    scenarioContext.set(aliasLocationsListWithTenant(tenant), locationsList);
    scenarioContext.set(aliasLocationNameWithTenant(tenant), importLocations[0].name);
    scenarioContext.set(aliasLocationIdWithTenant(tenant), locationGRPC[0].locationId);
}

export async function userOpenLocationPopupInCoursePage(cms: CMSInterface) {
    await cms.schoolAdminIsOnThePage(Menu.COURSES, 'Course');
    await openCreateCoursePage(cms);
    await openLocationPopup(cms);
}

export async function assertNotSeeOtherTenantLocationInCourse(
    page: Page,
    otherTenantLocationName: string
) {
    const isOtherTenantLocationVisible = await page.isVisible(
        locationLabelInLocationPopupOfCourse(otherTenantLocationName)
    );
    weExpect(
        isOtherTenantLocationVisible,
        'does not see location of other tenant in location popup on CMS'
    ).toBe(false);
}

export async function assertNotSeeOtherTenantLocationInLocationSettingOnNav(
    page: Page,
    otherTenantLocationId: string
) {
    const isOtherTenantLocationVisible = await page
        .locator(checkBoxLocation(otherTenantLocationId))
        .isVisible();
    weExpect(isOtherTenantLocationVisible).toBe(false);
}

export async function openCenterDropDownListAndSelectCenterInCreatingLessonPage(
    cms: CMSInterface,
    tenantLocationName: string
) {
    // open create lesson
    await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    await openCreateLessonPage(cms);

    // fill center name
    await focusAnFillKeywordToInputFieldCenterLocations(cms, tenantLocationName);
    await cms.waitingAutocompleteLoading();
    await selectCenterFromOptionInAutoCompleteBoxByPosition(cms, 1);
}

export async function assertNotSeeOtherTenantLocationInDropDownList(
    cms: CMSInterface,
    otherTenantLocationName: string
) {
    // fill center name
    await focusAnFillKeywordToInputFieldCenterLocations(cms, otherTenantLocationName);
    await cms.waitingAutocompleteLoading();
    await selectCenterFromOptionInAutoCompleteBoxByPosition(cms, 1);

    // check location name
    const centerAutocompleteInputValue = await cms.page!.inputValue(
        locationsLowestLevelAutocompleteInput
    );
    weExpect(centerAutocompleteInputValue).not.toEqual(otherTenantLocationName);
}

export async function assertSeeLocationInLocationSettingOnTeacherApp(
    driver: FlutterDriver,
    tenantLocationId: string
) {
    const listKey = new ByValueKey(TeacherKeys.locationTreeViewScrollView);

    const itemKey = new ByValueKey(
        TeacherKeys.locationCheckStatus(tenantLocationId, LocationItemCheckBoxStatus.unCheck)
    );
    await driver.scrollUntilVisible(listKey, itemKey, 0.0, 0.0, -6000, 100000);
}

export async function assertNotSeeLocationInLocationSettingOnTeacherApp(
    scenarioContext: ScenarioContext,
    currentTenant: Tenant,
    otherTenantLocationId: string
) {
    const currentTenantLocationsList = scenarioContext.get<
        RetrieveLocationsResponse.Location.AsObject[]
    >(aliasLocationsListWithTenant(currentTenant));

    const checkedLocationId = currentTenantLocationsList.find(
        (location) => location.locationId === otherTenantLocationId
    );
    weExpect(checkedLocationId).toBeUndefined();
}
