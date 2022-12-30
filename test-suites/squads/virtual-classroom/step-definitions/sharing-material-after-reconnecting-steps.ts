import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
} from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasMaterialId } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonMaterialMultipleType } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    learnerSeesPdfOnLearnerApp,
    learnerSeesVideoOnLearnerApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/learner-shares-file-definitions';
import {
    teacherSeesPdfOnTeacherApp,
    teacherSeesVideoOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-shares-file-definitions';

Then(
    "{string} still sees lesson's {string} on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialMultipleType) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(
            `${role} still sees ${material} on Teacher App`,
            async function () {
                if (material.includes('pdf')) {
                    await teacherSeesPdfOnTeacherApp(teacher, mediaId, false);
                    return;
                }

                await teacherSeesVideoOnTeacherApp(teacher, mediaId, false);
                return;
            }
        );
    }
);

Then(
    '{string} sees {string} on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialMultipleType) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} sees ${material} on Learner App`, async function () {
            if (material.includes('pdf')) {
                await learnerSeesPdfOnLearnerApp(learner, false);
            } else {
                await learnerSeesVideoOnLearnerApp(learner, false);
            }
        });
    }
);

Then(
    '{string} still sees {string} on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialMultipleType) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} still sees ${material} on Learner App`,
            async function () {
                if (material.includes('pdf')) {
                    await learnerSeesPdfOnLearnerApp(learner, false);
                } else {
                    await learnerSeesVideoOnLearnerApp(learner, false);
                }
            }
        );
    }
);

Then(
    "{string} sees lesson's {string} on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialMultipleType) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(`${role} sees ${material} on Teacher App`, async function () {
            if (material.includes('pdf')) {
                await teacherSeesPdfOnTeacherApp(teacher, mediaId, false);
                return;
            }

            await teacherSeesVideoOnTeacherApp(teacher, mediaId, false);
            return;
        });
    }
);
