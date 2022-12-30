import { When, Then, Given } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getUserIdFromRole } from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    teacherClickPinFeatureOptionButton,
    userCameraVisibilityOnListCameraOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/lesson-teacher-pins-learner-camera-definitions';
import {
    PinnedFeatureOptionMenu,
    StatusCameraAndSpeaker,
} from 'test-suites/squads/virtual-classroom/utils/types';

When(
    `{string} {string} {string} on Teacher App`,
    async function (
        teacherRole: AccountRoles,
        option: PinnedFeatureOptionMenu,
        userRole: AccountRoles
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this.scenario, userRole);
        await teacher.instruction(`${teacherRole} ${option} ${userRole} camera`, async function () {
            await teacherClickPinFeatureOptionButton(teacher, userId, option);
        });
    }
);

When(
    `{string} {string} new {string} on Teacher App`,
    async function (
        teacherRole: AccountRoles,
        option: PinnedFeatureOptionMenu,
        userRole: AccountRoles
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this.scenario, userRole);
        await teacher.instruction(
            `${teacherRole} ${option} new ${userRole} camera`,
            async function () {
                await teacherClickPinFeatureOptionButton(teacher, userId, option);
            }
        );
    }
);

Then(
    `{string} does not see {string} with camera {string} in the gallery view on Teacher App`,
    async function (teacherRole: AccountRoles, user: AccountRoles, status: StatusCameraAndSpeaker) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this.scenario, user);

        await teacher.instruction(
            `check ${user}'s camera is not visible on list camera`,
            async function () {
                await userCameraVisibilityOnListCameraOnTeacherApp(teacher, userId, false, status);
            }
        );
    }
);

Then(
    `{string} sees {string} with camera {string} in the gallery view on Teacher App`,
    async function (
        teacherRole: AccountRoles,
        userRole: AccountRoles,
        status: StatusCameraAndSpeaker
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this.scenario, userRole);

        await teacher.instruction(
            `check ${userRole}'s camera is visible on list camera`,
            async function () {
                await userCameraVisibilityOnListCameraOnTeacherApp(teacher, userId, true, status);
            }
        );
    }
);

Given(
    `{string} has {string} {string} on Teacher App`,
    async function (
        teacherRole: AccountRoles,
        option: PinnedFeatureOptionMenu,
        userRole: AccountRoles
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromRole(this.scenario, userRole);
        await teacher.instruction(`check ${userRole}'s camera has ${option}`, async function () {
            await teacherClickPinFeatureOptionButton(teacher, userId, option);
        });
    }
);
