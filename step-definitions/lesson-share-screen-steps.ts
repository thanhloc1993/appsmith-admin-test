import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { teacherSeesShareScreenBarOnTeacherApp } from './lesson-share-screen-after-reconnecting-definitions';
import {
    learnerSeesSharedScreenOnLearnerApp,
    teacherSeesCannotOverlapShareScreenDialog,
    teacherSeesSharedScreenOnTeacherApp,
    teacherSeesShareScreenIconOnTeacherApp,
    teacherSharesScreenOnTeacherApp,
    teacherStopsSharingScreenOnTeacherApp,
} from './lesson-share-screen-definitions';
import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';

Given(
    '{string} has shared their entire screen on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} has shared their {string} on Teacher App`,
            async function () {
                await teacherSharesScreenOnTeacherApp(teacher);
                await teacherSeesShareScreenBarOnTeacherApp(teacher, true);
            }
        );
    }
);

When(
    '{string} shares their entire screen on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} shares their entire screen on Teacher App`,
            async function () {
                await teacherSharesScreenOnTeacherApp(teacher);
            }
        );
    }
);

When(
    '{string} stops sharing their entire screen on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} stops sharing their entire screen on Teacher App`,
            async function () {
                await teacherStopsSharingScreenOnTeacherApp(teacher);
                await teacherSeesShareScreenBarOnTeacherApp(teacher, false);
            }
        );
    }
);

Then(
    '{string} sees {string} share screen icon on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, state: string) {
        const active = state === 'active';
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees ${state} share screen icon on Teacher App`,
            async function () {
                await teacherSeesShareScreenIconOnTeacherApp(teacher, active);
            }
        );
    }
);

Then(
    '{string} sees screen which has been shared on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees screen which has been shared on Teacher App`,
            async function () {
                await teacherSeesSharedScreenOnTeacherApp(teacher, true);
                await teacherSeesShareScreenBarOnTeacherApp(teacher, false);
            }
        );
    }
);

Then(
    '{string} does not see screen which has been shared on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} does not see screen which has been shared on Teacher App`,
            async function () {
                await teacherSeesSharedScreenOnTeacherApp(teacher, false);
            }
        );
    }
);

Then(
    '{string} sees cannot overlap share screen dialog and can not share screen',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees cannot overlap share screen dialog and can not share screen`,
            async function () {
                await teacherSeesCannotOverlapShareScreenDialog(teacher);
            }
        );
    }
);

Then(
    '{string} sees screen which has been shared on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees screen which has been shared on Learner App`,
            async function () {
                await learnerSeesSharedScreenOnLearnerApp(learner, true);
            }
        );
    }
);

Then(
    '{string} does not see screen which has been shared on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} does not see screen which has been shared on Learner App`,
            async function () {
                await learnerSeesSharedScreenOnLearnerApp(learner, false);
            }
        );
    }
);
