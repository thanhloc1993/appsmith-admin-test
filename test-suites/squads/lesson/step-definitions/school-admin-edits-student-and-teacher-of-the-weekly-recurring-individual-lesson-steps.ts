import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod } from 'manabuf/lessonmgmt/v1/enums_pb';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { ActionCanSee, ComparePosition } from 'test-suites/squads/lesson/common/types';
import { OrderLessonInRecurringChain } from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import {
    assertSeeTeacherAndStudentOfRecurringLesson,
    createLessonWithTeachersAndStudentsByGRPC,
    setupAndAddNewTeacherAndStudentToLesson,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-student-and-teacher-of-the-weekly-recurring-individual-lesson-definitions';
import { transformToAccountRoles } from 'test-suites/squads/lesson/utils/transform';

Given(
    '{string} has created a {string} individual lesson with teacher {string}, student {string}',
    async function (
        role: AccountRoles,
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

        await cms.instruction(
            `${role} has created a ${lessonTime} individual lesson with teacher ${teachers}, student ${students}`,
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
                });
            }
        );
    }
);

Then(
    '{string} can {string} {string} and {string} in other lessons in chain {string} the edited lesson',
    async function (
        role: AccountRoles,
        action: ActionCanSee,
        teacherRole: AccountRoles,
        studentRole: AccountRoles,
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
            `${role} can ${action} ${teacherRole} and ${studentRole} in other lessons in chain ${position} the edited lesson`,
            async function () {
                await assertSeeTeacherAndStudentOfRecurringLesson({
                    cms,
                    scenarioContext,
                    order: assertedOrder,
                    teacherRole,
                    studentRole,
                    shouldBeExisted,
                });
            }
        );
    }
);

Then(
    '{string} can {string} {string} and {string} in other lessons in chain',
    async function (
        role: AccountRoles,
        action: ActionCanSee,
        teacherRole: AccountRoles,
        studentRole: AccountRoles
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const shouldBeExisted = action === 'see';

        await cms.instruction(
            `${role} can ${action} ${teacherRole} and ${studentRole} in other lessons in chain`,
            async function () {
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
