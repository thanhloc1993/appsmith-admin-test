import { Given } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { seesWaitingRoomBannerOnTeacherApp } from './lesson-teacher-verify-lesson-definitions';
import { getTeacherInterfaceFromRole } from './utils';
import { getCreatedLessonInfoOfLessonManagement } from 'step-definitions/lesson-management-utils';
import { goesToLessonWaitingRoomOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/lesson-teacher-join-lesson-definitions';

Given(
    '{string} has gone to lesson waiting room on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        const lessonInfo = getCreatedLessonInfoOfLessonManagement(scenario);

        await teacher.instruction(
            `${role} has gone to lesson waiting room on Teacher App`,
            async function () {
                await goesToLessonWaitingRoomOnTeacherApp({ teacher, ...lessonInfo });
                await seesWaitingRoomBannerOnTeacherApp(teacher);
            }
        );
    }
);
