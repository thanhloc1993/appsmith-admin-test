import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasLessonId } from './alias-keys/lesson';
import { lessonTeachingMediumOfflineRatioButton } from './cms-selectors/lesson';
import { teacherNotSeeLessonItemOnTeacherApp } from './create-future-and-past-lesson-with-offline-teaching-medium-definitions';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
} from './utils';
import { assertToSeeNewLessonOnLearnerApp } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

Given('{string} has filled offline teaching medium', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} has offline teaching medium`, async function () {
        await cms.selectElementByDataTestId(lessonTeachingMediumOfflineRatioButton);
    });
});

Then(
    '{string} does not see new {string} lesson on Teacher App',
    async function (role: AccountRoles, lessonTime: LessonManagementLessonTime) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        await teacher.instruction(
            `${role} goes to course detail page & does not see new ${lessonTime} lesson on Teacher App`,
            async function (teacher) {
                await teacherNotSeeLessonItemOnTeacherApp(teacher, scenario, lessonTime);
            }
        );
    }
);

Then('{string} does not see the new lesson on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    const scenario = this.scenario;
    const lessonId = scenario.get(aliasLessonId);

    await learner.instruction(
        `${role} goes to lessons & does not see new lesson on Learner App`,
        async function () {
            await assertToSeeNewLessonOnLearnerApp(learner, lessonId, false);
        }
    );
});
