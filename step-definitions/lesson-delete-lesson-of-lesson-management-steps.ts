import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    assertSeeLessonOnTeacherApp,
    deleteLessonOfLessonManagement,
} from './lesson-delete-lesson-of-lesson-management-definitions';
import { userIsOnLessonDetailPage } from './lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
} from './utils';
import { aliasCourseId, aliasLessonId } from 'step-definitions/alias-keys/lesson';
import { assertToSeeNewLessonOnLearnerApp } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

When('{string} deletes the lesson', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} deletes the lesson of lesson management`, async function () {
        await deleteLessonOfLessonManagement(cms, 'confirm');
    });
});

When(
    '{string} cancels deleting the lesson',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} cancels deleting the lesson of lesson management`,
            async function () {
                await deleteLessonOfLessonManagement(cms, 'cancel');
            }
        );
    }
);

Then(
    '{string} is still in detailed lesson info page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} is still in detailed lesson info page`, async function () {
            await userIsOnLessonDetailPage(cms);
        });
    }
);

Then(
    '{string} does not see the {string} lesson on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        const courseId = scenario.get(aliasCourseId);
        const lessonId = scenario.get(aliasLessonId);

        await teacher.instruction(
            `${role} does not see the ${lessonTime} lesson on Teacher App`,
            async function () {
                await assertSeeLessonOnTeacherApp({
                    teacher,
                    lessonTime,
                    courseId,
                    lessonId,
                    lessonName: '', // Lesson of lesson management has no name
                    shouldDisplay: false,
                });
            }
        );
    }
);

Then(
    '{string} does not see the {string} lesson on Learner App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);

        await learner.instruction(
            `${role} does not see the ${lessonTime} lesson on Learner App`,
            async function () {
                await assertToSeeNewLessonOnLearnerApp(learner, lessonId, false);
            }
        );
    }
);

Then(
    '{string} still sees the {string} lesson on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);

        const courseId = scenario.get(aliasCourseId);
        const lessonId = scenario.get(aliasLessonId);

        await teacher.instruction(
            `${role} still sees the ${lessonTime} lesson on Teacher App`,
            async function () {
                await assertSeeLessonOnTeacherApp({
                    teacher,
                    lessonTime,
                    courseId,
                    lessonId,
                    lessonName: '', // Lesson of lesson management has no name
                });
            }
        );
    }
);

Then(
    '{string} still sees the {string} lesson on Learner App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);

        await learner.instruction(
            `${role} still sees the ${lessonTime} lesson on Learner App`,
            async function () {
                await assertToSeeNewLessonOnLearnerApp(learner, lessonId);
            }
        );
    }
);
