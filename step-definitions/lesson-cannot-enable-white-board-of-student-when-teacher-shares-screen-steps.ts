import { When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getTeacherInterfaceFromRole } from './utils';
import { teacherTapsUserButtonToShowStudentList } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';

When(
    '{string} opens student list on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(`${role} opens student list on Teacher App`, async function () {
            await teacherTapsUserButtonToShowStudentList(teacher);
        });
    }
);
