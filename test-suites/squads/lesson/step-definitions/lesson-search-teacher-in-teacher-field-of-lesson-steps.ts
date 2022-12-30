import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    seesTeacherInTeacherField,
    searchAndSelectTeachers,
    createTeachers,
    searchAndClearTeachers,
} from './lesson-search-teacher-in-teacher-field-of-lesson-definitions';

Given(
    '{string} has created {string} new teacher',
    async function (this: IMasterWorld, role: AccountRoles, numberTeacher: number) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`${role} selects a teacher`, async function () {
            await createTeachers(cms, scenario, numberTeacher);
        });
    }
);

When(
    '{string} searches and selects for the created teacher',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`${role} selects a teacher`, async function () {
            await searchAndSelectTeachers(cms, scenario);
        });
    }
);

When(
    '{string} searches and clears for the created teacher',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`${role} selects a teacher`, async function () {
            await searchAndClearTeachers(cms, scenario);
        });
    }
);

Then(
    '{string} sees selected teacher in teacher field',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`${role} selects a teacher`, async function () {
            await seesTeacherInTeacherField(cms, scenario);
        });
    }
);
