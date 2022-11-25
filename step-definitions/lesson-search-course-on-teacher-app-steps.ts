import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld, TeacherPages } from '@supports/app-types';

import { aliasCourseName } from './alias-keys/lesson';
import {
    goToPageOnTeacherApp,
    pressEnterSearchBar,
    removeTextInSearchBar,
    searchCourseByKeyword,
} from './lesson-search-course-on-teacher-app-definitions';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { getTeacherInterfaceFromRole } from './utils';
import { ByValueKey } from 'flutter-driver-x';

Given(
    `{string} has refreshed their browser on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} has refreshed their browser on Teacher App`,
            async function () {
                await teacher.flutterDriver?.reload();
            }
        );
    }
);

When(
    `{string} searches course by the keyword`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(`${role} searches course by the keyword`, async function () {
            const keyword = scenario.get(aliasCourseName);
            await searchCourseByKeyword(teacher, keyword);
        });
    }
);

Then(
    `{string} sees course which course name contains the keyword`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const driver = teacher.flutterDriver!;
        const scenario = this.scenario;
        const key = TeacherKeys.course(scenario.get(aliasCourseName));
        await teacher.instruction(
            `${role} sees course which course name contains the keyword`,
            async function () {
                await driver.runUnsynchronized(async () => {
                    await driver.waitFor(new ByValueKey(key), 10000);
                });
            }
        );
    }
);

When(
    `{string} searches course by non existed keyword`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} searches course by non existed keyword`,
            async function () {
                const keyword = `${scenario.get(aliasCourseName)} non-existed keyword`;
                await searchCourseByKeyword(teacher, keyword);
            }
        );
    }
);

Then(`{string} sees no course result`, async function (this: IMasterWorld, role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    const driver = teacher.flutterDriver!;
    await teacher.instruction(`${role} sees no course result`, async function () {
        await driver.runUnsynchronized(async () => {
            await driver.waitFor(new ByValueKey(TeacherKeys.noCourseResultScreen), 5000);
        });
    });
});

Given(
    `{string} has searched course by the keyword`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(`${role} has searched course by the keyword`, async function () {
            const keyword = scenario.get(aliasCourseName);
            await searchCourseByKeyword(teacher, keyword);
        });
    }
);

When(
    `{string} removes the keyword in the search bar on Teacher app`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} removes the keyword in the search bar on Teacher app`,
            async function () {
                await removeTextInSearchBar(teacher, scenario);
            }
        );
    }
);

When(`{string} presses enter`, async function (this: IMasterWorld, role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} presses enter`, async function () {
        await pressEnterSearchBar(teacher);
    });
});

Then(`{string} sees full course list`, async function (this: IMasterWorld, role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} sees full course list`, async function () {
        const driver = teacher.flutterDriver!;
        await driver.waitForAbsent(new ByValueKey(TeacherKeys.courseList(1)));
    });
});

Then(
    `{string} does not see the keyword in the search bar on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} does not see the keyword in the search bar on Teacher App`,
            async function () {
                const driver = teacher.flutterDriver!;
                const searchCourseInput = new ByValueKey(TeacherKeys.searchCourseInput);
                const text = await driver.getText(searchCourseInput);
                weExpect(text).toEqual('');
            }
        );
    }
);

When(
    `{string} goes to detailed course page on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} goes to detailed course page on Teacher App`,
            async function () {
                const driver = teacher.flutterDriver!;
                const key = TeacherKeys.course(scenario.get(aliasCourseName));
                await driver.tap(new ByValueKey(key));
            }
        );
    }
);

When(
    `{string} backs to course list on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`${role} backs to course list on Teacher App`, async function () {
            const driver = teacher.flutterDriver!;
            const backButton = new ByValueKey(TeacherKeys.backButton);
            await driver.tap(backButton);
        });
    }
);

Then(
    `{string} sees the keyword in the search bar on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} sees the keyword in the search bar on Teacher App`,
            async function () {
                const driver = teacher.flutterDriver!;
                const searchCourseInput = new ByValueKey(TeacherKeys.searchCourseInput);
                const text = await driver.getText(searchCourseInput, 8000);
                const key = scenario.get(aliasCourseName);
                weExpect(text).toEqual(key);
            }
        );
    }
);

When(
    `{string} goes to {string} on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles, page: TeacherPages) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`${role} goes to ${page} on Teacher App`, async function () {
            await goToPageOnTeacherApp(teacher, page);
        });
    }
);
