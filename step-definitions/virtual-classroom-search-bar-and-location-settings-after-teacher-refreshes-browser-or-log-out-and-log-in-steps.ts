import { When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getTeacherInterfaceFromRole } from './utils';
import { teacherLogoutsTeacherApp } from './virtual-classroom-search-bar-and-location-settings-after-teacher-refreshes-browser-or-log-out-and-log-in-definitions';

When('{string} logs out of Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} logs out of Teacher App`, async function () {
        await teacherLogoutsTeacherApp(teacher);
    });
});
