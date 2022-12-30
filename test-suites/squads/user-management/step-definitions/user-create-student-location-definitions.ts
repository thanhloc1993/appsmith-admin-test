import {
    studentCreatingDataAlias,
    studentLocationsAlias,
    studentLocationWithTypeAlias,
} from '@user-common/alias-keys/user';
import { inputCheckbox } from '@user-common/cms-selectors/student';
import {
    generalLocationValue,
    tabStudentDetailRoot,
    selectedLocationSubNote,
    locationItemCheckbox,
    inputSelectLocationChipTag,
    inputSelectLocationChipLimitTags,
    parentLocationLocationItem,
    childLocationItem,
} from '@user-common/cms-selectors/students-page';

import { ElementHandle } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import {
    createRandomStudentData,
    fillInStudentInformation,
    selectLocationsWithType,
    StudentLocationWithType,
} from './user-definition-utils';
import { strictEqual } from 'assert';

export enum AmountLocation {
    LTE_10 = '<= 10',
    GT_10 = '> 10',
    ONE = '1',
    ALL = 'all',
}

export enum LocationType {
    PARENT = 'parent location',
    CHILD = 'children location',
}

export enum LocationResult {
    SELECTED = 'selected',
    UNSELECTED = 'unselected',
}

export async function schoolAdminFillsAllFieldsWithLocations(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locations: LocationInfoGRPC[]
) {
    const studentData = await createRandomStudentData(cms, { locations });
    scenarioContext.set(studentCreatingDataAlias, studentData);

    await fillInStudentInformation(cms, scenarioContext, studentData);
}

export async function schoolAdminFillsAllFieldsWithLocationType(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    amount: AmountLocation,
    locationType: LocationType
) {
    const studentData = await createRandomStudentData(cms);
    await fillInStudentInformation(cms, scenarioContext, studentData);

    const studentLocations = await selectLocationsWithType(
        cms,
        scenarioContext,
        amount,
        locationType
    );

    scenarioContext.set(studentLocationsAlias, studentLocations);
    scenarioContext.set(studentCreatingDataAlias, { ...studentData, locations: studentLocations });
}

export async function seesLocationChipsAndRemainingChip(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    remaining: number
) {
    const page = cms.page!;

    const studentLocations = scenarioContext.get<LocationInfoGRPC[]>(studentLocationsAlias) || [];

    const locationChips = await page.locator(inputSelectLocationChipTag);
    const locationChipsLength = await locationChips.count();

    if (remaining) {
        const remainingChip = await page.locator(inputSelectLocationChipLimitTags);
        const remainingText = await remainingChip?.textContent();

        strictEqual(10, locationChipsLength, 'The location chips length should be equal 10');
        strictEqual(remainingText, `+ ${remaining}`, `The remaining text should be + ${remaining}`);
    } else {
        strictEqual(
            studentLocations.length,
            locationChipsLength,
            `The location chips length should be equal ${studentLocations.length}`
        );
    }
}

export async function schoolAdminSeesSelectedLocationsOnStudentDetail(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const page = cms.page!;

    const studentDetailInfo = await page.waitForSelector(tabStudentDetailRoot);

    const studentLocationsValue = await studentDetailInfo.waitForSelector(generalLocationValue);
    const studentLocationsTextContent = await studentLocationsValue.textContent();
    const studentLocationsSplit = studentLocationsTextContent?.split(', ');

    const studentLocations = scenarioContext.get<LocationInfoGRPC[]>(studentLocationsAlias);

    strictEqual(
        studentLocations.length,
        studentLocationsSplit?.length,
        `The selected locations length should be equal ${studentLocationsSplit?.length}`
    );

    for (let index = 0; index < studentLocations.length; index++) {
        const locationName = studentLocations[index].name;
        const hasLocation = studentLocationsSplit?.includes(locationName);

        strictEqual(
            hasLocation,
            true,
            `The location ${locationName} should be included in the location list`
        );
    }
}

export async function schoolAdminSeesParentLocationAndChildrenLocation(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    result: LocationResult,
    childrenLocationAmount: AmountLocation
) {
    const page = cms.page!;

    const studentLocationWithType = scenarioContext.get<StudentLocationWithType>(
        studentLocationWithTypeAlias
    );
    const { parent, children } = studentLocationWithType;
    const parentLocationItem = await page.waitForSelector(
        parentLocationLocationItem(parent.locationId)
    );
    const childLocationCheckboxes: ElementHandle<SVGElement | HTMLElement>[] = [];
    for (let index = 0; index < children.length; index++) {
        const element = children[index];
        const locationItem = await page.waitForSelector(childLocationItem(element.locationId));
        const locationCheckbox = await locationItem.waitForSelector(locationItemCheckbox);
        const checkbox = await locationCheckbox.waitForSelector(inputCheckbox);
        childLocationCheckboxes.push(checkbox);
    }

    const isParentSelectedResult = result === LocationResult.SELECTED;

    await cms.instruction(
        `Check parent location are ${isParentSelectedResult ? 'SELECTED' : 'UNSELECTED'}`,
        async function () {
            const parentCheckbox = await parentLocationItem.waitForSelector(locationItemCheckbox);
            const checkbox = await parentCheckbox.waitForSelector(inputCheckbox);

            const hasChecked = await checkbox?.isChecked();

            strictEqual(
                hasChecked,
                isParentSelectedResult,
                `The parent location should be ${
                    isParentSelectedResult ? 'SELECTED' : 'UNSELECTED'
                }`
            );
        }
    );

    await cms.instruction(
        `Check ${
            childrenLocationAmount === AmountLocation.ONE ? 'ONE' : 'ALL'
        } children locations are selected`,
        async function () {
            const isCheckedLocations = await Promise.all(
                childLocationCheckboxes.map((checkbox) => checkbox.isChecked())
            );

            for (const isChecked of isCheckedLocations) {
                strictEqual(isChecked, true, `child location should be checked`);
            }
        }
    );
}

export async function schoolAdminSeesOnlyChildrenLocationDisplayOnPopup(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const selectedNote = (await cms.getTextContentElement(selectedLocationSubNote)) || '';

    // format: Selected: center 1, center 2, center 3, center 4, center 5, +xxx
    const locationsPattern = /Selected: (.*), \+\w+/g;
    const matching = locationsPattern.exec(selectedNote);
    let selectedLocations;
    if (matching && matching.length > 1) {
        selectedLocations = matching[1].trim();
    }

    const selectedLocationsSplit = selectedLocations?.split(', ') || [];

    const studentLocationWithType = scenarioContext.get<StudentLocationWithType>(
        studentLocationWithTypeAlias
    );
    const { children } = studentLocationWithType;

    const remainingLocations = children.length > 5 ? children.length - 5 : 0;
    if (remainingLocations) {
        const remainingPattern = /.*(\+\w+)/g;
        const matching = remainingPattern.exec(selectedNote);
        if (matching && matching.length > 1) {
            const remainingText = matching[1];

            strictEqual(
                remainingText,
                `+${remainingLocations}`,
                `The remaining locations should be equal ${remainingLocations}`
            );
        }
    }
    for (const selectedLocationName of selectedLocationsSplit) {
        const hasLocation = children.some((location) => location.name === selectedLocationName);

        strictEqual(
            hasLocation,
            true,
            `The location ${selectedLocationName} should be included in the selected location list`
        );
    }
}
