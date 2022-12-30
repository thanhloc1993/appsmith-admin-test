import { delay } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';

import {
    bulkActionAttendanceStatusLessonUpsert,
    bulkActionDynamicField,
    checkBoxStudentInfoTable,
    columnStudentName,
    lessonInfoAttendanceStatusColumn,
    lessonManagementLessonSubmitButton,
    lessonManagementLessonSubmitDraftButton,
    lessonTableRow,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { AttendanceStatusValues } from 'test-suites/squads/lesson/common/types';
import { waitUpdateLesson } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import { waitForLessonUpsertDialogClosed } from 'test-suites/squads/lesson/utils/lesson-upsert';

export async function bulkUpdateAttendanceStatusInLessonUpsert(params: {
    cms: CMSInterface;
    attendanceStatus: AttendanceStatusValues;
}) {
    const { cms, attendanceStatus } = params;
    const page = cms.page!;

    const buttonBulkAction = page.locator(bulkActionAttendanceStatusLessonUpsert);

    await buttonBulkAction.scrollIntoViewIfNeeded();
    await buttonBulkAction.click();

    const dynamicFieldInput = page.locator(bulkActionDynamicField).getByRole('combobox');
    await dynamicFieldInput.click();
    await cms.chooseOptionInAutoCompleteBoxByText(attendanceStatus);

    await page.getByRole('button', { name: 'Apply' }).click();
}

export async function selectAttendanceStatusForStudent(params: {
    cms: CMSInterface;
    studentName: string;
    attendanceStatus: AttendanceStatusValues;
}) {
    const { cms, studentName, attendanceStatus } = params;
    const page = cms.page!;

    const studentCell = page.locator(checkBoxStudentInfoTable, { hasText: studentName });
    const studentRowLocator = page.locator(lessonTableRow, { has: studentCell });

    const attendanceStatusInput = studentRowLocator.getByPlaceholder('Status');

    await attendanceStatusInput.click();
    await cms.chooseOptionInAutoCompleteBoxByText(attendanceStatus);
}

export async function assertStudentAttendanceStatusInLessonDetail(params: {
    cms: CMSInterface;
    studentName: string;
    attendanceStatus: AttendanceStatusValues;
}) {
    const { cms, studentName, attendanceStatus } = params;
    const page = cms.page!;

    const studentCell = page.locator(columnStudentName, { hasText: studentName });
    const studentRowLocator = page.locator(lessonTableRow, { has: studentCell });

    const attendanceColLocator = studentRowLocator.locator(lessonInfoAttendanceStatusColumn);
    await attendanceColLocator.scrollIntoViewIfNeeded();

    const attendanceText = await attendanceColLocator.textContent();
    weExpect(attendanceStatus, `Attendance status text is ${attendanceStatus}`).toEqual(
        attendanceText
    );
}

export async function savesUpdatedLesson(params: {
    cms: CMSInterface;
    lessonActionSave: LessonActionSaveType;
}) {
    const { cms, lessonActionSave } = params;

    const saveButton =
        lessonActionSave === 'Draft'
            ? lessonManagementLessonSubmitDraftButton
            : lessonManagementLessonSubmitButton;

    await Promise.all([
        waitUpdateLesson(cms),
        cms.waitForHasuraResponse('Lesson_LessonDetailByLessonId'),
        waitForLessonUpsertDialogClosed(cms),
        cms.page!.click(saveButton),
    ]);

    await delay(1000); // Stay a while after closing the lesson's upsert dialog to get screen capture
}
