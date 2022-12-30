import { TeacherKeys } from '@common/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { getCommentContentByType } from './user-definition-utils';
import { ByValueKey } from 'flutter-driver-x';

export type ButtonNameType = 'cancel' | 'close';

export async function clicksOnIconDelete(teacher: TeacherInterface, keyComment: string) {
    await teacher.instruction('Teacher clicks on icon delete comment', async function () {
        await teacher.flutterDriver!.tap(new ByValueKey(keyComment));
    });
}

export async function clicksOnConfirmButton(teacher: TeacherInterface) {
    await teacher.instruction('Teacher clicks on confirm button', async function () {
        await teacher.flutterDriver!.tap(
            new ByValueKey(TeacherKeys.studentCommentDeleteConfirmButton)
        );
    });
}

export async function clicksOnCancelButton(teacher: TeacherInterface) {
    await teacher.instruction('Teacher clicks on cancel button', async function () {
        await teacher.flutterDriver!.tap(
            new ByValueKey(TeacherKeys.studentCommentDeleteCancelButton)
        );
    });
}

export async function clicksOnCloseButton(teacher: TeacherInterface) {
    await teacher.instruction('Teacher clicks on close button', async function () {
        await teacher.flutterDriver!.tap(
            new ByValueKey(TeacherKeys.closeDeleteCommentDialogButton)
        );
    });
}

export async function teacherCommentInHistory(teacher: TeacherInterface, comment: string) {
    const driver = teacher.flutterDriver!;

    const keyStudentCommentTextField = new ByValueKey(TeacherKeys.studentCommentTextField);

    await driver.tap(keyStudentCommentTextField);

    const commentContent = getCommentContentByType(comment, false);

    await driver.enterText(commentContent);
}
