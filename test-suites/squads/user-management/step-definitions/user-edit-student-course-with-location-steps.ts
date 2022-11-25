import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { getDateSelectorOfDatePickerCalendar } from '@legacy-step-definitions/cms-selectors/common';
import {
    learnerProfileAlias,
    locationAliasWithSuffix,
    locationImportedAliasWithSuffix,
    studentPackagesAlias,
} from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { Given, When, Then } from '@cucumber/cucumber';

import { IMasterWorld, Locations, Courses } from '@supports/app-types';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ImportLocationData } from '@supports/services/bob-import-service/types';
import { CreateStudentResponseEntity } from '@supports/services/usermgmt-student-service/entities/create-student-response';
import { LocationInfoGRPC, LocationObjectGRPC } from '@supports/types/cms-types';

import {
    createARandomStudentGRPC,
    clickOnSaveCourseDuration,
} from './user-create-student-definitions';
import {
    createRandomLocations,
    updateLocation,
    StatusDialog,
    selectorEndRowStudentCourseUpsertTable,
    getCourseAliasWithSuffix,
    gotoEditStudentCourse,
} from './user-definition-utils';
import {
    schoolAdminArchiveLocations,
    editLocationCourse,
} from './user-edit-student-course-with-location-definitions';
import { strictEqual } from 'assert';
import {
    getRandomNumber,
    goToPrevOrNextMonth,
    splitAndCombinationIntoArray,
} from 'step-definitions/utils';

Given(
    'school admin has created a student course with new {string}',
    async function (this: IMasterWorld, locations: Locations) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const arrayLocations = splitAndCombinationIntoArray(locations) as Locations[];
        const { importLocations, locationGRPC } = await createRandomLocations(
            cms,
            arrayLocations.length
        );

        for (const index in arrayLocations) {
            scenarioContext.set(
                locationImportedAliasWithSuffix(arrayLocations[index]),
                importLocations[index]
            );
        }

        const response = await createARandomStudentGRPC(cms, {
            studentPackageProfileLength: 1,
            locations: locationGRPC,
        });

        scenarioContext.set(learnerProfileAlias, response.student);
        scenarioContext.set(studentPackagesAlias, response.studentCoursePackages);
    }
);

When('school admin archives {string}', async function (this: IMasterWorld, locations: Locations) {
    await schoolAdminArchiveLocations(this.cms, this.scenario, locations);
});

Then(
    'school admin archives {string} to clean data',
    async function (this: IMasterWorld, locations: Locations) {
        await schoolAdminArchiveLocations(this.cms, this.scenario, locations);
    }
);

When(
    'school admin {string} edit course popup in student detail page',
    async function (this: IMasterWorld, statusDialog: StatusDialog) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        if (statusDialog === StatusDialog.OPENS) {
            const student = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

            await gotoEditStudentCourse(cms, student);
        } else {
            await cms.instruction(`Click Escape to Close Course dialog`, async function () {
                await cms.page!.keyboard.press('Escape');
            });
        }
    }
);

Then(
    'school admin only sees {string} display in the location dropdown',
    async function (this: IMasterWorld, location: Locations) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const page = cms.page!;

        const { name } = scenarioContext.get<ImportLocationData>(
            locationImportedAliasWithSuffix(location)
        );

        await cms.instruction(
            `school admin only sees ${name} display in the location dropdown`,
            async function () {
                const endRowTableCourse = await selectorEndRowStudentCourseUpsertTable(cms);
                const locationCell = endRowTableCourse?.locator(
                    studentPageSelectors.studentCourseUpsertTableLocation
                );
                await locationCell?.click();

                const dropdownList = page.getByRole('listbox');
                const count = await dropdownList.count();
                const locationName = await dropdownList.nth(0).textContent();

                strictEqual(count, 1, 'the location dropdown only have 1 location');
                strictEqual(locationName, name, `${locationName} display in the location dropdown`);
            }
        );
    }
);

