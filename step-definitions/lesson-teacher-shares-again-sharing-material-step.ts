import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';
import { aliasMaterialId } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonMaterialMultipleType } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { learnerSeesSharingMaterialOnLearnerApp } from 'test-suites/squads/virtual-classroom/step-definitions/learner-shares-file-definitions';
import { teacherSeesSharingLessonMaterialOfLessonManagementOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-shares-file-definitions';
import { teacherSharesMaterialOnTeacherApp } from 'test-suites/squads/virtual-classroom/utils/lesson';

When(
    "{string} shares again lesson's {string} on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialMultipleType) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(
            `${role} shares again ${material} on Teacher App`,
            async function () {
                await teacherSharesMaterialOnTeacherApp(teacher, mediaId);
            }
        );
    }
);

Then(
    "{string} still sees current lesson's {string} normally on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialMultipleType) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(`${role} see ${material}`, async function () {
            await teacherSeesSharingLessonMaterialOfLessonManagementOnTeacherApp(
                teacher,
                material,
                mediaId
            );
        });
    }
);

Then(
    '{string} still sees current {string} normally on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialMultipleType) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} see still sees ${material}`, async function () {
            await learnerSeesSharingMaterialOnLearnerApp(learner, material);
        });
    }
);
