import { aliasFirstGrantedLocation } from '@user-common/alias-keys/locations';
import { FieldsConditionTypes } from '@user-common/types/bdd';
import { clickButtonInNotFullScreenDialogByText } from '@user-common/utils/click-actions';
import { createRandomStudentData } from '@user-common/utils/create-student';
import { goToAddStudentPage } from '@user-common/utils/goto-page';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { fillFormStudentInformation } from '../upsert-student/user-create-student-utils';
import {
    schoolCourseColumn,
    schoolHistoryTableEndDate,
    schoolHistoryTableStartDate,
    schoolLevelColumn,
    schoolNameColumn,
} from './school-history-keys';
import { SchoolHistoryFields } from './types';
import {
    clickSaveToCreateAndSavingResp,
    modifySchoolHistoryData,
} from './user-add-school-history-student-definitions';
import { fillStudentSchoolHistory } from './user-view-school-history-student-detail-definitions';

export async function createStudentWithSchoolHistory(
    cms: CMSInterface,
    context: ScenarioContext,
    conditions: FieldsConditionTypes
) {
    const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    const randomStudentData = await createRandomStudentData(cms, {
        locations: [firstGrantedLocation],
    });

    await modifySchoolHistoryData(cms, context, conditions, randomStudentData.gradeMaster);

    await goToAddStudentPage(cms);
    await fillFormStudentInformation(cms, context, randomStudentData);

    if (conditions !== 'without school history') await fillStudentSchoolHistory(cms, context);

    await clickSaveToCreateAndSavingResp(cms, context);
    await clickButtonInNotFullScreenDialogByText(cms, 'Close');
}

export async function clearValueOnAutocomplete(cms: CMSInterface, selector: string) {
    const page = cms.page!;
    await page.locator(selector).hover();
    await cms.selectAButtonByAriaLabel('Clear', { parentSelector: selector });
}

export async function deselectsFieldSchoolHistory(
    cms: CMSInterface,
    attributes: SchoolHistoryFields
) {
    switch (attributes) {
        case 'School Level':
            await clearValueOnAutocomplete(cms, schoolLevelColumn);
            break;
        case 'School Name':
            await clearValueOnAutocomplete(cms, schoolNameColumn);
            break;
        case 'School Course':
            await clearValueOnAutocomplete(cms, schoolCourseColumn);
            break;
    }
}

export async function schoolAdminCheckBlankFields(
    cms: CMSInterface,
    fields: SchoolHistoryFields[]
) {
    const page = cms.page!;
    const schoolLevelColumnElement = page.locator(schoolLevelColumn).getByPlaceholder('Level');
    const schoolNameColumnElement = page.locator(schoolNameColumn).getByPlaceholder('School Name');
    const schoolCourseColumnElement = page.locator(schoolCourseColumn).getByPlaceholder('Course');
    const schoolHistoryTableStartDateElement = page
        .locator(schoolHistoryTableStartDate)
        .getByPlaceholder('Start Date');
    const schoolHistoryTableEndDateElement = page
        .locator(schoolHistoryTableEndDate)
        .getByPlaceholder('End Date');

    if (fields.includes('School Level'))
        weExpect(await schoolLevelColumnElement.inputValue()).toBe('');

    if (fields.includes('School Name'))
        weExpect(await schoolNameColumnElement.inputValue()).toBe('');

    if (fields.includes('School Course'))
        weExpect(await schoolCourseColumnElement.inputValue()).toBe('');

    if (fields.includes('Start Date'))
        weExpect(await schoolHistoryTableStartDateElement.inputValue()).toBe('');

    if (fields.includes('Start Date'))
        weExpect(await schoolHistoryTableEndDateElement.inputValue()).toBe('');
}
