import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { splitRolesStringToAccountRoles } from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasMaterialId } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonMaterial } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    checkStatusShareMaterialButtonOnTeacherApp,
    teacherDoesNotSeeSharingMaterialOnTeacherApp,
    teacherSeesSharingLessonMaterialOfLessonManagementOnTeacherApp,
    teacherStopShareMaterialOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-shares-file-definitions';
import { teacherSharesMaterialOnTeacherApp } from 'test-suites/squads/virtual-classroom/utils/lesson';
import { ButtonStatus } from 'test-suites/squads/virtual-classroom/utils/types';

Given(
    "{string} has shared lesson's {string} under gallery view on Teacher App",
    async function (role: AccountRoles, material: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(`${role} shares ${material}`, async function () {
            await teacherSharesMaterialOnTeacherApp(teacher, mediaId);
        });
    }
);

When(
    "{string} shares lesson's {string} under gallery view on Teacher App",
    async function (role: AccountRoles, material: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(`${role} shares ${material}`, async function (teacher) {
            await teacherSharesMaterialOnTeacherApp(teacher, mediaId);
        });
    }
);

Then(
    "{string} sees sharing lesson's {string} under gallery view on Teacher App",
    async function (role: AccountRoles, material: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(`${role} sees sharing ${material}`, async function (teacher) {
            await teacherSeesSharingLessonMaterialOfLessonManagementOnTeacherApp(
                teacher,
                material,
                mediaId
            );
        });
    }
);

Then(
    '{string} sees {string} share material icon on Teacher App',
    async function (role: AccountRoles, buttonStatus: ButtonStatus) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${teacher} sees share material button is ${buttonStatus}`,
            async function (teacher) {
                await checkStatusShareMaterialButtonOnTeacherApp(teacher, buttonStatus);
            }
        );
    }
);

Then(
    '{string} see {string} share material icon on Teacher App',
    async function (roles: string, buttonStatus: ButtonStatus) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);

            await teacher.instruction(
                `${teacher} sees share material button is ${buttonStatus}`,
                async function (teacher) {
                    await checkStatusShareMaterialButtonOnTeacherApp(teacher, buttonStatus);
                }
            );
        }
    }
);

When('{string} stops sharing material on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(`${role} click stop share material button`, async function (teacher) {
        await teacherStopShareMaterialOnTeacherApp(teacher);
    });
});

Then(
    "{string} does not see lesson's {string} under gallery view on Teacher App",
    async function (role: AccountRoles, material: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(
            `${role} can't see material content after stop share material`,
            async function (teacher) {
                await teacherDoesNotSeeSharingMaterialOnTeacherApp(teacher, mediaId);
            }
        );
    }
);

Then(
    "{string} sees lesson's {string} under gallery view on Teacher App",
    async function (role: AccountRoles, material: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(`${role} sees the new ${material}`, async function (teacher) {
            await teacherSeesSharingLessonMaterialOfLessonManagementOnTeacherApp(
                teacher,
                material,
                mediaId
            );
        });
    }
);
