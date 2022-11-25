import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { teacherDoesNotSeeAnnotateIconInStudentListOnTeacherApp } from './lesson-annotate-icon-when-teacher-does-not-share-pdf-definitions';
import { getTeacherInterfaceFromRole } from './utils';
import { teacherStopShareMaterialOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-shares-file-definitions';

When(
    `{string} does not share any material on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} does not share any material on Teacher App`,
            async function () {
                await teacherStopShareMaterialOnTeacherApp(teacher);
            }
        );
    }
);

When(
    `{string} stops sharing pdf on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`${role} stops sharing pdf on Teacher App`, async function () {
            await teacherStopShareMaterialOnTeacherApp(teacher);
        });
    }
);

Then(
    `{string} does not see annotate icon in student list on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} does not see annotate icon in student list on Teacher App`,
            async function () {
                await teacherDoesNotSeeAnnotateIconInStudentListOnTeacherApp(teacher);
            }
        );
    }
);
