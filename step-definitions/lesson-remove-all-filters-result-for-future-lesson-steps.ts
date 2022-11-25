import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { clearAllFilterAdvancedButton } from './cms-selectors/cms-keys';
import { chipAutocomplete } from './cms-selectors/lesson';
import { lessonsTable } from './cms-selectors/lesson-management';
import {
    filterWithOptionsInFilterPopup,
    clickResetButtonInFilterPopup,
} from './lesson-remove-all-filters-result-for-future-lesson-definitions';
import { getCMSInterfaceByRole } from './utils';

Given(
    '{string} has filtered {string} and {string}',
    async function (role: AccountRoles, option1List: string, option2List: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has filtered ${option1List} and ${option2List}`,
            async function () {
                await filterWithOptionsInFilterPopup(
                    cms,
                    scenarioContext,
                    option1List,
                    option2List
                );
            }
        );
    }
);

When(
    '{string} filters {string} and {string}',
    async function (role: AccountRoles, option1List: string, option2List: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has filtered ${option1List} and ${option2List}`,
            async function () {
                await filterWithOptionsInFilterPopup(
                    cms,
                    scenarioContext,
                    option1List,
                    option2List
                );
            }
        );
    }
);

When('{string} resets filter', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} resets filter`, async function () {
        await clickResetButtonInFilterPopup(cms);
    });
});

Then('{string} sees full lesson list', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} sees full lesson list`, async function () {
        await cms.page!.waitForSelector(lessonsTable);
        // TODO: Implement later
    });
});

Then('{string} does not see chip filter in result page', function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    weExpect(cms.page!, 'result page does not contain chip filter').not.toContain(
        `${chipAutocomplete}`
    );
});

When('{string} clears all chips filter in result page', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const page = cms.page!;
    await cms.instruction(`${role} clears all chips filter in result page`, async function () {
        const clearAllChipButton = await page.waitForSelector(clearAllFilterAdvancedButton);
        await clearAllChipButton.click();
    });
});
