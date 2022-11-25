import { TeacherKeys } from '@legacy-step-definitions/teacher-keys/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function teacherSelectStudentChatGroup(
    teacher: TeacherInterface,
    studentId: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const studentGroupChatFinder = new ByValueKey(TeacherKeys.studentConversationItem(studentId));

    await driver.tap(studentGroupChatFinder, 20000);
}

export async function teacherSelectParentGroupChat(
    teacher: TeacherInterface,
    studentId: string
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const parentGroupChatFinder = new ByValueKey(TeacherKeys.parentConversationItem(studentId));
    await driver.tap(parentGroupChatFinder, 20000);
}

export async function teacherTapJoinChatGroupButton(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;

    const joinConversationButtonFinder = new ByValueKey(TeacherKeys.joinConversationButton);
    await driver.tap(joinConversationButtonFinder, 10000);
}

export async function learnerSeesTeacherJoinChatGroup(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    const joinConversationMessageFinder = new ByValueKey(
        TeacherKeys.joinConversationMessageItem(0)
    );
    await driver.waitFor(joinConversationMessageFinder);
}

export async function parentSeesTeacherJoinChatGroup(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    const joinConversationMessageFinder = new ByValueKey(
        TeacherKeys.joinConversationMessageItem(0)
    );
    await driver.waitFor(joinConversationMessageFinder);
}

export async function teacherTapJoinAllButton(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const joinAllButtonFinder = new ByValueKey(TeacherKeys.joinAllButton);
    await driver.tap(joinAllButtonFinder);
}

export async function teacherTapJoinAllDialogButton(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const joinAllDialogButtonFinder = new ByValueKey(TeacherKeys.joinAllDialogButton);
    await driver.tap(joinAllDialogButtonFinder);
}

export async function teacherSeeJoinAllSuccessMessage(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const joinAllSuccessMessageFinder = new ByValueKey(TeacherKeys.joinAllSuccessMessage);
    //FIXME: find solution for wait to long to see join all success message
    await driver.waitFor(joinAllSuccessMessageFinder, 5 * 60000);
}
