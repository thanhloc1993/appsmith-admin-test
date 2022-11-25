import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { teacherSeesShareScreenIconOnTeacherApp } from './lesson-share-screen-definitions';
import { getTeacherInterfaceFromRole } from './utils';

Then(
    '{string} still sees {string} share screen icon on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, state: string) {
        const active = state === 'active';
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} still sees ${state} share screen icon on Teacher App`,
            async function () {
                await teacherSeesShareScreenIconOnTeacherApp(teacher, active);
            }
        );
    }
);
