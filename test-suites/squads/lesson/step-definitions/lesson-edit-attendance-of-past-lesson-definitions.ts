import { CMSInterface } from '@supports/app-types';

import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';
import { AttendanceStatusValues } from 'test-suites/squads/lesson/common/types';

export async function assertAttendanceStatusOfStudentOnLessonDetail(
    cms: CMSInterface,
    attendanceValue: AttendanceStatusValues
) {
    await cms.page!.waitForSelector(
        LessonManagementKeys.studentAttendanceStatusOnLessonDetail(attendanceValue)
    );
}
