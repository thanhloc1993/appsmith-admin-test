import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getUserIdFromRole } from './lesson-utils';
import { getTeacherInterfaceFromRole } from './utils';
import {
    checkSeeCameraOptionMenu,
    PinnedFeatureOptionMenu,
    teacherClickThreeDotButton,
} from './virtual-classroom-teacher-sees-three-dots-button-on-teacher-app-definitions';

When(
    `{string} clicks on three dots button in {string} gallery camera view on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles, userRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this, userRole);
        await teacher.instruction(
            `${role} clicks on three dots button in ${userRole} gallery camera view on Teacher App`,
            async function () {
                await teacherClickThreeDotButton(teacher, userId);
            }
        );
    }
);

Then(
    `{string} sees {string} and {string} options`,
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        option1: PinnedFeatureOptionMenu,
        option2: PinnedFeatureOptionMenu
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees ${option1} and ${option2} options`,
            async function () {
                const options = [option1, option2];
                await checkSeeCameraOptionMenu(teacher, options);
            }
        );
    }
);
