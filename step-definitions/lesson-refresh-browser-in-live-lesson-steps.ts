import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerBacksToLessonPage,
    teacherBacksToLessonDetailScreenOnTeacherApp,
} from './lesson-leave-lesson-definitions';
import { teacherDoesNotSeeStudentInStudentListOnTeacherApp } from './lesson-refresh-browser-in-live-lesson-definitions';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    getUserIdFromContextWithAccountRole,
} from './utils';
import { teacherTapsUserButtonToShowStudentList } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';

When(
    '{string} refreshes their browser on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} refreshes their browser on Teacher App`,
            async function () {
                await teacher.flutterDriver?.reload();
            }
        );
    }
);

When(
    '{string} refreshes their browser on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} refreshes their browser on Learner App`,
            async function () {
                await learner.flutterDriver?.reload();
            }
        );
    }
);

Then(
    '{string} is redirected to lesson detail info page on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} is redirected to lesson detail info page on Teacher App`,
            async function () {
                await teacherBacksToLessonDetailScreenOnTeacherApp(teacher);
            }
        );
    }
);

Then(
    '{string} is redirected to lesson list on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} is redirected to lesson list on Learner App`,
            async function () {
                await learnerBacksToLessonPage(learner);
            }
        );
    }
);

Then(
    '{string} does not see student in student list on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const learnerId = getUserIdFromContextWithAccountRole(this.scenario, 'student');
        await teacher.instruction(
            `${teacherRole} does not see student in student list on Teacher App`,
            async function () {
                await teacherTapsUserButtonToShowStudentList(teacher);
                await teacherDoesNotSeeStudentInStudentListOnTeacherApp(teacher, learnerId);
            }
        );
    }
);
