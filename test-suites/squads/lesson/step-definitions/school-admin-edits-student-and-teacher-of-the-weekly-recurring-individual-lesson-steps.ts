import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod, LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import {
    getStaffNameFromContext,
    getStudentNameFromContext,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    ActionCanSee,
    ComparePosition,
    LessonStatusType,
    LessonTimeValueType,
} from 'test-suites/squads/lesson/common/types';
import {
    assertLessonStatus,
    assertLessonStatusOrderBy,
} from 'test-suites/squads/lesson/step-definitions/auto-change-status-change-to-completed-when-submit-lesson-group-report-definitions';
import {
    assertStudentNameExistInLessonDetailPageOnCMS,
    assertTeacherNameExistInLessonDetailPageOnCMS,
} from 'test-suites/squads/lesson/step-definitions/lesson-can-edit-one-time-group-lesson-by-removing-definitions';
import { OrderLessonInRecurringChain } from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import {
    assertSeeTeacherAndStudentOfRecurringLesson,
    createLessonWithTeachersAndStudentsByGRPC,
    setupAndAddNewTeacherAndStudentToLesson,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-student-and-teacher-of-the-weekly-recurring-individual-lesson-definitions';
import { transformToAccountRoles } from 'test-suites/squads/lesson/utils/transform';

Given(
    '{string} has created a {string} {string} individual lesson with teacher {string},student {string}',
    async function (
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: 'future weekly recurring' | 'past weekly recurring',
        teachers: string,
        students: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const teacherRoles = transformToAccountRoles(teachers, 'teacher');
        // transform "T1, T2" to ["teacher T1, teacher T2"]
        const studentRoles = transformToAccountRoles(students, 'student');
        // transform "S1, S2" to ["student S1, student S2"]

        const schedulingStatus =
            lessonStatus === 'Published'
                ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

        await cms.instruction(
            `${role} has created a ${lessonStatus} ${lessonTime} individual lesson with teacher ${teachers}, student ${students}`,
            async function () {
                await createLessonWithTeachersAndStudentsByGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime: lessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
                    teachingMedium: 'Online',
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE,
                    teacherRoles,
                    studentRoles,
                    schedulingStatus,
                });
            }
        );
    }
);

Then(
    '{string} can {string} {string} & {string} in other {string} lessons in chain {string} the edited lesson',
    async function (
        role: AccountRoles,
        action: ActionCanSee,
        teacherRole: AccountRoles,
        studentRole: AccountRoles,
        lessonStatus: LessonStatusType,
        position: ComparePosition
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const shouldBeExisted = action === 'see';
        const assertedOrder =
            position === 'before'
                ? OrderLessonInRecurringChain.FIRST
                : OrderLessonInRecurringChain.LAST;

        await cms.instruction(
            `${role} can ${action} ${teacherRole} & ${studentRole} in other ${lessonStatus} lessons in chain ${position} the edited lesson`,
            async function () {
                await assertSeeTeacherAndStudentOfRecurringLesson({
                    cms,
                    scenarioContext,
                    order: assertedOrder,
                    teacherRole,
                    studentRole,
                    shouldBeExisted,
                });
                await assertLessonStatus(cms, lessonStatus);
            }
        );
    }
);

Then(
    '{string} can {string} {string} & {string} in other {string} {string} lessons in chain',
    {
        timeout: 360000,
    },
    async function (
        role: AccountRoles,
        action: ActionCanSee,
        teacherRole: AccountRoles,
        studentRole: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const shouldBeExisted = action === 'see';

        await cms.instruction(
            `${role} can ${action} ${teacherRole} & ${studentRole} in other ${lessonStatus} ${lessonTime} lessons in chain`,
            async function () {
                await assertLessonStatusOrderBy({
                    cms,
                    scenarioContext,
                    lessonTime,
                    lessonStatus,
                    endIndex: 0,
                    startIndex: 4,
                });
                await assertSeeTeacherAndStudentOfRecurringLesson({
                    cms,
                    scenarioContext,
                    order: OrderLessonInRecurringChain.FIRST,
                    teacherRole,
                    studentRole,
                    shouldBeExisted,
                });
                await assertSeeTeacherAndStudentOfRecurringLesson({
                    cms,
                    scenarioContext,
                    order: OrderLessonInRecurringChain.LAST,
                    teacherRole,
                    studentRole,
                    shouldBeExisted,
                });
            }
        );
    }
);

When(
    '{string} adds {string} and {string} in lesson edit page',
    async function (role: AccountRoles, teacherRole: AccountRoles, studentRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} adds ${teacherRole} and ${studentRole} in lesson edit page`,
            async function () {
                await setupAndAddNewTeacherAndStudentToLesson({
                    cms,
                    scenarioContext,
                    teacherRole,
                    studentRole,
                });
            }
        );
    }
);

Then(
    '{string} can {string} {string} in lesson detail page of the {string} lesson on CMS',
    async function (
        adminRole: AccountRoles,
        action: string,
        teacherRole: AccountRoles,
        lessonStatus: LessonStatusType
    ) {
        const cms = getCMSInterfaceByRole(this, adminRole);
        const teacherName = getStaffNameFromContext(this.scenario, teacherRole);
        const exist = action === 'see';
        await cms.instruction(
            `${adminRole} can ${action} ${teacherRole} in lesson detail page of the ${lessonStatus} lesson on CMS`,
            async function () {
                await assertTeacherNameExistInLessonDetailPageOnCMS(cms, teacherName, exist);
                await assertLessonStatus(cms, lessonStatus);
            }
        );
    }
);

Then(
    '{string} can {string} {string} in student list in lesson detail page of the {string} lesson on CMS',
    async function (
        adminRole: AccountRoles,
        action: string,
        learnerRole: AccountRoles,
        lessonStatus: LessonStatusType
    ) {
        const cms = getCMSInterfaceByRole(this, adminRole);
        const learnerName = getStudentNameFromContext(this.scenario, learnerRole);
        const exist = action === 'see';
        await cms.instruction(
            `${adminRole} can ${action} ${learnerRole} in student list in lesson detail page of the ${lessonStatus} lesson on CMS`,
            async function () {
                await assertStudentNameExistInLessonDetailPageOnCMS(cms, learnerName, exist);
                await assertLessonStatus(cms, lessonStatus);
            }
        );
    }
);
