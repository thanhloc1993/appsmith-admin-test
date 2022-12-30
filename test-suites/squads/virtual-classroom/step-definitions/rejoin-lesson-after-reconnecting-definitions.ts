import { LearnerKeys } from '@common/learner-key';
import { TeacherKeys } from '@common/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function disconnectingScreenDisplayOnTeacherApp(
    teacher: TeacherInterface,
    displayed: boolean
) {
    const driver = teacher.flutterDriver!;
    const disconnectingScreen = new ByValueKey(TeacherKeys.disconnectingScreenLiveLesson);
    if (displayed) {
        await driver.waitFor(disconnectingScreen);
    } else {
        await driver.waitForAbsent(disconnectingScreen);
    }
}

export async function disconnectingScreenDisplayOnLearnerApp(
    learner: LearnerInterface,
    displayed: boolean
) {
    const driver = learner.flutterDriver!;
    const disconnectingScreen = new ByValueKey(LearnerKeys.disconnectingScreenLiveLesson);
    if (displayed) {
        await driver.waitFor(disconnectingScreen);
    } else {
        await driver.waitForAbsent(disconnectingScreen);
    }
}

export async function disconnectsInternetFromLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    await learner.setOffline(true);
    if (!driver.isApp()) {
        await learner.flutterDriver!.webDriver!.page!.waitForLoadState('networkidle');
    }
}

export async function reconnectsInternetFromLearnerApp(learner: LearnerInterface) {
    await learner.setOffline(false);
}
