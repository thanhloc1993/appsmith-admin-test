import * as studentKeys from '@user-common/cms-selectors/students-page';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { RetrieveLocationsResponse } from 'manabuf/bob/v1/masterdata_pb';
import {
    aliasChildLocation,
    aliasChildrenLocation,
    aliasCourseName,
    aliasParentLocation,
} from 'step-definitions/alias-keys/lesson';
import * as CMSKeys from 'step-definitions/cms-selectors/cms-keys';
import { courseForm, courseFormName } from 'step-definitions/cms-selectors/course';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';
import { courseTeachingMethod } from 'step-definitions/cms-selectors/lesson-management';
import { getRandomElement, retrieveLocations } from 'step-definitions/utils';
import { clickOnSaveButtonInParentElement } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export type LocationCheckBoxMode = 'checked' | 'indeterminate';
export type LocationLevel = 'one child' | 'all children' | 'one parent';
export type TeachingMethod = 'Individual' | 'Group';
export type LocationResponse = RetrieveLocationsResponse.Location.AsObject;
export const parentLocationNames = ['Ha Noi', 'Ho Chi Minh City', 'Da Nang', 'Brand B', 'Brand 1'];

export async function openCreateCoursePage(cms: CMSInterface) {
    await cms.selectElementByDataTestId(LessonManagementKeys.openUpsertCourseDialog);
}

export async function fillCourseName(
    cms: CMSInterface,
    scenario: ScenarioContext,
    courseName: string
) {
    scenario.set(aliasCourseName, courseName);
    await cms.page!.fill(courseFormName, courseName);
}

export async function openLocationPopup(cms: CMSInterface) {
    await cms.page!.click(CMSKeys.locationSelectorCreateCourse);
    await cms.page!.waitForSelector(CMSKeys.locationDialog, { state: 'visible' });
}

export async function saveLocationPopup(cms: CMSInterface) {
    const dialogTreeLocations = await cms.page!.waitForSelector(
        studentPageSelectors.treeLocationDialog
    );
    await clickOnSaveButtonInParentElement(cms, dialogTreeLocations);
    await cms.page!.waitForSelector(studentKeys.inputSelectLocationChipTag);
}

export async function createNewCourse(cms: CMSInterface) {
    await clickOnSaveButtonInParentElement(cms);
}

export async function schoolAdminSelectLocationOfParentLocation(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    type: LocationLevel
) {
    const locations = await retrieveLocations(cms);

    switch (type) {
        case 'one child': {
            const oneChildLocation = getRandomElement(locations);
            await cms.selectElementByDataValue(oneChildLocation.locationId);
            scenarioContext.set(aliasChildLocation, oneChildLocation);
            break;
        }
        case 'all children': {
            const allParents = getParentLocation(locations);
            const selectedParent = getRandomElement(allParents);
            const allChildren = locations.filter(
                (location) => location.parentLocationId === selectedParent.locationId
            );

            for (const location of allChildren) {
                await cms.selectElementByDataValue(location.locationId);
            }

            scenarioContext.set(aliasChildrenLocation, allChildren);
            break;
        }
        case 'one parent': {
            const allParents = getParentLocation(locations);
            const selectedParent = getRandomElement(allParents);
            await cms.selectElementByDataValue(selectedParent.locationId);
            scenarioContext.set(aliasParentLocation, selectedParent);
            break;
        }
    }
}

export async function schoolAdminSelectTeachingMethod(
    cms: CMSInterface,
    teachingMethod: TeachingMethod
) {
    await cms.page!.click(CMSKeys.teachingMethodSelectorCreateCourse);
    await cms.chooseOptionInAutoCompleteBoxByExactText(teachingMethod);
}

export function getParentLocation(locations: LocationResponse[]) {
    const allParents: LocationResponse[] = [];
    const allParentsLocationIds: string[] = [];

    for (const location of locations) {
        const locationId = location.locationId;

        if (parentLocationNames.includes(location.name)) {
            allParentsLocationIds.push(locationId);
            allParents.push(location);
        }
    }

    return allParents;
}

export function getLocationByLocationId(locations: LocationResponse[], locationId: string) {
    const detail = locations.find((location) => location.locationId === locationId);

    if (!detail) throw new Error(`location list not contains location with id ${locationId}`);

    return detail;
}

export async function courseWithTeachingMethodIsOnPage(
    cms: CMSInterface,
    scenario: ScenarioContext,
    teachingMethod: TeachingMethod
) {
    const courseName = scenario.get<string>(aliasCourseName);
    const courseElement = await cms.page!.waitForSelector(
        CMSKeys.courseTableCourseNameLink(courseName)
    );
    const courseDetailURL = await courseElement.getAttribute('href');
    const [courseId] = courseDetailURL!.match(/([0-9]|[A-Z])\w+/g) || [];

    await cms.page!.waitForSelector(courseTeachingMethod(courseId, teachingMethod));
}

export async function locationRequireErrorIsOnPage(cms: CMSInterface) {
    await cms.page!.waitForSelector(CMSKeys.locationHelperText('This field is required'));
}

export async function teachingMethodRequireErrorIsOnPage(cms: CMSInterface) {
    await cms.page!.waitForSelector(CMSKeys.teachingMethodHelperText('This field is required'));
}

export async function isOnCreateCoursePage(cms: CMSInterface) {
    await cms.page!.waitForSelector(courseForm);
}
