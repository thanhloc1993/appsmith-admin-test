import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    addLessonDialogTitleSelector,
    classAutoCompleteInputV3,
    courseAutoCompleteInputV3,
    lessonEndDateRecurringV3,
    lessonLink,
    lessonRowWithId,
    lessonTableRow,
    lessonUpsertStudentAttendanceNoteInput,
    lessonUpsertStudentAttendanceNoticeInput,
    lessonUpsertStudentAttendanceStatusInput,
    lessonUpsertStudentReasonInput,
    recurringSettingRadioButton,
    upsertLessonDialog,
} from 'test-suites/squads/lesson/common/cms-selectors';
import {
    AttendanceNoticeValues,
    AttendanceReasonValues,
    AttendanceStatusValues,
    LessonSavingMethodType,
    LessonTimeValueType,
    MethodSavingType,
} from 'test-suites/squads/lesson/common/types';
import { assertAllInformationAreCopiedFromPreviousLesson } from 'test-suites/squads/lesson/step-definitions/school-admin-duplicate-individual-lesson-definitions';
import { GroupLessonInfo } from 'test-suites/squads/lesson/types/lesson-management';
import {
    goToLessonsList,
    searchLessonByStudentName,
} from 'test-suites/squads/lesson/utils/lesson-list';
import {
    schoolAdminClicksDuplicateGroupLessonButtonOption,
    schoolAdminPublishesDuplicatedLesson,
} from 'test-suites/squads/lesson/utils/lesson-upsert';
import { userIsOnLessonDetailPage } from 'test-suites/squads/lesson/utils/navigation';

export async function assertAllInformationAreCopiedFromPreviousGroupLesson(
    cms: CMSInterface,
    groupLessonInfo: GroupLessonInfo
) {
    const dialog = cms.page!.locator(upsertLessonDialog)!;

    await assertAllInformationAreCopiedFromPreviousLesson(cms, groupLessonInfo);

    const courseName = await dialog.locator(courseAutoCompleteInputV3).inputValue();
    const className = await dialog.locator(classAutoCompleteInputV3).inputValue();
    weExpect(groupLessonInfo.courseName, `Course name is ${groupLessonInfo.courseName}`).toEqual(
        courseName
    );
    weExpect(groupLessonInfo.className, `Class name is ${groupLessonInfo.className}`).toEqual(
        className
    );
}

export async function schoolAdminDuplicatesLesson(context: ScenarioContext, cms: CMSInterface) {
    const page = cms.page!;
    await schoolAdminClicksDuplicateGroupLessonButtonOption(cms, context);
    await page.waitForSelector(upsertLessonDialog);
    await schoolAdminPublishesDuplicatedLesson(cms, context);
}

export async function schoolAdminRedirectsToNewCreateLessonInfoPage(cms: CMSInterface) {
    const page = cms.page!;
    await page.waitForSelector(upsertLessonDialog);
    await page.waitForSelector(addLessonDialogTitleSelector);
}

export async function assertValueOfAttendanceInfoStatus(
    cms: CMSInterface,
    status: AttendanceStatusValues
) {
    const page = cms.page!;
    const attendanceText = await page
        .locator(lessonUpsertStudentAttendanceStatusInput)
        .inputValue();
    weExpect(status, `Attendance status text is ${status}`).toEqual(attendanceText);
}

export async function assertValueOfAttendanceInfoNotice(
    cms: CMSInterface,
    notice: AttendanceNoticeValues
) {
    const page = cms.page!;
    const noticeText = await page.locator(lessonUpsertStudentAttendanceNoticeInput).inputValue();
    weExpect(notice, `Attendance notice text is ${notice}`).toEqual(noticeText);
}

export async function assertValueOfAttendanceInfoReason(
    cms: CMSInterface,
    reason: AttendanceReasonValues
) {
    const page = cms.page!;
    const reasonText = await page.locator(lessonUpsertStudentReasonInput).inputValue();
    weExpect(reason, `Attendance reason text is ${reason}`).toEqual(reasonText);
}

