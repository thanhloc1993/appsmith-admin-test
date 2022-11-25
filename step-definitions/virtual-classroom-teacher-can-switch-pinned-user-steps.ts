import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getUserIdFromRole } from './lesson-utils';
import { getLearnerInterfaceFromRole, splitRolesStringToAccountRoles } from './utils';
import { userCameraVisibilityOnListCameraOnLearnerApp } from './virtual-classroom-teacher-can-switch-pinned-user-definitions';

Then(
    `{string} see {string} in the gallery view on Learner App`,
    async function (this: IMasterWorld, roles: string, role: AccountRoles) {
        const studentRoles = splitRolesStringToAccountRoles(roles);
        const userId = getUserIdFromRole(this, role);
        for (const studentRole of studentRoles) {
            const learner = getLearnerInterfaceFromRole(this, studentRole);
            await learner.instruction(
                `${studentRole} see ${role} in the gallery view on Learner App`,
                async function () {
                    await userCameraVisibilityOnListCameraOnLearnerApp(learner, userId, true);
                }
            );
        }
    }
);
