import { attendanceStatusAutocompleteInput } from '@legacy-step-definitions/cms-selectors/lesson-management';
import {
    deleteLessonOfLessonManagement,
    goToLessonDetailByLessonIdOnLessonList,
} from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { selectOneLocation } from '@legacy-step-definitions/lesson-select-and-view-location-in-location-setting-popup-navbar-definitions';
import {
    fulfillLessonReportInfo,
    openLessonReportUpsertDialog,
} from '@legacy-step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import { TeacherKeys } from '@legacy-step-definitions/teacher-keys/teacher-keys';

import { AccountRoles, CMSInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { saveDraftLessonReportButton } from 'test-suites/squads/lesson/common/cms-selectors';
import {
    LessonReportActionType,
    LessonTimeValueType,
} from 'test-suites/squads/lesson/common/types';
import { assertStudentExistInStudentListOnTeacherApp } from 'test-suites/squads/lesson/step-definitions/lesson-can-edit-one-time-group-lesson-by-removing-definitions';
import { assertSeeLessonOnCMS } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { saveIndividualLessonReport } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-can-delete-weekly-recurring-lesson-definitions';
import { goToLessonsList } from 'test-suites/squads/lesson/utils/lesson-list';
import {
    assertNewLessonOnTeacherApp,
    selectAttendanceStatus,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

async function selectLessonUnderLocation(params: {
    cms: CMSInterface;
    locationId: string;
    lessonTime: LessonTimeValueType;
    lessonId: string;
    studentName: string;
}) {
    const { cms, locationId, lessonId, lessonTime, studentName } = params;
    await selectOneLocation(cms, locationId);
    await goToLessonDetailByLessonIdOnLessonList({
        cms,
        lessonTime,
        lessonId,
        studentName,
    });
}
export async function goToLessonDetailAndSaveDraftReport(params: {
    cms: CMSInterface;
    locationId: string;
    lessonTime: LessonTimeValueType;
    lessonId: string;
    studentName: string;
}) {
    const { cms, locationId, lessonId, lessonTime, studentName } = params;
    await selectLessonUnderLocation({
        cms,
        locationId,
        lessonId,
        lessonTime,
        studentName,
    });

    await openLessonReportUpsertDialog(cms);
    await cms.selectElementByDataTestId(saveDraftLessonReportButton);
}

export async function goToLessonDetailAndSaveReportWithAction(params: {
    cms: CMSInterface;
    locationId: string;
    lessonTime: LessonTimeValueType;
    lessonId: string;
    studentName: string;
    actionSaveLessonReport: LessonReportActionType;
}) {
    const { cms, locationId, lessonId, lessonTime, studentName, actionSaveLessonReport } = params;
    await selectLessonUnderLocation({
        cms,
        locationId,
        lessonId,
        lessonTime,
        studentName,
    });

    await openLessonReportUpsertDialog(cms);

    await fulfillLessonReportInfo(cms);

    await selectAttendanceStatus(cms, 'Attend', attendanceStatusAutocompleteInput);

    await saveIndividualLessonReport(cms, actionSaveLessonReport);
}

export async function goToLessonListAndAssertLesson(params: {
    cms: CMSInterface;
    lessonTime: LessonTimeValueType;
    lessonId: string;
    studentName: string;
    shouldSeeLesson: boolean;
}) {
    const { cms, lessonId, lessonTime, shouldSeeLesson, studentName } = params;
    await goToLessonsList({ cms, lessonTime });
    await assertSeeLessonOnCMS({
        cms,
        lessonId,
        studentName,
        shouldSeeLesson,
        lessonTime,
    });
}

export async function goToLessonDetailAndCancelDeleteLesson(params: {
    cms: CMSInterface;
    locationId: string;
    lessonTime: LessonTimeValueType;
    lessonId: string;
    studentName: string;
}) {
    const { cms, locationId, lessonId, lessonTime, studentName } = params;
    await selectLessonUnderLocation({
        cms,
        locationId,
        lessonId,
        lessonTime,
        studentName,
    });
    await deleteLessonOfLessonManagement(cms, 'cancel');
}

export async function assertNewLessonAndStudentExistInStudentListOnTeacherApp(params: {
    role: AccountRoles;
    learnerRole: AccountRoles;
    teacher: TeacherInterface;
    lessonId: string;
    courseId: string;
    locationId: string;
    lessonTime: LessonTimeValueType;
    shouldDisplay: boolean;
    studentId: string;
    exist: boolean;
}) {
    const {
        lessonTime,
        shouldDisplay,
        locationId,
        lessonId,
        exist,
        courseId,
        studentId,
        teacher,
        role,
        learnerRole,
    } = params;

    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `${role} can ${shouldDisplay} the ${lessonTime} one time individual lesson on Teacher App`,
        async function () {
            await assertNewLessonOnTeacherApp({
                teacher,
                lessonId,
                courseId,
                locationId,
                lessonTime,
                shouldDisplay,
            });
        }
    );

    if (exist) {
        await teacher.instruction(
            `${role} can ${exist} ${learnerRole} in student list on Teacher App`,
            async function () {
                const lessonItem = new ByValueKey(TeacherKeys.liveLessonItem(lessonId, ''));
                await driver.tap(lessonItem);
                await assertStudentExistInStudentListOnTeacherApp(teacher, studentId, exist);
            }
        );
    }
}
