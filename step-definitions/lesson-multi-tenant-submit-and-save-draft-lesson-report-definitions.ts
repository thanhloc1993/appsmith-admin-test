import { AccountRoles, CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { LessonManagementLessonDetailTabNames } from './cms-selectors/lesson-management';
import { aliasLessonInfoByLessonName } from 'step-definitions/alias-keys/lesson';
import { lessonReportDetailContainer } from 'step-definitions/cms-selectors/lesson-management';
import { LessonManagementLessonName } from 'step-definitions/lesson-default-sort-future-lessons-list-definitions';
import { selectLessonLinkByLessonId } from 'step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import {
    createAnDraftIndividualLessonReport,
    createAnIndividualLessonReport,
} from 'step-definitions/lesson-edit-lesson-report-of-future-lesson-definitions';
import { assertStudentOnLessonReportStudentsList } from 'step-definitions/lesson-edit-student-of-past-lesson-definitions';
import { waitForTableLessonRenderRows } from 'step-definitions/lesson-management-utils';
import { LessonInfo } from 'step-definitions/lesson-multi-tenant-create-future-and-past-lesson-definitions';
import { seeEmptyResultLessonManagementList } from 'step-definitions/lesson-search-future-lesson-definitions';
import {
    chooseLessonTabOnLessonList,
    goToDetailedLessonInfoPage,
    isOnLessonReportDetailPage,
} from 'step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import { pick1stElement } from 'step-definitions/utils';
import { searchLessonByStudentName } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

export async function submitIndividualLessonReport(cms: CMSInterface, lessonId: string) {
    await goToDetailedLessonInfoPage(cms, lessonId);
    await createAnIndividualLessonReport(cms);
    await isOnLessonReportDetailPage(cms);
}

export async function assertSeeIndividualLessonReport(
    cms: CMSInterface,
    accountRole: AccountRoles,
    lessonTime: LessonManagementLessonTime,
    lessonId: string,
    studentName: string
) {
    const schoolAminRoles: AccountRoles[] = ['school admin 1', 'school admin 2'];

    if (schoolAminRoles.includes(accountRole)) {
        await cms.page!.reload();
        await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');

        // choose Lesson Tab and search by student name
        await chooseLessonTabOnLessonList(cms, lessonTime);
        await searchLessonByStudentName(cms, studentName);

        // select Lesson
        await waitForTableLessonRenderRows(cms);
        await selectLessonLinkByLessonId(cms, lessonId);

        // select lesson report
        const lessonReportTab = await cms.waitForTabListItem(
            LessonManagementLessonDetailTabNames.LESSON_REPORT
        );
        if (!lessonReportTab) throw Error('There is no lesson report');
        await lessonReportTab.click();
    }

    await cms.page!.waitForSelector(lessonReportDetailContainer);
    await assertStudentOnLessonReportStudentsList({ cms, studentName });
}

export async function assertNotSeeIndividualLessonReport(
    cms: CMSInterface,
    lessonTime: LessonManagementLessonTime,
    studentName: string
) {
    await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    await chooseLessonTabOnLessonList(cms, lessonTime);
    await searchLessonByStudentName(cms, studentName);
    await seeEmptyResultLessonManagementList(cms);
}

export async function getFirstStudentOfLesson(
    scenarioContext: ScenarioContext,
    lessonName: LessonManagementLessonName
) {
    const { studentInfos } = scenarioContext.get<LessonInfo>(
        aliasLessonInfoByLessonName(lessonName)
    );

    const firstStudent = pick1stElement(studentInfos);

    weExpect(firstStudent, 'should have student infos').toBeTruthy();
    return firstStudent;
}

export async function saveDraftIndividualLessonReport(cms: CMSInterface, lessonId: string) {
    await goToDetailedLessonInfoPage(cms, lessonId);
    await createAnDraftIndividualLessonReport(cms);
    await isOnLessonReportDetailPage(cms);
}
