import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasCourseId, aliasLessonId, aliasLessonName } from './alias-keys/lesson';
import { teacherBacksToLessonDetailScreenOnTeacherApp } from './lesson-leave-lesson-definitions';
import {
    teacherDoesNotSeeLiveLabelOfLessonOnTeacherApp,
    teacherSeesLessonInActiveListOnTeacherApp,
    teacherSeesLessonInCompletedListOnTeacherApp,
    teacherSeesLiveLabelOfLessonOnTeacherApp,
} from './lesson-live-icon-on-teacher-app-definitions';
import { createLessonManagementIndividualLessonWithGRPC } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { goToCourseDetailOnTeacherAppByCourseId } from './lesson-teacher-verify-lesson-definitions';
import { getCMSInterfaceByRole, getTeacherInterfaceFromRole } from './utils';

Given(
    'school admin has created a lesson of lesson management that is live now',
    async function (this: IMasterWorld) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            'school admin has created a lesson of lesson management that is live now',
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'in progress'
                );
            }
        );
    }
);

Given(
    'school admin has created a lesson of lesson management that has been completed in the last 24 hours',
    async function (this: IMasterWorld) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            'school admin has created a lesson of lesson management that has been completed in the last 24 hours',
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'completed within 24 hours'
                );
            }
        );
    }
);

When(
    '{string} goes to course detail screen',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        const courseId = this.scenario.get(aliasCourseId);

        await teacher.instruction(`${role} goes to course detail screen`, async function () {
            await goToCourseDetailOnTeacherAppByCourseId(teacher, courseId);
        });
    }
);

Then(
    `{string} sees lesson in {string} list on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles, status: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        const lessonId = scenario.get(aliasLessonId);
        const lessonName = scenario.get(aliasLessonName);

        await teacher.instruction(
            `${role} sees lesson in ${status} list on Teacher App`,
            async function () {
                if (status == 'Active') {
                    await teacherSeesLessonInActiveListOnTeacherApp(teacher, lessonId, lessonName);
                } else {
                    await teacherSeesLessonInCompletedListOnTeacherApp(
                        teacher,
                        lessonId,
                        lessonName
                    );
                }
            }
        );
    }
);

Then(
    '{string} sees live icon on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        const lessonId = scenario.get(aliasLessonId);
        const lessonName = scenario.get(aliasLessonName);

        await teacher.instruction(`${role} sees live icon on Teacher App`, async function () {
            await teacherSeesLiveLabelOfLessonOnTeacherApp(teacher, lessonId, lessonName);
        });
    }
);

Then(
    '{string} does not see live icon on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        const lessonId = scenario.get(aliasLessonId);
        const lessonName = scenario.get(aliasLessonName);

        await teacher.instruction(
            `${role} does not see live icon on Teacher App`,
            async function () {
                await teacherDoesNotSeeLiveLabelOfLessonOnTeacherApp(teacher, lessonId, lessonName);
            }
        );
    }
);

Then(
    '{string} is directed to lesson detail screen on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} backs to lesson detail screen on Teacher App`,
            async function () {
                await teacherBacksToLessonDetailScreenOnTeacherApp(teacher);
            }
        );
    }
);

Then(
    '{string} still sees live icon on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        const lessonId = scenario.get(aliasLessonId);
        const lessonName = scenario.get(aliasLessonName);

        await teacher.instruction(`${role} still sees live icon on Teacher App`, async function () {
            await teacherSeesLiveLabelOfLessonOnTeacherApp(teacher, lessonId, lessonName);
        });
    }
);
