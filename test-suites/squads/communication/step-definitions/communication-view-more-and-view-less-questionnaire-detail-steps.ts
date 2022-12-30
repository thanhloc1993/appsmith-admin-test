import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { ToggleViewButtonType } from './communication-common-questionnaire-definitions';
import { clickToggleViewButtonInQuestionSectionDetail } from './communication-view-more-and-view-less-questionnaire-detail-definitions';

When(
    '{string} click {string} in questionnaire detail section',
    async function (role: AccountRoles, toggleViewButton: ToggleViewButtonType) {
        const cms = getCMSInterfaceByRole(this, role);

        await clickToggleViewButtonInQuestionSectionDetail(cms, toggleViewButton);
    }
);
