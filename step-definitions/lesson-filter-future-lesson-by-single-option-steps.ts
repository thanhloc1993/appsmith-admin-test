import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getCMSInterfaceByRole } from './utils';
import {
    getFilteredOptionsList,
    OtherFilteredOptions,
    seeLessonInfoMatchingRemainedOption,
    selectAndApplyFilterLessonInFilterAdvanced,
} from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

When(
    '{string} filters with {string}',
    async function (this: IMasterWorld, role: AccountRoles, option: OtherFilteredOptions) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        await cms.instruction(`${role} filters with ${option}`, async function () {
            await selectAndApplyFilterLessonInFilterAdvanced(cms, scenarioContext, [option]);
        });
    }
);

Then(
    '{string} sees a lesson list which matches {string}',
    async function (this: IMasterWorld, role: AccountRoles, option: OtherFilteredOptions) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const filteredOptionsList = getFilteredOptionsList(scenarioContext);

        await cms.instruction(
            `${role} sees a lesson list which matches ${option}`,
            async function () {
                await seeLessonInfoMatchingRemainedOption(cms, [option], filteredOptionsList);
            }
        );
    }
);

When('{string} selects no criteria', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenarioContext = this.scenario;
    await cms.instruction(`${role} selects no criteria`, async function () {
        await selectAndApplyFilterLessonInFilterAdvanced(cms, scenarioContext, []);
    });
});

Then(
    '{string} sees message {string}',
    async function (this: IMasterWorld, role: AccountRoles, message: string) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees msg: ${message}`, async function () {
            await cms.assertNotification(message);
        });
    }
);
