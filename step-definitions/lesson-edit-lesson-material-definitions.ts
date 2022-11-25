import { TeacherInterface } from '@supports/app-types';

import { retryHelper } from './lesson-utils';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherChangesToMaterialTabAndCheckMaterialList(
    teacher: TeacherInterface,
    materialCount: number
) {
    const driver = teacher.flutterDriver!;

    const materialTab = new ByValueKey(TeacherKeys.materialTab);
    await driver.tap(materialTab);

    const materialList = new ByValueKey(TeacherKeys.materialList(materialCount));
    await retryHelper({
        action: async function () {
            await driver.waitFor(materialList);
        },
        retryCount: 3,
        errorAction: async function () {
            await driver.reload();
            await driver.tap(materialTab);
        },
    });
}
