import { Given, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    getStaffNameFromContext,
    getStudentNameFromContext,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { LessonTimeValueType, MethodSavingType } from 'test-suites/squads/lesson/common/types';
import { createGroupLessonWithTeacherAndStudent } from 'test-suites/squads/lesson/step-definitions/school-admin-edits-student-and-teacher-of-the-weekly-recurring-group-lesson-definitions';
import {
    removeStudentFromLesson,
    removeTeacherFromLesson,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has created a {string} {string} group lesson with teachers and students',
    async function (
        cmsRole: AccountRoles,
        lessonTime: LessonTimeValueType,
        savingMethod: MethodSavingType
    ) {
        const cms = getCMSInterfaceByRole(this, cmsRole);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${cmsRole} has created a ${lessonTime} ${savingMethod} group lesson with teachers and students`,
            async function () {
                await createGroupLessonWithTeacherAndStudent(
                    cms,
                    scenarioContext,
                    lessonTime,
                    savingMethod,
                    ['teacher T1', 'teacher T2'],
                    ['student S1', 'student S2']
                );
            }
        );
    }
);

When(
    '{string} removes {string} and {string} to the lesson',
    async function (cmsRole: AccountRoles, teacherRole: AccountRoles, studentRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, cmsRole);
        const context = this.scenario;
        const teacherName = getStaffNameFromContext(context, teacherRole);
        const studentName = getStudentNameFromContext(context, studentRole);
        await cms.instruction(
            `${cmsRole} removes ${teacherRole} and ${studentRole} to the lesson`,
            async function () {
                await removeTeacherFromLesson(cms, teacherName);
                await removeStudentFromLesson(cms, studentName);
            }
        );
    }
);
