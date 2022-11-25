import { LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { ByValueKey } from 'flutter-driver-x';

export async function userCameraVisibilityOnListCameraOnLearnerApp(
    teacher: LearnerInterface,
    userId: string,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    if (visible) {
        try {
            await driver.waitFor(new ByValueKey(LearnerKeys.cameraDisplay(userId, true)));
        } catch {
            await driver.waitFor(new ByValueKey(LearnerKeys.cameraDisplay(userId, false)));
        }
    } else {
        await driver.waitForAbsent(new ByValueKey(LearnerKeys.cameraDisplay(userId, true)));
        await driver.waitForAbsent(new ByValueKey(LearnerKeys.cameraDisplay(userId, false)));
    }
}
