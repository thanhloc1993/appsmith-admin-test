import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { seesWaitingRoomBannerOnTeacherApp } from './lesson-teacher-verify-lesson-definitions';
import { getTeacherInterfaceFromRole } from './utils';

Then(
    '{string} sees waiting room banner on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} sees waiting room banner on Teacher App`,
            async function (teacher) {
                await seesWaitingRoomBannerOnTeacherApp(teacher);
            }
        );
    }
);
