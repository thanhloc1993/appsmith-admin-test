import {
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import {
    getUserProfileFromContext,
    getUsersFromContextByRegexKeys,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasLessonTime } from 'test-suites/squads/lesson/common/alias-keys';
import {
    AttendanceNoticeValues,
    AttendanceReasonValues,
    AttendanceStatusValues,
    LessonTimeValueType,
    LessonType,
    LessonUpsertFields,
    MethodSavingType,
} from 'test-suites/squads/lesson/common/types';
import {
    assertLessonStatus,
    assertLessonStatusOrderBy,
} from 'test-suites/squads/lesson/step-definitions/auto-change-status-change-to-completed-when-submit-lesson-group-report-definitions';
import {
    assertBreakRecurringChain,
    assertDetailLessonChangeSavingOption,
} from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-center-of-weekly-recurring-individual-lesson-definitions';
import {
    assertValueOfAttendanceInfoNoteUpdated,
    assertValueOfAttendanceInfoNoticeUpdated,
    assertValueOfAttendanceInfoReasonUpdated,
    assertValueOfAttendanceInfoStatusUpdated,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-general-infomation-of-weekly-recurring-group-lesson-definitions';
import {
    filterLessonListByStudentName,
    OrderLessonInRecurringChain,
    selectLessonLinkByLessonOrder,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import { goToLessonsList } from 'test-suites/squads/lesson/utils/lesson-list';
import {
    assertGroupLessonUpsertFieldNoChanged,
    assertGroupLessonUpsertFieldUpdated,
    assertUpdatedGroupLessonFieldOfOtherLessonInChain,
    createLessonWithGRPC,
    methodSavingObject,
} from 'test-suites/squads/lesson/utils/lesson-upsert';
import { generateMaterialWithType } from 'test-suites/squads/lesson/utils/materials';
import { parseLessonTime } from 'test-suites/squads/lesson/utils/utils';

Then(
    '{string} sees Attendance is {string}, {string}, {string}, and {string} of student are updated',
    async function (
        role: AccountRoles,
        status: AttendanceStatusValues,
        notice: AttendanceNoticeValues,
        reason: AttendanceReasonValues,
        note: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees Attendance is ${status}, ${notice}, ${reason}, and ${note} of student are updated`,
            async function () {
                await assertValueOfAttendanceInfoStatusUpdated(cms, status);
                await assertValueOfAttendanceInfoNoticeUpdated(cms, notice);
                await assertValueOfAttendanceInfoReasonUpdated(cms, reason);
                await assertValueOfAttendanceInfoNoteUpdated(cms, note);
            }
        );
    }
);

Then(
    '{string} sees all {string} {string} lessons in chain no change',
    async function (
        role: AccountRoles,
        lessonStatus: LessonActionSaveType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `${role} sees other ${lessonStatus} ${lessonTime} lessons in chain no change`,
            async function () {
                await assertBreakRecurringChain({
                    cms,
                    countBreakChain: 5,
                    studentName,
                    role,
                    lessonTime,
                });

                await assertDetailLessonChangeSavingOption({
                    cms,
                    lessonTime,
                    studentName,
                    role,
                    savingOptionExpect: 'Weekly Recurring',
                });

                await assertLessonStatusOrderBy({
                    cms,
                    lessonTime,
                    startIndex: 0,
                    scenarioContext: scenario,
                    endIndex: 4,
                    lessonStatus,
                });
            }
        );
    }
);

Then(
    '{string} sees updated {string} for this {string} group lesson',
    async function (
        role: AccountRoles,
        field: LessonUpsertFields,
        lessonStatus: LessonActionSaveType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees updated ${field} for this ${lessonStatus} lesson`,
            async function () {
                await assertGroupLessonUpsertFieldUpdated(cms, scenarioContext, field);
                await assertLessonStatus(cms, lessonStatus);
            }
        );
    }
);

Then(
    '{string} sees updated {string} for other {string} group lessons in chain',
    {
        timeout: 120000,
    },
    async function (
        role: AccountRoles,
        field: LessonUpsertFields,
        lessonStatus: LessonActionSaveType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);

        await cms.instruction(
            `${role} sees updated ${field} for other ${lessonStatus} group lessons in chain`,
            async function () {
                await assertUpdatedGroupLessonFieldOfOtherLessonInChain(
                    cms,
                    scenarioContext,
                    lessonTime,
                    field
                );
                await assertLessonStatus(cms, lessonStatus);
            }
        );
    }
);

Then(
    '{string} other {string} group lessons before the edited lesson no change in {string}',
    async function (
        role: AccountRoles,
        lessonStatus: LessonActionSaveType,
        field: LessonUpsertFields
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);
        const users = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
        await cms.instruction(
            `${role} other ${lessonStatus} lessons before the edited lesson no change in ${field}`,
            async function () {
                await goToLessonsList({ cms, lessonTime });
                await filterLessonListByStudentName(cms, users[0].name, lessonTime);
                await selectLessonLinkByLessonOrder(
                    cms,
                    OrderLessonInRecurringChain.FIRST,
                    lessonTime
                );
                await assertGroupLessonUpsertFieldNoChanged(cms, scenarioContext, field);
                await assertLessonStatus(cms, lessonStatus);
            }
        );
    }
);

Then(
    '{string} other {string} group lessons after the edited lesson no change in {string}',
    async function (
        role: AccountRoles,
        lessonStatus: LessonActionSaveType,
        field: LessonUpsertFields
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);
        const users = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
        await cms.instruction(
            `${role} other ${lessonStatus} group lessons after the edited lesson no change in ${field}`,
            async function () {
                await goToLessonsList({ cms, lessonTime });
                await filterLessonListByStudentName(cms, users[0].name, lessonTime);
                await selectLessonLinkByLessonOrder(
                    cms,
                    OrderLessonInRecurringChain.FOURTH,
                    lessonTime
                );
                await assertGroupLessonUpsertFieldNoChanged(cms, scenarioContext, field);
                await assertLessonStatus(cms, lessonStatus);
            }
        );
    }
);

Given(
    '{string} has created a {string} {string} {string} lessons in the {string} with attached {string}',
    {
        timeout: 120000,
    },
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        methodSaving: MethodSavingType,
        teachingMedium: LessonType,
        lessonTime: LessonTimeValueType,
        materials: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const materialsList = generateMaterialWithType(materials);

        const createLessonTime = parseLessonTime({ lessonTime, methodSaving });
        await cms.instruction(
            `${role} has created a ${lessonActionSave} ${methodSaving} ${teachingMedium} lesson in the ${lessonTime} with attached ${materials}`,
            async function () {
                const teachingMethod: LessonTeachingMethod =
                    teachingMedium === 'individual'
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
                    createLessonTime,
                    teachingMethod,
                    schedulingStatus,
                    materialsList,
                    methodSavingOption: methodSavingObject[methodSaving],
                });
            }
        );
    }
);
