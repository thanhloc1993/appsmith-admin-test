import { When, Then } from '@cucumber/cucumber';

import { Courses, IMasterWorld } from '@supports/app-types';

import {
    verifyStudentCourseLocationDropdownListMatchedWithCourse,
    verifyStudentCourseLocationDropdownListEmpty,
} from './user-location-dropdown-list-validation.definitions';
import { strictEqual } from 'assert';

Then(
    'school admin sees location dropdown list matched with {string} location',
    async function (this: IMasterWorld, course: Courses) {
        const cms = this.cms;
        const context = this.scenario;
        await verifyStudentCourseLocationDropdownListMatchedWithCourse(cms, context, course);
    }
);

Then('school admin sees location dropdown list is empty', async function (this: IMasterWorld) {
    const cms = this.cms;
    const page = cms.page!;

    await cms.instruction('Verify location dropdown list is empty', async function () {
        const locationDropdownOptionsLength = await page.locator(`[role='listbox'] li`).count();
        strictEqual(locationDropdownOptionsLength, 0, 'The location dropdown list is empty');
    });
});

When('school admin sees location field is empty', async function (this: IMasterWorld) {
    const cms = this.cms;

    await verifyStudentCourseLocationDropdownListEmpty(cms);
});
