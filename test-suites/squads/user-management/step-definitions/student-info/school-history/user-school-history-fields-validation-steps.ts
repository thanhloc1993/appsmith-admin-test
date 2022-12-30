import { ActionsTypes } from '@user-common/types/bdd';

import { Then, When } from '@cucumber/cucumber';

import { ExpectedSchoolHistoryOptionTypes, SchoolHistoryFields } from './types';
import {
    schoolAdminClicksFieldsSchoolHistory,
    schoolAdminSelectsValueFieldsSchoolHistory,
    schoolSeesFullOptionsDropdown,
    schoolSeesOptionsSchoolLevelDependOnSchoolName,
    schoolSeesOptionsSchoolNameDependOnLevel,
} from './user-school-history-fields-validation-definitions';

When('school admin adds {float} draft School History', async function (number: number) {
    const page = this.cms.page!;
    await this.cms.instruction(
        `School admin adds ${number} draft School History`,
        async function () {
            const schoolHistoryUpsert = page.getByTestId('StudentSchoolHistoryUpsert__root');
            for (let i = 0; i < number; i++) {
                await schoolHistoryUpsert.locator('button', { hasText: 'Add' }).click();
            }
        }
    );
});

When(
    'school admin {string} {string} field',
    async function (actions: ActionsTypes, fields: SchoolHistoryFields) {
        const cms = this.cms;
        const context = this.scenario;
        await cms.instruction(`School admin ${actions}s ${fields} field`, async function () {
            switch (actions) {
                case 'select':
                    await schoolAdminSelectsValueFieldsSchoolHistory(cms, fields, context);
                    break;
                default:
                    await schoolAdminClicksFieldsSchoolHistory(cms, fields);
                    break;
            }
        });
    }
);

Then(
    'school admin sees the {string} displayed {string}',
    async function (fields: SchoolHistoryFields, expectation: ExpectedSchoolHistoryOptionTypes) {
        const cms = this.cms;
        const scenario = this.scenario;
        await this.cms.instruction(
            `School admin sees the ${fields} displayed ${expectation}`,
            async function () {
                switch (expectation) {
                    case 'full options':
                        await schoolSeesFullOptionsDropdown(cms, fields);
                        break;
                    case 'on optional':
                        await cms
                            .page!.locator('[data-popper-placement="bottom"]')
                            .getByText('No options')
                            .textContent();
                        break;
                    case 'School Name belong to School Level':
                        await schoolSeesOptionsSchoolNameDependOnLevel(cms, scenario);
                        break;
                    default:
                        await schoolSeesOptionsSchoolLevelDependOnSchoolName(cms);
                        break;
                }
            }
        );
    }
);
