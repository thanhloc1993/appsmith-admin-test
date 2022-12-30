import { assertSeeLessonOnTeacherApp } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import {
    createLessonManagementIndividualLessonWithGRPC,
    LessonManagementCreateLessonTime,
} from '@legacy-step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonStatus } from 'manabuf/bob/v1/lessons_pb';
import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod } from 'manabuf/lessonmgmt/v1/enums_pb';
import { aliasLessonId } from 'test-suites/squads/lesson/common/alias-keys';
import { ActionCanSee } from 'test-suites/squads/lesson/common/types';
import { assertToSeeNewLessonOnLearnerApp } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { assertUpdatedTeachingMedium } from 'test-suites/squads/lesson/step-definitions/school-admin-can-edit-teaching-medium-of-one-time-individual-lesson-definitions';
import {
    LessonActionSaveType,
    LessonManagementLessonTime,
    LessonTimeValueType,
    TeachingMediumValueType,
} from 'test-suites/squads/lesson/types/lesson-management';
import {
    createLessonWithGRPC,
    parseTeachingMediumObject,
    selectTeachingMedium,
} from 'test-suites/squads/lesson/utils/lesson-upsert';
import { aliasCourseId } from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';

Given(
    '{string} has create a {string} teaching medium one time individual lesson in the {string}',
    async function (
        role: AccountRoles,
        teachingMedium: TeachingMediumValueType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const createLessonTime: LessonManagementCreateLessonTime =
            lessonTime === 'future'
                ? 'within 10 minutes from now'
                : 'completed before 24 hours ago';

        await cms.instruction(
            `${role} has create a ${teachingMedium} teaching medium one time individual lesson in the ${lessonTime}`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    createLessonTime,
                    teachingMedium,
                    CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME
                );
            }
        );
    }
);

Given(
    '{string} has create a {string} {string} one time individual lesson in the {string}',
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        teachingMedium: TeachingMediumValueType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const createLessonTime: LessonManagementCreateLessonTime =
            lessonTime === 'future'
                ? 'within 10 minutes from now'
                : 'completed before 24 hours ago';

        const schedulingStatus: LessonStatus =
            lessonActionSave === 'Published'
                ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

        await cms.instruction(
            `${role} has create a ${teachingMedium} teaching medium one time individual lesson in the ${lessonTime}`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime,
                    teachingMedium,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME,
                    schedulingStatus,
                });
            }
        );
    }
);

When(
    '{string} edits teaching medium to {string} in lesson detail',
    async function (role: AccountRoles, teachingMedium: TeachingMediumValueType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} edits teaching medium to ${teachingMedium} in lesson detail`,
            async function () {
                await selectTeachingMedium(cms, parseTeachingMediumObject[teachingMedium]);
            }
        );
    }
);

Then(
    '{string} sees updated teaching medium to {string} on CMS',
    async function (role: AccountRoles, teachingMedium: TeachingMediumValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees updated teaching medium to ${teachingMedium} on CMS`,
            async function () {
                await assertUpdatedTeachingMedium(cms, scenarioContext, teachingMedium);
            }
        );
    }
);

Then(
    '{string} can {string} the {string} lesson on Teacher App',
    async function (
        role: AccountRoles,
        action: ActionCanSee,
        lessonTime: LessonManagementLessonTime
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        const courseId = scenario.get(aliasCourseId);
        const lessonId = scenario.get(aliasLessonId);
        const shouldDisplay = action === 'see';

        await teacher.instruction(
            `${role} can ${action} the ${lessonTime} lesson on Teacher App`,
            async function () {
                await assertSeeLessonOnTeacherApp({
                    teacher,
                    lessonTime,
                    courseId,
                    lessonId,
                    lessonName: '', // Lesson of lesson management has no name
                    shouldDisplay,
                });
            }
        );
    }
);

Then(
    '{string} can {string} the {string} lesson on Learner App',
    async function (
        role: AccountRoles,
        action: ActionCanSee,
        lessonTime: LessonManagementLessonTime
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);
        const shouldDisplay = action === 'see';

        await learner.instruction(
            `${role} can ${action} the ${lessonTime} lesson on Learner App`,
            async function () {
                await assertToSeeNewLessonOnLearnerApp(learner, lessonId, shouldDisplay);
            }
        );
    }
);
