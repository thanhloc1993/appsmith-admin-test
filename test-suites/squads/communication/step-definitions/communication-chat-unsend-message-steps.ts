import {
    getLearnerInterfaceFromRole,
    getStudentIdFromContextWithAccountRole,
    getTeacherInterfaceFromRole,
    isParentRole,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import { messageContentKey } from './alias-keys/communication';
import {
    learnerAccessesChatGroup,
    userSeesTheMessageChangesToDeleted,
    userUnsendTheMessage,
} from './communication-chat-unsend-message-definitions';
import { MessageType, teacherSelectConversation } from './communication-common-definitions';
import { teacherSeesMessageIsSent } from './communication-send-message-definitions';
import {
    learnerSendMessageWithType,
    teacherSendMessageWithType,
} from './communication-send-receive-message-definitions';

export type MessageTypes = 'text' | 'attachment' | 'image';

Given(
    '{string} has sent {string} message to {string}',
    { timeout: 60000 },
    async function (
        this: IMasterWorld,
        senderRole: AccountRoles,
        messageType: MessageType,
        receiverRole: AccountRoles
    ) {
        const scenario = this.scenario;
        if (senderRole === 'teacher') {
            const teacher = getTeacherInterfaceFromRole(this, senderRole);
            await teacher.instruction(
                `Teacher accesses chat group and send the message`,
                async function (teacher) {
                    const studentId = getStudentIdFromContextWithAccountRole(
                        scenario,
                        receiverRole
                    );
                    const isParent = isParentRole(receiverRole);
                    await teacherSelectConversation(teacher, isParent, studentId);
                    await teacherSendMessageWithType(teacher, scenario, messageType);
                    await teacherSeesMessageIsSent(
                        teacher,
                        messageType,
                        scenario.get<string>(messageContentKey)
                    );
                }
            );
        } else {
            const teacher = getTeacherInterfaceFromRole(this, receiverRole);
            await teacher.instruction(`Teacher accesses chat group`, async function (teacher) {
                const studentId = getStudentIdFromContextWithAccountRole(scenario, senderRole);
                const isParent = isParentRole(senderRole);
                await teacherSelectConversation(teacher, isParent, studentId);
            });

            const learner = getLearnerInterfaceFromRole(this, senderRole);
            await learner.instruction(
                `${learner} accesses chat group and send ${messageType} message`,
                async function (learner) {
                    await learnerAccessesChatGroup(learner, senderRole);
                    await learnerSendMessageWithType(learner, scenario, messageType);
                }
            );
        }
    }
);

When(
    '{string} unsend the {string} message',
    async function (this: IMasterWorld, senderRole: AccountRoles, messageType: MessageType) {
        const scenario = this.scenario;
        if (senderRole === 'teacher') {
            const teacher = getTeacherInterfaceFromRole(this, senderRole);
            await teacher.instruction(
                `${teacher} unsend the ${messageType} message`,
                async function (teacher) {
                    await userUnsendTheMessage(scenario, teacher.flutterDriver!, messageType);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, senderRole);

            await learner.instruction(
                `${learner} unsend the ${messageType} message`,
                async function (learner) {
                    await userUnsendTheMessage(scenario, learner.flutterDriver!, messageType);
                }
            );
        }
    }
);

Then(
    '{string} sees {string} message changes to deleted',
    async function (this: IMasterWorld, role: AccountRoles, messageType: MessageType) {
        if (role === 'teacher') {
            const teacher = getTeacherInterfaceFromRole(this, role);
            await teacher.instruction(
                `${teacher} unsend the ${messageType} message`,
                async function (teacher) {
                    await userSeesTheMessageChangesToDeleted(teacher.flutterDriver!);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, role);

            await learner.instruction(
                `${learner} unsend the ${messageType} message`,
                async function (learner) {
                    await userSeesTheMessageChangesToDeleted(learner.flutterDriver!);
                }
            );
        }
    }
);
