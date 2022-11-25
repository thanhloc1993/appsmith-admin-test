import { TeacherKeys } from '@common/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { ButtonStatus } from 'test-suites/squads/virtual-classroom/utils/types';

export async function assertStatusOfShareMaterialButton(
    teacher: TeacherInterface,
    status: ButtonStatus
) {
    const driver = teacher.flutterDriver!;
    const shareMaterialButton = new ByValueKey(
        TeacherKeys.shareMaterialButtonActive(status === 'active')
    );
    await driver.waitFor(shareMaterialButton);
}
