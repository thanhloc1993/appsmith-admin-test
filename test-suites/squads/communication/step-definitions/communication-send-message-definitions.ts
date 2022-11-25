import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { firstIndex, messageKeyForType, MessageType } from './communication-common-definitions';
import {
    fileButtonKey,
    imageButtonKey,
    messageTimeKey,
    sendMessageButtonKey,
    textFieldMessageKey,
} from './teacher-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

/// Teacher
export async function teacherEnterTextMessage(
    teacher: TeacherInterface,
    message: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const messageTextFieldFinder = new ByValueKey(textFieldMessageKey);

    await driver.tap(messageTextFieldFinder, 20000);
    await driver.enterText(message, 20000);
}

export async function teacherSendTextMessage(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const sendMessageButtonFinder = new ByValueKey(sendMessageButtonKey);
    await driver.tap(sendMessageButtonFinder);
}

export async function teacherVerifyMessageIsSent(
    teacher: TeacherInterface,
    message: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const messageKey = messageKeyForType(MessageType.text, message);
    const messageFinder = new ByValueKey(messageKey);
    await driver.waitFor(messageFinder, 20000);
}

export async function teacherSendImageMessage(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const sendMessageButtonFinder = new ByValueKey(imageButtonKey);
    await driver.tap(sendMessageButtonFinder);
}

export async function teacherSendPdfMessage(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const sendMessageButtonFinder = new ByValueKey(fileButtonKey);
    await driver.tap(sendMessageButtonFinder);
}

export async function teacherSeesMessageIsSent(
    teacher: TeacherInterface,
    messageType: MessageType,
    content?: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const messageKey = messageKeyForType(messageType, content);
    const messageFinder = new ByValueKey(messageKey);
    await driver.waitFor(messageFinder, 20000);

    const timeSentKey = messageTimeKey(firstIndex);
    const timeFinder = new ByValueKey(timeSentKey);
    await driver.waitFor(timeFinder, 20000);
}

/// Leaner Web
export async function learnerReceiveMessage(
    learner: LearnerInterface,
    messageType: MessageType,
    content?: string
): Promise<void> {
    const driver = learner.flutterDriver!;
    const key = messageKeyForType(messageType, content);
    const messageFinder = new ByValueKey(key);
    await driver.waitFor(messageFinder);
}

export async function learnerEnterTextMessage(
    learner: LearnerInterface,
    message: string
): Promise<void> {
    const driver = learner.flutterDriver!;
    const messageTextFieldFinder = new ByValueKey(textFieldMessageKey);
    await driver.tap(messageTextFieldFinder, 20000);
    await driver.enterText(message, 20000);
}

export async function learnerSendTextMessage(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const sendMessageButtonFinder = new ByValueKey(sendMessageButtonKey);
    await driver.tap(sendMessageButtonFinder);
}

export async function learnerVerifyMessageIsSent(
    learner: LearnerInterface,
    message: string
): Promise<void> {
    const driver = learner.flutterDriver!;
    const messageKey = messageKeyForType(MessageType.text, message);
    const messageFinder = new ByValueKey(messageKey);
    await driver.waitFor(messageFinder, 20000);
}

export async function learnerSendImageMessage(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const sendMessageButtonFinder = new ByValueKey(imageButtonKey);
    await driver.tap(sendMessageButtonFinder);
}

export async function learnerSendPdfMessage(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const sendMessageButtonFinder = new ByValueKey(fileButtonKey);
    await driver.tap(sendMessageButtonFinder);
}
