import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    goesToPageByControlBarOnTeacherApp,
    seesPageOfSharingPdfOnLearnerApp,
    seesPageOfSharingPdfOnTeacherApp,
} from './lesson-change-page-definitions';
import { learnerSeesNewFileFromBeginningOnLearnerApp } from './lesson-two-teachers-share-and-interact-on-file-definitions';
import { StatusShareMaterialButton } from './lesson-utils';
import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';
import { aliasMaterialId } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonMaterial } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { learnerDoesNotSeeSharingMaterialOnLearnerApp } from 'test-suites/squads/virtual-classroom/step-definitions/learner-shares-file-definitions';
import {
    checkStatusShareMaterialButtonOnTeacherApp,
    teacherDoesNotSeeSharingMaterialOnTeacherApp,
    teacherSeesSharingLessonMaterialOfLessonManagementOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-shares-file-definitions';
import { teacherSharesMaterialOnTeacherApp } from 'test-suites/squads/virtual-classroom/utils/lesson';

Given(
    `{string} has changed page of pdf 1 on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId['pdf 1']);

        await teacher.instruction(
            `${role} has changed page of pdf 1 on Teacher App`,
            async function () {
                await teacherSharesMaterialOnTeacherApp(teacher, mediaId);
                await goesToPageByControlBarOnTeacherApp(teacher, 'the next page');
            }
        );
    }
);

Given(
    `{string} has shared lesson's {string} on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(
            `${role} has shared lesson's ${material} on Teacher App`,
            async function () {
                await teacherSharesMaterialOnTeacherApp(teacher, mediaId);
            }
        );
    }
);

When(
    `{string} shares lesson's {string} on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(
            `${role} shares lesson's ${material} on Teacher App`,
            async function () {
                await teacherSharesMaterialOnTeacherApp(teacher, mediaId);
            }
        );
    }
);

Then(
    "all teachers see lesson's {string} from the beginning on Teacher App",
    async function (this: IMasterWorld, material: LessonMaterial) {
        const mediaId = this.scenario.get(aliasMaterialId[material]);
        const teacherRoles: AccountRoles[] = ['teacher T1', 'teacher T2'];

        for (const role of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, role);

            await teacher.instruction(
                `${role} sees lesson's ${material} from the beginning on Teacher App`,
                async function () {
                    await teacherSeesSharingLessonMaterialOfLessonManagementOnTeacherApp(
                        teacher,
                        material,
                        mediaId
                    );
                }
            );
        }
    }
);

Then(
    `all teachers see lesson's pdf 1 from the previous page on Teacher App`,
    async function (this: IMasterWorld) {
        const mediaId = this.scenario.get(aliasMaterialId['pdf 1']);
        const teacherRoles: AccountRoles[] = ['teacher T1', 'teacher T2'];

        for (const role of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, role);
            await teacher.instruction(
                `${role} sees pdf 1 from the previous page on Teacher App`,
                async function () {
                    await teacherSeesSharingLessonMaterialOfLessonManagementOnTeacherApp(
                        teacher,
                        'pdf 1',
                        mediaId
                    );
                    await seesPageOfSharingPdfOnTeacherApp(teacher, 2);
                }
            );
        }
    }
);
Then(
    `all teachers see {string} share material icon on Teacher App`,
    async function (this: IMasterWorld, status: StatusShareMaterialButton) {
        const teacherRoles: AccountRoles[] = ['teacher T1', 'teacher T2'];
        for (const role of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, role);
            await teacher.instruction(
                `Teacher sees ${status} share material icon on Teacher App`,
                async function () {
                    await checkStatusShareMaterialButtonOnTeacherApp(teacher, status);
                }
            );
        }
    }
);

Then(
    `all teachers do not see lesson's {string} on Teacher App`,
    async function (this: IMasterWorld, file: LessonMaterial) {
        const { scenario } = this!;
        const mediaId = scenario.get(aliasMaterialId[file]);
        const teacherRoles: AccountRoles[] = ['teacher T1', 'teacher T2'];

        for (const role of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, role);
            await teacher.instruction(
                `${role} does not see lesson's  ${file} on Teacher App`,
                async function () {
                    await teacherDoesNotSeeSharingMaterialOnTeacherApp(teacher, mediaId);
                }
            );
        }
    }
);

Then(
    `{string} sees {string} from the beginning on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterial) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} sees ${material} from the beginning on Learner App`,
            async function () {
                await learnerSeesNewFileFromBeginningOnLearnerApp(learner, material);
            }
        );
    }
);
Then(
    `{string} sees pdf 1 from the previous page on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees pdf 1 from the previous page on Learner App`,
            async function () {
                await seesPageOfSharingPdfOnLearnerApp(learner, 2);
            }
        );
    }
);
Then(
    `{string} does not see {string} on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles, file: LessonMaterial) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} does not see ${file} on Learner App`, async function () {
            await learnerDoesNotSeeSharingMaterialOnLearnerApp(learner);
        });
    }
);
