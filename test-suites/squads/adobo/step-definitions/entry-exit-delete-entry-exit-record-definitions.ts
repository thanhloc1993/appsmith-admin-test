import { getButtonSelectorByAction } from '@legacy-step-definitions/cms-selectors/cms-keys';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import { entryExitRecordsTable } from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

export async function deleteEntryExitRecordOnCMS(cms: CMSInterface, action: 'confirm' | 'cancel') {
    await cms.selectActionButton(ActionOptions.DELETE, {
        target: 'actionPanelTrigger',
        wrapperSelector: entryExitRecordsTable,
    });

    if (action === 'confirm') await cms.confirmDialogAction();
    else await cms.cancelDialogAction();
}

export async function attemptDeleteEntryExitRecord(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction(`Click action panel trigger to open actions`, async function () {
        const entryExitTable = await page.waitForSelector(
            studentPageSelectors.entryExitRecordsTable
        );
        const entryExitRecordMenuTrigger = await entryExitTable.$(
            studentPageSelectors.entryExitRecordActionPanelTrigger
        );
        await entryExitRecordMenuTrigger!.click();
    });
}

export async function schoolAdminSeesDisabledDeleteEntryExitRecord(cms: CMSInterface) {
    const cmsPage = cms.page!;
    const deleteButtonSelector = getButtonSelectorByAction(ActionOptions.DELETE);
    const isDisabled = await cmsPage.getAttribute(deleteButtonSelector, 'aria-disabled');
    weExpect(isDisabled).toEqual('true');
}
