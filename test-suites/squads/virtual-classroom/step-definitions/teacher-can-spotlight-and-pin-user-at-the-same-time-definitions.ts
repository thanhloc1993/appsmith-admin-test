import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { StatusCameraAndSpeaker } from 'test-suites/squads/virtual-classroom/utils/types';

export async function teacherSeesWhiteFrameVisibleCoveredUserCameraStreamInTheMainScreenOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(
        new ByValueKey(VirtualClassroomKeys.cameraDisplayContainerKey(userId, visible)),
        10000
    );
}

export async function userCameraVisibilityOnMainScreenOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    visible: boolean,
    cameraStatus: StatusCameraAndSpeaker
) {
    weExpect(visible).toEqual(
        await isUserCameraVisibilityOnMainScreenOnTeacherApp(teacher, userId, cameraStatus)
    );
}

export async function isUserCameraVisibilityOnMainScreenOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    cameraStatus: StatusCameraAndSpeaker
): Promise<boolean> {
    const driver = teacher.flutterDriver!;
    switch (cameraStatus) {
        case 'active':
            try {
                await driver.waitFor(
                    new ByValueKey(VirtualClassroomKeys.pinnedUserView(userId, true)),
                    10000
                );
                return true;
            } catch {
                return false;
            }
        case 'inactive':
            try {
                await driver.waitFor(
                    new ByValueKey(VirtualClassroomKeys.pinnedUserView(userId, false)),
                    10000
                );
                return true;
            } catch {
                return false;
            }
    }
}
