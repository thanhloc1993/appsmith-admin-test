import { LearnerKeys } from '@common/learner-key';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { LessonMaterialMultipleType } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

export async function learnerSeesSharingMaterialOnLearnerApp(
    learner: LearnerInterface,
    material: LessonMaterialMultipleType
) {
    const driver = learner.flutterDriver!;

    if (material.includes('pdf')) {
        const presentPdf = LearnerKeys.liveLessonWhiteBoardIndex(1);
        await driver.waitFor(new ByValueKey(presentPdf), 10000);
        return;
    }

    const presentVideo = LearnerKeys.liveLessonVideoView([]);
    await driver.waitFor(new ByValueKey(presentVideo), 10000);
    return;
}

export async function learnerDoesNotSeeSharingMaterialOnLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const absentPdf = LearnerKeys.liveLessonWhiteBoardIndex(0);
    const presentVideo = LearnerKeys.liveLessonVideoView([]);

    await driver.waitFor(new ByValueKey(absentPdf), 10000);
    await driver.waitForAbsent(new ByValueKey(presentVideo), 10000);
}

export async function learnerSeesPdfOnLearnerApp(learner: LearnerInterface, hidden: boolean) {
    const driver = learner.flutterDriver!;
    const absentPdf = LearnerKeys.liveLessonWhiteBoardIndex(0);
    if (hidden) {
        await driver.waitFor(new ByValueKey(absentPdf), 10000);
    } else {
        await driver.waitForAbsent(new ByValueKey(absentPdf), 10000);
    }
}

export async function learnerSeesVideoOnLearnerApp(learner: LearnerInterface, hidden: boolean) {
    const driver = learner.flutterDriver!;
    const presentVideo = LearnerKeys.liveLessonVideoView([]);
    if (hidden) {
        await driver.waitForAbsent(new ByValueKey(presentVideo), 15000);
    } else {
        await driver.waitFor(new ByValueKey(presentVideo), 15000);
    }
}
