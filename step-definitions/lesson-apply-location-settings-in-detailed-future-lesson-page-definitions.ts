import { dialogWithHeaderFooterButtonExit } from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';

import {
    confirmApplyButton,
    cancelApplyButton,
    titleHeaderDialogSelector,
} from './cms-selectors/cms-keys';
import { randomInteger } from './utils';
import { getCancelOption } from 'step-definitions/lesson-apply-location-settings-for-lesson-list-definitions';

export async function confirmApplyLocationSettings(cms: CMSInterface) {
    const confirmButton = await cms.page!.waitForSelector(confirmApplyButton);
    await confirmButton.click();
}

export async function cancelConfirmApplyLocationSettings(cms: CMSInterface) {
    const cancelButton = await cms.page!.waitForSelector(cancelApplyButton);
    await cancelButton.click();
}

export async function cancelApplyingLocationInLessonDetailPage(cms: CMSInterface, option: string) {
    const page = cms.page!;
    const randIndex = randomInteger(0, 1);
    const cancelOption = getCancelOption(option, randIndex);
    switch (cancelOption) {
        case 'cancel button': {
            const cancelButton = await page.waitForSelector(cancelApplyButton);
            await cancelButton.click();
            const headerDialogConfirmDiscard = await cms.waitForSelectorHasText(
                titleHeaderDialogSelector,
                'Discard Change'
            );
            if (!headerDialogConfirmDiscard) {
                throw Error('Cannot find confirm cancel dialog');
            }
            const cancelConfirmButton = await headerDialogConfirmDiscard.waitForSelector(
                dialogWithHeaderFooterButtonExit
            );
            await cancelConfirmButton.click();
            break;
        }
        case 'X button': {
            const closeButton = await page.waitForSelector(dialogWithHeaderFooterButtonExit);
            await closeButton.click();
            const headerDialogConfirmDiscard = await cms.waitForSelectorHasText(
                titleHeaderDialogSelector,
                'Discard Change'
            );
            if (!headerDialogConfirmDiscard) {
                throw Error('Cannot find confirm cancel dialog');
            }
            const closeConfirmButton = await headerDialogConfirmDiscard.waitForSelector(
                dialogWithHeaderFooterButtonExit
            );
            await closeConfirmButton.click();
            break;
        }
    }
}

export async function assertLocationSettingPopupVisible(cms: CMSInterface) {
    const headerDialogLocationSetting = await cms.waitForSelectorHasText(
        titleHeaderDialogSelector,
        'Location Setting'
    );
    if (!headerDialogLocationSetting) {
        throw Error('Cannot find confirm apply dialog');
    }
}
