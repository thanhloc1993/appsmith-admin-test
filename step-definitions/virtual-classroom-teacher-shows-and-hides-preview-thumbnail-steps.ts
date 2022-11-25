import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getTeacherInterfaceFromRole, splitRolesStringToAccountRoles } from './utils';
import { teacherSeesPreviewButtonOnMainBar } from './virtual-classroom-teacher-cannot-see-preview-button-in-the-main-bar-definitions';
import {
    teacherDoesNotSeePdfSlide,
    teacherHidesPreviewThumbnail,
    teacherSeesPdfSlide,
    teacherSeesThePageInSlide,
    teacherShowsPreviewThumbnail,
} from './virtual-classroom-teacher-shows-and-hides-preview-thumbnail-definitions';

When(`{string} shows preview thumbnail`, async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} shows preview thumbnail`, async function () {
        await teacherShowsPreviewThumbnail(teacher);
    });
});

When(`{string} hides preview thumbnail`, async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} hides preview thumbnail`, async function () {
        await teacherHidesPreviewThumbnail(teacher);
    });
});

Given(`{string} has shown preview thumbnail`, async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} has shown preview thumbnail`, async function () {
        await teacherShowsPreviewThumbnail(teacher);
    });
});

Given(`{string} have shown preview thumbnail`, async function (roles: string) {
    const teacherRoles = splitRolesStringToAccountRoles(roles);
    for (const teacherRole of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(`${teacherRole} has shown preview thumbnail`, async function () {
            await teacherShowsPreviewThumbnail(teacher);
        });
    }
});

Then(
    `{string} sees active Preview icon in the main bar on Teacher App`,
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees active Preview icon in the main bar on Teacher App`,
            async function () {
                await teacherSeesPreviewButtonOnMainBar(teacher, true);
            }
        );
    }
);

Then(`{string} sees pdf slide on the left side`, async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} sees pdf slide on the left side`, async function () {
        await teacherSeesPdfSlide(teacher);
    });
});

Then(`{string} do not see pdf slide on the left side`, async function (roles: string) {
    const teacherRoles = splitRolesStringToAccountRoles(roles);
    for (const teacherRole of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        await teacher.instruction(
            `${teacherRole} does not see pdf slide on the left side`,
            async function () {
                await teacherDoesNotSeePdfSlide(teacher);
            }
        );
    }
});

Then(`{string} does not see pdf slide on the left side`, async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} does not see pdf slide on the left side`, async function () {
        await teacherDoesNotSeePdfSlide(teacher);
    });
});

Then(
    `{string} sees the first pdf page is framed and displayed in the beginning of the slide`,
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees the first pdf page is framed and displayed in the beginning of the slide`,
            async function () {
                await teacherSeesThePageInSlide(teacher, 0, true);
            }
        );
    }
);

Given(
    `{string} see the first pdf page is framed and displayed in the beginning of the slide`,
    async function (roles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} sees the first pdf page is framed and displayed in the beginning of the slide`,
                async function () {
                    await teacherSeesThePageInSlide(teacher, 0, true);
                }
            );
        }
    }
);
