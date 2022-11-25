import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerHidesWhiteboardBarByTool,
    learnerShowsWhiteboardBarOnLearnerApp,
    teacherHidesWhiteboardBarByTool,
    teacherSeesAnnotateIconOnTeacherApp,
    teacherSeesWhiteboardBarOnTeacherApp,
    teacherShowsWhiteboardBarOnTeacherApp,
} from './lesson-hide-or-show-again-whiteboard-bar-definitions';
import { learnerSeesAnnotateIconOnLearnerApp } from './lesson-teacher-can-enable-or-disable-student-white-board-definitions';
import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';

Given(
    '{string} has hidden white board bar by {string} on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, tool: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} has hidden white board bar by ${tool} on Teacher App`,
            async function () {
                await teacherHidesWhiteboardBarByTool(teacher, tool);
            }
        );
    }
);

Given(
    '{string} has hidden white board bar by {string} on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, tool: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} has hidden white board bar by ${tool} on Learner App`,
            async function () {
                await learnerHidesWhiteboardBarByTool(learner, tool);
            }
        );
    }
);

When(
    '{string} shows again white board bar on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} shows again white board bar on Teacher App`,
            async function () {
                await teacherShowsWhiteboardBarOnTeacherApp(teacher);
            }
        );
    }
);

When(
    '{string} hides white board bar by {string} on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, tool: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} hides white board bar by ${tool} on Teacher App`,
            async function () {
                await teacherHidesWhiteboardBarByTool(teacher, tool);
            }
        );
    }
);

When(
    '{string} shows again white board bar on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} shows again white board bar on Learner App`,
            async function () {
                await learnerShowsWhiteboardBarOnLearnerApp(learner);
            }
        );
    }
);

When(
    '{string} hides white board bar by {string} on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, tool: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} hides white board bar by ${tool} on Learner App`,
            async function () {
                await learnerHidesWhiteboardBarByTool(learner, tool);
            }
        );
    }
);

Then(
    '{string} sees white board bar on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`${role} sees white board bar on Teacher App`, async function () {
            await teacherSeesWhiteboardBarOnTeacherApp(teacher, true);
        });
    }
);

Then(
    '{string} still sees white board bar on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} still sees white board bar on Teacher App`,
            async function () {
                await teacherSeesWhiteboardBarOnTeacherApp(teacher, true);
            }
        );
    }
);

Then(
    '{string} does not see white board bar on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} does not see white board bar on Teacher App`,
            async function () {
                await teacherSeesWhiteboardBarOnTeacherApp(teacher, false);
            }
        );
    }
);

Then(
    '{string} sees white board icon on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees white board icon on Teacher App`,
            async function () {
                await teacherSeesAnnotateIconOnTeacherApp(teacher, true);
            }
        );
    }
);

Then(
    '{string} still sees white board icon on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} still sees white board icon on Teacher App`,
            async function () {
                await teacherSeesAnnotateIconOnTeacherApp(teacher, true);
            }
        );
    }
);

Then(
    '{string} still sees white board icon on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} still sees white board icon on Learner App`,
            async function () {
                await learnerSeesAnnotateIconOnLearnerApp(learner, false);
            }
        );
    }
);
