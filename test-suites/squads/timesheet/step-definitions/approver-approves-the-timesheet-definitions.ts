import { dialogWithHeaderFooter } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { CMSInterface } from '@supports/app-types';

import { confirmDialogButtonSave } from 'test-suites/squads/timesheet/common/cms-selectors/common';
import * as TimesheetListSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-list';

export const clickApproveTimesheetButton = async (cms: CMSInterface) => {
    const page = cms.page!;

    await cms.instruction('click on approve button', async () => {
        const approveButton = await page.waitForSelector(TimesheetListSelectors.approveButton);
        approveButton.click();
    });
};

export const assertConfirmationMessage = async (cms: CMSInterface, message: string) => {
    const page = cms.page!;

    await cms.instruction(`sees ${message}`, async () => {
        const confirmationDialogMessage = await (
            await page.waitForSelector(dialogWithHeaderFooter)
        ).textContent();

        weExpect(confirmationDialogMessage).toEqual(message);
    });
};

export const clickProceedApproveTimesheetButton = async (cms: CMSInterface) => {
    const page = cms.page!;

    await cms.instruction('click proceed button', async () => {
        await page.waitForSelector(confirmDialogButtonSave);

        const proceedButton = page.locator(confirmDialogButtonSave);

        await proceedButton.click();
    });
};
