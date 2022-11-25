import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import { dialogMessage } from './cms-selectors/cms-keys';
import {
    createNewCourse,
    fillCourseName,
    LocationLevel,
    openCreateCoursePage,
    openLocationPopup,
    saveLocationPopup,
    schoolAdminSelectLocationOfParentLocation,
    courseWithTeachingMethodIsOnPage,
    TeachingMethod,
    locationRequireErrorIsOnPage,
    teachingMethodRequireErrorIsOnPage,
    isOnCreateCoursePage,
} from './lesson-create-course-with-teaching-method-definitions';
import { getCMSInterfaceByRole, getRandomNumber } from './utils';

Given('{string} has gone to course page', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction('Go to the course page', async function () {
        await cms.schoolAdminIsOnThePage(Menu.COURSES, 'Course');
    });
});

Given(
    '{string} has opened creating course page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} has opened creating lesson page`, async function () {
            await openCreateCoursePage(cms);
        });
    }
);

Given('{string} has filled course name', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const courseName = `Course Name ${getRandomNumber()}`;
    const scenario = this.scenario;

    await cms.instruction(`${role} has filled course name: ${courseName}`, async function () {
        await fillCourseName(cms, scenario, courseName);
    });
});

Given(
    '{string} has selected {string} location in Course',
    {
        timeout: 90000,
    },
    async function (this: IMasterWorld, role: AccountRoles, typeLocation: LocationLevel) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} has selected ${typeLocation} location in Course`,
            async function () {
                await openLocationPopup(cms);
                await schoolAdminSelectLocationOfParentLocation(cms, scenario, typeLocation);
                await saveLocationPopup(cms);
            }
        );
    }
);

When('{string} creates a new course', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} creates a new course`, async function () {
        await createNewCourse(cms);
    });
});

Then(
    '{string} sees an inline error message under location field',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees an inline error message under location field`,
            async function () {
                await locationRequireErrorIsOnPage(cms);
            }
        );
    }
);

Then(
    '{string} sees an inline error message under teaching method field',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees an inline error message under location field`,
            async function () {
                await teachingMethodRequireErrorIsOnPage(cms);
            }
        );
    }
);

Then(
    '{string} is still in creating course page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} is still in creating course page`, async function () {
            await isOnCreateCoursePage(cms);
        });
    }
);

Then(
    '{string} is redirected to course list page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} is redirected to course list page`, async function () {
            await cms.assertThePageTitle('Course');
        });
    }
);

Then(
    '{string} sees a dialog that course is created successfully',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees a dialog that course is created successfully`,
            async function () {
                await cms.page!.waitForSelector(dialogMessage);
            }
        );
    }
);

Then(
    '{string} sees the new course with {string} teaching method on CMS',
    async function (this: IMasterWorld, role: AccountRoles, teachingMethod: TeachingMethod) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees the new course with ${teachingMethod} teaching method on CMS`,
            async () => {
                await courseWithTeachingMethodIsOnPage(cms, scenario, teachingMethod);
            }
        );
    }
);
