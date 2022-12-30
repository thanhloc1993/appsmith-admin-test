import { CMSInterface } from '@supports/app-types';

import { cancelDialogButton } from './cms-selectors/cms-keys';

export async function cancelBulkAction(cms: CMSInterface): Promise<void> {
    await cms.instruction(`Cancel Bulk Action`, async function () {
        await cms.page!.click(cancelDialogButton);
    });
}
