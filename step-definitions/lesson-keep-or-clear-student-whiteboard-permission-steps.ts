import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { teacherDoesNotSeeAnnotateIconOfStudentInStudentListOnTeacherApp } from './lesson-keep-or-clear-student-whiteboard-permission-definitions';
import { teacherSeesAnnotateIconInStudentListOnTeacherApp } from './lesson-teacher-can-enable-or-disable-student-white-board-definitions';
import { getUserIdFromRole } from './lesson-utils';
import { getTeacherInterfaceFromRole } from './utils';

Then(
    '{string} still sees {string} {string} annotate icon in student list on Teacher App',
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        active: string,
        learnerRole: AccountRoles
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const learnerId = getUserIdFromRole(this, learnerRole);
        const iconActive = active === 'active';
        await teacher.instruction(
            `${teacherRole} sees ${active} ${learnerRole} annotate icon in student list on Teacher App`,
            async function () {
                await teacherSeesAnnotateIconInStudentListOnTeacherApp(
                    teacher,
                    learnerId,
                    iconActive
                );
            }
        );
    }
);

Then(
    '{string} does not see {string} annotate icon in student list on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const learnerId = getUserIdFromRole(this, learnerRole);
        await teacher.instruction(
            `${teacherRole} does not see ${learnerRole} annotate icon in student list on Teacher App`,
            async function () {
                await teacherDoesNotSeeAnnotateIconOfStudentInStudentListOnTeacherApp(
                    teacher,
                    learnerId
                );
            }
        );
    }
);
