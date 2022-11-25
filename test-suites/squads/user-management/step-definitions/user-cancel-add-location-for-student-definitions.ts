import {
    dialogWithHeaderFooterWrapper,
    dialogWithHeaderFooterButtonExit,
    dialogWithHeaderFooterButtonClose,
} from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';

import { OptionCancel } from './user-definition-utils';

export async function discardPopupLocation(cms: CMSInterface, button: OptionCancel) {
    await cms.instruction(
        `school admin close popup location using ${button}`,
        async function (cms: CMSInterface) {
            const wrapper = await cms.page!.waitForSelector(dialogWithHeaderFooterWrapper);

            switch (button) {
                case OptionCancel.Cancel: {
                    const cancelButton = await wrapper.waitForSelector(
                        dialogWithHeaderFooterButtonExit
                    );
                    await cancelButton.click();
                    break;
                }
                case OptionCancel.ESC: {
                    await cms.page!.keyboard.press('Escape');
                    break;
                }
                case OptionCancel.X: {
                    const cancelButton = await wrapper.waitForSelector(
                        dialogWithHeaderFooterButtonClose
                    );
                    await cancelButton.click();
                    break;
                }
            }
        }
    );
}
