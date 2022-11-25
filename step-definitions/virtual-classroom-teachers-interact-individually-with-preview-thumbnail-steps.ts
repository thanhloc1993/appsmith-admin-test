import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from './utils';
import {
    teacherCannotSeePreviewButtonOnMainBar,
    teacherSeesPreviewButtonOnMainBar,
} from './virtual-classroom-teacher-cannot-see-preview-button-in-the-main-bar-definitions';
import { teacherSeesThePageInSlide } from './virtual-classroom-teacher-shows-and-hides-preview-thumbnail-definitions';
import {
    learnerSeesExactlyPagePDF,
    teacherSeesExactlyPagePDF,
    teacherSelectsThePageInSlide,
} from './virtual-classroom-teachers-interact-individually-with-preview-thumbnail-definitions';
import { aliasMaterialId } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonMaterial } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

When(
    `{string} selects second page on pdf slide`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`${role} selects second page on pdf slide`, async function () {
            await teacherSelectsThePageInSlide(teacher, 1, false);
        });
    }
);

Then(
    `{string} see the second pdf page is framed in the slide`,
    async function (this: IMasterWorld, roles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} see the second pdf page is framed in the slide`,
                async function () {
                    await teacherSeesThePageInSlide(teacher, 1, true);
                }
            );
        }
    }
);

Then(
    `{string} see the first pdf page is framed in the slide`,
    async function (this: IMasterWorld, roles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} see the first pdf page is framed in the slide`,
                async function () {
                    await teacherSeesThePageInSlide(teacher, 0, true);
                }
            );
        }
    }
);

Then(
    `{string} see active Preview icon in the main bar on Teacher App`,
    async function (this: IMasterWorld, roles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} sees active Preview icon in the main bar on Teacher App`,
                async function () {
                    await teacherSeesPreviewButtonOnMainBar(teacher, true);
                }
            );
        }
    }
);

Then(
    `{string} do not see Preview icon in the main bar on Teacher App`,
    async function (this: IMasterWorld, roles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} does not see Preview icon in the main bar on Teacher App`,
                async function () {
                    await teacherCannotSeePreviewButtonOnMainBar(teacher);
                }
            );
        }
    }
);

Then(
    `{string} see the second page of {string} on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);
        await teacher.instruction(
            `${role} see the second page of ${material} on Teacher App`,
            async function () {
                await teacherSeesExactlyPagePDF(teacher, mediaId, 2);
            }
        );
    }
);

Then(
    `{string} see the first page of {string} on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);
        await teacher.instruction(
            `${role} see the first page of ${material} on Teacher App`,
            async function () {
                await teacherSeesExactlyPagePDF(teacher, mediaId, 1);
            }
        );
    }
);

Then(
    `{string} see the second page of {string} on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterial) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} see the second page of ${material} on Learner App`,
            async function () {
                await learnerSeesExactlyPagePDF(learner, 2);
            }
        );
    }
);

Then(
    `{string} see the first page of {string} on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterial) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} see the first page of ${material} on Learner App`,
            async function () {
                await learnerSeesExactlyPagePDF(learner, 1);
            }
        );
    }
);
