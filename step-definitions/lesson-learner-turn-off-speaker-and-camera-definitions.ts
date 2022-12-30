import { LearnerInterface } from '@supports/app-types';

import { CameraOrSpeaker } from './lesson-learner-turn-off-speaker-and-camera-steps';
import {
    checkCameraStatusOnLearnerApp,
    checkSpeakerStatusOnLearnerApp,
    learnerSeesCameraViewInGalleryViewOnLearnerApp,
    learnerSeesStatusSpeakerIconInGalleryViewOnLearnerApp,
    StatusCameraAndSpeaker,
    turnOwnCameraStatusOnLearnerApp,
    turnOwnSpeakerStatusOnLearnerApp,
} from './lesson-turn-on-speaker-and-camera-definitions';

export async function turnOffDeviceOnLearnerApp(
    learner: LearnerInterface,
    device: CameraOrSpeaker
) {
    if (device === 'camera') {
        await turnOwnCameraStatusOnLearnerApp(learner, true);
    } else {
        await turnOwnSpeakerStatusOnLearnerApp(learner, true);
    }
}

export async function learnerSeesDeviceStatusOnLearnerApp(
    learner: LearnerInterface,
    device: CameraOrSpeaker,
    status: StatusCameraAndSpeaker
) {
    if (device === 'camera') {
        await checkCameraStatusOnLearnerApp(learner, status);
    } else {
        await checkSpeakerStatusOnLearnerApp(learner, status);
    }
}

export async function learnerSeesDeviceStatusOfOtherOnLearnerApp(
    learner: LearnerInterface,
    status: StatusCameraAndSpeaker,
    device: CameraOrSpeaker,
    otherUserId: string
) {
    const isActivatedDevice = status === 'active';

    if (device === 'camera') {
        await learnerSeesCameraViewInGalleryViewOnLearnerApp(
            learner,
            otherUserId,
            isActivatedDevice
        );
    } else {
        await learnerSeesStatusSpeakerIconInGalleryViewOnLearnerApp(
            learner,
            otherUserId,
            isActivatedDevice
        );
    }
}
