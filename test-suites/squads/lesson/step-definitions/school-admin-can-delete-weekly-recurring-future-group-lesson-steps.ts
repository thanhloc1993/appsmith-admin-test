import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod, LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasLessonTime } from 'test-suites/squads/lesson/common/alias-keys';
import {
    ActionCanSee,
    LessonTimeValueType,
    ComparePosition,
    LessonType,
} from 'test-suites/squads/lesson/common/types';
import {
    assertNotSeeDeletedLessonOnCMS,
    assertSeeLessonStillRemainInRecurringChain,
} from 'test-suites/squads/lesson/step-definitions/school-admin-can-delete-weekly-recurring-future-group-lesson-definitions';
import {
    goToLessonInRecurringChainByOrder,
    OrderLessonInRecurringChain,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import {
    CreateLessonTimeType,
    createLessonWithGRPC,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

// TODO: Use this step for all other create lesson steps
Given(
    '{string} has created a {string} weekly recurring {string} lesson with lesson date in the {string}',
    {
        timeout: 120000,
    },
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        lessonType: LessonType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a weekly recurring ${lessonType} lesson with lesson date in the ${lessonTime}`,
            async function () {
                const teachingMethod: LessonTeachingMethod =
                    lessonType === 'individual'
                        ? LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL
                        : LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP;

                const createLessonTime: CreateLessonTimeType =
                    lessonTime === 'future' ? 'future weekly recurring' : 'past weekly recurring';

                const schedulingStatus =
                    lessonActionSave === 'Published'
                        ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                        : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    teachingMedium: 'Online',
                    createLessonTime,
                    schedulingStatus,
                    teachingMethod,
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE,
                });
            }
        );
    }
);

Given(
    '{string} has gone to detailed lesson info page of the 2nd lesson in the chain',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);

        await cms.instruction(
            `${role} has gone to detailed lesson info page of the 2nd lesson in the chain`,
            async function () {
                await goToLessonInRecurringChainByOrder(
                    cms,
                    scenarioContext,
                    OrderLessonInRecurringChain.SECOND,
                    lessonTime
                );
            }
        );
    }
);

Then(
    '{string} does not see the deleted lesson on {string} lesson list on CMS',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} does not see the deleted lesson on ${lessonTime} lesson list on CMS`,
            async function () {
                await assertNotSeeDeletedLessonOnCMS({
                    cms,
                    scenarioContext,
                    lessonTime,
                });
            }
        );
    }
);

Then(
    '{string} can {string} other lessons in chain {string} deleted lesson',
    async function (role: AccountRoles, action: ActionCanSee, position: ComparePosition) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const shouldBeSee = action === 'see';
        const order =
            position === 'before'
                ? OrderLessonInRecurringChain.FIRST
                : OrderLessonInRecurringChain.SECOND;
        // Check other lessons in chain before deleted lesson is remained by check the first lesson in chain
        // Check other lessons in chain after deleted lesson is remained by check the second lesson in chain

        await cms.instruction(
            `${role} can ${action} other lessons in chain from deleted lesson`,
            async function () {
                await assertSeeLessonStillRemainInRecurringChain({
                    cms,
                    scenarioContext,
                    order,
                    shouldSeeLesson: shouldBeSee,
                });
            }
        );
    }
);

Then(
    '{string} can see other lessons in the recurring chain still remain',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} can see other lessons in the recurring chain still remain`,
            async function () {
                await assertSeeLessonStillRemainInRecurringChain({
                    cms,
                    scenarioContext,
                    order: OrderLessonInRecurringChain.FIRST,
                    shouldSeeLesson: true,
                });
                await assertSeeLessonStillRemainInRecurringChain({
                    cms,
                    scenarioContext,
                    order: OrderLessonInRecurringChain.SECOND,
                    shouldSeeLesson: true,
                });
            }
        );
    }
);
