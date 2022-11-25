import { splitAndCombinationIntoArray } from '@legacy-step-definitions/utils';
import { locationImportedAliasWithSuffix } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import { chooseAutocompleteOptionByExactText } from '@user-common/utils/autocomplete-actions';

import { CMSInterface, Locations } from '@supports/app-types';
import { CourseEntityWithLocation } from '@supports/entities/course-entity';
import { ScenarioContext } from '@supports/scenario-context';
import { ImportLocationData } from '@supports/services/bob-import-service/types';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import { updateLocation, selectorAllRowStudentCourseUpsertTable } from './user-definition-utils';

export async function schoolAdminArchiveLocations(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    locations: Locations
) {
    await cms.attach(`school admin archive ${locations}`);

    const arrayLocations = splitAndCombinationIntoArray(locations);
    for (const location of arrayLocations as Locations[]) {
        const locationImportData = scenarioContext.get<ImportLocationData>(
            locationImportedAliasWithSuffix(location)
        );
        const newLocation = { ...locationImportData, is_archived: true };
        await updateLocation(cms, newLocation);
    }

    await cms.page?.reload();
}

export async function editLocationCourse(
    cms: CMSInterface,
    course: CourseEntityWithLocation,
    courseIndex: number,
    fromLocation: LocationInfoGRPC,
    toLocation: LocationInfoGRPC
) {
    await cms.instruction(
        `Edit ${course.name} location from ${fromLocation.name} to ${toLocation.name}`,
        async function () {
            const tableBaseRow = selectorAllRowStudentCourseUpsertTable(cms) ?? [];
            const courseRow = tableBaseRow.nth(courseIndex);

            const locationCell = courseRow.locator(
                studentPageSelectors.studentCourseUpsertTableLocation
            );
            const inputLocation = locationCell.getByPlaceholder('Location');

            await inputLocation.click();
            await cms.page!.keyboard.press('Backspace');

            await inputLocation?.type(toLocation.name, { delay: 100 });

            await chooseAutocompleteOptionByExactText(cms, toLocation.name);
        }
    );
}
