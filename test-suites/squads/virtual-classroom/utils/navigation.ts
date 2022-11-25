import { LearnerKeys } from '@common/learner-key';
import { TeacherKeys } from '@common/teacher-keys';
import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { teacherGenCourseDetailUrl } from 'test-suites/common/step-definitions/course-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

export async function goToCourseDetailByCourseId(teacher: TeacherInterface, courseId: string) {
    const driver = teacher.flutterDriver!;
    const courseDetailURL = await teacherGenCourseDetailUrl(teacher, courseId);
    await driver.webDriver!.page.goto(courseDetailURL);
}

export async function goToLiveLessonDetailOnTeacherApp(params: {
    teacher: TeacherInterface;
    courseId: string;
    lessonId: string;
}) {
    const { teacher, courseId, lessonId } = params;

    const driver = teacher.flutterDriver!;
    const websiteDomain = await driver.webDriver!.getUrlOrigin();
    const lessonLink = `${websiteDomain}liveLessonDetailScreen?course_id=${courseId}&lesson_id=${lessonId}`;

    await teacher.instruction(
        `Teacher go to live lesson detail screen by link: ${lessonLink}`,
        async function () {
            await driver.webDriver!.page.goto(lessonLink);
            await driver.waitFor(new ByValueKey('Live Lesson Screen'));
        }
    );
}

export async function selectLessonTab(
    teacher: TeacherInterface,
    lessonTime: LessonManagementLessonTime
) {
    const driver = teacher.flutterDriver!;
    switch (lessonTime) {
        case 'past': {
            await teacher.instruction('Select Complete tab', async function () {
                const completeLessonTab = new ByValueKey(TeacherKeys.lessonCompletedTab);
                await driver.tap(completeLessonTab);
            });
            break;
        }
        case 'future':
        default: {
            await teacher.instruction('Select Active tab', async function () {
                const driver = teacher.flutterDriver!;
                const activeLessonTab = new ByValueKey(TeacherKeys.lessonActiveTab);
                await driver.tap(activeLessonTab, 20000);
            });
            break;
        }
    }
}

export async function teacherJoinsLesson(teacher: TeacherInterface, isFirstTeacher: boolean) {
    const driver = teacher.flutterDriver!;
    await teacher.instruction('Teacher join lesson', async function () {
        await driver.runUnsynchronized(async () => {
            const startLessonButton = new ByValueKey(TeacherKeys.startLessonButton);
            await driver.tap(startLessonButton);
            const joinButton = new ByValueKey(TeacherKeys.joinButton(true, isFirstTeacher));
            await driver.waitFor(joinButton, 15000);
            await driver.tap(joinButton);
            await driver.waitForAbsent(joinButton, 10000);
        });
    });
}

export async function teacherRejoinsEndedLessonByAnotherTeacher(
    teacher: TeacherInterface,
    isFirstTeacher: boolean
) {
    const driver = teacher.flutterDriver!;
    const endNowButton = new ByValueKey(VirtualClassroomKeys.endNowButton);
    await driver.tap(endNowButton);
    await driver.runUnsynchronized(async () => {
        const startLessonButton = new ByValueKey(TeacherKeys.startLessonButton);
        await driver.tap(startLessonButton);
        const joinButton = new ByValueKey(TeacherKeys.joinButton(true, isFirstTeacher));
        await driver.waitFor(joinButton, 15000);
        await driver.tap(joinButton);
        await driver.waitForAbsent(joinButton, 10000);
    });
}

export async function learnerJoinsLesson(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string
): Promise<void> {
    await learnerGoToLesson(learner);
    await learnerClickJoinLesson(learner, lessonId, lessonName);
    await learnerIsInWaitingRoom(learner);
}

export async function learnerRejoinsAfterReceivedEndAllMessageOnLearnerApp(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = learner.flutterDriver!;
    const endNowButton = new ByValueKey(VirtualClassroomKeys.endNowButton);
    await driver.tap(endNowButton);

    await learnerGoToLesson(learner);
    await learnerClickJoinLesson(learner, lessonId, lessonName);
    await learnerIsInWaitingRoom(learner);
}

export async function learnerGoToLesson(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    if (!driver.isApp()) {
        await learner.instruction('learner tap drawer', async function () {
            const drawerButton = new ByValueKey(LearnerKeys.homeScreenDrawerButton);
            await driver.tap(drawerButton);
        });
    }

    await learner.instruction('learner tap lesson tab', async function () {
        const lessonTab = new ByValueKey(LearnerKeys.lesson_tab);
        await driver.tap(lessonTab);
    });
}

export async function learnerClickJoinLesson(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = learner.flutterDriver!;
    await learner.instruction(
        `learner tap join lesson ${lessonName}, ID: ${lessonId}`,
        async function () {
            const lessonItem = new ByValueKey(LearnerKeys.lessonItem(lessonId, lessonName));
            await driver.waitFor(lessonItem, 20000);

            const joinLessonButton = new ByValueKey(
                LearnerKeys.joinLiveLessonButton(lessonId, lessonName, true)
            );
            await driver.tap(joinLessonButton);
        }
    );
}

export async function learnerIsInWaitingRoom(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    await driver.runUnsynchronized(async () => {
        const waitingRoom = new ByValueKey(LearnerKeys.waitingRoomTeacher);
        await driver.waitFor(waitingRoom, 15000);
    });
}

export async function learnerJoinsLessonSuccessfully(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    await driver.runUnsynchronized(async () => {
        const waitingRoom = new ByValueKey(LearnerKeys.waitingRoomTeacher);
        await driver.waitForAbsent(waitingRoom, 60 * 1000);
    });
}

export async function assertJoinButtonVisible(
    teacher: TeacherInterface,
    isFirstTeacher: boolean,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const joinButton = new ByValueKey(TeacherKeys.joinButton(true, isFirstTeacher));
    if (visible) {
        await driver.waitFor(joinButton);
    } else {
        await driver.waitForAbsent(joinButton);
    }
}
