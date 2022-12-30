import { CMSInterface } from '@supports/app-types';

import { getTestId, snackbarContent } from 'step-definitions/cms-selectors/cms-keys';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';

export type DiscardOptions = 'X button' | 'Discard button' | 'Esc keyboard button';

export async function discardLessonReportUpsertForm(
    cms: CMSInterface,
    discardOption: DiscardOptions
) {
    switch (discardOption) {
        case 'X button':
            await cms.selectElementByDataTestId(LessonManagementKeys.dialogFullScreenButtonClose);
            break;

        case 'Discard button': {
            const snackbar = await cms.page!.$(snackbarContent);

            if (snackbar) await cms.closeSnackbar();
            await cms.page!.click(getTestId(LessonManagementKeys.lessonReportDiscardButton));

            break;
        }

        case 'Esc keyboard button':
        default:
            await cms.page!.keyboard.press('Escape');
            break;
    }
}

export async function notSeenIndividualLessonReport(cms: CMSInterface) {
    await cms.waitForDataTestId(LessonManagementKeys.createLessonReportButton);

    const allTabs = await cms.page!.$$(LessonManagementKeys.tabItem);
    weExpect(allTabs).toHaveLength(1); // Has only lesson info
}
