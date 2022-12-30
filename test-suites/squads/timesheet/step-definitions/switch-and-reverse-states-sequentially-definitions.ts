import { CMSInterface } from '@supports/app-types';

import { actionsPanelPopupBackdrop } from 'test-suites/squads/timesheet/common/cms-selectors/common';

export async function closeTimesheetActionsPanel(cms: CMSInterface) {
    await cms.page?.click(actionsPanelPopupBackdrop);
}
