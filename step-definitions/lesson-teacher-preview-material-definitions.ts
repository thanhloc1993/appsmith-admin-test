import { TeacherInterface } from '@supports/app-types';

import { teacherChangesToMaterialTabAndCheckMaterialList } from './lesson-edit-lesson-material-definitions';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';
import { LessonMaterial } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

export async function teacherSeeMaterialOnLessonDetailOnTeacherApp(
    teacher: TeacherInterface,
    materialName: string
) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(
        `teacher changes to material tab and sees material ${materialName}`,
        async function () {
            await teacherChangesToMaterialTabAndCheckMaterialList(teacher, 1);
            const materialItem = new ByValueKey(TeacherKeys.mediaItem(materialName));
            await driver.waitFor(materialItem);
        }
    );
}

export async function teacherPreviewLessonMaterialOnTeacherApp(
    teacher: TeacherInterface,
    material: LessonMaterial,
    materialName: string
) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(`Teacher preview material: ${materialName}`, async function () {
        const materialItem = new ByValueKey(TeacherKeys.mediaItem(materialName));
        await driver.tap(materialItem);

        if (material === 'pdf' || material === 'pdf 1' || material === 'pdf 2') {
            const viewMaterialScreen = new ByValueKey(TeacherKeys.viewMaterialScreen);
            await driver.waitFor(viewMaterialScreen);
            return;
        }

        // video + brightcove video are similar
        const viewMaterialScreen = new ByValueKey(TeacherKeys.videoView);
        await driver.waitFor(viewMaterialScreen);
        return;
    });
}
