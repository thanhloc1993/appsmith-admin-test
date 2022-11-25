import { CMSInterface } from '@supports/app-types';

import { LessonReportButtonsStatus } from './lesson-report-utils';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';

export type LessonReportButtonsPosition = 'lesson report detail' | 'lesson report upsert dialog';

export async function assertPreviousReportButtonStatus(
    cms: CMSInterface,
    state: LessonReportButtonsStatus,
    position: LessonReportButtonsPosition
) {
    const page = cms.page!;
    const buttonPreviousReportSelector =
        position === 'lesson report detail'
            ? LessonManagementKeys.previousReportButtonOnReportDetailPage
            : LessonManagementKeys.previousReportButtonOnUpsertReportDialog;

    const isPreviousReportButtonEnabled = await page.isEnabled(buttonPreviousReportSelector);

    if (state === 'enabled') weExpect(isPreviousReportButtonEnabled).toEqual(true);
    else weExpect(isPreviousReportButtonEnabled).toEqual(false);
}

export async function seeDoesNotHavePreviousReportMessage(
    cms: CMSInterface,
    position: LessonReportButtonsPosition
) {
    const notHavePreviousReportMessageSelector =
        position === 'lesson report detail'
            ? LessonManagementKeys.doesNotHavePreviousReportMessageOnReportDetailPage
            : LessonManagementKeys.doesNotHavePreviousReportMessageOnUpsertReportDialog;

    await cms.page!.waitForSelector(notHavePreviousReportMessageSelector);
}
