import { Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    teacherSeesPollingAccuracyOnTeacherApp,
    teacherSeesPollingSubmissionOnTeacherApp,
} from './lesson-teacher-can-see-stats-is-changed-after-student-submits-answer-definitions';
import { splitRolesStringToAccountRoles, getTeacherInterfaceFromRole } from './utils';

Then(
    '{string} see submission is {string}',
    async function (this: IMasterWorld, roles: string, submission: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} sees submission is ${submission} on Teacher App`,
                async function () {
                    await teacherSeesPollingSubmissionOnTeacherApp(teacher, submission);
                }
            );
        }
    }
);

Then(
    '{string} see accuracy is {string}',
    async function (this: IMasterWorld, roles: string, accuracy: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} sees accuracy is ${accuracy} on Teacher App`,
                async function () {
                    await teacherSeesPollingAccuracyOnTeacherApp(teacher, accuracy);
                }
            );
        }
    }
);
