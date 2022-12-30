import { WhiteboardKeys } from '@common/whiteboard-keys';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey, delay } from 'flutter-driver-x';

export async function zoomsInPdfOnLearner(learner: LearnerInterface, count: number) {
    const driver = learner.flutterDriver!;
    const zoomInButton = new ByValueKey(WhiteboardKeys.zoomInButton);
    for (let i = 0; i < count; i++) {
        await driver.tap(zoomInButton);
        // DeBouncer in Learner App
        await delay(500);
    }
}

export async function zoomsOutPdfOnLearner(learner: LearnerInterface, count: number) {
    const driver = learner.flutterDriver!;
    const zoomOutButton = new ByValueKey(WhiteboardKeys.zoomOutButton);
    for (let i = 0; i < count; i++) {
        await driver.tap(zoomOutButton);
        // DeBouncer in Learner App
        await delay(500);
    }
}

export async function assertSharingPdfWithZoomRatio(learner: LearnerInterface, percentage: string) {
    const driver = learner.flutterDriver!;
    const currentPercentageText = new ByValueKey(
        `${WhiteboardKeys.currentZoomPercentage} ${percentage}`
    );

    await driver.waitFor(currentPercentageText);
}
