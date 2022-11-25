import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasQuestionnaireTable } from './alias-keys/communication';
import {
    checkAccordionAnswerContent,
    checkAccordionQuestionContent,
    checkArrowIconInQuestionSectionDetail,
    checkDetailAnswerExpandStateInQuestionSectionDetail,
    clickArrowIconInQuestionSectionDetail,
} from './communication-collapse-and-expand-question-in-detail-notification-questionnaire-definitions';
import {
    AccordionStatus,
    ArrowType,
    MappedQuestionnaireTable,
    QuestionnaireFormData,
} from './communication-common-questionnaire-definitions';

When(
    '{string} click {string} at {string}',
    async function (role: AccountRoles, arrowIconType: ArrowType, questionSectionList: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        const questionSections = questionSectionList.split(',');
        const questionnaireTable: MappedQuestionnaireTable[] = context.get(aliasQuestionnaireTable);

        for (const [questionnaireIndex, { questionSection }] of questionnaireTable.entries()) {
            if (questionSection && questionSections.includes(questionSection)) {
                const questionnaireFormData: QuestionnaireFormData = context.get(questionSection);

                await clickArrowIconInQuestionSectionDetail(cms, arrowIconType, questionnaireIndex);
                await checkAccordionQuestionContent(cms, questionnaireFormData, questionnaireIndex);
            }
        }
    }
);

Then(
    '{string} sees {string} at {string}',
    async function (role: AccountRoles, arrowIconType: ArrowType, questionSectionList: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        const questionSections = questionSectionList.split(',');
        const questionnaireTable: MappedQuestionnaireTable[] = context.get(aliasQuestionnaireTable);

        for (const [questionnaireIndex, { questionSection }] of questionnaireTable.entries()) {
            if (questionSection && questionSections.includes(questionSection)) {
                await checkArrowIconInQuestionSectionDetail(cms, arrowIconType, questionnaireIndex);
            }
        }
    }
);

Then(
    '{string} sees {string} {string} all answer',
    async function (
        role: AccountRoles,
        questionSectionList: string,
        accordionStatus: AccordionStatus
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        const questionSections = questionSectionList.split(',');
        const questionnaireTable: MappedQuestionnaireTable[] = context.get(aliasQuestionnaireTable);

        for (const [questionnaireIndex, { questionSection }] of questionnaireTable.entries()) {
            if (questionSection && questionSections.includes(questionSection)) {
                const questionnaireFormData: QuestionnaireFormData = context.get(questionSection);

                await checkDetailAnswerExpandStateInQuestionSectionDetail(
                    cms,
                    accordionStatus,
                    questionnaireIndex
                );
                await checkAccordionAnswerContent(cms, questionnaireFormData, questionnaireIndex);
            }
        }
    }
);
