import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod, LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
} from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    aliasCourseId,
    aliasLessonId,
    aliasLessonTime,
} from 'test-suites/squads/lesson/common/alias-keys';
import { LessonTimeValueType, LessonType } from 'test-suites/squads/lesson/common/types';
import {
    assertToSeeTheLessonOnLearnerApp,
    assertToSeeTheLessonOnTeacherApp,
    userDoesNotSeeLesson,
} from 'test-suites/squads/lesson/step-definitions/lesson-teacher-can-delete-one-time-future-group-lesson-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import { deleteOneTimeLesson } from 'test-suites/squads/lesson/utils/lesson-detail';
import { createLessonWithGRPC } from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has created a {string} one time {string} lesson in the {string}',
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        lessonType: LessonType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a one time ${lessonType} lesson in the ${lessonTime}`,
            async function () {
                const teachingMethod: LessonTeachingMethod =
                    lessonType === 'individual'
                        ? LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL
                        : LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP;

                const schedulingStatus =
                    lessonActionSave === 'Published'
                        ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                        : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    teachingMedium: 'Online',
                    createLessonTime: lessonTime,
                    teachingMethod,
                    schedulingStatus,
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME,
                });
            }
        );
    }
);

When(
    '{string} deletes the one time {string} lesson in the {string}',
    async function (role: AccountRoles, lessonType: LessonType, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} deletes the one time ${lessonType} lesson in the ${lessonTime}`,
            async function () {
                await deleteOneTimeLesson(cms);
            }
        );
    }
);

Then('{string} does not see the lesson on CMS', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenarioContext = this.scenario;

    await cms.instruction(`${role} does not see the lesson on CMS`, async function () {
        await userDoesNotSeeLesson({ cms, scenarioContext });
    });
});

Then('{string} does not see the lesson on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    const scenarioContext = this.scenario;

    const lessonId = scenarioContext.get(aliasLessonId);
    const courseId = scenarioContext.get(aliasCourseId);
    const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);

    await teacher.instruction(`${role} does not see the lesson on Teacher App`, async function () {
        await assertToSeeTheLessonOnTeacherApp({
            teacher,
            courseId,
            lessonId,
            lessonTime,
            state: 'not see',
        });
    });
});

Then('{string} does not see the lesson on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    const scenarioContext = this.scenario;

    const lessonId = scenarioContext.get(aliasLessonId);

    await learner.instruction(`${role} does not see the lesson on Learner App`, async function () {
        await assertToSeeTheLessonOnLearnerApp({
            learner,
            lessonId,
            state: 'not see',
        });
    });
});
