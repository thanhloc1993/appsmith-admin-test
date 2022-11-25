import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod, LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import { StudentAttendStatus } from 'manabuf/lessonmgmt/v1/lessons_pb';
import { aliasLessonTime } from 'test-suites/squads/lesson/common/alias-keys';
import {
    LessonReportActionType,
    LessonStatusType,
    LessonTimeValueType,
    LessonType,
    MethodSavingType,
} from 'test-suites/squads/lesson/common/types';
import {
    assertLessonStatus,
    assertLessonStatusOrderBy,
    saveGroupLessonReport,
} from 'test-suites/squads/lesson/step-definitions/auto-change-status-change-to-completed-when-submit-lesson-group-report-definitions';
import { saveIndividualLessonReport } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-can-delete-weekly-recurring-lesson-definitions';
import {
    goToLessonInRecurringChainByOrder,
    OrderLessonInRecurringChain,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import {
    LessonActionSaveType,
    LessonManagementLessonTime,
} from 'test-suites/squads/lesson/types/lesson-management';
import {
    CreateLessonTimeType,
    createLessonWithGRPC,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has created a {string} {string} {string} lesson in {string} with filled Attendance status',
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        lessonType: LessonType,
        methodSavingOptionType: MethodSavingType,
        lessonTime: LessonManagementLessonTime
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const teachingMethod =
            lessonType === 'group'
                ? LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP
                : LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL;

        const schedulingStatus =
            lessonActionSave === 'Published'
                ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

        const methodSavingOption =
            methodSavingOptionType === 'One Time'
                ? CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME
                : CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE;

        const createLessonTime =
            lessonTime === 'future' && methodSavingOptionType === 'Weekly Recurring'
                ? 'future weekly recurring'
                : lessonTime;

        await cms.instruction(
            `${role} has created a ${lessonActionSave} one time ${teachingMethod} lesson with filled Attendance status`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime,
                    teachingMethod,
                    teachingMedium: 'Online',
                    addAttendanceStatusStudent: StudentAttendStatus.STUDENT_ATTEND_STATUS_ABSENT,
                    schedulingStatus,
                    methodSavingOption,
                });
            }
        );
    }
);

When(
    '{string} click button {string} on lesson group report page',
    async function (role: AccountRoles, reportAction: LessonReportActionType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} click button ${reportAction} on lesson group report page`,
            async function () {
                await saveGroupLessonReport(cms, reportAction);
            }
        );
    }
);

When(
    '{string} click button {string} on individual lesson report page',
    async function (role: AccountRoles, actionSaveLessonReport: LessonReportActionType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has clicked ${actionSaveLessonReport} individual lesson report`,
            async function () {
                await saveIndividualLessonReport(cms, actionSaveLessonReport);
            }
        );
    }
);

Then(
    `{string} sees the lesson's status is {string}`,
    async function (role: AccountRoles, lessonStatusType: LessonStatusType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees the lesson's status is ${lessonStatusType}`,
            async function () {
                await cms.waitingForLoadingIcon();
                await assertLessonStatus(cms, lessonStatusType);
            }
        );
    }
);

Then(
    '{string} has created {string} {string} {string} lesson',
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        lessonType: LessonType,
        lessonTime: CreateLessonTimeType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const teachingMethod =
            lessonType === 'group'
                ? LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP
                : LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL;

        const schedulingStatus =
            lessonActionSave === 'Published'
                ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

        await cms.instruction(
            `${role} has created ${lessonActionSave} ${lessonType} ${lessonTime} lesson`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime: lessonTime,
                    teachingMethod,
                    teachingMedium: 'Online',
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE,
                    schedulingStatus,
                });
            }
        );
    }
);

Given(
    '{string} has gone to detailed lesson info page of the 1st lesson in the chain',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);

        await cms.instruction(
            `${role} has gone to detailed lesson info page of the 1st lesson in the chain`,
            async function () {
                await goToLessonInRecurringChainByOrder(
                    cms,
                    scenarioContext,
                    OrderLessonInRecurringChain.FIRST,
                    lessonTime
                );
            }
        );
    }
);

Then(
    '{string} sees the status of the all lessons in the chain still is {string} after 1st lesson {string}',
    async function (
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees the status of the all lessons in the chain still is ${lessonStatus} after 1st lesson ${lessonTime}`,
            async function () {
                await assertLessonStatusOrderBy({
                    cms,
                    lessonStatus,
                    lessonTime,
                    startIndex: 1,
                    endIndex: 4,
                    scenarioContext,
                });
            }
        );
    }
);

Given(
    '{string} has created a {string} {string} {string} lesson in the {string}',
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        methodSavingOptionType: MethodSavingType,
        lessonType: LessonType,
        lessonTime: LessonManagementLessonTime
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const teachingMethod =
            lessonType === 'group'
                ? LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP
                : LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL;

        const schedulingStatus =
            lessonActionSave === 'Published'
                ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

        const methodSavingOption =
            methodSavingOptionType === 'One Time'
                ? CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME
                : CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE;

        const createLessonTime =
            lessonTime === 'future' && methodSavingOptionType === 'Weekly Recurring'
                ? 'future weekly recurring'
                : lessonTime;

        await cms.instruction(
            `${role} has created a ${lessonActionSave} ${methodSavingOptionType} ${lessonType} lesson in the ${lessonTime}`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime,
                    teachingMethod,
                    teachingMedium: 'Online',
                    schedulingStatus,
                    methodSavingOption,
                });
            }
        );
    }
);

Then(
    '{string} sees the status of the all lessons in the chain still is {string} after 2nd lesson {string}',
    async function (
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees the status of the all lessons in the chain still is ${lessonStatus} after 2nd lesson ${lessonTime}`,
            async function () {
                await assertLessonStatusOrderBy({
                    cms,
                    lessonStatus,
                    lessonTime,
                    startIndex: 2,
                    endIndex: 4,
                    scenarioContext,
                });
            }
        );
    }
);
