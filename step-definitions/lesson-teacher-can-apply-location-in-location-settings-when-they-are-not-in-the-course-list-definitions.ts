import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherConfirmAcceptApplyingLocation(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const selectLocationDialogApplyButtonKey = new ByValueKey(
        TeacherKeys.selectLocationDialogApplyButtonKey
    );
    const selectLocationDialogConfirmAcceptApplyingButtonKey = new ByValueKey(
        TeacherKeys.selectLocationDialogConfirmAcceptApplyingButtonKey
    );

    await driver.tap(selectLocationDialogApplyButtonKey);
    await driver.tap(selectLocationDialogConfirmAcceptApplyingButtonKey);
}

export async function teacherIsRedirectToTheCourseListPageOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const courseListPage = new ByValueKey(TeacherKeys.homeScreen);

    await driver.waitFor(courseListPage);
}

export async function teacherIsStayAtCourseDetailScreenOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const courseDetailScreen = new ByValueKey(TeacherKeys.courseDetailsScreen);
    await driver.waitFor(courseDetailScreen, 10000);
}
