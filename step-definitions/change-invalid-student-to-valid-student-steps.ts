import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    openEditStudentPage,
    seeStudentInTableMatchStudentNameSearchBar,
    selectStatusFromOptionInAutoCompleteBoxByText,
} from './change-invalid-student-to-valid-student-definitions';
import { StatusTypes } from './types/common';
import { goToDetailedStudentInfoPage } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

Given('school admin has opened editing student page', async function () {
    const cms = this.cms;
    const scenario = this.scenario;
    const student = scenario.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student')
    );

    await cms.instruction('school admin gone to student detail page', async function () {
        await goToDetailedStudentInfoPage(cms, student);
    });

    await cms.instruction(
        `school admin has opened editing student "Name:${student.name}/ID:${student.id}"`,
        async function () {
            await openEditStudentPage(cms);
        }
    );
});
Given(
    '{string} has changed student {string} status to {string} status',
    async function (role: AccountRoles, status1: StatusTypes, status2: StatusTypes) {
        const cms = this.cms;

        await cms.instruction(
            `${role} changed student "${status1}" status to "${status2}" status`,
            async function () {
                await selectStatusFromOptionInAutoCompleteBoxByText(cms, status2);
                await cms.confirmDialogAction();
                await cms.waitingForLoadingIcon();
            }
        );
    }
);

Then(
    '{string} sees student which matches student name in search bar',
    async function (role: AccountRoles) {
        const cms = this.cms;
        const scenario = this.scenario;
        const student = scenario.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(`${role} see student "${student.name}" in table`, async function () {
            await seeStudentInTableMatchStudentNameSearchBar(cms, student);
        });
    }
);
