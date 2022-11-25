import { LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { ByValueKey } from 'flutter-driver-x';

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
