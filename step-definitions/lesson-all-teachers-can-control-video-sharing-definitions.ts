import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';
import {
    pauseButtonBrightcove,
    playButtonBrightcove,
    videoControllerBrightcove,
} from 'step-definitions/teacher-keys/lesson';

export async function teacherSeesVideoControlBarOnTeacherApp(
    teacher: TeacherInterface,
    isShown: boolean
) {
    const driver = teacher.flutterDriver!;

    const videoControlBar = new ByValueKey(videoControllerBrightcove);
    if (isShown) {
        await driver.waitFor(videoControlBar);
    } else {
        await driver.waitForAbsent(videoControlBar);
    }
}

export async function teacherActionsVideoOnTeacherApp(
    teacher: TeacherInterface,
    videoId: string,
    action: 'play' | 'pause'
) {
    const driver = teacher.flutterDriver!;

    const videoView = new ByValueKey(TeacherKeys.videoLiveLessonView(videoId));
    const buttonKey = action === 'play' ? playButtonBrightcove : pauseButtonBrightcove;
    const actionVideoButton = new ByValueKey(buttonKey);
    await driver.tap(videoView);
    await driver.tap(actionVideoButton, 10000);
}

export async function teacherSeesVideoIsPlayingOnTeacherApp(
    teacher: TeacherInterface,
    videoId: string,
    isPlaying: boolean
) {
    const driver = teacher.flutterDriver!;

    const videoView = new ByValueKey(TeacherKeys.videoLiveLessonView(videoId));
    await driver.tap(videoView);
    const buttonKey = isPlaying ? pauseButtonBrightcove : playButtonBrightcove;
    const videoButton = new ByValueKey(buttonKey);
    await driver.waitFor(videoButton, 10000);
}

export async function learnerSeesVideoIsPlayingOnLearnerApp(
    learner: LearnerInterface,
    isShown: boolean
) {
    const driver = learner.flutterDriver!;
    const videoView = new ByValueKey(`${LearnerKeys.liveLessonVideoView()} ${isShown}`);
    await driver.waitFor(videoView, 10000);
}
