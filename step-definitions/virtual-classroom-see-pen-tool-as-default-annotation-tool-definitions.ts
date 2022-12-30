import { TeacherInterface, LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function seesDefaultLineSizeIconUnderPenToolIconInWhiteBoardOnTeacherApp(
    teacher: TeacherInterface
) {
    const driver = teacher.flutterDriver!;
    const annotationBarStrokePathKey = new ByValueKey(
        TeacherKeys.annotationBarStrokePathKey(4, true)
    );

    await driver.waitFor(annotationBarStrokePathKey);
}

export async function seesDefaultGreenColourIconUnderLineSizeIconInWhiteBoardOnTeacherApp(
    teacher: TeacherInterface
) {
    const driver = teacher.flutterDriver!;
    const annotationBarColorPickerColorIndexKey = new ByValueKey(
        TeacherKeys.annotationBarColorPickerColorIndexKey(0, true)
    );

    await driver.waitFor(annotationBarColorPickerColorIndexKey);
}

export async function seesDefaultLineSizeIconUnderPenToolIconInWhiteBoardOnLearnerApp(
    learner: LearnerInterface
) {
    const driver = learner.flutterDriver!;
    const annotationBarStrokePathKey = new ByValueKey(
        LearnerKeys.annotationBarStrokePathKey(4, true)
    );

    await driver.waitFor(annotationBarStrokePathKey);
}

export async function seesDefaultGreenColourIconUnderLineSizeIconInWhiteBoardOnLearnerApp(
    learner: LearnerInterface
) {
    const driver = learner.flutterDriver!;
    const annotationBarColorPickerColorIndexKey = new ByValueKey(
        LearnerKeys.annotationBarColorPickerColorIndexKey(0, true)
    );

    await driver.waitFor(annotationBarColorPickerColorIndexKey);
}