When('school admin changes the name of location', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const locationImportData = scenarioContext.get<ImportLocationData>(
        locationImportedAliasWithSuffix('location')
    );
    const newName = `${locationImportData.name}-edit-${getRandomNumber().toString().slice(3)}`;
    const newLocation = { ...locationImportData, name: newName };

    await updateLocation(cms, newLocation);

    scenarioContext.set(locationImportedAliasWithSuffix('location'), newLocation);

    await cms.page?.reload();
});

Then('school admin sees the location name has changed', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const { name } = scenarioContext.get<ImportLocationData>(
        locationImportedAliasWithSuffix('location')
    );

    await cms.instruction(
        `school admin only sees ${name} display in the location dropdown`,
        async function () {
            const endRowTableCourse = await selectorEndRowStudentCourseUpsertTable(cms);
            const locationCell = endRowTableCourse?.locator(
                studentPageSelectors.studentCourseUpsertTableLocation
            );
            const inputLocation = locationCell?.getByPlaceholder('Location');

            const locationName = await inputLocation?.inputValue();
            strictEqual(locationName, name, `the location name ${locationName} has been edited`);
        }
    );
});

When(
    'school admin edits {string} to {string} of {string} in the student',
    async function (
        this: IMasterWorld,
        fromLocation: Locations,
        toLocation: Locations,
        courses: Courses
    ) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const page = cms.page!;

        const courseData = getCourseAliasWithSuffix(scenarioContext, courses);

        const fromLocationData = scenarioContext.get<LocationInfoGRPC>(
            locationAliasWithSuffix(fromLocation)
        );

        const toLocationData = scenarioContext.get<LocationInfoGRPC>(
            locationAliasWithSuffix(toLocation)
        );

        await cms.instruction(`Click to Edit Course button`, async function () {
            const editCourseButton = await page.waitForSelector(
                studentPageSelectors.editCourseButton
            );
            await editCourseButton.click();
        });

        scenarioContext.set(studentPackagesAlias, []);

        for (const index in courseData) {
            await editLocationCourse(
                cms,
                courseData[index],
                Number(index),
                fromLocationData,
                toLocationData
            );
        }

        await cms.instruction(
            `Click on Save button in Edit course duration dialog`,
            async function () {
                await clickOnSaveCourseDuration(cms);
                await cms.page?.waitForSelector(studentPageSelectors.upsertCourseInfoDialog, {
                    state: 'hidden',
                });
                await cms.waitForSkeletonLoading();
            }
        );
    }
);

Given('school admin has created a student course with location', async function () {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {
        locations: [firstGrantedLocation],
        studentPackageProfileLength: 1,
    });

    scenarioContext.set(learnerProfileAlias, response.student);
    scenarioContext.set(studentPackagesAlias, response.studentCoursePackages);
});

When('school admin edits end date to be smaller than the start date', async function () {
    const cms = this.cms;
    const cmsPage = cms.page!;

    await cms.instruction(`school admin click on to open end date dialog`, async function () {
        const endDate = await cmsPage?.waitForSelector(
            studentPageSelectors.upsertCourseInfoDatePickerEnd
        );
        await endDate.click();
    });
});

Then('school admin sees the editing date is disabled', async function () {
    const cms = this.cms;
    const scenarioContext = this.scenario;
    const cmsPage = cms.page!;

    const { startDate } =
        scenarioContext.get<StudentCoursePackageEntity[]>(studentPackagesAlias)[0];
    const start = new Date(startDate);

    await cms.instruction(`school admin sees yesterday is disabled`, async function () {
        const isDisabled = await cmsPage.getByTitle('Previous month').isDisabled();

        if (!isDisabled) {
            if (start.getDate() === 1) {
                await goToPrevOrNextMonth(cms, true);
            }
            const yesterday = new Date(start.valueOf() - 3600 * 24000);
            const dateSelector = getDateSelectorOfDatePickerCalendar(yesterday.getDate());
            const isEnabled = await cmsPage.isEnabled(dateSelector);

            weExpect(isEnabled).toEqual(false);
        }
    });
});
