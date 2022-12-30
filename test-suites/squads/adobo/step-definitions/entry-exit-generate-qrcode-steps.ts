import {
    getLearnerInterfaceFromRole,
    getUserProfileFromContext,
} from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { learnerSeesQrCode, tapOnMyQrCode } from './entry-exit-generate-qrcode-definitions';
import {
    findNewlyCreatedLearnerOnCMSStudentsPage,
    openMenuPopupOnWeb,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

Then(
    '{string} sees QR Code has been generated',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = this.cms;
        const learner = getLearnerInterfaceFromRole(this, role);

        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(role)
        );

        await cms.instruction(
            `Find student ${learnerProfile.name} on student list`,
            async function () {
                await findNewlyCreatedLearnerOnCMSStudentsPage(cms, learnerProfile);
            }
        );

        await openMenuPopupOnWeb(learner);

        await tapOnMyQrCode(learner);

        await learnerSeesQrCode(learner);
    }
);
