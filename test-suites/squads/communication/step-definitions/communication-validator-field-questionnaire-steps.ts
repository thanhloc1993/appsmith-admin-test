import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    checkAnswerContentErrorMessage,
    checkQuestionTitleErrorMessage,
} from './communication-common-questionnaire-definitions';

When(
    '{string} sees required fields validator Question and Answer',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        await checkQuestionTitleErrorMessage(cms, scenario, 'This field is required');
        await checkAnswerContentErrorMessage(cms, scenario, 'This field is required');
    }
);
