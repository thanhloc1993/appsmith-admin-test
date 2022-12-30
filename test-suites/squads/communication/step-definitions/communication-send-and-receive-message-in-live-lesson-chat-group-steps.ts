import {
    delay,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    isTeacherRole,
} from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import {
    AccountRoles,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';

import { aliasAccountRole, aliasMessageType, messageContentKey } from './alias-keys/communication';
import { MessageType } from './communication-common-definitions';
import {
    learnerSelectLessonChatGroup,
    teacherSelectLessonChatGroup,
} from './communication-create-live-lesson-chat-group-definitions';
import { teacherSeesMessageIsSent } from './communication-send-message-definitions';
import {
    learnerSeesMessage,
    learnerSendMessageWithType,
    teacherSeesMessage,
    teacherSendMessageWithType,
} from './communication-send-receive-message-definitions';

When(
    '{string} sends a text message',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const isTeacherAccount = isTeacherRole(accountRole);
        const scenario = this.scenario;
        scenario.set(aliasMessageType, MessageType.text);
        scenario.set(aliasAccountRole, accountRole);

        if (isTeacherAccount) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                'select lesson chat group',
                async function (teacher: TeacherInterface) {
                    await teacherSelectLessonChatGroup(teacher);
                }
            );
            //We have to wait for the conversation to be synced before we can send a new message
            await delay(10000);

            await teacher.instruction(
                'send text message',
                async function (teacher: TeacherInterface) {
                    await teacherSendMessageWithType(teacher, scenario, MessageType.text);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            await learner.instruction(
                'select lesson chat group',
                async function (learner: LearnerInterface) {
                    await learnerSelectLessonChatGroup(learner);
                }
            );
            //We have to wait for the conversation to be synced before we can send a new message
            await delay(10000);

            await learner.instruction(
                'send text message',
                async function (learner: LearnerInterface) {
                    await learnerSendMessageWithType(learner, scenario, MessageType.text);
                }
            );
        }
    }
);

Then(
    '{string} sees message display in lesson chat box',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const isTeacherAccount = isTeacherRole(accountRole);
        const messageText = this.scenario.get<string>(messageContentKey);
        const senderRole = this.scenario.get<AccountRoles>(aliasAccountRole);

        if (accountRole == senderRole) {
            const isTeacherSenderAccount = isTeacherRole(senderRole);
            if (isTeacherSenderAccount) {
                const teacher = getTeacherInterfaceFromRole(this, senderRole);
                await teacher.instruction(
                    'sees text message is sent',
                    async function (teacher: TeacherInterface) {
                        await teacherSeesMessageIsSent(teacher, MessageType.text, messageText);
                    }
                );
            } else {
                const learner = getLearnerInterfaceFromRole(this, senderRole);
                await learner.instruction(
                    'sess text message is sent',
                    async function (learner: LearnerInterface) {
                        await learnerSeesMessage(learner, MessageType.text, messageText);
                    }
                );
            }
        } else {
            if (isTeacherAccount) {
                const teacher = getTeacherInterfaceFromRole(this, accountRole);
                await teacher.instruction(
                    'select lesson chat group',
                    async function (teacher: TeacherInterface) {
                        await teacherSelectLessonChatGroup(teacher);
                    }
                );

                await teacher.instruction(
                    'sees text message',
                    async function (teacher: TeacherInterface) {
                        await teacherSeesMessage(teacher, MessageType.text, messageText);
                    }
                );
            } else {
                const learner = getLearnerInterfaceFromRole(this, accountRole);
                await learner.instruction(
                    'select lesson chat group',
                    async function (learner: LearnerInterface) {
                        await learnerSelectLessonChatGroup(learner);
                    }
                );

                await learner.instruction(
                    `sees text message`,
                    async function (learner: LearnerInterface) {
                        await learnerSeesMessage(learner, MessageType.text, messageText);
                    }
                );
            }
        }
    }
);
