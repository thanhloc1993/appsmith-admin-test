import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, Tenant } from '@supports/app-types';

import { aliasLessonInfoByLessonName } from 'step-definitions/alias-keys/lesson';
import { LessonManagementLessonName } from 'step-definitions/lesson-default-sort-future-lessons-list-definitions';
import { setupAliasForCreateLessonByRoles } from 'step-definitions/lesson-management-utils';
import {
    LessonInfo,
    teacherDoesNotSeeCourseWithAccessByURL,
} from 'step-definitions/lesson-multi-tenant-create-future-and-past-lesson-definitions';
import {
    arrayHasItem,
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    pick1stElement,
} from 'step-definitions/utils';
import {
    assertSeeLessonOnCMS,
    assertToSeeNewLessonOnLearnerApp,
    assertToSeeTheLessonOnTeacherApp,
    createIndividualLesson,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

When(
    '{string} of {string} creates a {string} online {string} with {string}&{string} on CMS',
    async function (
        primaryRole: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName,
        secondaryRole: AccountRoles,
        tertiaryRole: AccountRoles
    ) {
        const cms = getCMSInterfaceByRole(this, primaryRole);
        const scenarioContext = this.scenario;

        const setupAliasLesson = setupAliasForCreateLessonByRoles({
            scenarioContext,
            teacherRoles: [secondaryRole],
            studentRoles: [tertiaryRole],
        });
        const { teacherNames, studentInfos } = setupAliasLesson;

        await cms.instruction(
            `${primaryRole} of ${tenant} creates ${lessonTime} lesson with ${secondaryRole} and ${tertiaryRole}`,
            async function () {
                await createIndividualLesson({
                    cms,
                    scenarioContext,
                    lessonTime,
                    lessonName,
                    teacherNames,
                    studentInfos,
                });
            }
        );
    }
);

Then(
    '{string} of {string} sees newly {string} online {string} on CMS',
    async function (
        role: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const { lessonId, studentInfos } = this.scenario.get<LessonInfo>(
            aliasLessonInfoByLessonName(lessonName)
        );

        const oneOfStudents = pick1stElement(studentInfos);
        if (!oneOfStudents) throw Error('There are no students');

        await cms.instruction(
            `${role} of ${tenant} sees newly ${lessonTime} online ${lessonName} on CMS`,
            async function () {
                await assertSeeLessonOnCMS({
                    cms,
                    lessonId,
                    studentName: oneOfStudents.studentName,
                    shouldSeeLesson: true,
                });
            }
        );
    }
);

Then(
    '{string} of {string} does not see newly {string} online {string} on CMS',
    async function (
        role: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const { lessonId, studentInfos } = this.scenario.get<LessonInfo>(
            aliasLessonInfoByLessonName(lessonName)
        );

        const oneOfStudents = pick1stElement(studentInfos);
        if (!oneOfStudents) throw Error(`There are no students in lesson: ${lessonId}`);

        await cms.instruction(
            `${role} of ${tenant} does not see newly ${lessonTime} online ${lessonName} on CMS`,
            async function () {
                await assertSeeLessonOnCMS({
                    cms,
                    lessonId,
                    studentName: oneOfStudents.studentName,
                    shouldSeeLesson: false,
                });
            }
        );
    }
);

Then(
    '{string} of {string} sees newly {string} online {string} on Teacher App',
    async function (
        role: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        const { lessonId, studentInfos } = this.scenario.get<LessonInfo>(
            aliasLessonInfoByLessonName(lessonName)
        );

        weExpect(arrayHasItem(studentInfos), `Expect lesson(${lessonId}) has student`).toEqual(
            true
        );

        await teacher.instruction(
            `${role} of ${tenant} sees newly ${lessonTime} online ${lessonName} on Teacher App`,
            async function () {
                for (const student of studentInfos) {
                    await assertToSeeTheLessonOnTeacherApp({
                        teacher,
                        courseId: student.courseId,
                        lessonId,
                        lessonTime,
                        lessonName: '',
                    });
                }
            }
        );
    }
);

Then(
    '{string} of {string} does not see newly {string} online {string} on Teacher App',
    async function (
        role: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        const { lessonId, studentInfos } = this.scenario.get<LessonInfo>(
            aliasLessonInfoByLessonName(lessonName)
        );

        weExpect(arrayHasItem(studentInfos), `Expect lesson (${lessonId}) has student`).toEqual(
            true
        );

        await teacher.instruction(
            `${role} of ${tenant} does not see newly ${lessonTime} online ${lessonName} on Teacher App`,
            async function () {
                for (const student of studentInfos) {
                    await teacherDoesNotSeeCourseWithAccessByURL(teacher, student.courseId);
                }
            }
        );
    }
);

Then(
    '{string} of {string} sees newly {string} online {string} on Learner App',
    async function (
        role: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);

        const { lessonId } = this.scenario.get<LessonInfo>(aliasLessonInfoByLessonName(lessonName));

        await learner.instruction(
            `${role} of ${tenant} sees newly ${lessonTime} online ${lessonName} on Learner App`,
            async function () {
                await assertToSeeNewLessonOnLearnerApp(learner, lessonId);
            }
        );
    }
);

Then(
    '{string} of {string} does not see newly {string} online {string} on Learner App',
    async function (
        role: AccountRoles,
        tenant: Tenant,
        lessonTime: LessonManagementLessonTime,
        lessonName: LessonManagementLessonName
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);

        const { lessonId } = this.scenario.get<LessonInfo>(aliasLessonInfoByLessonName(lessonName));

        await learner.instruction(
            `${role} of ${tenant} does not see newly ${lessonTime} online ${lessonName} on Learner App`,
            async function () {
                await learner.flutterDriver!.reload();
                await assertToSeeNewLessonOnLearnerApp(learner, lessonId, false);
            }
        );
    }
);
