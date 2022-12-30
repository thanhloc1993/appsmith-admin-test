import { courseAliasWithSuffix } from '@user-common/alias-keys/user';

import { When } from '@cucumber/cucumber';

import { Courses, IMasterWorld } from '@supports/app-types';
import { CourseEntityWithLocation } from '@supports/entities/course-entity';

import {
    clickAddCourseButton,
    clickToOpenLocationDropdownOptions,
    selectCourseWithName,
} from './user-student-course-common-definitions';

When('school admin selects the {string}', async function (this: IMasterWorld, course: Courses) {
    const cms = this.cms;
    const context = this.scenario;

    await clickAddCourseButton(cms);

    const courseData = context.get<CourseEntityWithLocation>(courseAliasWithSuffix(course));

    await selectCourseWithName(cms, courseData.name);
});

When('school admin wants to select location', async function (this: IMasterWorld) {
    const cms = this.cms;

    await clickToOpenLocationDropdownOptions(cms);
});

When('school admin re-selects {string}', async function (this: IMasterWorld, course: Courses) {
    const cms = this.cms;
    const context = this.scenario;

    const courseData = context.get<CourseEntityWithLocation>(courseAliasWithSuffix(course));
    await selectCourseWithName(cms, courseData.name, true);
});
