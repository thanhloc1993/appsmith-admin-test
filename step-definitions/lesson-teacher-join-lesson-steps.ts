import { When, Then, Given } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld, TeacherInterface } from '@supports/app-types';

import { userIsShownInListCameraOnTeacherApp } from './lesson-leave-lesson-definitions';
import {
    teacherInteractOnTeacherApp,
    goesToLessonWaitingRoomOnTeacherApp,
    interactiveEndLessonTeacher,
    teacherJoinedLessonSuccess,
    teacherSeesAllTeacherStreamInGalleryViewOnTeacherApp,
    whenTeacherJoinsLessonOfLessonManagement,
} from './lesson-teacher-join-lesson-definitions';
import { getUserIdFromRole } from './lesson-utils';
import {
    getTeacherInterfaceFromRole,
    getUsersFromContextByRegexKeys,
    splitRolesStringToAccountRoles,
} from './utils';
import { getCreatedLessonInfoOfLessonManagement } from 'step-definitions/lesson-management-utils';

Given(
    '{string} has joined lesson of lesson management on Teacher App',
    { timeout: 80000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const isFirstTeacher = role !== 'teacher T2';
        const scenario = this.scenario;

        const lessonInfo = getCreatedLessonInfoOfLessonManagement(scenario);

        await teacher.instruction(
            `${role} joins lesson of lesson management on Teacher App`,
            async function () {
                await whenTeacherJoinsLessonOfLessonManagement({
                    teacher,
                    isFirstTeacher,
                    ...lessonInfo,
                });
            }
        );
    }
);

Then(
    '{string} sees all teacher in gallery view on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const teacherUserInfo = getUsersFromContextByRegexKeys(this.scenario, 'teacher');
        const teacherUserIds = teacherUserInfo.map((teacher) => teacher.id);
        await teacher.instruction(
            `${role} sees all teacher in gallery view on Teacher App`,
            async function () {
                await teacherJoinedLessonSuccess(teacher);
                await teacherSeesAllTeacherStreamInGalleryViewOnTeacherApp(teacher, teacherUserIds);
            }
        );
    }
);

Then(
    '{string} sees student in gallery view on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const learnerId = getUserIdFromRole(this, 'student');
        await teacher.instruction(
            `${role} sees student in gallery view on Teacher App`,
            async function () {
                await userIsShownInListCameraOnTeacherApp(teacher, learnerId, true);
            }
        );
    }
);

Then(
    '{string} ends lesson on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
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
    }
);

When(
    '{string} goes to lesson waiting room on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        const lessonInfo = getCreatedLessonInfoOfLessonManagement(scenario);

        await teacher.instruction(
            `${role} goes to lesson waiting room on Teacher App`,
            async function () {
                await goesToLessonWaitingRoomOnTeacherApp({ teacher, ...lessonInfo });
            }
        );
    }
);

Then('{string} can not interact on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(`${role} can not interact on Teacher App`, async function (teacher) {
        await teacherInteractOnTeacherApp(teacher, false);
    });
});

Given(
    '{string} have joined lesson of lesson management on Teacher App',
    { timeout: 200000 },
    async function (this: IMasterWorld, roles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);

        const scenario = this.scenario;
        const lessonInfo = getCreatedLessonInfoOfLessonManagement(scenario);

        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            const isFirstTeacher = teacherRole !== 'teacher T2';

            await teacher.instruction(
                `${teacherRole} has joined lesson of lesson management on Teacher App`,
                async function () {
                    await whenTeacherJoinsLessonOfLessonManagement({
                        teacher,
                        isFirstTeacher,
                        ...lessonInfo,
                    });
                }
            );
        }
    }
);

When(
    '{string} joins lesson of lesson management on Teacher App',
    { timeout: 80000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const isFirstTeacher = role !== 'teacher T2';
        const scenario = this.scenario;
        const lessonInfo = getCreatedLessonInfoOfLessonManagement(scenario);

        await teacher.instruction(`${role} joins lesson on Teacher App`, async function () {
            await whenTeacherJoinsLessonOfLessonManagement({
                teacher,
                isFirstTeacher,
                ...lessonInfo,
            });
        });
    }
);
