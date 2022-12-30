import {
    formFilterAdvancedTextFieldSearchInput,
    tableEmptyMessageV2,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import { changeDatePickerByDateRangeV2 } from '@legacy-step-definitions/lesson-management-utils';
import { chooseLessonTabOnLessonList } from '@legacy-step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';

import { CMSInterface } from '@supports/app-types';

import { LessonActionSaveType, LessonUpsertFields } from '../types/lesson-management';
import {
    areMissingFieldsNotEqualToCertainField,
    assertAlertMessageLessonCenterV3,
    assertAlertMessageLessonStartEndTime,
    assertAlertMessageLessonTeachersV3,
    selectTeachingMethod,
} from './lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { delay } from 'flutter-driver-x';
import {
    alertMessageLessonStudentsV2,
    autoCompleteTimeOfDayWithNth,
    checkBoxOfTableRowStudentSubscriptionsV2,
    lessonDateV3,
    lessonListFuture,
    lessonListPast,
    lessonOnListWithDataValue,
    lessonStatusInLessonList,
    RadioButtonLessonTeachingMethodIndividual,
    recordStudentSubscriptionTableCheckBox,
    tableAddStudentSubscriptionAddButtonV2,
    upsertLessonFormV3,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { changeTimeLesson } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import { waitRetrieveStudentSubscriptionResponse } from 'test-suites/squads/lesson/utils/grpc-responses';
import {
    searchLessonByStudentName,
    waitForTableLessonRenderRows,
} from 'test-suites/squads/lesson/utils/lesson-list';
import { changeLessonDateToTomorrow } from 'test-suites/squads/lesson/utils/lesson-management';
import {
    openAddStudentInfoDialog,
    searchTeacherV3,
    selectCenterByNameV3,
    selectTeacher,
    selectTeachingMedium,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

export async function selectDateAndTimeOfFutureV2(cms: CMSInterface) {
    await changeLessonDateToTomorrow(cms);
    await changeStartTimeLesson(cms, '07:00');
    await changeEndTimeLesson(cms, '09:00');
}

export async function changeStartTimeLesson(cms: CMSInterface, startTime: string) {
    await cms.instruction(`Select start time is ${startTime}`, async function () {
        await cms.page!.click(autoCompleteTimeOfDayWithNth(0));
        await cms.chooseOptionInAutoCompleteBoxByText(startTime);
    });
}
export async function changeEndTimeLesson(cms: CMSInterface, endTime: string) {
    await cms.instruction(`Select end time is ${endTime}`, async function () {
        await cms.page!.click(autoCompleteTimeOfDayWithNth(1));
        await cms.chooseOptionInAutoCompleteBoxByText(endTime);
    });
}
export async function fillUpsertFormLessonV2(params: {
    cms: CMSInterface;
    teacherName: string;
    studentName: string;
    centerName: string;
    missingFields: LessonUpsertFields[];
}) {
    const { cms, teacherName, studentName, centerName, missingFields } = params;

    if (
        areMissingFieldsNotEqualToCertainField(missingFields, 'start time') &&
        areMissingFieldsNotEqualToCertainField(missingFields, 'end time')
    ) {
        await changeTimeLesson(cms, '07:00', '09:00');
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'teaching medium')) {
        await selectTeachingMedium(cms, 'LESSON_TEACHING_MEDIUM_ONLINE');
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'teaching method')) {
        await selectTeachingMethod(cms, 'LESSON_TEACHING_METHOD_INDIVIDUAL');
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'teacher')) {
        await searchTeacherV3(cms, teacherName);
        await selectTeacher(cms, teacherName);
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'center')) {
        await selectCenterByNameV3(cms, centerName);
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'student')) {
        await selectStudentSubscriptionV2({ cms, studentName });
    }
}

export async function selectStudentSubscriptionV2(params: {
    cms: CMSInterface;
    studentName?: string;
    studentSubscriptionId?: string;
}) {
    const { cms, studentName, studentSubscriptionId } = params;
    const page = cms.page!;

    await openDialogAddStudentSubscriptionV2(cms);

    if (studentName) {
        await cms.instruction(`Searching student ${studentName}`, async function () {
            await page.fill(formFilterAdvancedTextFieldSearchInput, studentName);

            await Promise.all([
                cms.waitForHasuraResponse('StudentsMany', { timeout: 60000 }),
                cms.waitForHasuraResponse('CoursesMany', { timeout: 60000 }),
                waitRetrieveStudentSubscriptionResponse(cms),
                page.keyboard.press('Enter'),
            ]);
        });
    }

    await cms.instruction('Select student subscription', async function () {
        const targetCheckbox = studentSubscriptionId
            ? recordStudentSubscriptionTableCheckBox(studentSubscriptionId)
            : checkBoxOfTableRowStudentSubscriptionsV2;

        await page.click(targetCheckbox, { timeout: 5000 });
    });

    await cms.instruction('Add student subscription', async function () {
        await page.click(tableAddStudentSubscriptionAddButtonV2);
    });
}

