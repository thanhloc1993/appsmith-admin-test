import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasLocationName } from './alias-keys/lesson';
import {
    checkEqualCenterNameInAutoCompleteInput,
    clearSearchedCenterInCenterField,
    focusAnFillKeywordToInputFieldCenterLocations,
    getCenterNameFromLocationsListAPI,
    selectCenterFromOptionInAutoCompleteBoxByPosition,
} from './lesson-search-center-in-center-field-of-lesson-definitions';
import { getCMSInterfaceByRole } from './utils';

When(
    `{string} searches for the center name`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const centerName =
            scenario.get(aliasLocationName) ||
            (await getCenterNameFromLocationsListAPI(cms, scenario));

        await cms.instruction(
            `${role} has focused and filled keyword "${centerName}" to the input field to search center`,
            async function () {
                await focusAnFillKeywordToInputFieldCenterLocations(cms, centerName);
                await cms.waitingAutocompleteLoading();
            }
        );
    }
);

When(`{string} selects a center`, async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;
    const position = 1;
    const centerName = scenario.get(aliasLocationName);

    await cms.instruction(
        `${role} has select "${centerName}" at position "${position}" from list box autocomplete`,
        async function () {
            await selectCenterFromOptionInAutoCompleteBoxByPosition(cms, position);
        }
    );
});

Then(
    `{string} sees center in center field`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const centerName = scenario.get(aliasLocationName);

        await cms.instruction(
            `${role} see "${centerName}" selected in center field`,
            async function () {
                await checkEqualCenterNameInAutoCompleteInput(cms, centerName);
            }
        );
    }
);

When(
    `{string} clears searched center in center field`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} click clear button in search field`, async function () {
            await clearSearchedCenterInCenterField(cms);
        });

        await cms.instruction(`${role} see empty value in search field`, async function () {
            await checkEqualCenterNameInAutoCompleteInput(cms, '');
        });
    }
);

When(
    `{string} searches for the center name again`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const centerName = scenario.get(aliasLocationName);

        await cms.instruction(
            `${role} has focused and filled keyword "${centerName}" to the input field to search center again`,
            async function () {
                await focusAnFillKeywordToInputFieldCenterLocations(cms, centerName);
                await cms.waitingAutocompleteLoading();
            }
        );
    }
);
