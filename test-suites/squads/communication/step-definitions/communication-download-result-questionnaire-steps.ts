import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { DataTable, Given, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { QuestionnaireAnswerTable } from './communication-common-questionnaire-definitions';
import {
    checkResultInQuestionnaireAnswerFile,
    deleteQuestionnaireAnswerResultFile,
    downloadQuestionnaireAnswerResult,
    mapRecipientNameInQuestionnaireAnswerTable,
} from './communication-download-result-questionnaire-definitions';

Given('{string} download questionnaire answer result', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await cms.instruction('Reload CMS to get the updated notification', async function () {
        await cms.page?.reload();
        await cms.waitingForLoadingIcon();
        await cms.waitForSkeletonLoading();
    });

    const suggestedFileName = await downloadQuestionnaireAnswerResult(cms, scenario);
    await deleteQuestionnaireAnswerResultFile(cms, suggestedFileName);
});

When(
    '{string} sees file display correct with data',
    async function (role: AccountRoles, questionnaireAnswerTable: DataTable) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const hashedQuestionnaireAnswerTable: QuestionnaireAnswerTable[] =
            questionnaireAnswerTable.hashes();
        const mappedQuestionnaireAnswerTable = mapRecipientNameInQuestionnaireAnswerTable(
            scenario,
            hashedQuestionnaireAnswerTable
        );

        await checkResultInQuestionnaireAnswerFile(cms, scenario, mappedQuestionnaireAnswerTable);
    }
);
