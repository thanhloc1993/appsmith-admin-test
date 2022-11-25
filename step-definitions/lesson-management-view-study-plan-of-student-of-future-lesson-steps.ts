import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { aliasCourseId, aliasStudyPlanName } from './alias-keys/syllabus';
import {
    assertLessonReportButtonStatus,
    teacherHasSavedDraftReport,
    viewStudyPlanOfStudent,
} from './lesson-management-view-study-plan-of-student-of-future-lesson-definitions';
import { delay, getCMSInterfaceByRole, getTeacherInterfaceFromRole } from './utils';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';
import { ViewStudyPlanOrPreviousReportButtonType } from 'step-definitions/types/content';
import { teacherSeeStudyPlan } from 'test-suites/common/step-definitions/teacher-study-plan-definitions';

Then(
    '{string} sees {string} button is {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        button: ViewStudyPlanOrPreviousReportButtonType,
        state: 'enabled' | 'disabled'
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} sees ${button} button is ${state}`, async function () {
            // need to wait for icon to be loaded
            await delay(2000);
            await assertLessonReportButtonStatus(cms, button, state);
        });
    }
);

When(
    '{string} views studyplan of student',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        const courseId = context.get(aliasCourseId);
        const { id: studentId }: UserProfileEntity = context.get(
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const teacher = getTeacherInterfaceFromRole(this, role);

        await cms.instruction(`${role} views studyplan of student`, async function () {
            await cms.waitForDataTestId('ButtonViewStudyPlan__button');
            await cms.page!.waitForSelector(LessonManagementKeys.viewStudyPlanButton);
            await viewStudyPlanOfStudent(teacher, courseId, studentId);
        });
    }
);

When(
    '{string} has saved draft individual lesson report of {string} lesson',
    async function (this: IMasterWorld, role: AccountRoles, state: string) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} has saved draft individual lesson report of ${state} lesson`,
            async function () {
                await cms.waitingForLoadingIcon();
                await teacherHasSavedDraftReport(cms);
            }
        );
    }
);

Then(
    '{string} sees studyplan of student in new browser',
    async function (this: IMasterWorld, role: AccountRoles) {
        const studyPlanName = this.scenario.get<string>(aliasStudyPlanName);
        const teacher = this.teacher;
        await teacher.instruction(
            `${role} sees studyplan of student in new browser`,
            async function () {
                await teacherSeeStudyPlan(teacher, studyPlanName);
            }
        );
    }
);
