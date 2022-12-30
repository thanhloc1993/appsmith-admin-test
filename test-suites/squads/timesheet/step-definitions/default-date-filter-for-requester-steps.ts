import { submitButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { aSchoolAdminAlreadyLoginSuccessInCMS } from '@legacy-step-definitions/school-admin-email-login-definitions';
import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld, CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { staffProfileAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import { createTimesheetsForMutipleDate } from 'test-suites/squads/timesheet/step-definitions/default-date-filter-for-requester-definitions';
import { fillTestAccountMultiTenantLoginInCMS } from 'test-suites/squads/user-management/step-definitions/user-multi-tenant-authentication-definitions';

Given(
    '{string} creates {int} timesheet for this staff',
    async function (this: IMasterWorld, role: AccountRoles, numTimesheets: number) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} creates ${numTimesheets} timesheet for this staff`,
            async function (cms) {
                await createTimesheetsForMutipleDate(cms, role, scenarioContext, numTimesheets);
            }
        );
    }
);

Given('staff logins CMS', async function (this: IMasterWorld) {
    const cms2 = this.cms2;
    const scenario = this.scenario;
    const page = cms2.page!;

    const { email, password } = await scenario.get<UserProfileEntity>(staffProfileAlias);

    await cms2.instruction('staff logins cms', async function (this: CMSInterface) {
        await fillTestAccountMultiTenantLoginInCMS(this, {
            organization: 'e2e',
            username: email,
            password: password,
        });
    });

    await page.click(submitButton);

    await cms2.instruction('Logged in, see home page', async function (cms: CMSInterface) {
        await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
    });
});
