import {
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { delay } from 'flutter-driver-x';
import {
    getLearnerInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    aliasCourseId,
    aliasLessonId,
    aliasLessonName,
    aliasLessonTime,
    aliasMaterialId,
} from 'test-suites/squads/lesson/common/alias-keys';
import { UserProfileEntity } from 'test-suites/squads/lesson/common/lesson-profile-entity';
import {
    learnerJoinsLessonLocal,
    learnerLoginsAppLocal,
    teacherGoToLiveLessonDetailByURLLocal,
    teacherLoginsAppLocal,
} from 'test-suites/squads/virtual-classroom/step-definitions/virtual-classroom-hard-code-lesson-for-local-definitions';
import {
    learnerJoinsLessonSuccessfully,
    teacherJoinsLesson,
} from 'test-suites/squads/virtual-classroom/utils/navigation';

Given('{string} logins Teacher App Local', async function (role: AccountRoles) {
    await teacherLoginsAppLocal(this, role);
});

Given('setup scenario context for Local', async function () {
    const context = this.scenario!;
    // Course: Virtual Classroom Local Course  / 01GBPS6YPZ800YDZPBZKXJZ7W9
    // Change lessonId depend on purpose
    // Lesson:
    //  - With materials: 01GBPSQRDARCHZG07XNDVC8HTK
    //  - With pdf: 01GBPSXEGN0HCG3DPB3FASEF99
    //  - With video: 01GBPT7R14XYQ4NG267HRWKGK5
    context.set(aliasCourseId, '01GBPS6YPZ800YDZPBZKXJZ7W9');
    context.set(aliasLessonId, '01GBPSQRDARCHZG07XNDVC8HTK');
    context.set(aliasLessonName, '');
    context.set(aliasLessonTime, 'past');

    context.set(aliasMaterialId['pdf'], '01GBPSXE5XXY0N49080Y5X8N6D');
    context.set(aliasMaterialId['video'], '01GBPT7QQCRPW1RVA1W4Q3ZZ5K');
    context.set(aliasMaterialId['pdf 1'], '01GBPSQR1E5CH7GFH4X65BNA26');
    context.set(aliasMaterialId['pdf 2'], '01GBPSQR1F9RTPBXN70NT7FYQZ');
    context.set(aliasMaterialId['video 1'], '01GBPSQR1F9RTPBXN70RPNR2WB');
    context.set(aliasMaterialId['video 2'], '01GBPSQR1F9RTPBXN70S1JHP5X');

    const teacherProfile: UserProfileEntity = {
        id: '01GBPRNAPMEYRF5QBGHQN2MGP4',
        email: 'trungkim.tran+virtual_teacher01@manabie.com',
        name: 'Virtual Teacher 01',
        avatar: '',
        phoneNumber: '[]',
        givenName: '',
        password: '123456',
    };
    const teacher2Profile: UserProfileEntity = {
        id: '01GBPRQVMA56YK7VM2T75YJJXM',
        email: 'trungkim.tran+virtual_teacher02@manabie.com',
        name: 'Virtual Teacher 02',
        avatar: '',
        phoneNumber: '[]',
        givenName: '',
        password: '123456',
    };
    const studentProfile: UserProfileEntity = {
        id: '01GBPS3APFGPA9198W0804B637',
        email: 'trungkim.tran+virtual_learner01@manabie.com',
        name: 'Virtual Learner 01 Test',
        avatar: '',
        phoneNumber: '[]',
        givenName: '',
        password: 'TV66LS',
    };
    const student2Profile: UserProfileEntity = {
        id: '01GBPS646R1M6ACZV10V9K2W04',
        email: 'trungkim.tran+virtual_learner02@manabie.com',
        name: 'Virtual Learner 02 Test',
        avatar: '',
        phoneNumber: '[]',
        givenName: '',
        password: 'D6DAGS',
    };
    context.set(staffProfileAliasWithAccountRoleSuffix('teacher'), teacherProfile);
    context.set(staffProfileAliasWithAccountRoleSuffix('teacher T1'), teacherProfile);
    context.set(staffProfileAliasWithAccountRoleSuffix('teacher T2'), teacher2Profile);
    context.set(learnerProfileAliasWithAccountRoleSuffix('student'), studentProfile);
    context.set(learnerProfileAliasWithAccountRoleSuffix('student S1'), studentProfile);
    context.set(learnerProfileAliasWithAccountRoleSuffix('student S2'), student2Profile);
});

Given('{string} login Teacher App Local', async function (roles: string) {
    const accountRoles = splitRolesStringToAccountRoles(roles);
    for (const role of accountRoles) {
        await teacherLoginsAppLocal(this, role);
    }
});

Given('{string} has logged Learner App Local', async function (role: AccountRoles) {
    await learnerLoginsAppLocal(this, role);
});

Given('{string} have logged Learner App Local', async function (roles: string) {
    const accountRoles = splitRolesStringToAccountRoles(roles);
    for (const role of accountRoles) {
        await learnerLoginsAppLocal(this, role);
    }
});

Given(
    '{string} has joined virtual classroom on Teacher App Local',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const context = this.scenario;
        const isFirstTeacher = role === 'teacher' || role === 'teacher T1';
        await teacher.instruction(
            `${role} has joined virtual classroom on Teacher App Local`,
            async function () {
                await teacherGoToLiveLessonDetailByURLLocal(teacher, context);
                await delay(3000);
                await teacherJoinsLesson(teacher, isFirstTeacher);
            }
        );
    }
);

Given(
    '{string} have joined virtual classroom on Teacher App Local',
    async function (roles: string) {
        const accountRoles = splitRolesStringToAccountRoles(roles);
        for (const role of accountRoles) {
            const teacher = getTeacherInterfaceFromRole(this, role);
            const context = this.scenario;
            const isFirstTeacher = role === 'teacher' || role === 'teacher T1';
            await teacher.instruction(
                `${role} has joined virtual classroom on Teacher App Local`,
                async function () {
                    await teacherGoToLiveLessonDetailByURLLocal(teacher, context);
                    await delay(3000);
                    await teacherJoinsLesson(teacher, isFirstTeacher);
                }
            );
        }
    }
);

Given(
    '{string} has joined lesson on Learner App Local',
    async function (learnerRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        const lessonId = this.scenario.get(aliasLessonId);
        await learner.instruction(`${learnerRole} joins lesson on Learner App`, async function () {
            await learnerJoinsLessonLocal(learner, lessonId);
        });
    }
);

Given('{string} have joined lesson on Learner App Local', async function (roles: string) {
    const accountRoles = splitRolesStringToAccountRoles(roles);
    for (const role of accountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);
        await learner.instruction(`${role} joins lesson on Learner App`, async function () {
            await learnerJoinsLessonLocal(learner, lessonId);
            await learnerJoinsLessonSuccessfully(learner);
        });
    }
});
