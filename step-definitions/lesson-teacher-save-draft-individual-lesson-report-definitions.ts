import { CMSInterface } from '@supports/app-types';

import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';

export async function saveDraftIndividualLessonReport(cms: CMSInterface) {
    await cms.selectElementByDataTestId(LessonManagementKeys.lessonReportSaveDraftButton);
}

export async function isLessonReportBlanked(cms: CMSInterface) {
    const page = cms.page!;

    const allLessonReportDetailValueLabels = await page.$$(
        LessonManagementKeys.lessonReportDetailValueLabels
    );

    const allLessonReportDetailEmptyValues = await page.$$(
        LessonManagementKeys.lessonReportDetailEmptyValues
    );

    weExpect(allLessonReportDetailValueLabels).toHaveLength(
        allLessonReportDetailEmptyValues.length
    );
}
