import { Given } from '@cucumber/cucumber';

import { IMasterWorld, CMSInterface } from '@supports/app-types';

import {
    aSchoolAdminClickOnProfileButton,
    aSchoolAdminClickLogoutButton,
} from './user-login-fail-definitions';

Given('school admin has logged out CMS', async function (this: IMasterWorld): Promise<void> {
    await this.cms.instruction('Click on dropdown', async function (cms: CMSInterface) {
        await aSchoolAdminClickOnProfileButton(cms);
    });

    await this.cms.instruction('Click on logout button', async function (cms: CMSInterface) {
        await aSchoolAdminClickLogoutButton(cms);
    });
});
