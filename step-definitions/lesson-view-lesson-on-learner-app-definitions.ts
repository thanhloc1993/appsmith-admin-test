import { LearnerInterface } from '@supports/app-types';
import { CreateLessonRequestData } from '@supports/services/bob-lesson-management/bob-lesson-management-service';

import { LearnerKeys } from './learner-keys/learner-key';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerChoosesDesiredLessonDateToViewLesson(
    learner: LearnerInterface,
    lessonInfo: CreateLessonRequestData
) {
    const driver = learner.flutterDriver!;

    const lessonStartDate = lessonInfo.startTime;
    if (!lessonStartDate) throw Error('There is no lesson start time');

    const now = new Date().getMonth();

    if (now < lessonStartDate.getMonth()) {
        for (let i = now; i < lessonStartDate.getMonth(); i++) {
            await driver.tap(new ByValueKey(LearnerKeys.liveLessonScheduleCalendarNextButton));
        }
    }

    if (now > lessonStartDate.getMonth()) {
        for (let i = lessonStartDate.getMonth(); i < now; i++) {
            await driver.tap(new ByValueKey(LearnerKeys.liveLessonScheduleCalendarPreviousButton));
        }
    }

    const calendarDay = new ByValueKey(
        LearnerKeys.normalDate(lessonStartDate.getDate(), lessonStartDate.getMonth() + 1)
    );
    await driver.tap(calendarDay);
}

export async function learnerSelectsRespectiveLessonDateOnTheCalendar(
    learner: LearnerInterface,
    lessonInfo: CreateLessonRequestData
) {
    const driver = learner.flutterDriver!;

    const lessonStartDate = lessonInfo.startTime;
    if (!lessonStartDate) throw Error('There is no lesson start time');

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lessonStartDateMonth = lessonStartDate.getMonth();
    const lessonStartDateYear = lessonStartDate.getFullYear();

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
        LearnerKeys.normalDate(lessonStartDate.getDate(), lessonStartDateMonth + 1)
    );
    await driver.tap(calendarDay);
}

export async function learnerOpensCalendarOnLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    if (driver.isApp()) {
        const calendarIcon = new ByValueKey(LearnerKeys.lessonsCalendarIcon);
        await driver.tap(calendarIcon);
    } else {
        const calendarIcon = new ByValueKey(LearnerKeys.liveLessonScheduleCalendar);
        await driver.tap(calendarIcon);
    }
}
