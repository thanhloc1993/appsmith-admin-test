import { TeacherKeys } from '@legacy-step-definitions/teacher-keys/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { teacherSelectConversation } from './communication-common-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherLeaveGroupChat(
    teacher: TeacherInterface,
    isParent: boolean,
    studentId: string
) {
    const driver = teacher.flutterDriver!;

    await teacherSelectConversation(teacher, isParent, studentId);

    const menuPopupButtonFinder = new ByValueKey(TeacherKeys.conversationDetailMenuPopupButton);
    await driver.tap(menuPopupButtonFinder);

    const leaveGroupChatButtonFinder = new ByValueKey(TeacherKeys.leaveGroupChatButton);
    await driver.tap(leaveGroupChatButtonFinder);

    const leaveGroupChatDialogButtonFinder = new ByValueKey(TeacherKeys.leaveGroupChatDialogButton);
    await driver.tap(leaveGroupChatDialogButtonFinder);
}
