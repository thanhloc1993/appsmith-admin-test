import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { teacherSeesShareScreenBarOnTeacherApp } from './lesson-share-screen-after-reconnecting-definitions';
import { teacherSeesShareScreenIconOnTeacherApp } from './lesson-share-screen-definitions';
import { getTeacherInterfaceFromRole } from './utils';

Then(
    '{string} does not share their entire screen anymore',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} does not share their entire screen anymore`,
            async function () {
                await teacherSeesShareScreenIconOnTeacherApp(teacher, false);
                await teacherSeesShareScreenBarOnTeacherApp(teacher, false);
            }
        );
    }
);
