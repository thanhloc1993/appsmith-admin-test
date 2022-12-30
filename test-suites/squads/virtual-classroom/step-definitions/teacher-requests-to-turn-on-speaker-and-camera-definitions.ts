import { LearnerKeys } from '@common/learner-key';
import { ManabieAgoraKeys } from '@common/manabie-agora-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { AcceptsOrDeclines } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-requests-to-turn-on-speaker-and-camera-steps';
import { teacherTapsUserButtonToShowStudentList } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';
import { CameraOrSpeaker } from 'test-suites/squads/virtual-classroom/utils/types';

export async function teacherTurnOnStudentDeviceOnTeacherApp(
    teacher: TeacherInterface,
    learnerId: string,
    device: CameraOrSpeaker
) {
    const driver = teacher.flutterDriver!;

    await teacherTapsUserButtonToShowStudentList(teacher);

    if (device === 'camera') {
        const cameraIcon = new ByValueKey(ManabieAgoraKeys.cameraKeyButton(learnerId, false));
        await driver.tap(cameraIcon);
    } else {
        const speakerIcon = new ByValueKey(ManabieAgoraKeys.microKeyButton(learnerId, false));
        await driver.tap(speakerIcon);
    }
}

export async function learnerTapActionFromRequestModalOnLearnerApp(
    learner: LearnerInterface,
    action: AcceptsOrDeclines
) {
    const driver = learner.flutterDriver!;

    if (action === 'accepts') {
        const acceptRequestButton = new ByValueKey(LearnerKeys.acceptRequestButton);
        await driver.tap(acceptRequestButton);
    } else {
        const declineRequestButton = new ByValueKey(LearnerKeys.declineRequestButton);
        await driver.tap(declineRequestButton);
    }
}
