import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    removeStudentFromLesson,
    removeTeacherFromLesson,
} from './lesson-edit-lesson-by-removing-definitions';
import {
    assertStudentOnStudentListOfCourseOnTeacherApp,
    getLessonDataOnLessonDetailPage,
    getUserProfileAliasByRole,
} from './lesson-edit-lesson-by-updating-and-adding-definitions';
import {
    getCMSInterfaceByRole,
    getTeacherInterfaceFromRole,
    getUserProfileFromContext,
} from './utils';
import {
    aliasCourseId,
    aliasCourseIdByStudent,
    aliasLessonId,
} from 'step-definitions/alias-keys/lesson';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

Given(
    '{string} has removed {string} from the lesson',
    async function (this: IMasterWorld, role: AccountRoles, secondRole: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const { isTeacher, profileAlias } = getUserProfileAliasByRole(secondRole);
        const { id: userId, name: userName } = getUserProfileFromContext(scenario, profileAlias);

        await cms.instruction(`${role} removes ${secondRole} from the lesson`, async function () {
            if (isTeacher) {
                await removeTeacherFromLesson(cms, userName);
                return;
            }

            const courseId = scenario.get(aliasCourseIdByStudent(userId));
            const studentSubscriptionId = userId + courseId;
            await removeStudentFromLesson(cms, studentSubscriptionId);
        });
    }
);

When(
    '{string} removes {string} from the lesson',
    async function (this: IMasterWorld, role: AccountRoles, secondRole: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const { isTeacher, profileAlias } = getUserProfileAliasByRole(secondRole);
        const { id: userId, name: userName } = getUserProfileFromContext(scenario, profileAlias);

        await cms.instruction(`${role} removes ${secondRole} from the lesson`, async function () {
            if (isTeacher) {
                await removeTeacherFromLesson(cms, userName);
                return;
            }

            const courseId = scenario.get(aliasCourseIdByStudent(userId));
            const studentSubscriptionId = userId + courseId;
            await removeStudentFromLesson(cms, studentSubscriptionId);
        });
    }
);

Then(
    '{string} does not see {string} in detailed lesson info page on CMS',
    async function (this: IMasterWorld, role: AccountRoles, secondRole: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const { isTeacher, profileAlias } = getUserProfileAliasByRole(secondRole);

        const { name: userName } = getUserProfileFromContext(scenario, profileAlias);
        const { teacherNames, studentNames } = await getLessonDataOnLessonDetailPage(cms);
        const desireNameNotContainUsername = isTeacher ? teacherNames : studentNames;

        await cms.instruction(
            `${role} does not see ${secondRole} in detailed lesson info page on CMS`,
            async function () {
                weExpect(desireNameNotContainUsername).not.toContain(userName);
            }
        );
    }
);

Then(
    '{string} does not see {string} in student list of {string} lesson on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        secondRole: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);

        const courseId = scenario.get(aliasCourseId);
        const lessonId = scenario.get(aliasLessonId);
        const { id: studentId } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix(secondRole)
        );

        await teacher.instruction(
            `${role} does not see ${secondRole} in student list of ${lessonTime} lesson on Teacher App`,
            async function () {
                await assertStudentOnStudentListOfCourseOnTeacherApp({
                    teacher,
                    courseId,
                    lessonId,
                    studentId,
                    lessonTime,
                    shouldBeOnList: false,
                });
            }
        );
    }
);
