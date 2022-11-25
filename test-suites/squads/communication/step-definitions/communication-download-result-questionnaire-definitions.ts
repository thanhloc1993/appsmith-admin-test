import { optionsButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasQuestionnaireAnswerCsv } from './alias-keys/communication';
import { QuestionnaireAnswerTable } from './communication-common-questionnaire-definitions';
import { readFileSync, unlinkSync } from 'fs';
import { parse } from 'papaparse';

export interface QuestionnaireAnswerCsv extends QuestionnaireAnswerTable {
    '': string;
    Timestamp: string;
}

export function mapRecipientNameInQuestionnaireAnswerTable(
    scenario: ScenarioContext,
    hashedQuestionnaireAnswerTable: QuestionnaireAnswerTable[]
) {
    const mappedQuestionnaireAnswerTable = hashedQuestionnaireAnswerTable.map(
        (questionnaireAnswer) => {
            const studentKey = learnerProfileAliasWithAccountRoleSuffix(
                questionnaireAnswer['Responder Name'] as AccountRoles
            );
            const student: UserProfileEntity = scenario.get(studentKey);
            questionnaireAnswer['Responder Name'] = student.name;

            return questionnaireAnswer;
        }
    );

    return mappedQuestionnaireAnswerTable;
}

export async function downloadQuestionnaireAnswerResult(
    cms: CMSInterface,
    scenario: ScenarioContext
): Promise<string> {
    await cms.attach('Download questionnaire answer result');

    const recipientActionPanel = await cms.page!.waitForSelector(optionsButton);
    await recipientActionPanel.click();

    const [download] = await Promise.all([
        cms.page!.waitForEvent('download'),
        cms.selectAButtonByAriaLabel('Download Result'),
    ]);

    const suggestedFileName = download.suggestedFilename();

    await download.saveAs(suggestedFileName);

    await cms.attach('Parse data in questionnaire answer result file');

    const csvFile = readFileSync(suggestedFileName, {
        encoding: 'utf-8',
    });
    parse<QuestionnaireAnswerTable>(csvFile.toString(), {
        header: true,
        complete: (results) => {
            scenario.set(aliasQuestionnaireAnswerCsv, results.data);
        },
    });

    return suggestedFileName;
}

export async function deleteQuestionnaireAnswerResultFile(cms: CMSInterface, filePath: string) {
    await cms.attach('Delete questionnaire answer result file');

    unlinkSync(filePath);
}

export async function checkResultInQuestionnaireAnswerFile(
    cms: CMSInterface,
    scenario: ScenarioContext,
    mappedQuestionnaireAnswerTable: QuestionnaireAnswerTable[]
) {
    await cms.attach('Check result in questionnaire answer file');

    const questionnaireAnswerCsv: QuestionnaireAnswerTable[] = scenario.get(
        aliasQuestionnaireAnswerCsv
    );

    questionnaireAnswerCsv.forEach((questionnaireAnswer, answerIndex) => {
        weExpect(questionnaireAnswer).toMatchObject(mappedQuestionnaireAnswerTable[answerIndex]);
    });
}
