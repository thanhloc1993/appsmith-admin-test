import {
    getLearnerInterfaceFromRole,
    isParentRole,
    randomInteger,
} from '@legacy-step-definitions/utils';

import { Given, When, Then } from '@cucumber/cucumber';

import {
    AccountRoles,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';

import { aliasLearnerRole, aliasMessageType, messageContentKey } from './alias-keys/communication';
import {
    getMessageType,
    learnerSelectConversation,
    MessageType,
    moveLearnerToMessagePage,
    teacherSelectConversation,
} from './communication-common-definitions';
import {
    getContentConversationMessage,
    teacherNotSeesReplyStatus,
    teacherSeesReadStatusAtFirstPosition,
    teacherSeesReplyStatus,
    verifyNotSeesReadStatusAtFirstPosition,
    verifyUnreadMessageOnTop,
    verifyUnreadStatus,
    verifyUnreadStatusDisappear,
} from './communication-read-and-reply-message-definitions';
import {
    learnerSendMessageWithType,
    teacherSeesMessage,
    teacherSendMessageWithType,
} from './communication-send-receive-message-definitions';

/// BEGIN: Scenario Outline: Teacher sees status that <userAccount> does not read the message in Teacher App
Given(
    'teacher sends {string} message to {string}',
    async function (this: IMasterWorld, messageType: string, role: AccountRoles): Promise<void> {
        const randIndex = randomInteger(0, 2);
        const type = getMessageType(messageType, randIndex);
        const scenario = this.scenario;
        const studentId = await this.learner.getUserId();
        const isParent = isParentRole(role);
        scenario.set(aliasLearnerRole, role);
        scenario.set(aliasMessageType, type);

        await this.teacher.instruction(
            'Teacher select chat group',
            async function (teacher: TeacherInterface) {
                await teacherSelectConversation(teacher, isParent, studentId);
            }
        );

        await this.teacher.instruction(
            `Teacher send message with ${type}`,
            async function (teacher: TeacherInterface) {
                await teacherSendMessageWithType(teacher, scenario, type);
            }
        );
    }
);

Then(
    'teacher does not see "Read" status next to message in conversation on Teacher App',
    async function (this: IMasterWorld): Promise<void> {
        const teacher = this.teacher;
        await teacher.instruction(
            'Teacher does not see Read status',
            async function (teacher: TeacherInterface) {
                await verifyNotSeesReadStatusAtFirstPosition(teacher);
            }
        );
    }
);

Then(
    'teacher sees "Replied" icon next to chat group in Message list on Teacher App',
    async function (this: IMasterWorld): Promise<void> {
        const teacher = this.teacher;
        const studentId = await this.learner.getUserId();
        const role = this.scenario.get<AccountRoles>(aliasLearnerRole);
        const isParent = isParentRole(role);

        await teacher.instruction(
            'Teacher sees reply icon',
            async function (teacher: TeacherInterface) {
                await teacherSeesReplyStatus(teacher, studentId, isParent);
            }
        );
    }
);

Then(
    '{string} sees chat group with unread message is showed on top on Learner App',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        const studentId = await this.learner.getUserId();
        const messageType = this.scenario.get<MessageType>(aliasMessageType);
        const messageText = this.scenario.get(messageContentKey);
        const content = getContentConversationMessage(messageType, messageText);
        const isParent = isParentRole(role);

        await learner.instruction(`Learner open conversation screen`, async function (learner) {
            await moveLearnerToMessagePage(learner);
        });

        await learner.instruction(`Learner select a conversation detail`, async function (learner) {
            await learnerSelectConversation(learner, isParent, studentId);
        });

        await learner.instruction(
            'Leaner sees unseen message',
            async function (learner: LearnerInterface) {
                await verifyUnreadMessageOnTop(learner, studentId, content, true);
            }
        );
    }
);

Then(
    '{string} sees "Unread" icon next to chat group in Messages list on Learner App',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        const isParent = isParentRole(role);
        const studentId = await this.learner.getUserId();

        await learner.instruction(`Learner open conversation screen`, async function (learner) {
            await moveLearnerToMessagePage(learner);
        });

        await learner.instruction(`Learner select a conversation detail`, async function (learner) {
            await learnerSelectConversation(learner, isParent, studentId);
        });

        await learner.instruction(
            'Learner sees unread status',
            async function (learner: LearnerInterface) {
                await verifyUnreadStatus(learner, studentId, isParent);
            }
        );
    }
);

/// END: Scenario Outline: Teacher sees status that <userAccount> does not read the message in Teacher App

/// BEGIN: Scenario Outline: Teacher sees status that <userAccount> read the message in Teacher App
When(
    '{string} reads the message',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        const isParent = isParentRole(role);
        const studentId = await this.learner.getUserId();

        await learner.instruction(`Learner open conversation screen`, async function (learner) {
            await moveLearnerToMessagePage(learner);
        });

        await learner.instruction(`Learner select a conversation detail`, async function (learner) {
            await learnerSelectConversation(learner, isParent, studentId);
        });
    }
);

Then('teacher sees "Read" status next to message on Teacher App', async function () {
    const teacher = this.teacher;
    await teacher.instruction(
        'Teacher see read status',
        async function (teacher: TeacherInterface) {
            await teacherSeesReadStatusAtFirstPosition(teacher);
        }
    );
});

