import { schoolHistoriesAlias } from '@user-common/alias-keys/student';
import { buttonDropdownWithPopoverPopover } from '@user-common/cms-selectors/student';
import { SchoolHistoriesTypes } from '@user-common/types/student';
import { chooseAutocompleteOptionByExactText } from '@user-common/utils/autocomplete-actions';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { ConditionFilterCurrentSchool } from './types';

export async function schoolAdminFilterStudentBySchoolConditions(
    cms: CMSInterface,
    context: ScenarioContext,
    conditions: ConditionFilterCurrentSchool
) {
    const page = cms.page!;
    const schoolHistories = context.get<SchoolHistoriesTypes[]>(schoolHistoriesAlias);
    const wrapperStudentFormFilter = page.locator(buttonDropdownWithPopoverPopover);

    await page.locator('button', { hasText: 'Filter' }).click();

    if (conditions === 'include all school') {
        await cms.instruction(
            'school admin sees Including ALL school from School History checked',
            async function () {
                const checkedAllSchools = wrapperStudentFormFilter.getByText(
                    'Including ALL school from School History'
                );
                await checkedAllSchools.check();
            }
        );
    } else {
        await cms.instruction(
            `school admin selects the school ${schoolHistories[0].schoolInfo.school_name}`,
            async function () {
                const schoolNameInput = wrapperStudentFormFilter.getByLabel('School Name');

                await schoolNameInput.click();
                //Current current is always in index 0
                await schoolNameInput.fill(schoolHistories[0].schoolInfo.school_name);

                await page.waitForTimeout(1000);

                await chooseAutocompleteOptionByExactText(
                    cms,
                    schoolHistories[0].schoolInfo.school_name
                );

                await page.keyboard.press('Escape');
            }
        );
    }
}
