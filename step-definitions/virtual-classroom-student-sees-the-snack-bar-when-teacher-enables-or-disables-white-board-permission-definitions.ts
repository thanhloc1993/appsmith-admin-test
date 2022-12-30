import { LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerSeesSnackBarWhiteboardPermission(
    learner: LearnerInterface,
    visible: boolean
) {
    const driver = learner.flutterDriver!;
    const dialog = new ByValueKey(LearnerKeys.enableWhiteboardPermissionDialog);
    if (visible) {
        await driver.waitFor(dialog);
    } else {
        await driver.waitForAbsent(dialog);
    }
}
