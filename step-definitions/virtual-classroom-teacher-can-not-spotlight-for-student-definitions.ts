import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { PinnedFeatureOptionMenu } from './virtual-classroom-teacher-sees-three-dots-button-on-teacher-app-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherSeesPinnedFeatureMenuOption(
    teacher: TeacherInterface,
    option: PinnedFeatureOptionMenu,
    enable: boolean
) {
    const driver = teacher.flutterDriver!;
    const optionButton = new ByValueKey(TeacherKeys.cameraDisplayOptionItem(option, enable));
    await driver.waitFor(optionButton);
}

export async function learnerDoesNotSeeUserStreamInTheMainScreenOnLearnerApp(
    teacher: LearnerInterface,
    userId: string
) {
    const driver = teacher.flutterDriver!;
    await driver.waitForAbsent(new ByValueKey(LearnerKeys.cameraDisplayContainerKey(userId, true)));
}
