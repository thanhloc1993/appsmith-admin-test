import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import {
    fillUpsertFormLessonOfLessonManagement,
    lessonL1AboveLessonL2,
    LessonManagementLessonDate,
    LessonManagementLessonName,
    selectDateAndTime,
    submitUpsertLessonForm,
} from './lesson-default-sort-future-lessons-list-definitions';
import { searchLessonOfLessonManagement } from './lesson-search-future-lesson-definitions';
import { getCMSInterfaceByRole, getUserProfileFromContext } from './utils';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';
import { createARandomStaffFromGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-staff-definitions';

Given(
    '{string} has filled start date is {string} & time from {string} to {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonDate: LessonManagementLessonDate,
        lessonTimeStart: string,
        lessonTimeEnd: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has filled start date is ${lessonDate} & time from ${lessonTimeStart} to ${lessonTimeEnd}`,
            async function () {
                await selectDateAndTime(cms, lessonDate, lessonTimeStart, lessonTimeEnd);
            }
        );
    }
);

Given(
    '{string} has added {string}',
    async function (this: IMasterWorld, role: AccountRoles, studentRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: teacherName } = await createARandomStaffFromGRPC(cms);
        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await cms.instruction(`${role} has added ${studentName}`, async function () {
            await fillUpsertFormLessonOfLessonManagement({
                cms,
                teacherName,
                studentName,
            });
        });
    }
);

Given(
    '{string} has created the {string} of lesson management',
    {
        timeout: 90000,
    },
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonName: LessonManagementLessonName
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`${role} has created the ${lessonName}`, async function () {
            await submitUpsertLessonForm(cms, scenario, lessonName);
        });
    }
);

When(
    '{string} searches name of {string} for the keyword',
    async function (this: IMasterWorld, role: AccountRoles, studentRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await cms.instruction(`${role} fills ${studentName} in the searchbar`, async function () {
            await searchLessonOfLessonManagement(cms, studentName);
        });
    }
);

Then(
    '{string} sees {string} above {string} in {string} lessons list',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonL1: LessonManagementLessonName,
        lessonL2: LessonManagementLessonName,
        lessonTIme: LessonManagementLessonTime
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees in ${lessonTIme} lessons list is ${lessonL1} above ${lessonL2}`,
            async function () {
                await lessonL1AboveLessonL2(cms, scenario, lessonL1, lessonL2);
            }
        );
    }
);
