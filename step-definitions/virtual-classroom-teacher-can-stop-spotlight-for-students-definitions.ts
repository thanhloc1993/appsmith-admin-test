import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { StatusCameraAndSpeaker } from './lesson-turn-on-speaker-and-camera-definitions';
import { teacherClickCameraOptionsDialogOption } from './virtual-classroom-teacher-can-spotlight-user-definitions';
import { teacherClickThreeDotButton } from './virtual-classroom-teacher-sees-three-dots-button-on-teacher-app-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherStopSpotlightUserCameraOnTeacherApp(
    teacher: TeacherInterface,
    userId: string
) {
    await teacherClickThreeDotButton(teacher, userId);
    await teacherClickCameraOptionsDialogOption(teacher, 'Stop spotlighting for students', true);
}

export async function checkPinnedUserViewVisibleOnLearnerApp(
    learner: LearnerInterface,
    userId: string,
    visible: boolean,
    cameraStatus: StatusCameraAndSpeaker
) {
    weExpect(visible).toEqual(
        await isPinnedUserViewVisibleOnLearnerApp(learner, userId, cameraStatus)
    );
}

export async function isPinnedUserViewVisibleOnLearnerApp(
    learner: LearnerInterface,
    userId: string,
    cameraStatus: StatusCameraAndSpeaker
): Promise<boolean> {
    const driver = learner.flutterDriver!;
    switch (cameraStatus) {
        case 'active':
            try {
                await driver.waitFor(new ByValueKey(LearnerKeys.pinnedUserView(userId, true)));
                return true;
            } catch {
                return false;
            }
        case 'inactive':
            try {
                await driver.waitFor(new ByValueKey(LearnerKeys.pinnedUserView(userId, false)));
                return true;
            } catch {
                return false;
            }
    }
}
