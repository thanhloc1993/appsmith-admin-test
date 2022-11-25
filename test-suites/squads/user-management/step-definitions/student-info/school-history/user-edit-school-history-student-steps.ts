import { FieldsConditionTypes } from '@user-common/types/bdd';
import { goToEditPageAStudent } from '@user-common/utils/goto-page';

import { Given, Then, When } from '@cucumber/cucumber';

import { SchoolHistoryFields } from './types';
import {
    createStudentWithSchoolHistory,
    deselectsFieldSchoolHistory,
    schoolAdminCheckBlankFields,
} from './user-edit-school-history-student-definitions';

Given(
    'school admin has created a student {string} for School History',
    async function (fieldsCondition: FieldsConditionTypes) {
        const scenarioContext = this.scenario;
        const cms = this.cms;

        await cms.instruction(
            `School admin has created a student ${fieldsCondition} for School History`,
            async function () {
                await createStudentWithSchoolHistory(cms, scenarioContext, fieldsCondition);
            }
        );
    }
);

When(
    'school admin deselects the previously chosen {string}',
    async function (attributes: SchoolHistoryFields) {
        const scenarioContext = this.scenario;
        const cms = this.cms;

        await cms.instruction(`School admin goes to edit page a student`, async function () {
            await goToEditPageAStudent(cms, scenarioContext);
        });
        await cms.instruction(
            `School admin deselects the previously chosen ${attributes}`,
            async function () {
                await deselectsFieldSchoolHistory(cms, attributes);
            }
        );
    }
);

Then(
    'school admin sees {string} fields becomes blank',
    async function (fields: SchoolHistoryFields) {
        const cms = this.cms;

        const arrayFields = fields.split('&') as SchoolHistoryFields[];
        await cms.instruction(
            `School admin sees ${fields} fields becomes blank`,
            async function () {
                await schoolAdminCheckBlankFields(cms, arrayFields);
            }
        );
    }
);
