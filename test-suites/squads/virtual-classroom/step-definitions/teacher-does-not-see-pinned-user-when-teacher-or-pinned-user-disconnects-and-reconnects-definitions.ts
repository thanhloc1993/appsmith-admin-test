import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { StatusCameraAndSpeaker } from 'test-suites/squads/virtual-classroom/utils/types';

export async function checkPinnedUserViewVisibleOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    visible: boolean,
    cameraStatus: StatusCameraAndSpeaker
) {
    const pinnedUserViewVisible = await isPinnedUserViewVisibleOnTeacherApp(
        teacher,
        userId,
        cameraStatus
    );
    weExpect(pinnedUserViewVisible).toEqual(visible);
}

export async function isPinnedUserViewVisibleOnTeacherApp(
    teacher: TeacherInterface,
    userId: string,
    cameraStatus: StatusCameraAndSpeaker
): Promise<boolean> {
    const driver = teacher.flutterDriver!;
    let result = false;
    await driver.runUnsynchronized(async () => {
        switch (cameraStatus) {
            case 'active':
                try {
                    await driver.waitFor(
                        new ByValueKey(VirtualClassroomKeys.pinnedUserView(userId, true))
                    );
                    result = true;
                } catch {
                    result = false;
                }
                break;
            case 'inactive':
                try {
                    await driver.waitFor(
                        new ByValueKey(VirtualClassroomKeys.pinnedUserView(userId, false))
                    );
                    result = true;
                } catch {
                    result = false;
                }
                break;
        }
    });
    return result;
}
