import { getTeacherInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { learnerJoinsLesson, learnerJoinsLessonSuccessfully } from '../utils/navigation';
import { VisibleState } from '../utils/types';
import {
    assertStudentVisibleInJoinedSectionStudentListOnTeacherApp,
    assertStudentVisibleInUnjoinedSectionStudentListOnTeacherApp,
} from './user-sees-current-joined-unjoined-section-definitions';
import {
    getLearnerInterfaceFromRole,
    getUserIdFromRole,
    splitRolesStringToAccountRoles,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { aliasLessonId, aliasLessonName } from 'test-suites/squads/lesson/common/alias-keys';

Given(
    '{string} have joined lesson on Learner App',
    { timeout: 200000 },
    async function (roles: string) {
        const learnerRoles = splitRolesStringToAccountRoles(roles);

        for (const learnerRole of learnerRoles) {
            const learner = getLearnerInterfaceFromRole(this, learnerRole);
            const lessonId = this.scenario.get(aliasLessonId);
            const lessonName = this.scenario.get(aliasLessonName);

            await learner.instruction(
                `${learnerRole} has joined lesson on Learner App`,
                async function () {
                    await learnerJoinsLesson(learner, lessonId, lessonName);
                    await learnerJoinsLessonSuccessfully(learner);
                }
            );
        }
    }
);

Then(
    `{string} {string} {string} in Joined section student list on Teacher App`,
    async function (role: AccountRoles, visibleState: VisibleState, studentRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const studentUserId = getUserIdFromRole(this.scenario, studentRole);
        const visible = visibleState === 'can see';
        await teacher.instruction(
            `{string} {string} {string} in Joined section student list on Teacher App`,
            async function () {
                await assertStudentVisibleInJoinedSectionStudentListOnTeacherApp(
                    teacher,
                    studentUserId,
                    visible
                );
            }
        );
    }
);

Then(
    `{string} {string} {string} in Unjoined section student list on Teacher App`,
    async function (role: AccountRoles, visibleState: VisibleState, studentRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const studentUserId = getUserIdFromRole(this.scenario, studentRole);
        const visible = visibleState === 'can see';
        await teacher.instruction(
            `{string} {string} {string} in Unjoined section student list on Teacher App`,
            async function () {
                await assertStudentVisibleInUnjoinedSectionStudentListOnTeacherApp(
                    teacher,
                    studentUserId,
                    visible
                );
            }
        );
    }
);
