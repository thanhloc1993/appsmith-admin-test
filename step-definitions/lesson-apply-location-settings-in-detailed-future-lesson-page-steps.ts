import { When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getCMSInterfaceByRole } from './utils';
import {
    assertLocationSettingPopupVisible,
    cancelApplyingLocationInLessonDetailPage,
    confirmApplyLocationSettings,
} from 'step-definitions/lesson-apply-location-settings-in-detailed-future-lesson-page-definitions';

When(
    '{string} confirms to apply location settings',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} confirms to apply location settings`, async function () {
            await confirmApplyLocationSettings(cms);
        });
    }
);

When(
    '{string} cancels confirming applying location settings by {string}',
    async function (this: IMasterWorld, role: AccountRoles, options: string) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} confirms to apply location settings ${options}`,
            async function () {
                await cancelApplyingLocationInLessonDetailPage(cms, options);
            }
        );
    }
);

Then(
    '{string} still sees location settings popup',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} still sees location settings popup`, async function () {
            await assertLocationSettingPopupVisible(cms);
        });
    }
);
