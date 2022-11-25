import { TeacherInterface, LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerSeesMessageTeacherHasLeft(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const teacherLeftMessage = new ByValueKey(LearnerKeys.waitingTeacherJoin);
    await driver.waitFor(teacherLeftMessage);
}

export async function userIsShownInListCameraOnLearnerApp(
    learner: LearnerInterface,
    userId: string,
    visible: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;
    const noneCameraView = new ByValueKey(LearnerKeys.liveLessonNoneCameraView(userId));
    if (visible) {
        await driver.waitFor(noneCameraView);
    } else {
        await driver.waitForAbsent(noneCameraView);
    }
}

export async function learnerHaveToEndLesson(learner: LearnerInterface): Promise<void> {
    await learnerTapsEndLessonButtonAfterReceivedEndAllMessage(learner);
    await learnerBacksToLessonPage(learner);
}

export async function teacherHaveToEndLesson(teacher: TeacherInterface): Promise<void> {
    await teacherTapsEndLessonButtonAfterReceivedEndAllMessage(teacher);
    await teacherBacksToLessonDetailScreenOnTeacherApp(teacher);
}

export async function learnerTapsEndLessonButtonAfterReceivedEndAllMessage(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;
    const endNowButton = new ByValueKey(LearnerKeys.endNowButton);
    await driver.tap(endNowButton);
}

export async function teacherTapsEndLessonButtonAfterReceivedEndAllMessage(
    teacher: TeacherInterface
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const endNowButton = new ByValueKey(TeacherKeys.endNowButton);
    await driver.tap(endNowButton);
}

export async function learnerLeavesLessonOnLearnerApp(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    const endCallButton = new ByValueKey(LearnerKeys.endLessonButton);
    await driver.tap(endCallButton);

    const endLessonButton = new ByValueKey(LearnerKeys.endNowButton);
    await driver.tap(endLessonButton);
}

export async function learnerBacksToLessonPage(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const lessonPage = new ByValueKey(LearnerKeys.lesson_page);
    await driver.waitFor(lessonPage);
}

export async function learnerTapsLeaveForNowButton(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    const leaveForNowButton = new ByValueKey(LearnerKeys.leaveForNowButton);
    await driver.tap(leaveForNowButton, 15000);
}

export async function teacherTapsEndLessonButton(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const endLessonButton = new ByValueKey(TeacherKeys.endLessonButton);
    await driver.tap(endLessonButton);
}

export async function teacherTapsLeaveLessonButton(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const leaveLessonButton = new ByValueKey(TeacherKeys.leaveLessonButton);
    await driver.tap(leaveLessonButton);
}

export async function teacherLeavesLessonOnTeacherApp(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    await teacherTapsEndLessonButton(teacher);
    await teacherTapsLeaveLessonButton(teacher);
    const liveStreamScreen = new ByValueKey(TeacherKeys.liveStreamScreen);
    await driver.waitForAbsent(liveStreamScreen);
}

export async function teacherBacksToLessonDetailScreenOnTeacherApp(
    teacher: TeacherInterface
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const liveLessonScreen = new ByValueKey(TeacherKeys.liveLessonScreen);
    await driver.waitFor(liveLessonScreen);
}

export async function userIsShownInListCameraOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    visible: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const noneCameraView = new ByValueKey(LearnerKeys.liveLessonNoneCameraView(userId));
    if (visible) {
        await driver.waitFor(noneCameraView, 10000);
    } else {
        await driver.waitForAbsent(noneCameraView);
    }
}

export async function teacherEndsLessonForAllOnTeacherApp(
    teacher: TeacherInterface
): Promise<void> {
    const driver = teacher.flutterDriver!;
    await teacherTapsEndLessonButton(teacher);
    const endLessonForAllButton = new ByValueKey(TeacherKeys.endLessonForAllButton);
    await driver.tap(endLessonForAllButton);

    const endLessonDialog = new ByValueKey(TeacherKeys.endLiveLessonDialog);
    await driver.waitFor(endLessonDialog);

    const endNowButton = new ByValueKey(TeacherKeys.endNowButton);
    await driver.tap(endNowButton);
}
