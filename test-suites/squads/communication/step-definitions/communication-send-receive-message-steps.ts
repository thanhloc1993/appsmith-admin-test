import {
    getLearnerInterfaceFromRole,
    getStudentIdFromContextWithAccountRole,
    getTeacherInterfaceFromRole,
    isParentRole,
    isTeacherRole,
    randomInteger,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { aliasMessageType, messageContentKey } from './alias-keys/communication';
import {
    getAccountType,
    getMessageType,
    MessageType,
    AccountType,
    learnerSelectConversation,
    verifySenderAvatar,
    verifySenderName,
} from './communication-common-definitions';
import {
    learnerReceiveMessage,
    teacherSeesMessageIsSent,
} from './communication-send-message-definitions';
import {
    learnerInteractWithMessageType,
    learnerSeesMessage,
    learnerOpenedViewerMessage,
    teacherSeesMessage,
    teacherSendMessageWithType,
    learnerSendMessageWithType,
    teacherSendFileImageMessage,
    teacherInteractWithMessageType,
    teacherOpenedViewerMessage,
} from './communication-send-receive-message-definitions';

/// Scenario Outline: Teacher sends <messageType> message to <userAccount> chat group on Teacher App
When(
    'teacher sends {string} to the conversation on Teacher App',
    async function (this: IMasterWorld, messageType: string): Promise<void> {
        const numberOfTypes = messageType.split(',').length - 1;
        const randIndex = randomInteger(0, numberOfTypes);
        const type = getMessageType(messageType, randIndex);
        const scenario = this.scenario;
        const teacher = this.teacher;

        scenario.set(aliasMessageType, type);
        await teacher.instruction(`Teacher send message with ${type}`, async function (teacher) {
            await teacherSendMessageWithType(teacher, scenario, type);
        });
    }
);

Then('"messageType" is sent', async function (this: IMasterWorld): Promise<void> {
    const messageType = this.scenario.get<MessageType>(aliasMessageType);
    const messageText = this.scenario.get<string>(messageContentKey);
    const teacher = this.teacher;

    await teacher.instruction(`${messageType} is sent`, async function (teacher) {
        await teacherSeesMessageIsSent(teacher, messageType, messageText);
    });
});

/// Scenario Outline: <userAccount>sends < messageType > message to teacher on Learner App
When(
    '{string} sends {string} to the conversation on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, messageType: string): Promise<void> {
        const numberOfTypes = messageType.split(',').length - 1;
        const randIndex = randomInteger(0, numberOfTypes);
        const type = getMessageType(messageType, randIndex);
        const scenario = this.scenario;
        const learner = getLearnerInterfaceFromRole(this, role);
        scenario.set(aliasMessageType, type);

        await learner.instruction(`${learner} send message with ${type}`, async function (learner) {
            await learnerSendMessageWithType(learner, scenario, type);
        });
    }
);

Then(
    '{string} of {string} sees message with "messageType" on Learner App',
    async function (
        this: IMasterWorld,
        parentRole: AccountRoles,
        learnerRole: AccountRoles
    ): Promise<void> {
        const parent = getLearnerInterfaceFromRole(this, parentRole);
        const messageType = this.scenario.get<MessageType>(aliasMessageType);
        const messageText = this.scenario.get<string>(messageContentKey);
        const isParent = isParentRole(parentRole);
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, learnerRole);

        await parent.instruction(`Select a conversation detail`, async function (learner) {
            await learnerSelectConversation(learner, isParent, studentId);
        });

        await parent.instruction(`Learner sees message ${messageType}`, async function (learner) {
            await learnerSeesMessage(learner, messageType, messageText);
        });
    }
);

Then(
    'teacher sees "messageType" on Teacher App',
    async function (this: IMasterWorld): Promise<void> {
        const teacher = this.teacher;
        const messageType = this.scenario.get<MessageType>(aliasMessageType);
        const messageText = this.scenario.get<string>(messageContentKey);

        await teacher.instruction(
            `${teacher} sees ${messageType} message on teacher app`,
            async function (teacher) {
                await teacherSeesMessage(teacher, messageType, messageText);
            }
        );
    }
);

/// Scenario Outline: <member> open hyperlink in pdf file of <userAccount> chat group
Given(
    'teacher has sent pdf with hyperlink in the content to the conversation',
    async function (this: IMasterWorld): Promise<void> {
        const teacher = this.teacher;
        const context = this.scenario;

        await teacher.instruction('Teacher send pdf message', async function (teacher) {
            await teacherSendMessageWithType(teacher, context, MessageType.pdf);
        });
    }
);

When(
    '{string} views the detail of pdf file',
    async function (this: IMasterWorld, members: string): Promise<void> {
        const randIndex = randomInteger(0, 1);
        const accountType = getAccountType(members, randIndex);

        switch (accountType) {
            case AccountType.student: {
                await this.learner.instruction(
                    'Leaner received pdf message',
                    async function (learner) {
                        await learnerReceiveMessage(learner, MessageType.pdf);
                    }
                );
                break;
            }

            case AccountType.parent: {
                await this.parent.instruction(
                    'Leaner received pdf message',
                    async function (learner) {
                        await learnerReceiveMessage(learner, MessageType.pdf);
                    }
                );
                break;
            }

            case AccountType.teacher: {
                await this.teacher.instruction(
                    'Teacher sent pdf message',
                    async function (teacher) {
                        await teacherSeesMessageIsSent(teacher, MessageType.pdf);
                    }
                );
                break;
            }
        }
    }
);

