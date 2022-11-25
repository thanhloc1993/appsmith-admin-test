import { CMSInterface } from '@supports/app-types';

import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';

export async function assertLessonReportNotExist(cms: CMSInterface) {
    const reportTab = await cms.page!.$$(LessonManagementKeys.reportTab);
    weExpect(reportTab).toHaveLength(0);
    const lessonReportDetailContainer = await cms.page!.$$(
        LessonManagementKeys.lessonReportDetailContainer
    );
    weExpect(lessonReportDetailContainer).toHaveLength(0);
}

export async function userIsOnLessonDetailPage(cms: CMSInterface) {
    const page = cms.page!;

    await Promise.all([
        cms.waitForTabListItem(
            LessonManagementKeys.LessonManagementLessonDetailTabNames.LESSON_INFO
        ),
        cms.waitForDataTestId(LessonManagementKeys.lessonInfoPageContainer),
        page.waitForSelector(LessonManagementKeys.lessonDetailGeneralInfo),
        page.waitForSelector(LessonManagementKeys.lessonDetailStudentsTable),
        page.waitForSelector(LessonManagementKeys.lessonDetailMaterialInfo),
        page.waitForSelector(LessonManagementKeys.upsertLessonForm, { state: 'hidden' }),
    ]);
}