export async function assertValueOfAttendanceInfoNote(cms: CMSInterface, note: string) {
    const page = cms.page!;
    const noteText = await page.locator(lessonUpsertStudentAttendanceNoteInput).inputValue();
    weExpect(note, `Attendance note text is ${note}`).toEqual(noteText);
}

export async function assertEndDateFieldVisible(cms: CMSInterface, visible: boolean) {
    const page = cms.page!;
    await page.waitForSelector(lessonEndDateRecurringV3, {
        state: visible ? 'visible' : 'detached',
    });
}

export async function userGoToFirstLessonInChain(params: {
    cms: CMSInterface;
    lessonTime: LessonTimeValueType;
    studentName: string;
}) {
    const { cms, lessonTime, studentName } = params;
    const page = cms.page!;

    await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    await goToLessonsList({ cms, lessonTime });
    await searchLessonByStudentName({ cms, studentName, lessonTime });

    const lessonLinkLocator = page.locator(lessonLink);
    const middleLessonLinkInChain = lessonLinkLocator.nth(0);

    await middleLessonLinkInChain.click();
    await userIsOnLessonDetailPage(cms);
}

export async function selectedRecurringSettings(
    cms: CMSInterface,
    recurringSettings: MethodSavingType
) {
    const dialog = cms.page!.locator(upsertLessonDialog)!;
    const setting: LessonSavingMethodType =
        recurringSettings === 'One Time'
            ? 'CREATE_LESSON_SAVING_METHOD_ONE_TIME'
            : 'CREATE_LESSON_SAVING_METHOD_RECURRENCE';
    await dialog.locator(recurringSettingRadioButton(setting)).check();
}

export async function assertNewlyDuplicatedLessonVisibleOnTheList(
    cms: CMSInterface,
    lessonId: string,
    lessonTime: LessonTimeValueType,
    studentName: string
) {
    const page = cms.page!;

    await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    await goToLessonsList({ cms, lessonTime });
    await searchLessonByStudentName({ cms, studentName, lessonTime });

    await page.waitForSelector(lessonRowWithId(lessonId));
}

export async function assertLessonRecurringChainNoChange(
    cms: CMSInterface,
    previousLessonId: string,
    duplicatedLessonId: string
) {
    const page = cms.page!;

    const firstRowLessonId = await page.locator(lessonTableRow).nth(0).getAttribute('data-value');
    const secondsRowLessonId = await page.locator(lessonTableRow).nth(1).getAttribute('data-value');
    weExpect(duplicatedLessonId, 'Duplicated lesson will be placed in first row').toEqual(
        firstRowLessonId
    );

    weExpect(previousLessonId, 'Previous lesson will be placed in second row').toEqual(
        secondsRowLessonId
    );
}

export async function assertSelectedLessonToDuplicatingVisible(
    cms: CMSInterface,
    lessonId: string,
    visible: boolean,
    lessonTime: LessonTimeValueType
) {
    const state = visible ? 'attached' : 'detached';
    await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    await goToLessonsList({ cms, lessonTime });
    await cms.page!.waitForSelector(lessonRowWithId(lessonId), { state });
}

export async function assertRecurringSettingChecked(
    cms: CMSInterface,
    savingMethod: MethodSavingType,
    checked: boolean
) {
    const dialog = cms.page!.locator(upsertLessonDialog)!;

    const setting =
        savingMethod === 'One Time'
            ? 'CREATE_LESSON_SAVING_METHOD_ONE_TIME'
            : 'CREATE_LESSON_SAVING_METHOD_RECURRENCE';

    const isChecked = await dialog.locator(recurringSettingRadioButton(setting)).isChecked();

    weExpect(checked, `Recurring Settings ${savingMethod} is checked: ${checked}`).toEqual(
        isChecked
    );
}
