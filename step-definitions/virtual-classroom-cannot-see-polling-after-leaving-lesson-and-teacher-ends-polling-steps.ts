import { Then } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import { teacherDoesNotSeePollingStatsPageOnTeacherApp } from './lesson-hide-or-show-again-polling-definitions';
import { getTeacherInterfaceFromRole } from './utils';
import { teacherDoesNotSeePollingDetailPageOnTeacherApp } from './virtual-classroom-cannot-see-polling-after-leaving-lesson-and-teacher-ends-polling-definitions';

Then(
    '{string} is not redirected to current polling page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} is not redirected to current polling page`,
            async function () {
                await teacherDoesNotSeePollingStatsPageOnTeacherApp(teacher);
                await teacherDoesNotSeePollingDetailPageOnTeacherApp(teacher);
            }
        );
    }
);
