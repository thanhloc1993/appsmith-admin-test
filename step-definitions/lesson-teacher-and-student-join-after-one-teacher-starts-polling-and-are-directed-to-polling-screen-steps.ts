import { Then } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import { teacherIsNotRedirectedToSetUpPollingPageOnTeacherApp } from './lesson-teacher-and-student-join-after-one-teacher-starts-polling-and-are-directed-to-polling-screen-definitions';
import { getTeacherInterfaceFromRole } from './utils';

Then(
    '{string} is not redirected to set up polling page with 4 default options on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} is not redirected to set up polling page with 4 default options on Teacher App`,
            async function () {
                await teacherIsNotRedirectedToSetUpPollingPageOnTeacherApp(teacher);
            }
        );
    }
);