Then(
    'teacher sees "Replied" icon next to chat group in Messages list on Teacher App',
    async function (this: IMasterWorld): Promise<void> {
        const teacher = this.teacher;
        const studentId = await this.learner.getUserId();
        const role = this.scenario.get<AccountRoles>(aliasLearnerRole);
        const isParent = isParentRole(role);

        await teacher.instruction(
            'Teacher sees reply icon',
            async function (teacher: TeacherInterface) {
                await teacherSeesReplyStatus(teacher, studentId, isParent);
            }
        );
    }
);

Then(
    '{string} sees "Unread" icon next to chat group disappeared in Messages list on Learner App',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        const isParent = isParentRole(role);
        const studentId = await this.learner.getUserId();
        await learner.instruction(
            'Learner not sees unread status',
            async function (learner: LearnerInterface) {
                await verifyUnreadStatusDisappear(learner, studentId, isParent);
            }
        );
    }
);

/// END: Scenario Outline: Teacher sees status that <userAccount> read the message in Teacher App

/// BEGIN: Scenario Outline: Teacher does not reads reply from <userAccount>
Given(
    'teacher selects {string} chat group',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const teacher = this.teacher;
        const isParent = isParentRole(role);
        const studentId = await this.learner.getUserId();

        await teacher.instruction(
            'Teacher select chat group',
            async function (teacher: TeacherInterface) {
                await teacherSelectConversation(teacher, isParent, studentId);
            }
        );
    }
);

Given(
    '{string} sends {string} message to teacher',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        messageType: MessageType
    ): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        const isParent = isParentRole(role);
        const studentId = await this.learner.getUserId();
        const randIndex = randomInteger(0, 2);
        const type = getMessageType(messageType, randIndex);
        const context = this.scenario;
        context.set(aliasLearnerRole, role);
        context.set(aliasMessageType, type);

        await learner.instruction(`Learner open conversation screen`, async function (learner) {
            await moveLearnerToMessagePage(learner);
        });

        await learner.instruction(`Learner select a conversation detail`, async function (learner) {
            await learnerSelectConversation(learner, isParent, studentId);
        });

        await learner.instruction(
            'Learner replies text message',
            async function (learner: LearnerInterface) {
                await learnerSendMessageWithType(learner, context, type);
            }
        );
    }
);

Then(
    'teacher does not see "Replied" icon next to {string} chat group in Messages list on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const teacher = this.teacher;
        const studentId = await this.learner.getUserId();
        const isParent = isParentRole(role);

        await teacher.instruction(
            'Teacher not sees reply',
            async function (teacher: TeacherInterface) {
                await teacherNotSeesReplyStatus(teacher, studentId, isParent);
            }
        );
    }
);

Then(
    'teacher sees "Unread" icon next to {string} chat group in Messages list on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const teacher = this.teacher;
        const studentId = await this.learner.getUserId();
        const isParent = isParentRole(role);

        await teacher.instruction('', async function (teacher: TeacherInterface) {
            await verifyUnreadStatus(teacher, studentId, isParent);
        });
    }
);

Then(
    'teacher sees chat group with unread message shown on top in Messages list on Teacher App',
    async function (this: IMasterWorld): Promise<void> {
        const teacher = this.teacher;
        const studentId = await this.learner.getUserId();
        const messageText = this.scenario.get(messageContentKey);
        const messageType = this.scenario.get<MessageType>(aliasMessageType);
        const content = getContentConversationMessage(messageType, messageText);

        await teacher.instruction(
            'Teacher see chat group on Top',
            async function (teacher: TeacherInterface) {
                await verifyUnreadMessageOnTop(teacher, studentId, content, false);
            }
        );
    }
);

Then(
    '{string} does not see "Read" status next to message on Learner App',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            'Learner not sees read status',
            async function (learner: LearnerInterface) {
                await verifyNotSeesReadStatusAtFirstPosition(learner);
            }
        );
    }
);
/// END: Scenario Outline: Teacher does not reads reply from <userAccount>

/// BEGIN: Teacher reads reply from <userAccount>
Given(
    '{string} replies to teacher',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        const studentId = await this.learner.getUserId();
        const isParent = isParentRole(role);
        const context = this.scenario;

        await learner.instruction(`Learner open conversation screen`, async function (learner) {
            await moveLearnerToMessagePage(learner);
        });

        await learner.instruction(`Learner select a conversation detail`, async function (learner) {
            await learnerSelectConversation(learner, isParent, studentId);
        });

        await learner.instruction(
            'Leaner replies conversation',
            async function (learner: LearnerInterface) {
                await learnerSendMessageWithType(learner, context, MessageType.text);
            }
        );
    }
);

When('teacher read replies', async function (this: IMasterWorld): Promise<void> {
    const teacher = this.teacher;
    const messageText = this.scenario.get(messageContentKey);

    await teacher.instruction(
        'Teacher receive text message',
        async function (teacher: TeacherInterface) {
            await teacherSeesMessage(teacher, MessageType.text, messageText);
        }
    );
});

Then(
    'teacher sees "Unread" icon next to {string} chat group disappeared in Messages list on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const teacher = this.teacher;
        const studentId = await this.learner.getUserId();
        const isParent = isParentRole(role);

        await teacher.instruction(
            'Teacher not sees unread status',
            async function (teacher: TeacherInterface) {
                await verifyUnreadStatusDisappear(teacher, studentId, isParent);
            }
        );
    }
);

Then(
    '{string} does not sees "Read" status next to message on Learner App',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            'Learner not sees Read status',
            async function (learner: LearnerInterface) {
                await verifyNotSeesReadStatusAtFirstPosition(learner);
            }
        );
    }
);
/// END: Teacher reads reply from <userAccount>
