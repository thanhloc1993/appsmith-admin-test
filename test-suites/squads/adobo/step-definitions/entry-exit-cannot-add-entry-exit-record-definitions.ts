import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';

export async function findEntryEarlierThanExitValidation(cms: CMSInterface) {
    await cms.page!.waitForSelector(studentPageSelectors.entryEarlierThanExitValidation);
}

export async function schoolAdminSeesDisabledAddButton(cms: CMSInterface) {
    const cmsPage = cms.page!;
    const isDisabled = await cmsPage.isDisabled(studentPageSelectors.entryExitAddRecordButton);
    weExpect(isDisabled).toBe(true);
}
