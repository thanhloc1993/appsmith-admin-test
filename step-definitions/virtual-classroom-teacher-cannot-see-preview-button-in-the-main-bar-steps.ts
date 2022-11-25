import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getTeacherInterfaceFromRole } from './utils';
import {
    teacherCannotSeePreviewButtonOnMainBar,
    teacherSeesPreviewButtonOnMainBar,
} from './virtual-classroom-teacher-cannot-see-preview-button-in-the-main-bar-definitions';

Then(
    '{string} sees inactive Preview icon in the main bar on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} sees inactive Preview icon in the main bar on Teacher App`,
            async function () {
                await teacherSeesPreviewButtonOnMainBar(teacher, false);
            }
        );
    }
);

Then(
    '{string} does not see Preview icon in the main bar on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} does not see Preview icon in the main bar on Teacher App`,
            async function () {
                await teacherCannotSeePreviewButtonOnMainBar(teacher);
            }
        );
    }
);
