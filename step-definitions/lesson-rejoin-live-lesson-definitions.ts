import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { learnerClickJoinLesson } from './lesson-learner-join-lesson-definitions';
import { learnerJoinsLessonSuccessfully } from './lesson-student-interacts-in-lesson-waiting-room-definitions';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerRejoinsOnLearnerApp(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string
): Promise<void> {
    await learnerClickJoinLesson(learner, lessonId, lessonName);
    await learnerJoinsLessonSuccessfully(learner);
}

export async function learnerHasLeftLessonOnLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const liveLessonScreen = new ByValueKey(LearnerKeys.liveStreamScreen);
    await driver.waitForAbsent(liveLessonScreen, 15000);
}

export async function speakerOfLearnerIs(
    learner: LearnerInterface,
    active: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;
    const cameraButtonLiveLesson = new ByValueKey(LearnerKeys.microButtonLiveLesson(active));
    await driver.waitFor(cameraButtonLiveLesson);
}

export async function speakerOfTeacherIs(
    teacher: TeacherInterface,
    active: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const cameraButtonLiveLesson = new ByValueKey(TeacherKeys.microButtonLiveLessonActive(active));
    await driver.waitFor(cameraButtonLiveLesson);
}

export async function cameraOfLearnerIs(learner: LearnerInterface, active: boolean): Promise<void> {
    const driver = learner.flutterDriver!;
    const cameraButtonLiveLesson = new ByValueKey(LearnerKeys.cameraButtonLiveLesson(active));
    await driver.waitFor(cameraButtonLiveLesson);
}

export async function cameraOfTeacherIs(teacher: TeacherInterface, active: boolean): Promise<void> {
    const driver = teacher.flutterDriver!;
    const cameraButtonLiveLesson = new ByValueKey(TeacherKeys.cameraButtonLiveLessonActive(active));
    await driver.waitFor(cameraButtonLiveLesson);
}
