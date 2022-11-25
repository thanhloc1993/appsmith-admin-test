import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasQuestionnaireTable } from './alias-keys/communication';
import { getQuestionSectionSelectorByQuestionIndex } from './cms-selectors/communication';
import {
    checkAddAnswerQuestionIsHidden,
    checkAddQuestionIsHidden,
    MappedQuestionnaireTable,
} from './communication-common-questionnaire-definitions';
import { MAX_ANSWER, MAX_QUESTION } from './communication-constants';

When(
    '{string} sees buttons hidden with conditions on questionnaire form',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        const questionnaireTable: MappedQuestionnaireTable[] =
            this.scenario.get(aliasQuestionnaireTable);

        if (questionnaireTable.length === MAX_QUESTION) {
            await checkAddQuestionIsHidden(cms);
        }

        for (const [questionnaireIndex, questionnaire] of questionnaireTable.entries()) {
            if (questionnaire.numberOfAnswersEach === MAX_ANSWER) {
                const questionSectionElement = await cms.page!.$(
                    getQuestionSectionSelectorByQuestionIndex(questionnaireIndex)
                );
                if (!questionSectionElement)
                    throw Error('Cannot find question section in questionnaire');

                await checkAddAnswerQuestionIsHidden(cms, questionSectionElement);
            }
        }
    }
);
