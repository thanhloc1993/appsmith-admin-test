import { schoolHistoriesAlias } from '@user-common/alias-keys/student';
import { SchoolHistoriesTypes } from '@user-common/types/student';
import { chooseAutocompleteOptionByExactText } from '@user-common/utils/autocomplete-actions';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    getSchoolLevel,
    getSchoolInfoBySchoolLevelId,
} from './school-history-student-detail-utils';
import { SchoolHistoryFields } from './types';

export async function schoolAdminClicksFieldsSchoolHistory(
    cms: CMSInterface,
    fields: SchoolHistoryFields
) {
    const page = cms.page!;
    const schoolHistoryTable = page.getByTestId('SchoolHistoryTable');
    switch (fields) {
        case 'School Level': {
            const element = schoolHistoryTable.getByPlaceholder('Level');
            await element.click();
            return element;
        }

        case 'School Name': {
            const element = schoolHistoryTable.getByPlaceholder('School Name');
            await element.click();
            return element;
        }
        default: {
            const element = schoolHistoryTable.getByPlaceholder('Course');
            await element.click();
            return element;
        }
    }
}

export async function schoolAdminSelectsValueFieldsSchoolHistory(
    cms: CMSInterface,
    fields: SchoolHistoryFields,
    context: ScenarioContext
) {
    const page = cms.page!;
    const schoolHistories = context.get<SchoolHistoriesTypes[]>(schoolHistoriesAlias);
    switch (fields) {
        case 'School Level':
            {
                const element = await schoolAdminClicksFieldsSchoolHistory(cms, fields);
                await element?.type(schoolHistories[0].schoolLevel.school_level_name);
                await page.waitForTimeout(1000);
                await chooseAutocompleteOptionByExactText(
                    cms,
                    schoolHistories[0].schoolLevel.school_level_name
                );
            }
            break;
        default:
            {
                const element = await schoolAdminClicksFieldsSchoolHistory(cms, fields);
                await element?.type(schoolHistories[0].schoolInfo.school_name);
                await page.waitForTimeout(1000);
                await chooseAutocompleteOptionByExactText(
                    cms,
                    schoolHistories[0].schoolInfo.school_name
                );
            }
            break;
    }
}

export async function schoolSeesFullOptionsDropdown(
    cms: CMSInterface,
    fields: SchoolHistoryFields
) {
    const page = cms.page!;
    const options = page.getByRole('option');
    const count = await options.count();
    switch (fields) {
        case 'School Level':
            {
                const result = (await getSchoolLevel(cms, { limit: 50 })).filter(
                    (item) => !item.is_archived
                );
                weExpect(count).toBe(result.length);
            }
            break;
        default:
            {
                const result = (await getSchoolInfoBySchoolLevelId(cms, { limit: 50 })).filter(
                    (item) => !item.is_archived
                );
                weExpect(count).toBe(result.length);
            }
            break;
    }
}

export async function schoolSeesOptionsSchoolNameDependOnLevel(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const schoolHistories = context.get<SchoolHistoriesTypes[]>(schoolHistoriesAlias);

    const page = cms.page!;

    await cms.instruction('School admin clicks the School Name', async function () {
        await schoolAdminClicksFieldsSchoolHistory(cms, 'School Name');
    });

    await cms.instruction(
        'School admin sees the option of school depend on school level',
        async function () {
            const options = page.getByRole('option');

            const count = await options.count();

            const result = await getSchoolInfoBySchoolLevelId(cms, {
                limit: 50,
                school_level_id: schoolHistories[0].schoolLevel.school_level_id,
            });

            const filtered = result.filter((item) => !item.is_archived);

            weExpect(count).toBe(filtered.length);
        }
    );
}

export async function schoolSeesOptionsSchoolLevelDependOnSchoolName(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction('School admin clicks the School Level', async function () {
        await schoolAdminClicksFieldsSchoolHistory(cms, 'School Level');
    });

    await cms.instruction(
        'School admin sees only one option selected in the School Level',
        async function () {
            const options = page.getByRole('option');

            const count = await options.count();

            weExpect(count).toBe(1);
        }
    );
}
