import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { VisibleState } from '../utils/types';
import {
    assertMovePdfControllerVisibleOnTeacherApp,
    assertSharingPdfWithZoomRatio,
    assertZoomInAndOutControllerVisibleOnTeacherApp,
    seesDefaultPenToolIconInWhiteBoardOnLearnerApp,
    seesDefaultPenToolIconInWhiteBoardOnTeacherApp,
    selectsZoomInTool,
    zoomsInPdfOnTeacher,
    zoomsOutPdfOnTeacher,
} from './teacher-can-zoom-on-pdf-definitions';
import {
    getLearnerInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';

Given(`{string} has selected zoom tool on Teacher App`, async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} has selected zoom tool on Teacher App`, async function () {
        await selectsZoomInTool(teacher, {});
    });
});

Given(`{string} have selected zoom tool on Teacher App`, async function (rawRoles: string) {
    const teacherRoles = splitRolesStringToAccountRoles(rawRoles);
    for (const teacherRole of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(
            `${teacherRole} has selected zoom tool on Teacher App`,
            async function () {
                await selectsZoomInTool(teacher, {});
            }
        );
    }
});

Given(
    `{string} has zoomed in {string} time on Teacher App`,
    async function (role: AccountRoles, click: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const count: number = parseInt(click);
        await teacher.instruction(
            `${role} has zoomed in ${click} time on Teacher App`,
            async function () {
                await zoomsInPdfOnTeacher(teacher, count);
            }
        );
    }
);

Given(
    `{string} have seen sharing pdf with zoom ratio is {string}% on Teacher App`,
    async function (role: AccountRoles, percentage: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} have seen sharing pdf with zoom ratio is ${percentage}% on Teacher App`,
            async function () {
                await assertSharingPdfWithZoomRatio(teacher, percentage);
            }
        );
    }
);

When(`{string} selects zoom tool on Teacher App`, async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} selects zoom tool on Teacher App`, async function () {
        await selectsZoomInTool(teacher, {});
    });
});

When(`{string} select zoom tool on Teacher App`, async function (rawRoles: string) {
    const teacherRoles = splitRolesStringToAccountRoles(rawRoles);
    for (const teacherRole of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(
            `${teacherRole} selects zoom tool on Teacher App`,
            async function () {
                await selectsZoomInTool(teacher, {});
            }
        );
    }
});

When(
    `{string} zooms in {string} time on Teacher App`,
    async function (role: AccountRoles, click: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const count: number = parseInt(click);
        await teacher.instruction(
            `${role} zooms in ${click} time on Teacher App`,
            async function () {
                await zoomsInPdfOnTeacher(teacher, count);
            }
        );
    }
);

When(
    `{string} zooms out {string} time on Teacher App`,
    async function (role: AccountRoles, click: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const count: number = parseInt(click);
        await teacher.instruction(
            `${role} zooms out ${click} time on Teacher App`,
            async function () {
                await zoomsOutPdfOnTeacher(teacher, count);
            }
        );
    }
);

Then(
    `{string} sees default pen tool icon in white board on Teacher App`,
    async function (teacherRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(
            `${teacherRole} sees default pen tool icon in white board on Teacher App`,
            async function () {
                await seesDefaultPenToolIconInWhiteBoardOnTeacherApp(teacher);
            }
        );
    }
);

Then(
    `{string} see default pen tool icon in white board on Teacher App`,
    async function (rawRoles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(rawRoles);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} sees default pen tool icon in white board on Teacher App`,
                async function () {
                    await seesDefaultPenToolIconInWhiteBoardOnTeacherApp(teacher);
                }
            );
        }
    }
);

Then(
    `{string} {string} zoom in & out button and move controller on Teacher App`,
    async function (rawRoles: string, visibleState: VisibleState) {
        const teacherRoles = splitRolesStringToAccountRoles(rawRoles);
        const visible = visibleState === 'can see';
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} ${visibleState} zoom in & out button and move controller on Teacher App`,
                async function () {
                    await assertZoomInAndOutControllerVisibleOnTeacherApp(teacher, visible);
                    await assertMovePdfControllerVisibleOnTeacherApp(teacher, visible);
                }
            );
        }
    }
);

Then(
    `{string} see sharing pdf with zoom ratio is {string}% on Teacher App`,
    async function (rawRoles: string, percentage: string) {
        const teacherRoles = splitRolesStringToAccountRoles(rawRoles);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} see sharing pdf with zoom ratio is ${percentage}% on Teacher App`,
                async function () {
                    await assertSharingPdfWithZoomRatio(teacher, percentage);
                }
            );
        }
    }
);

Then(
    `{string} sees default pen tool icon in white board on Learner App`,
    async function (learnerRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        await learner.instruction(
            `${learnerRole} sees default pen tool icon in white board on Learner App`,
            async function () {
                await seesDefaultPenToolIconInWhiteBoardOnLearnerApp(learner);
            }
        );
    }
);
