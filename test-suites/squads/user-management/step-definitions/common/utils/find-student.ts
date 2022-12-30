import {
    formFilterAdvancedTextFieldInput,
    lookingForIcon,
} from '@user-common/cms-selectors/students-page';

import { Locator } from 'playwright';

import { CMSInterface } from '@supports/app-types';

import { ConditionStatusTypes } from '../types/bdd';

export async function schoolAdminSeesNewStudentBySearch(
    cms: CMSInterface,
    keyWord: string,
    statusStudent: ConditionStatusTypes
): Promise<Locator | undefined> {
    const cmsPage = cms.page!;
    await cmsPage.fill(formFilterAdvancedTextFieldInput, keyWord);
    await cmsPage.keyboard.press('Enter');

    switch (statusStudent) {
        case 'sees':
            return schoolAdminFindsStudentOnStudentTable(cms, keyWord);
        case 'does not see':
            return cmsPage.locator(lookingForIcon);
        default:
            throw new Error("Don't have type map to status student");
    }
}

export async function schoolAdminFindsStudentOnStudentTable(cms: CMSInterface, name: string) {
    const tableStudent = cms.page!.getByTestId('TableStudent__table');
    return tableStudent.getByText(name);
}