export async function openDialogAddStudentSubscriptionV2(cms: CMSInterface) {
    await cms.instruction('Open dialog student subscriptions', async function () {
        await openAddStudentInfoDialog({ cms, type: 'STANDARD' });
    });
}

export async function checkTeachingMethod(cms: CMSInterface) {
    await cms.page!.check(RadioButtonLessonTeachingMethodIndividual);
}

export async function assertSeeLessonOnCMSVersion2(params: {
    cms: CMSInterface;
    lessonId: string;
    studentName: string;
    shouldSeeLesson?: boolean;
    lessonTime: LessonTimeValueType;
}) {
    const { cms, lessonId, studentName, shouldSeeLesson = true, lessonTime } = params;
    const page = cms.page!;

    await searchLessonByStudentName({ cms, studentName, lessonTime });

    if (shouldSeeLesson) {
        await waitForTableLessonRenderRows(cms, lessonTime);
        await page.waitForSelector(lessonOnListWithDataValue(lessonId));
        return;
    }

    await page.waitForSelector(tableEmptyMessageV2);
}

export async function assertSeeLessonWithStatus(params: {
    cms: CMSInterface;
    lessonId: string;
    studentName: string;
    shouldSeeLesson?: boolean;
    lessonTime: LessonTimeValueType;
    lessonStatus?: LessonActionSaveType;
}) {
    const { cms, lessonId, studentName, shouldSeeLesson = true, lessonTime, lessonStatus } = params;
    const page = cms.page!;

    const lessonList = lessonTime === 'future' ? lessonListFuture : lessonListPast;

    await cms.instruction('Go to lesson management page', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    });

    await cms.instruction(`Change tab ${lessonTime}`, async function () {
        await chooseLessonTabOnLessonList(cms, lessonTime);
    });

    await searchLessonByStudentName({ cms, studentName, lessonTime });

    if (shouldSeeLesson) {
        await waitForTableLessonRenderRows(cms, lessonTime);
        await page.waitForSelector(lessonOnListWithDataValue(lessonId));
        await cms.instruction(
            `Assert lesson status with ${lessonStatus} on tab ${lessonTime}`,
            async function () {
                const lessonStatusTable = await cms
                    .page!.locator(lessonList)
                    .locator(lessonStatusInLessonList)
                    .nth(0)
                    .innerText();

                weExpect(
                    lessonStatusTable,
                    `Lesson status in table ${lessonStatusTable} to equal ${lessonStatus}`
                ).toEqual(lessonStatus);
            }
        );
        return;
    }

    await page.waitForSelector(tableEmptyMessageV2);
}

export async function selectDateAndTimeOfPastV2(cms: CMSInterface) {
    await changeLessonDateToYesterdayV2(cms);
    await changeTimeLesson(cms, '07:00', '09:00');
}

export async function changeLessonDateToYesterdayV2(cms: CMSInterface, dateRange = 1) {
    const pastDateRange = -dateRange;

    const currentDate = await cms.page!.inputValue(lessonDateV3);

    await cms.instruction('Select date of yesterday', async function () {
        await changeDatePickerByDateRangeV2({
            cms,
            currentDate,
            datePickerSelector: lessonDateV3,
            dateRange: pastDateRange,
        });
    });
}

export async function assertAlertMessageLessonUpsertRequiredFieldV2(
    cms: CMSInterface,
    missingField: LessonUpsertFields
) {
    switch (missingField) {
        case 'start time': {
            await assertAlertMessageLessonStartEndTime(cms);
            break;
        }

        case 'end time': {
            await assertAlertMessageLessonStartEndTime(cms);
            break;
        }

        case 'center': {
            await assertAlertMessageLessonCenterV3(cms);
            break;
        }

        case 'teacher': {
            await assertAlertMessageLessonTeachersV3(cms);
            break;
        }

        case 'student':
        default: {
            await assertAlertMessageLessonStudentsV2(cms);
            break;
        }
    }
}

export async function assertAlertMessageLessonStudentsV2(cms: CMSInterface) {
    await delay(1000); // Wait for display alert message
    await cms.page!.waitForSelector(alertMessageLessonStudentsV2);
}

export async function isOnLessonUpsertDialogV2(cms: CMSInterface) {
    await cms.page!.waitForSelector(upsertLessonFormV3);
}
