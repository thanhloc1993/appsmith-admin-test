import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export type PinnedFeatureOptionMenu =
    | 'Pin for me'
    | 'Spotlight for students'
    | 'Stop spotlighting for students'
    | 'Unpin'
    | '';

export async function teacherClickThreeDotButton(teacher: TeacherInterface, userId: string) {
    const driver = teacher.flutterDriver!;
    await driver.webDriver?.page.hover(`div[id="${userId}"]`);
    const cameraDisplayOptionButton = new ByValueKey(TeacherKeys.cameraDisplayOptionButton(userId));
    await driver.tap(cameraDisplayOptionButton);
}

export async function teacherClickPinButton(
    teacher: TeacherInterface,
    option: PinnedFeatureOptionMenu
) {
    const driver = teacher.flutterDriver!;
    const optionButton = new ByValueKey(TeacherKeys.cameraDisplayOptionItem(option, true));
    await driver.tap(optionButton);
}

export async function checkSeeCameraOptionMenu(
    teacher: TeacherInterface,
    options: PinnedFeatureOptionMenu[]
) {
    const driver = teacher.flutterDriver!;
    const cameraDisplayOptionsMenu = new ByValueKey(TeacherKeys.cameraDisplayOptionsMenu(options));
    await driver.waitFor(cameraDisplayOptionsMenu);
}
