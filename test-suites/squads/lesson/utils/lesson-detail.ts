import { LearnerKeys } from '@common/learner-key';
import { TeacherKeys } from '@common/teacher-keys';

import { Page } from 'playwright';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import {
    lessonInfoDayOfWeek,
    lessonInfoLessonDate,
    lessonInfoStartTime,
    lessonInfoEndTime,
    lessonInfoTeachingMedium,
    lessonInfoTeachingMethod,
    lessonInfoLocation,
    lessonInfoTeachers,
    lessonInfoStudentNameColumn,
    actionPanelTrigger,
    actionPanelDeleteOption,
    dialogDeleteLesson,
    saveButton,
    createLessonReportButton,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { ActionCanSee, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { IndividualLessonInfo } from 'test-suites/squads/lesson/types/lesson-management';
import { waitDeleteLessonResponse } from 'test-suites/squads/lesson/utils/grpc-responses';
import { userIsOnLessonReportGrpUpsertDialog } from 'test-suites/squads/lesson/utils/lesson-report';
import { userIsOnLessonDetailPage } from 'test-suites/squads/lesson/utils/navigation';
import { retry } from 'ts-retry-promise';

export async function getLessonDataOnLessonDetailPage(
    cms: CMSInterface
): Promise<IndividualLessonInfo> {
    const page = cms.page!;

    const lessonDateLocator = page.locator(lessonInfoLessonDate);
    const dayOfWeekLocator = page.locator(lessonInfoDayOfWeek);
    const startTimeLocator = page.locator(lessonInfoStartTime);
    const endTimeLocator = page.locator(lessonInfoEndTime);
    const teachingMediumLocator = page.locator(lessonInfoTeachingMedium);
    const teachingMethodLocator = page.locator(lessonInfoTeachingMethod);
    const locationLocator = page.locator(lessonInfoLocation);
    const teacherNamesLocator = page.locator(lessonInfoTeachers);
    const studentNamesLocator = page.locator(lessonInfoStudentNameColumn);

    const [
        lessonDate,
        dayOfWeek,
        startTime,
        endTime,
        teachingMedium,
        teachingMethod,
        location,
        teacherNames,
        studentNames,
    ] = await Promise.all([
        lessonDateLocator.textContent(),
        dayOfWeekLocator.textContent(),
        startTimeLocator.textContent(),
        endTimeLocator.textContent(),
        teachingMediumLocator.textContent(),
        teachingMethodLocator.textContent(),
        locationLocator.textContent(),
        teacherNamesLocator.textContent(),
        studentNamesLocator.allTextContents(),
    ]);

    const result: IndividualLessonInfo = {
        lessonDate,
        dayOfWeek,
        startTime,
        endTime,
        teachingMedium,
        teachingMethod,
        location,
        teacherNames,
        studentNames,
    };

    return result;
}

export async function goToLessonDetailByLink(params: { cms: CMSInterface; lessonId: string }) {
    const { cms, lessonId } = params;
    const linkToLesson = `/lesson/lesson_management/${lessonId}/show`;

    await cms.instruction(`Go to ${linkToLesson}`, async function () {
        await cms.page!.goto(linkToLesson);
        await cms.waitingForLoadingIcon();
    });
}

export async function goToLessonDetailByLessonId(params: { cms: CMSInterface; lessonId: string }) {
    const { cms, lessonId } = params;

    await retry(
        async function () {
            await goToLessonDetailByLink({ cms, lessonId });
            await userIsOnLessonDetailPage(cms);
        },
        { retries: 1, delay: 1000 }
    ).catch(async function (error) {
        throw new Error(JSON.stringify(error));
    });
}

export async function openLessonReportUpsertDialog(page: Page) {
    const addReportButton = page.locator(createLessonReportButton);
    await addReportButton.click();
    await userIsOnLessonReportGrpUpsertDialog(page);
}

export async function deleteOneTimeLesson(cms: CMSInterface) {
    const page = cms.page!;

    await page.locator(actionPanelTrigger).click();
    await page.locator(actionPanelDeleteOption).click();

    const dialog = page.locator(dialogDeleteLesson);

    await Promise.all([waitDeleteLessonResponse(cms), dialog.locator(saveButton).click()]);
}

export async function teacherGoToCourseDetailById(teacher: TeacherInterface, courseId: string) {
    const driver = teacher.flutterDriver!;

    const websiteDomain = await driver.webDriver?.getUrlOrigin();
    const url = `${websiteDomain}courseDetail?course_id=${courseId}`;

    await driver.webDriver?.page.goto(url);
    await driver.waitFor(new ByValueKey(TeacherKeys.courseDetailsScreen), 10000);
}

export async function teacherWaitForLessonItem(params: {
    teacher: TeacherInterface;
    lessonId: string;
    lessonName: string;
    state: ActionCanSee;
}) {
    const { teacher, lessonId, lessonName, state } = params;

    const driver = teacher.flutterDriver!;

    await driver.runUnsynchronized(async function () {
        const lessonItem = new ByValueKey(TeacherKeys.liveLessonItem(lessonId, lessonName));

        if (state === 'see') await driver.waitFor(lessonItem, 10000);
        else await driver.waitForAbsent(lessonItem, 10000);
    });
}

export async function teacherChooseLessonTab(params: {
    teacher: TeacherInterface;
    lessonTime: LessonTimeValueType;
}) {
    const { teacher, lessonTime } = params;
    const flutterDriver = teacher.flutterDriver!;

    const lessonTabKey =
        lessonTime === 'future' ? TeacherKeys.lessonActiveTab : TeacherKeys.lessonCompletedTab;
    const lessonTab = new ByValueKey(lessonTabKey);
    await flutterDriver.tap(lessonTab);
}

export async function learnerChooseLessonTab(learner: LearnerInterface) {
    const flutterDriver = learner.flutterDriver!;

    const drawerButton = new ByValueKey(LearnerKeys.homeScreenDrawerButton);
    await flutterDriver.tap(drawerButton, 10000);

    const lessonTab = new ByValueKey(LearnerKeys.lesson_tab);
    await flutterDriver.tap(lessonTab);
}

export async function assertLearnerSeeLesson(params: {
    learner: LearnerInterface;
    lessonId: string;
    state: ActionCanSee;
}) {
    const { learner, lessonId, state } = params;
    const flutterDriver = learner.flutterDriver!;

    const lessonItem = new ByValueKey(LearnerKeys.lessonItem(lessonId, ''));
    if (state === 'see') await flutterDriver.waitFor(lessonItem, 20000);
    else await flutterDriver.waitForAbsent(lessonItem, 10000);
}
