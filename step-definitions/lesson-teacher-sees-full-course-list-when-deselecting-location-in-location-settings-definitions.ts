import { TeacherInterface } from '@supports/app-types';
import { LocationItemCheckBoxStatus } from '@supports/enum';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherDeselectLocationsOnTeacherApp(
    teacher: TeacherInterface,
    locationIdList: string[]
) {
    const driver = teacher.flutterDriver!;

    const listKey = new ByValueKey(TeacherKeys.locationTreeViewScrollView);

    for (const locationId of locationIdList) {
        const itemKey = new ByValueKey(
            TeacherKeys.locationCheckStatus(locationId, LocationItemCheckBoxStatus.checked)
        );

        await driver.scrollUntilVisible(listKey, itemKey, 0.0, 0.0, -100);

        await driver.tap(itemKey, 10000);
    }
}
