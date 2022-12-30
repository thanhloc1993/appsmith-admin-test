import { Given } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod, LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    LessonActionSaveType,
    LessonManagementLessonTime,
    TeachingMediumValueType,
} from 'test-suites/squads/lesson/types/lesson-management';
import { createLessonWithGRPC } from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has created a {string} {string} one time group lesson in the {string}',
    async function (
        role: AccountRoles,
        lessonStatus: LessonActionSaveType,
        teachingMedium: TeachingMediumValueType,
        lessonTime: LessonManagementLessonTime
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const schedulingStatus =
            lessonStatus === 'Published'
                ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

        await cms.instruction(
            `${role} has created a ${lessonStatus} ${teachingMedium} one time group lesson in the ${lessonTime}`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime: lessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP,
                    teachingMedium,
                    schedulingStatus,
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME,
                });
            }
        );
    }
);
