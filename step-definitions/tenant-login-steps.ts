import { Given } from '@cucumber/cucumber';

import { AccountRoles, Tenant } from '@supports/app-types';

import {
    userLoginWithTenantToCMS,
    userLoginWithTenantToLearnerApp,
    userLoginWithTenantToTeacherApp,
    userLoginWithTenantToTeacherAppWithAvailableAccount,
} from 'step-definitions/tenant-login-definitions';

Given(
    '{string} of {string} has logged in CMS',
    async function (accountRole: AccountRoles, tenant: Tenant) {
        const allowListRoles: AccountRoles[] = [
            'school admin',
            'school admin 1',
            'school admin 2',
            'teacher',
            'teacher T1',
            'teacher T2',
        ];
        if (!allowListRoles.includes(accountRole)) {
            throw new Error(`${accountRole} is not allowed to login to CMS`);
        }

        await userLoginWithTenantToCMS(this, accountRole, tenant);
    }
);

Given(
    '{string} of {string} has logged in Teacher App',
    async function (accountRole: AccountRoles, tenant: Tenant) {
        const allowListRoles: AccountRoles[] = ['teacher', 'teacher T1', 'teacher T2'];

        if (!allowListRoles.includes(accountRole)) {
            throw new Error(`${accountRole} is not allowed to login to Teacher App`);
        }

        await userLoginWithTenantToTeacherApp(this, accountRole, tenant);
    }
);

Given(
    '{string} of {string} has logged in Teacher App with available account',
    async function (accountRole: AccountRoles, tenant: Tenant) {
        const allowListRoles: AccountRoles[] = ['teacher', 'teacher T1', 'teacher T2'];

        if (!allowListRoles.includes(accountRole)) {
            throw new Error(`${accountRole} is not allowed to login to Teacher App`);
        }

        await userLoginWithTenantToTeacherAppWithAvailableAccount(this, accountRole, tenant);
    }
);

Given(
    '{string} of {string} with course and enrolled status has logged Learner App',
    async function (accountRole: AccountRoles, tenant: Tenant) {
        const allowListRoles: AccountRoles[] = ['student', 'student S1', 'student S2'];

        if (!allowListRoles.includes(accountRole)) {
            throw new Error(`${accountRole} is not allowed to login to Learner App`);
        }

        await userLoginWithTenantToLearnerApp(this, accountRole, tenant);
    }
);
