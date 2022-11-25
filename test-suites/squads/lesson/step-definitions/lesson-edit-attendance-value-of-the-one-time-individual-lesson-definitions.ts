import { CMSInterface } from '@supports/app-types';

import { lessonUpsertStudentAttendanceStatusInput } from 'test-suites/squads/lesson/common/cms-selectors';
import { AttendanceStatusValues } from 'test-suites/squads/lesson/common/types';
import { saveUpdateLessonOfLessonManagement } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { selectAttendanceStatus } from 'test-suites/squads/lesson/utils/lesson-upsert';

export async function applyAttendanceStatus(
    cms: CMSInterface,
    attendanceStatus: AttendanceStatusValues
) {
    await selectAttendanceStatus(cms, attendanceStatus, lessonUpsertStudentAttendanceStatusInput);
    await saveUpdateLessonOfLessonManagement(cms);
}

export async function editAttendanceStatus(
    cms: CMSInterface,
    attendanceStatus: AttendanceStatusValues
) {
    await cms.selectAButtonByAriaLabel('Edit');
    await selectAttendanceStatus(cms, attendanceStatus, lessonUpsertStudentAttendanceStatusInput);
    await saveUpdateLessonOfLessonManagement(cms);
}
