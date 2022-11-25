import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles, Locations } from '@supports/app-types';

import { userSeesLessonInTodayCell } from './school-admin-can-view-draft-one-time-lessons-created-in-lessonmgmt-on-calendar-weekly-view-definitions';
import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod, LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import { LessonType } from 'test-suites/squads/calendar/common/types';
import { createLessonWithGRPC } from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has created an one time {string} lesson with lesson date of today and {string} in lessonmgmt',
    async function (role: AccountRoles, lessonType: LessonType, location: Locations) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a one time ${lessonType} lesson in today and ${location}`,
            async function () {
                const teachingMethod: LessonTeachingMethod =
                    lessonType === 'individual'
                        ? LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL
                        : LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP;

                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    teachingMedium: 'Online',
                    createLessonTime: 'now',
                    teachingMethod,
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME,
                    schedulingStatus: LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED,
                });
            }
        );
    }
);

Then(
    '{string} sees lesson is displayed in today cell with light blue filling',
    async function (role: AccountRoles) {
        const scenarioContext = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} lesson is displayed in today cell`, async function () {
            await cms.waitingForLoadingIcon();
            await userSeesLessonInTodayCell(
                cms,
                scenarioContext,
                LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
            );
        });
    }
);
