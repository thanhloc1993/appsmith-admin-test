import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld, Lessons, Locations } from '@supports/app-types';

import { aliasCourseId } from './alias-keys/syllabus';
import { goToCourseDetailOnTeacherAppByCourseId } from './lesson-teacher-verify-lesson-definitions';
import { getTeacherInterfaceFromRole } from './utils';
import {
    applyLocation,
    applyParentLocationWhichNotIncludeLocation,
    checkLessonItemOnTeacherApp,
    confirmApplingLocation,
    confirmApplyingParentLocationWhichIncludeLocation,
    createCourseWith2Locations,
    createLessonWithLocation,
} from './virtual-classroom-show-respective-lesson-after-applying-location-filter-in-navigation-bar-definitions';
import { getLocationAliasWithSuffix } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

Given('school admin has created course with 2 locations', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenario = this.scenario;
    await cms.instruction('school admin has created course with 2 locations', async function () {
        await createCourseWith2Locations(cms, scenario);
    });
});

Given(
    'school admin has created a {string} with {string} with start date&time is within 10 minutes from now',
    async function (this: IMasterWorld, lessons: Lessons, locations: Locations) {
        const cms = this.cms;
        const scenario = this.scenario;
        await cms.instruction(
            `school admin has created a ${lessons} with ${locations} with start date&time is within 10 minutes from now`,
            async function () {
                await createLessonWithLocation(
                    cms,
                    scenario,
                    lessons,
                    locations,
                    'within 10 minutes from now'
                );
            }
        );
    }
);

When(
    '{string} applies {string} in location settings',
    async function (this: IMasterWorld, role: AccountRoles, locations: Locations) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} applies ${locations} in location settings`,
            async function () {
                const locationsData = getLocationAliasWithSuffix(scenario, locations);
                await applyLocation(
                    teacher,
                    locationsData.map((val) => val.locationId)
                );
            }
        );
    }
);

Then(
    '{string} does not see the {string} on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, lessons: Lessons) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} does not see the ${lessons} on Teacher App`,
            async function () {
                const result = await checkLessonItemOnTeacherApp(teacher, scenario, lessons);
                weExpect(result, `Don't see the lesson`).toEqual(false);
            }
        );
    }
);

Then(
    '{string} sees the {string} on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, lessons: Lessons) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(`${role} sees the ${lessons} on Teacher App`, async function () {
            const result = await checkLessonItemOnTeacherApp(teacher, scenario, lessons);
            weExpect(result, 'See the lesson').toEqual(true);
        });
    }
);

When(
    '{string} applies one parent location which do not have {string} in location settings',
    async function (this: IMasterWorld, role: AccountRoles, locations: Locations) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const cms = this.cms;
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} applies one parent location which do not have ${locations} in location settings`,
            async function () {
                await applyParentLocationWhichNotIncludeLocation(cms, teacher, scenario, locations);
            }
        );
    }
);

Given(
    '{string} has applied {string} in location settings',
    async function (this: IMasterWorld, role: AccountRoles, locations: Locations) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} has applied ${locations} in location settings`,
            async function () {
                const locationsData = getLocationAliasWithSuffix(scenario, locations);
                await applyLocation(
                    teacher,
                    locationsData.map((val) => val.locationId)
                );
            }
        );
    }
);

Given(
    '{string} has gone to course detail screen',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        const courseId = this.scenario.get(aliasCourseId);

        await teacher.instruction(`${role} goes to course detail screen`, async function () {
            await goToCourseDetailOnTeacherAppByCourseId(teacher, courseId);
        });
    }
);

Then(
    '{string} goes to course detail screen again',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        const courseId = this.scenario.get(aliasCourseId);

        await teacher.instruction(`${role} goes to course detail screen again`, async function () {
            await goToCourseDetailOnTeacherAppByCourseId(teacher, courseId);
        });
    }
);

Given(
    '{string} has applied one parent location which do not have {string} in location settings',
    async function (this: IMasterWorld, role: AccountRoles, locations: Locations) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const cms = this.cms;
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} has applied one parent location which do not have ${locations} in location settings`,
            async function () {
                await applyParentLocationWhichNotIncludeLocation(cms, teacher, scenario, locations);
            }
        );
    }
);

When(
    '{string} confirms applying one parent location which includes {string} in location settings',
    async function (this: IMasterWorld, role: AccountRoles, locations: Locations) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const cms = this.cms;
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} confirms applying one parent location which includes ${locations} in location settings`,
            async function () {
                await confirmApplyingParentLocationWhichIncludeLocation(
                    cms,
                    teacher,
                    scenario,
                    locations
                );
            }
        );
    }
);

When(
    '{string} confirms removing {string} and applying {string} in location settings',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        locations1: Locations,
        locations2: Locations
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} confirms removing ${locations1} and applying ${locations2} in location settings`,
            async function () {
                const locationsData1 = getLocationAliasWithSuffix(scenario, locations1);
                const locationsData2 = getLocationAliasWithSuffix(scenario, locations2);
                await confirmApplingLocation(
                    teacher,
                    locationsData2.map((val) => val.locationId),
                    locationsData1.map((val) => val.locationId)
                );
            }
        );
    }
);
