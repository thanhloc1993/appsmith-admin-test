import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import {
    PinnedFeatureOptionMenu,
    teacherClickThreeDotButton,
} from './virtual-classroom-teacher-sees-three-dots-button-on-teacher-app-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherSpotlightsUserCameraOnTeacherApp(
    teacher: TeacherInterface,
    userId: string
) {
    await teacherClickThreeDotButton(teacher, userId);
    await teacherClickCameraOptionsDialogOption(teacher, 'Spotlight for students', true);
}

export async function teacherClickCameraOptionsDialogOption(
    teacher: TeacherInterface,
    option: PinnedFeatureOptionMenu,
    enable: boolean
) {
    const driver = teacher.flutterDriver!;
    const optionButton = new ByValueKey(TeacherKeys.cameraDisplayOptionItem(option, enable));
    await driver.tap(optionButton);
}

export async function teacherSeesWhiteFrameVisibleCoveredUserCameraStreamInTheGalleryViewOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(new ByValueKey(TeacherKeys.cameraDisplayContainerKey(userId, visible)));
}

export async function teacherSeesSpotlightIconInUserStreamInTheGalleryViewOnTeacherApp(
    teacher: TeacherInterface,
    userId: string
) {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(new ByValueKey(TeacherKeys.spotlightIconKey(userId)));
}

export async function learnerSeesUserStreamInTheMainScreenOnLearnerApp(
    teacher: LearnerInterface,
    userId: string
) {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(new ByValueKey(LearnerKeys.cameraDisplayContainerKey(userId, true)));
}
