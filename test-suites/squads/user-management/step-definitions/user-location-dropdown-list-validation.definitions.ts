import {
    courseLocationsAliasWithSuffix,
    studentLocationsAlias,
} from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface, Courses } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import { selectorEndRowStudentCourseUpsertTable } from './user-definition-utils';
import { strictEqual } from 'assert';

export async function verifyStudentCourseLocationDropdownListMatchedWithCourse(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    course: Courses
) {
    const page = cms.page!;
    const studentLocationsData = scenarioContext.get<LocationInfoGRPC[]>(studentLocationsAlias);
    const courseLocationsData = scenarioContext.get<LocationInfoGRPC[]>(
        courseLocationsAliasWithSuffix(course)
    );
    await cms.waitingForLoadingIcon();
    const studentCourseLocations = courseLocationsData.filter(
        (courseLocation) =>
            studentLocationsData.findIndex(
                (studentLocation) => studentLocation.locationId === courseLocation.locationId
            ) >= 0
    );
    const locationDropdownOptions = await page.locator(`[role='listbox'] li`).allTextContents();

    await cms.instruction(
        `Verify location dropdown list displayed matched with ${course}`,
        async function () {
            for (let index = 0; index < studentCourseLocations.length; index++) {
                const studentCourseLocation = studentCourseLocations[index];
                const isMatched =
                    locationDropdownOptions.findIndex(
                        (option) => option === studentCourseLocation.name
                    ) > -1;

                strictEqual(
                    true,
                    isMatched,
                    `The location: ${studentCourseLocation.name} is displayed`
                );
            }
        }
    );
}

export async function verifyStudentCourseLocationDropdownListEmpty(cms: CMSInterface) {
    await cms.instruction('Verify location input is empty', async function () {
        const endRowTableCourse = await selectorEndRowStudentCourseUpsertTable(cms);

        const locationCell = endRowTableCourse?.locator(
            studentPageSelectors.studentCourseUpsertTableLocation
        );

        const inputLocation = locationCell?.getByPlaceholder('Location');

        const locationInputValue = await inputLocation?.getAttribute('value');

        strictEqual(locationInputValue, '', 'The location input is empty');
    });
}
