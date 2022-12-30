import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function assertMaterialButtonVisibleOnLearnerApp(
    learner: LearnerInterface,
    lessonId: string,
    visible: boolean
) {
    const driver = learner.flutterDriver!;

    const materialButton = new ByValueKey(VirtualClassroomKeys.materialButton(lessonId));
    if (visible) {
        await driver.waitFor(materialButton);
    } else {
        await driver.waitForAbsent(materialButton);
    }
}

export async function assertMaterialVisibleOnLearnerApp(
    learner: LearnerInterface,
    materialName: string,
    visible: boolean
) {
    const driver = learner.flutterDriver!;

    const materialButton = new ByValueKey(VirtualClassroomKeys.mediaItem(materialName, false));
    if (visible) {
        await driver.waitFor(materialButton);
    } else {
        await driver.waitForAbsent(materialButton);
    }
}

export async function assertMaterialNameVisibleOnLearnerApp(
    learner: LearnerInterface,
    materialName: string,
    visible: boolean
) {
    const driver = learner.flutterDriver!;

    const materialNameKey = new ByValueKey(materialName);
    if (visible) {
        await driver.waitFor(materialNameKey);
    } else {
        await driver.waitForAbsent(materialNameKey);
    }
}

export async function previewMaterialOnLearnerApp(learner: LearnerInterface, materialName: string) {
    const driver = learner.flutterDriver!;

    const materialButton = new ByValueKey(VirtualClassroomKeys.mediaItem(materialName, false));
    const previewAnnotatedPdfScreen = new ByValueKey(
        VirtualClassroomKeys.previewAnnotatedPdfScreen
    );
    await driver.tap(materialButton);
    await driver.waitFor(previewAnnotatedPdfScreen, 15000);
}
