import { Given } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    LessonTimeValueType,
    LessonType,
    TeachingMediumValueType,
} from 'test-suites/squads/lesson/common/types';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import { createLessonWithGRPC } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { generateMaterialWithType } from 'test-suites/squads/lesson/utils/materials';

Given(
    '{string} has created a {string} {string} {string} lesson in the {string} and attached {string}',
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        teachingMedium: TeachingMediumValueType,
        lessonType: LessonType,
        lessonTime: LessonTimeValueType,
        materials: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const materialsList = generateMaterialWithType(materials);

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
                    teachingMedium,
                    createLessonTime: lessonTime,
                    teachingMethod,
                    schedulingStatus,
                    materialsList,
                });
            }
        );
    }
);
