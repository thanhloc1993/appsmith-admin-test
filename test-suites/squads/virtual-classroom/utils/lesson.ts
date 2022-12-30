import { LearnerKeys } from '@common/learner-key';
import { TeacherKeys } from '@common/teacher-keys';
import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { selectLessonTab } from './navigation';
import { ByValueKey, delay } from 'flutter-driver-x';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';
import { retryHelper } from 'test-suites/squads/virtual-classroom/utils/utils';

export async function assertLessonVisibleOnTeacherApp(
    teacher: TeacherInterface,
    lessonId: string,
    lessonTime: LessonManagementLessonTime,
    visible: boolean
) {
    await selectLessonTab(teacher, lessonTime);
    await shouldDisplayLessonOnTeacherApp(teacher, lessonId, visible);
}

export async function shouldDisplayLessonOnTeacherApp(
    teacher: TeacherInterface,
    lessonId: string,
    shouldDisplay = true
) {
    await teacher.instruction(
        `${shouldDisplay ? '' : 'does not'} sees created lesson ${lessonId}`,
        async function () {
            if (shouldDisplay) {
                await teacherWaitForLessonItem(teacher, lessonId, '');
            } else {
                await teacherWaitForAbsentLessonItem(teacher, lessonId, '');
            }
        }
    );
}

export async function teacherWaitForLessonItem(
    teacher: TeacherInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = teacher.flutterDriver!;

    await driver.runUnsynchronized(async () => {
        const lessonItem = new ByValueKey(TeacherKeys.liveLessonItem(lessonId, lessonName));
        await driver.waitFor(lessonItem, 10000);
    });
}

export async function teacherWaitForAbsentLessonItem(
    teacher: TeacherInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = teacher.flutterDriver!;

    await driver.runUnsynchronized(async () => {
        const lessonItem = new ByValueKey(TeacherKeys.liveLessonItem(lessonId, lessonName));
        await driver.waitForAbsent(lessonItem, 10000);
    });
}

export async function assertLessonVisibleOnLearnerApp(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string,
    startTime: Date | undefined,
    visible: boolean
) {
    const driver = learner.flutterDriver!;
    const lessonItem = new ByValueKey(VirtualClassroomKeys.liveLessonItem(lessonId, lessonName));
    await learnerOpensCalendarOnLearnerApp(learner);
    await learnerSelectsRespectiveLessonDateOnTheCalendar(learner, startTime);
    if (visible) {
        await driver.waitFor(lessonItem, 20000);
    } else {
        await driver.waitForAbsent(lessonItem, 20000);
    }
}

export async function learnerOpensCalendarOnLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    if (driver.isApp()) {
        const calendarIcon = new ByValueKey(LearnerKeys.lessonsCalendarIcon);
        await driver.tap(calendarIcon);
    } else {
        const calendarIcon = new ByValueKey(VirtualClassroomKeys.liveLessonScheduleCalendar);
        await driver.tap(calendarIcon);
    }
}

export async function learnerSelectsRespectiveLessonDateOnTheCalendar(
    learner: LearnerInterface,
    startTime: Date | undefined
) {
    const driver = learner.flutterDriver!;
    if (!startTime) throw Error('There is no lesson start time');

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lessonStartDateMonth = startTime.getMonth();
    const lessonStartDateYear = startTime.getFullYear();

    if (currentYear < lessonStartDateYear) {
        const numberOfMonthsFromNowToLessonStartDate =
            (lessonStartDateYear - currentYear - 1) * 12 +
            (12 - currentMonth) +
            lessonStartDateMonth +
            1;
        for (let i = 1; i < numberOfMonthsFromNowToLessonStartDate; i++) {
            await driver.tap(new ByValueKey(LearnerKeys.liveLessonScheduleCalendarNextButton));
        }
    } else if (currentYear > lessonStartDateYear) {
        const numberOfMonthsFromNowToLessonStartDate =
            (currentYear - lessonStartDateYear - 1) * 12 +
            (currentMonth + (12 - lessonStartDateMonth)) +
            1;
        for (let i = 1; i < numberOfMonthsFromNowToLessonStartDate; i++) {
            await driver.tap(new ByValueKey(LearnerKeys.liveLessonScheduleCalendarPreviousButton));
        }
    } else {
        if (currentMonth < lessonStartDateMonth) {
            for (let i = currentMonth; i < lessonStartDateMonth; i++) {
                await driver.tap(new ByValueKey(LearnerKeys.liveLessonScheduleCalendarNextButton));
            }
        }

        if (currentMonth > lessonStartDateMonth) {
            for (let i = lessonStartDateMonth; i < currentMonth; i++) {
                await driver.tap(
                    new ByValueKey(LearnerKeys.liveLessonScheduleCalendarPreviousButton)
                );
            }
        }
    }

    const calendarDay = new ByValueKey(
        LearnerKeys.normalDate(startTime.getDate(), lessonStartDateMonth + 1)
    );
    await driver.tap(calendarDay);
    // Unfocus calendar
    await driver.webDriver!.page.mouse.click(0, 0);
}

export async function teacherSharesMaterialOnTeacherApp(
    teacher: TeacherInterface,
    mediaId: string
) {
    const driver = teacher.flutterDriver!;

    const shareMaterialButton = new ByValueKey(TeacherKeys.shareMaterialButtonInteraction(true));
    const materialItem = new ByValueKey(TeacherKeys.materialItem(mediaId));
    await retryHelper({
        action: async function () {
            await driver.tap(shareMaterialButton);
            await driver.tap(materialItem, 10000);

            await delay(5000); //Delay for whiteboard loaded
        },
        retryCount: 5,
        errorAction: async function () {
            await driver.webDriver?.page.keyboard.press('Escape');
        },
    });
}
