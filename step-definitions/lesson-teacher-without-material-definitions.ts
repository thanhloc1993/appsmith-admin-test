import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function makeSureLessonHasNoMaterialOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        'Teacher change to material tab and sees no material',
        async function () {
            const materialTab = new ByValueKey(TeacherKeys.materialTab);
            await driver.tap(materialTab);

            const emptyMaterial = new ByValueKey(TeacherKeys.materialList(0));
            await driver.waitFor(emptyMaterial);
        }
    );
}
