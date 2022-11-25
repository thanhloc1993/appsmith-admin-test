import { makeRandomTextMessage } from '@legacy-step-definitions/utils';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { messageContentKey } from './alias-keys/communication';
import {
    messageInteractionKeyForType,
    messageKeyForType,
    MessageType,
    viewerKeyForType,
} from './communication-common-definitions';
import {
    learnerEnterTextMessage,
    learnerSendImageMessage,
    learnerSendPdfMessage,
    learnerSendTextMessage,
    learnerVerifyMessageIsSent,
    teacherEnterTextMessage,
    teacherSendImageMessage,
    teacherSendPdfMessage,
    teacherSendTextMessage,
    teacherVerifyMessageIsSent,
} from './communication-send-message-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherSeesMessage(
    teacher: TeacherInterface,
    messageType: MessageType,
    content?: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const messageFinder = new ByValueKey(messageKeyForType(messageType, content));
    await driver.waitFor(messageFinder, 20000);
}

export async function teacherSendMessageWithType(
    teacher: TeacherInterface,
    context: ScenarioContext,
    messageType: MessageType
): Promise<void> {
    switch (messageType) {
        case MessageType.text: {
            const messageText = makeRandomTextMessage();
            await teacherEnterTextMessage(teacher, messageText);
            await teacherSendTextMessage(teacher);
            await teacherVerifyMessageIsSent(teacher, messageText);
            context.set(messageContentKey, messageText);
            break;
        }
        case MessageType.image: {
            await teacherSendImageMessage(teacher);
            break;
        }

        case MessageType.pdf: {
            await teacherSendPdfMessage(teacher);
            break;
        }

        case MessageType.hyperlink: {
            const messageText = 'https://manabie.com';
            await teacherEnterTextMessage(teacher, messageText);
            await teacherSendTextMessage(teacher);
            context.set(messageContentKey, messageText);
            break;
        }

        case MessageType.zip: {
            await teacher.sendZipFile();
            break;
        }
    }
}

export async function teacherSendFileImageMessage(
    teacher: TeacherInterface,
    messageType: MessageType
): Promise<void> {
    switch (messageType) {
        case MessageType.image: {
            await teacherSendImageMessage(teacher);
            break;
        }
        case MessageType.pdf: {
            await teacherSendPdfMessage(teacher);
            break;
        }

        case MessageType.zip: {
            await teacher.sendZipFile();
            break;
        }
    }
}

export async function teacherInteractWithMessageType(
    teacher: TeacherInterface,
    messageType: string,
    messageContent?: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const key = messageInteractionKeyForType(messageType, messageContent);
    const messageFinder = new ByValueKey(key);
    await driver.tap(messageFinder);
}

export async function teacherOpenedViewerMessage(
    teacher: TeacherInterface,
    messageType: MessageType
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const viewerFinder = new ByValueKey(viewerKeyForType(messageType));
    await driver.waitFor(viewerFinder);
}

export async function learnerInteractWithMessageType(
    learner: LearnerInterface,
    messageType: string,
    messageContent?: string
): Promise<void> {
    const driver = learner.flutterDriver!;
    const key = messageInteractionKeyForType(messageType, messageContent);
    const messageFinder = new ByValueKey(key);
    await driver.tap(messageFinder);
}

export async function learnerOpenedViewerMessage(
    learner: LearnerInterface,
    messageType: MessageType
): Promise<void> {
    const driver = learner.flutterDriver!;
    const viewerFinder = new ByValueKey(viewerKeyForType(messageType));
    await driver.runUnsynchronized(async () => {
        await driver.waitFor(viewerFinder);
    });
}

export async function learnerSeesMessage(
    learner: LearnerInterface,
    messageType: MessageType,
    content: string
): Promise<void> {
    const driver = learner.flutterDriver!;
    const messageFinder = new ByValueKey(messageKeyForType(messageType, content));
    await driver.waitFor(messageFinder, 10000);
}

export async function learnerSendMessageWithType(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    messageType: MessageType
): Promise<void> {
    switch (messageType) {
        case MessageType.text: {
            const messageText = makeRandomTextMessage();
            await learnerEnterTextMessage(learner, messageText);
            await learnerSendTextMessage(learner);
            await learnerVerifyMessageIsSent(learner, messageText);
            scenario.set(messageContentKey, messageText);
            break;
        }

        case MessageType.image: {
            await learnerSendImageMessage(learner);
            break;
        }

        case MessageType.pdf: {
            await learnerSendPdfMessage(learner);
            break;
        }

        case MessageType.hyperlink: {
            const messageText = 'https://manabie.com';
            await learnerEnterTextMessage(learner, messageText);
            await learnerSendTextMessage(learner);
            scenario.set(messageContentKey, messageText);
            break;
        }

        case MessageType.zip: {
            await learner.sendZipFile();
            break;
        }
    }
}
