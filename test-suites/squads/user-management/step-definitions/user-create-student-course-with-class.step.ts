import { buttonByAriaLabel } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { ClassCSV } from '@legacy-step-definitions/types/content';
import {
    splitAndCombinationIntoArray,
    convertToCSVString,
    writeDownloadFileSync,
} from '@legacy-step-definitions/utils';
import {
    courseAliasWithSuffix,
    courseLocationsAliasWithSuffix,
    classImportedAliasWithSuffix,
    locationAliasWithSuffix,
} from '@user-common/alias-keys/user';

import { Given, When, Then } from '@cucumber/cucumber';

import { Courses, IMasterWorld, Locations, Classes } from '@supports/app-types';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import {
    createCSVListClass,
    openRegisterClassDialog,
    schoolAdminGoesToImportClasses,
    selectClassByName,
} from './user-create-student-course-with-class.definition';
import { verifyStudentCourseTable } from './user-create-student-course-with-location.definition';
import {
    createRandomCoursesWithLocations,
    getLocationAliasWithSuffix,
    FileCSV,
    getCourseAliasWithSuffix,
    selectOneLocation,
} from './user-definition-utils';
import { strictEqual } from 'assert';
import { importClass } from 'test-suites/squads/lesson/services/student-service/student-service';
import { aliasClassesList } from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';

Given(
    'school admin has created a {string} belong to {string} and {string}',
    async function (this: IMasterWorld, courses: Courses, locations: Locations, classes: Classes) {
        const cms = this.cms;
        const context = this.scenario;

        const courseKeys = splitAndCombinationIntoArray(courses) as Courses[];
        const locationsData = getLocationAliasWithSuffix(context, locations);
        let classRow: ClassCSV[] = [];
        const locationId = locationsData[0]?.locationId;

        await selectOneLocation(cms, locationId);

        for (const course of courseKeys) {
            await cms.attach('Create a course by GRPC');
            const { request: courseData } = await createRandomCoursesWithLocations(cms, {
                quantity: 1,
                locations: locationsData,
            });

            const classesList = splitAndCombinationIntoArray(classes) as Classes[];
            context.set(aliasClassesList, classesList);

            const _classRow: ClassCSV[] = await createCSVListClass(cms, courseData[0], classesList);
            classRow = [...classRow, ..._classRow];

            context.set(courseAliasWithSuffix(course), {
                ...courseData[0],
            });
            context.set(courseLocationsAliasWithSuffix(course), locationsData);
        }
        context.set(classImportedAliasWithSuffix(classes), classRow);

        const classKeys = splitAndCombinationIntoArray(classes) as Classes[];
        for (let i = 0; i < classKeys.length; i++) {
            context.set(classKeys[i], classRow[i]);
        }
        const csv = convertToCSVString(classRow);
        const uniqueKey = new Date().getTime().toString();
        const fileName = FileCSV.STUDENT + uniqueKey + FileCSV.EXT;
        writeDownloadFileSync(fileName, csv);

        await schoolAdminGoesToImportClasses(cms, fileName);
    }
);

Then(
    'school admin sees the {string} with {string} and {string} added for the student',
    async function (
        this: IMasterWorld,
        courses: Courses,
        location: Locations,
        classCourseName: Classes
    ) {
        const cms = this.cms;
        const context = this.scenario;
        const courseData = getCourseAliasWithSuffix(context, courses);

        for (const course of courseData) {
            const locationData = context.get<LocationInfoGRPC>(locationAliasWithSuffix(location));
            await cms.instruction(
                `Verify course: ${course.name} with location: ${locationData.name} and class: ${classCourseName}`,
                async function () {
                    await verifyStudentCourseTable(
                        cms,
                        course.id,
                        course.name,
                        locationData.name,
                        classCourseName === 'no class' ? '' : classCourseName
                    );
                }
            );
        }
    }
);

Given(
    'school admin has imported {string} belong to {string} and {string}',
    async function (this: IMasterWorld, classes: Classes, course: Courses, locations: Locations) {
        const cms = this.cms;
        const context = this.scenario;
        const courseData = getCourseAliasWithSuffix(context, course);
        const locationData = getLocationAliasWithSuffix(context, locations);
        const classesList = splitAndCombinationIntoArray(classes);
        for (const className of classesList) {
            await importClass({
                cms,
                courseId: courseData[0].id,
                locationId: locationData[0].locationId,
                className,
            });
        }
    }
);

When(
    'school admin registers {string} for {string}',
    async function (this: IMasterWorld, className: Classes, course: Courses) {
        const cms = this.cms;
        const context = this.scenario;
        const courseData = getCourseAliasWithSuffix(context, course);
        await openRegisterClassDialog(cms, courseData[0].id);
        if (className !== 'any class') await selectClassByName(cms, className);
    }
);

When(
    'school admin changes to {string} of {string}',
    async function (this: IMasterWorld, className: Classes, course: Courses) {
        const cms = this.cms;
        const context = this.scenario;
        const courseData = getCourseAliasWithSuffix(context, course);
        await openRegisterClassDialog(cms, courseData[0].id);
        await selectClassByName(cms, className);
    }
);

Then('school admin {string} any class', async function (this: IMasterWorld, action: string) {
    const cms = this.cms;
    const page = cms.page!;

    await cms.instruction(`School admin ${action} any class`, async function () {
        await page.getByLabel('Class').click();
        await page.getByText('No options').waitFor({ state: 'visible' });
        const classListContent = await page.getByText('No options').isVisible();
        strictEqual(classListContent, true, 'Class option list should be empty');
    });
    await cms.instruction('School admin closes register class dialog', async function () {
        await page.getByLabel('Class').click();
        await page.click(buttonByAriaLabel('Cancel'));
    });
});
