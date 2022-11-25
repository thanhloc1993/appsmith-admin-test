import { CMSInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

export const schoolAdminSelectBulkActionOfBookDetail = async (
    cms: CMSInterface,
    action: ActionOptions.EDIT | ActionOptions.DUPLICATE
) => {
    await cms.selectActionButton(action, {
        target: 'actionPanelTrigger',
    });
};
