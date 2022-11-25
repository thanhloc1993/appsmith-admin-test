import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { createSampleStudentWithCourseAndEnrolledStatus } from 'step-definitions/lesson-management-utils';
import { getUsersFromContextByRegexKeys } from 'test-suites/common/step-definitions/user-common-definitions';
import {
    lessonUpsertStudentAttendanceNoteInput,
    lessonUpsertStudentAttendanceNoticeInput,
    lessonUpsertStudentAttendanceStatusInput,
    lessonUpsertStudentReasonInput,
} from 'test-suites/squads/lesson/common/cms-selectors';
import {
    AttendanceNoticeValues,
    AttendanceReasonValues,
    AttendanceStatusValues,
} from 'test-suites/squads/lesson/common/types';
import { selectStudentSubscriptionV2 } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import { arrayHasItem } from 'test-suites/squads/lesson/utils/lesson-upsert';

export async function addStudentToLessonOnLessonPage(cms: CMSInterface, context: ScenarioContext) {
    const learners = getUsersFromContextByRegexKeys(context, learnerProfileAlias);

    let studentName = '';

    if (arrayHasItem(learners)) {
        studentName = learners[0].name;
    } else {
        const { student } = await createSampleStudentWithCourseAndEnrolledStatus({
            cms,
            scenarioContext: context,
            studentRole: 'student',
        });
        studentName = student.name;
    }

    await selectStudentSubscriptionV2({ cms, studentName });
}

export async function assertAttendanceNoticeEnable(cms: CMSInterface, enable: boolean) {
    const page = cms.page!;
    const noticeInputEnable = await page
        .locator(lessonUpsertStudentAttendanceNoticeInput)
        .isEnabled();
    weExpect(noticeInputEnable, `Attendance notice is ${enable}`).toEqual(noticeInputEnable);
}

export async function updatesAttendanceStatus(cms: CMSInterface, status: AttendanceStatusValues) {
    const page = cms.page!;
    const statusInput = page.locator(lessonUpsertStudentAttendanceStatusInput);
    await statusInput.click();
    await cms.chooseOptionInAutoCompleteBoxByText(status);
}

export async function updatesAttendanceNotice(cms: CMSInterface, notice: AttendanceNoticeValues) {
    const page = cms.page!;
    const noticeInput = page.locator(lessonUpsertStudentAttendanceNoticeInput);
    if (notice) {
        await noticeInput.click();
        await cms.chooseOptionInAutoCompleteBoxByText(notice);
    }
}

export async function updatesAttendanceReason(cms: CMSInterface, reason: AttendanceReasonValues) {
    const page = cms.page!;
    const reasonInput = page.locator(lessonUpsertStudentReasonInput);
    if (reason) {
        await reasonInput.click();
        await cms.chooseOptionInAutoCompleteBoxByText(reason);
    }
}

export async function updatesAttendanceNote(cms: CMSInterface, note: string) {
    const page = cms.page!;
    const noteInput = page.locator(lessonUpsertStudentAttendanceNoteInput);
    await noteInput.fill(note);
}
