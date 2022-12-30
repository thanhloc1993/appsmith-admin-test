import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerContinuesLessonNormallyOnLearnerApp,
    teacherContinuesLessonNormallyOnTeacherApp,
} from './lesson-continue-live-lesson-definitions';
import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';
import {
    learnerInteractOnLearnerApp,
    teacherInteractOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/lesson-teacher-join-lesson-definitions';

Then(
    '{string} continues lesson normally on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} continues lesson normally on Teacher App`,
            async function () {
                await teacherContinuesLessonNormallyOnTeacherApp(teacher);
            }
        );
    }
);

Then(
    '{string} continues lesson normally on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} continues lesson normally on Learner App`,
            async function () {
                await learnerContinuesLessonNormallyOnLearnerApp(learner);
            }
        );
    }
);

Then(
    '{string} still interacts normally on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} still interacts normally on Teacher App`,
            async function () {
                await teacherInteractOnTeacherApp(teacher, true);
            }
        );
    }
);

Then(
    '{string} still interacts normally on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} still interacts normally on Learner App`,
            async function () {
                await learnerInteractOnLearnerApp(learner, true);
            }
        );
    }
);
