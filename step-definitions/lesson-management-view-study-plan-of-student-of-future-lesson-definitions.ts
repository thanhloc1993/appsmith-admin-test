import { Page } from 'playwright-core';

import { CMSInterface, TeacherInterface } from '@supports/app-types';

import { fulfillSampleTextLessonReportForm } from './lesson-edit-lesson-report-of-future-lesson-definitions';
import { saveDraftIndividualLessonReport } from './lesson-teacher-save-draft-individual-lesson-report-definitions';
import { openLessonReportUpsertDialog } from './lesson-teacher-submit-individual-lesson-report-definitions';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';
import { ViewStudyPlanOrPreviousReportButtonType } from 'step-definitions/types/content';

export async function viewStudyPlanOfStudent(
    teacher: TeacherInterface,
    courseId: string,
    studentId: string
) {
    const studyPlanLink = `localhost:3002/#/courseDetail?course_id=${courseId}/studentStudyPlan?student_id=${studentId}`;
    await teacher.flutterDriver!.webDriver?.page.goto(studyPlanLink);
}

async function assertButtonState(state: 'enabled' | 'disabled', page: Page, icon: string) {
    const result = state === 'enabled' ? await page.isEnabled(icon) : await page.isDisabled(icon);
    weExpect(result).toBeTruthy();
}
export async function assertLessonReportButtonStatus(
    cms: CMSInterface,
    button: ViewStudyPlanOrPreviousReportButtonType,
    state: 'enabled' | 'disabled'
) {
    const page = cms.page!;
    if (button === 'View Study Plan') {
        await assertButtonState(state, page, LessonManagementKeys.viewStudyPlanButton);
    }
    if (button === 'Previous Lesson Report') {
        await assertButtonState(state, page, LessonManagementKeys.previousLessonReport);
    }
}

export async function teacherHasSavedDraftReport(cms: CMSInterface) {
    await openLessonReportUpsertDialog(cms);
    await fulfillSampleTextLessonReportForm(cms);
    await saveDraftIndividualLessonReport(cms);
}
