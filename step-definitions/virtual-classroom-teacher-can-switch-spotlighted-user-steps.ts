import { When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getUserIdFromRole } from './lesson-utils';
import { getTeacherInterfaceFromRole } from './utils';
import { teacherSpotlightsUserCameraOnTeacherApp } from './virtual-classroom-teacher-can-spotlight-user-definitions';

When(
    '{string} spotlights new user {string} on Teacher App',
    async function (role: AccountRoles, userRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const userId = getUserIdFromRole(this, userRole);
        await teacher.instruction(
            `${role} spotlights new user ${userRole} on Teacher App`,
            async function () {
                await teacherSpotlightsUserCameraOnTeacherApp(teacher, userId);
            }
        );
    }
);
