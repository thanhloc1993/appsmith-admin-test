import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { firstIndex, MessageType } from './communication-common-definitions';
import {
    contentConversationKey,
    conversationUnseenStatusKey,
    readMessageKey,
    repliedConversationKey,
} from './teacher-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

export async function verifyNotSeesReadStatusAtFirstPosition(
    client: TeacherInterface | LearnerInterface
): Promise<void> {
    const driver = client.flutterDriver!;

    const readKeyFinder = new ByValueKey(readMessageKey(firstIndex));
    await driver.waitForAbsent(readKeyFinder);
}

export async function teacherSeesReadStatusAtFirstPosition(
    teacher: TeacherInterface
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const readKeyFinder = new ByValueKey(readMessageKey(firstIndex));
    await driver.waitFor(readKeyFinder);
}

export async function teacherSeesReplyStatus(
    teacher: TeacherInterface,
    studentId: string,
    isParent: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const repliedKeyFinder = new ByValueKey(repliedConversationKey(studentId, isParent));
    await driver.waitFor(repliedKeyFinder);
}

export async function teacherNotSeesReplyStatus(
    teacher: TeacherInterface,
    studentId: string,
    isParent: boolean
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const repliedKeyFinder = new ByValueKey(repliedConversationKey(studentId, isParent));
    await driver.waitForAbsent(repliedKeyFinder);
}

export async function verifyUnreadStatus(
    client: TeacherInterface | LearnerInterface,
    studentId: string,
    isParent: boolean
): Promise<void> {
    const driver = client.flutterDriver!;

    const unreadStatusFinder = new ByValueKey(conversationUnseenStatusKey(studentId, isParent));
    await driver.waitFor(unreadStatusFinder);
}

export async function verifyUnreadStatusDisappear(
    client: TeacherInterface | LearnerInterface,
    studentId: string,
    isParent: boolean
): Promise<void> {
    const driver = client.flutterDriver!;

    const unreadStatusFinder = new ByValueKey(conversationUnseenStatusKey(studentId, isParent));
    await driver.waitForAbsent(unreadStatusFinder);
}

export async function verifyUnreadMessageOnTop(
    client: TeacherInterface | LearnerInterface,
    studentId: string,
    message: string | undefined,
    read: boolean
): Promise<void> {
    const driver = client.flutterDriver!;

    const unreadStatusOnTopFinder = new ByValueKey(
        contentConversationKey(firstIndex, studentId, message, read)
    );
    await driver.waitFor(unreadStatusOnTopFinder, 10000);
}

export function getContentConversationMessage(
    messageType: MessageType,
    messageText: string | undefined
) {
    switch (messageType) {
        case MessageType.image: {
            return 'Image';
        }
        case MessageType.pdf:
            return 'Pdf';

        default:
            return messageText;
    }
}