When(
    '{string} interacts with hyperlink',
    async function (this: IMasterWorld, members: string): Promise<void> {
        const randIndex = randomInteger(0, 1);
        const accountType = getAccountType(members, randIndex);

        switch (accountType) {
            case AccountType.student: {
                await this.learner.instruction(
                    'Student click pdf message',
                    async function (learner) {
                        await learnerInteractWithMessageType(learner, MessageType.pdf);
                    }
                );
                break;
            }

            case AccountType.parent: {
                await this.parent.instruction('Parent click pdf message', async function (learner) {
                    await learnerInteractWithMessageType(learner, MessageType.pdf);
                });
                break;
            }

            case AccountType.teacher: {
                await this.teacher.instruction(
                    'Teacher click on message sent',
                    async function (teacher) {
                        await teacherInteractWithMessageType(teacher, MessageType.pdf);
                    }
                );
                break;
            }
        }
    }
);

Then(
    '{string} redirects to web browser',
    async function (this: IMasterWorld, members: string): Promise<void> {
        const randIndex = randomInteger(0, 1);
        const accountType = getAccountType(members, randIndex);
        switch (accountType) {
            case AccountType.student: {
                await this.learner.instruction(
                    'Leaner is in pdf message detail',
                    async function (learner) {
                        await learnerOpenedViewerMessage(learner, MessageType.pdf);
                    }
                );
                break;
            }

            case AccountType.parent: {
                await this.parent.instruction(
                    'Parent is in pdf message detail',
                    async function (learner) {
                        await learnerOpenedViewerMessage(learner, MessageType.pdf);
                    }
                );
                break;
            }

            case AccountType.teacher: {
                await this.teacher.instruction(
                    'Leaner is in pdf message detail',
                    async function (teacher) {
                        await teacherOpenedViewerMessage(teacher, MessageType.pdf);
                    }
                );
                break;
            }
        }
    }
);

/// Scenario Outline: <userAccount> opens <messageType> message
Given(
    'teacher has sent {string} message to {string} chat group',
    async function (this: IMasterWorld, messageType: string, role: AccountRoles): Promise<void> {
        const randIndex = randomInteger(0, 1);
        const type = getMessageType(messageType, randIndex);
        this.scenario.set(aliasMessageType, type);
        const teacher = this.teacher!;

        await teacher.instruction(
            `Teacher send message ${type} to ${role}`,
            async function (teacher) {
                await teacherSendFileImageMessage(teacher, type);
            }
        );

        await teacher.instruction(
            `Teacher sees message ${messageType} has sent`,
            async function (teacher) {
                await teacherSeesMessage(teacher, type);
            }
        );
    }
);

When(
    '{string} interacts "messageType" message',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const messageType = this.scenario.get<MessageType>(aliasMessageType);
        const learner = getLearnerInterfaceFromRole(this, role);
        const isParent = isParentRole(role);
        const studentId = await this.learner.getUserId();

        await learner.instruction(`Select a conversation detail`, async function (learner) {
            await learnerSelectConversation(learner, isParent, studentId);
        });

        await learner.instruction(
            `Learner click on message ${messageType}`,
            async function (learner) {
                await learnerInteractWithMessageType(learner, messageType);
            }
        );
    }
);

Then(
    '{string} sees "messageType" display in detail',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const learner = getLearnerInterfaceFromRole(this, role);
        const messageType = this.scenario.get<MessageType>(aliasMessageType);

        await learner.instruction(
            `${role} view detail message ${messageType}`,
            async function (learner) {
                await learnerOpenedViewerMessage(learner, messageType);
            }
        );
    }
);

Then(
    '{string} sees message of {string} with name and avatar on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles, accountRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const isTeacher = isTeacherRole(accountRole);

        const scenario = this.scenario;
        const senderProfile = scenario.get(
            isTeacher
                ? staffProfileAliasWithAccountRoleSuffix(accountRole)
                : learnerProfileAliasWithAccountRoleSuffix(accountRole)
        ) as UserProfileEntity;
        const studentId = await this.learner.getUserId();

        const messageType = scenario.get<MessageType>(aliasMessageType);
        const messageText = scenario.get<string>(messageContentKey);

        await teacher.instruction(
            `${teacher} sees ${messageType} message on teacher app`,
            async function (teacher) {
                await teacherSeesMessage(teacher, messageType, messageText);
            }
        );

        await teacher.instruction(
            `${teacherRole} sees message with ${accountRole} name & avatar`,
            async function () {
                await verifySenderName(teacher, senderProfile.name, studentId);
                await verifySenderAvatar(teacher, senderProfile.avatar, studentId);
            }
        );
    }
);

Then(
    '{string} sees {string} of {string} message with name and avatar on Teacher App',
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        accountRole: AccountRoles,
        learnerRole: AccountRoles
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const isTeacher = isTeacherRole(accountRole);
        const scenario = this.scenario;

        let senderProfile: UserProfileEntity;
        if (isTeacher) {
            senderProfile = scenario.get(staffProfileAliasWithAccountRoleSuffix(accountRole));
        } else {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            senderProfile = await learner.getProfile();
        }
        const studentId = getStudentIdFromContextWithAccountRole(scenario, learnerRole);

        const messageType = scenario.get<MessageType>(aliasMessageType);
        const messageText = scenario.get<string>(messageContentKey);

        await teacher.instruction(
            `${teacher} sees ${messageType} message on teacher app`,
            async function (teacher) {
                await teacherSeesMessage(teacher, messageType, messageText);
            }
        );

        await teacher.instruction(
            `${teacherRole} sees message with ${accountRole} name & avatar`,
            async function () {
                await verifySenderName(teacher, senderProfile.name, studentId);
                await verifySenderAvatar(teacher, senderProfile.avatar, studentId);
            }
        );
    }
);
