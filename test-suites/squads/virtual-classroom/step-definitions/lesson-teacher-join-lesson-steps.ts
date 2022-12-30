import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { When, Then, Given } from '@cucumber/cucumber';

import { AccountRoles, TeacherInterface } from '@supports/app-types';

import {
    getUserIdFromRole,
    splitRolesStringToAccountRoles,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasCourseId, aliasLessonId } from 'test-suites/squads/lesson/common/alias-keys';
import {
    goesToLessonWaitingRoomOnTeacherApp,
    interactiveEndLessonTeacher,
    teacherInteractOnTeacherApp,
    teacherJoinedLessonSuccess,
    teacherSeesItselfStreamInGalleryViewOnTeacherApp,
    whenTeacherJoinsLessonOfLessonManagement,
} from 'test-suites/squads/virtual-classroom/step-definitions/lesson-teacher-join-lesson-definitions';
import { teacherSeesCameraViewInGalleryViewOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-speaker-and-camera-definitions';

Given(
    '{string} has joined lesson of lesson management on Teacher App',
    { timeout: 80000 },
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const isFirstTeacher = role !== 'teacher T2';
        const scenario = this.scenario;
        const courseId = scenario.get(aliasCourseId);
        const lessonId = scenario.get(aliasLessonId);

        await teacher.instruction(
            `${role} joins lesson of lesson management on Teacher App`,
            async function () {
                await whenTeacherJoinsLessonOfLessonManagement({
                    teacher,
                    isFirstTeacher,
                    courseId,
                    lessonId,
                });
            }
        );
    }
);

Then('{string} see itself in gallery view on Teacher App', async function (roles: string) {
    const teacherRoles = splitRolesStringToAccountRoles(roles);
    for (const role of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const teacherUserInfo = getUserProfileFromContext(
            this.scenario,
            staffProfileAliasWithAccountRoleSuffix(role)
        );
        await teacher.instruction(
            `${role} sees all teacher in gallery view on Teacher App`,
            async function () {
                await teacherJoinedLessonSuccess(teacher);
                await teacherSeesItselfStreamInGalleryViewOnTeacherApp(teacher, teacherUserInfo.id);
            }
        );
    }
});

Then('{string} see student in gallery view on Teacher App', async function (roles: string) {
    const scenario = this.scenario;
    const teacherRoles = splitRolesStringToAccountRoles(roles);
    for (const role of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const learnerId = getUserIdFromRole(scenario, 'student');
        await teacher.instruction(
            `${role} sees student in gallery view on Teacher App`,
            async function () {
                await teacherSeesCameraViewInGalleryViewOnTeacherApp(teacher, learnerId, true);
            }
        );
    }
});

Then('{string} sees student in gallery view on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    const learnerId = getUserIdFromRole(this.scenario, 'student');
    await teacher.instruction(
        `${role} sees student in gallery view on Teacher App`,
        async function () {
            await teacherSeesCameraViewInGalleryViewOnTeacherApp(teacher, learnerId, true);
        }
    );
});

Then('{string} ends lesson on Teacher App', async function (role: AccountRoles) {
    const roles = role.split(', ');

    for (const teacherRole of roles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole as AccountRoles);
        await teacher.instruction(
            `${teacherRole} end lesson`,
            async function (this: TeacherInterface) {
                await interactiveEndLessonTeacher(this);
            }
        );
    }
});

When('{string} goes to lesson waiting room on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    const scenario = this.scenario;
    const courseId = scenario.get(aliasCourseId);
    const lessonId = scenario.get(aliasLessonId);

    await teacher.instruction(
        `${role} goes to lesson waiting room on Teacher App`,
        async function () {
            await goesToLessonWaitingRoomOnTeacherApp({
                teacher,
                courseId,
                lessonId,
            });
        }
    );
});

Then('{string} can not interact on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(`${role} can not interact on Teacher App`, async function (teacher) {
        await teacherInteractOnTeacherApp(teacher, false);
    });
});

Given(
    '{string} have joined lesson of lesson management on Teacher App',
    { timeout: 200000 },
    async function (roles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);

        const scenario = this.scenario;
        const courseId = scenario.get(aliasCourseId);
        const lessonId = scenario.get(aliasLessonId);

        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            const isFirstTeacher = teacherRole !== 'teacher T2';

            await teacher.instruction(
                `${teacherRole} has joined lesson of lesson management on Teacher App`,
                async function () {
                    await whenTeacherJoinsLessonOfLessonManagement({
                        teacher,
                        isFirstTeacher,
                        courseId,
                        lessonId,
                    });
                }
            );
        }
    }
);

When(
    '{string} joins lesson of lesson management on Teacher App',
    { timeout: 80000 },
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const isFirstTeacher = role !== 'teacher T2';
        const scenario = this.scenario;
        const courseId = scenario.get(aliasCourseId);
        const lessonId = scenario.get(aliasLessonId);

        await teacher.instruction(`${role} joins lesson on Teacher App`, async function () {
            await whenTeacherJoinsLessonOfLessonManagement({
                teacher,
                isFirstTeacher,
                courseId,
                lessonId,
            });
        });
    }
);
