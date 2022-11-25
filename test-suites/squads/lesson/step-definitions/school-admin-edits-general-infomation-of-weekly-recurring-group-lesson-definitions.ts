import { CMSInterface } from '@supports/app-types';

import {
    lessonInfoAttendanceNoteColumn,
    lessonInfoAttendanceNoticeColumn,
    lessonInfoAttendanceReasonColumn,
    lessonInfoAttendanceStatusColumn,
} from 'test-suites/squads/lesson/common/cms-selectors';
import {
    AttendanceNoticeValues,
    AttendanceReasonValues,
    AttendanceStatusValues,
} from 'test-suites/squads/lesson/common/types';

export async function assertValueOfAttendanceInfoStatusUpdated(
    cms: CMSInterface,
    status: AttendanceStatusValues
) {
    const page = cms.page!;
    const statusValue = status === '' ? '--' : status;
    const attendanceText = await page.locator(lessonInfoAttendanceStatusColumn).textContent();
    weExpect(statusValue, `Attendance status text is ${statusValue}`).toEqual(attendanceText);
}

export async function assertValueOfAttendanceInfoNoticeUpdated(
    cms: CMSInterface,
    notice: AttendanceNoticeValues
) {
    const page = cms.page!;
    const noticeValue = notice === '' ? '--' : notice;
    const noticeText = await page.locator(lessonInfoAttendanceNoticeColumn).textContent();
    weExpect(noticeValue, `Attendance notice text is ${noticeValue}`).toEqual(noticeText);
}

export async function assertValueOfAttendanceInfoReasonUpdated(
    cms: CMSInterface,
    reason: AttendanceReasonValues
) {
    const page = cms.page!;
    const reasonValue = reason === '' ? '--' : reason;
    const reasonText = await page.locator(lessonInfoAttendanceReasonColumn).textContent();
    weExpect(reasonValue, `Attendance reason text is ${reasonValue}`).toEqual(reasonText);
}

export async function assertValueOfAttendanceInfoNoteUpdated(cms: CMSInterface, note: string) {
    const page = cms.page!;
    const noteValue = note === '' ? '--' : note;
    const noteText = await page.locator(lessonInfoAttendanceNoteColumn).textContent();
    weExpect(noteValue, `Attendance note text is ${noteValue}`).toEqual(noteText);
}
