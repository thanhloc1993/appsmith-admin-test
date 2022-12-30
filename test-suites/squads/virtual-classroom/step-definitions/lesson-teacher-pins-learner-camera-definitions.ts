import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import {
    PinnedFeatureOptionMenu,
    StatusCameraAndSpeaker,
} from 'test-suites/squads/virtual-classroom/utils/types';

export async function teacherClickPinFeatureOptionButton(
    teacher: TeacherInterface,
    userId: string,
    option: PinnedFeatureOptionMenu
) {
    const driver = teacher.flutterDriver!;
    await driver.webDriver?.page.hover(`div[id="${userId}"]`);
    const cameraDisplayOptionButton = new ByValueKey(
        VirtualClassroomKeys.cameraDisplayOptionButton(userId)
    );
    await driver.tap(cameraDisplayOptionButton);

    const optionButton = new ByValueKey(VirtualClassroomKeys.cameraDisplayOptionItem(option, true));
    await driver.tap(optionButton);
}

export async function userCameraVisibilityOnListCameraOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    visible: boolean,
    cameraStatus: StatusCameraAndSpeaker
) {
    weExpect(visible).toEqual(
        await isUserCameraVisibilityOnListCameraOnTeacherApp(teacher, userId, cameraStatus)
    );
}

export async function isUserCameraVisibilityOnListCameraOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    cameraStatus: StatusCameraAndSpeaker
): Promise<boolean> {
    const driver = teacher.flutterDriver!;
    switch (cameraStatus) {
        case 'active':
            try {
                await driver.waitFor(
                    new ByValueKey(VirtualClassroomKeys.cameraDisplay(userId, true)),
                    10000
                );
                return true;
            } catch {
                return false;
            }
        case 'inactive':
            try {
                await driver.waitFor(
                    new ByValueKey(VirtualClassroomKeys.cameraDisplay(userId, false)),
                    10000
                );
                return true;
            } catch {
                return false;
            }
    }
}
