import { Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getLearnerInterfaceFromRole } from './utils';
import { learnerSeesSnackBarWhiteboardPermission } from './virtual-classroom-student-sees-the-snack-bar-when-teacher-enables-or-disables-white-board-permission-definitions';

Then(
    '{string} sees the snack bar for noticing white board permission is granted on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees the snack bar for noticing white board permission is granted on Learner App`,
            async function () {
                await learnerSeesSnackBarWhiteboardPermission(learner, true);
            }
        );
    }
);

Then(
    '{string} sees the snack bar for noticing white board permission is removed on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees the snack bar for noticing white board permission is removed on Learner App`,
            async function () {
                await learnerSeesSnackBarWhiteboardPermission(learner, true);
            }
        );
    }
);

Then(
    '{string} does not see the snack bar for noticing white board permission is granted on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} does not see the snack bar for noticing white board permission is granted on Learner App`,
            async function () {
                await learnerSeesSnackBarWhiteboardPermission(learner, false);
            }
        );
    }
);

Then(
    '{string} does not see the snack bar for noticing white board permission is removed on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} does not see the snack bar for noticing white board permission is removed on Learner App`,
            async function () {
                await learnerSeesSnackBarWhiteboardPermission(learner, false);
            }
        );
    }
);
