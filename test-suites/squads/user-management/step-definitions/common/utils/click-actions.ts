import {
    dialogWithHeaderFooterWrapper,
    footerDialogConfirmButtonSave,
    dialogWithHeaderFooterDialogActions,
} from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';

export async function clickButtonInNotFullScreenDialogByText(
    cms: CMSInterface,
    nameButton: 'Save' | 'Close' | 'Upload file'
) {
    await cms.instruction(
        `School admin click ${nameButton} button in the dialog is active`,
        async function () {
            const wrapper = cms.page!.locator(dialogWithHeaderFooterWrapper);
            await wrapper.locator('button', { hasText: nameButton }).click();
        }
    );
}

export async function clickOnSaveFullScreenDialog(cms: CMSInterface) {
    await cms.instruction(
        'School admin click Save button in the fullscreen dialog',
        async function () {
            const wrapper = cms.page!.locator(dialogWithHeaderFooterDialogActions);
            await wrapper.locator(footerDialogConfirmButtonSave).click();
        }
    );
}

export async function clickApplyFilterAndCloseDialogFilter(cms: CMSInterface) {
    await cms.instruction(
        'School admin click apply button and close dialog filter',
        async function () {
            await cms.page?.locator('button', { hasText: 'Apply' }).click();
            await cms.page!.keyboard.press('Escape');
        }
    );
}
