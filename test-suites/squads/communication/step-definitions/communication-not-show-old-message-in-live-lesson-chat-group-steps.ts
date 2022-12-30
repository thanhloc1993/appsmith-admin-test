import {
    teacherEndsLessonForAllOnTeacherApp,
    learnerHaveToEndLesson,
    teacherLeavesLessonOnTeacherApp,
    learnerLeavesLessonOnLearnerApp,
} from '@legacy-step-definitions/lesson-leave-lesson-definitions';
import {
    delay,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    isTeacherRole,
    splitRolesStringToAccountRoles,
} from '@legacy-step-definitions/utils';

import { Given, Then } from '@cucumber/cucumber';

import {
    AccountRoles,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';

import { aliasAccountRoles, aliasMessageType } from './alias-keys/communication';
import { MessageType } from './communication-common-definitions';
import {
    learnerSelectLessonChatGroup,
    teacherSelectLessonChatGroup,
} from './communication-create-live-lesson-chat-group-definitions';
import { verifyLessonConversationIsEmpty } from './communication-not-show-old-message-in-live-lesson-chat-group-definitions';
import {
    learnerSendMessageWithType,
    teacherSendMessageWithType,
} from './communication-send-receive-message-definitions';

Given(
    '{string} have sent message in lesson chat group',
    async function (this: IMasterWorld, roles: string): Promise<void> {
        const accountRoles = splitRolesStringToAccountRoles(roles);
        const scenario = this.scenario;
        scenario.set(aliasMessageType, MessageType.text);
        scenario.set(aliasAccountRoles, accountRoles);
        for (const val of accountRoles) {
            const isTeacherAccount = isTeacherRole(val);
            if (isTeacherAccount) {
                const teacher = getTeacherInterfaceFromRole(this, val);
                await teacher.instruction(
                    `${val} open lesson conversation`,
                    async function (teacher: TeacherInterface) {
                        await teacherSelectLessonChatGroup(teacher);
                    }
                );
                //We have to wait for the conversation to be synced before we can send a new message
                await delay(10000);

                await teacher.instruction(
                    `${val} sends text message`,
                    async function (teacher: TeacherInterface) {
                        await teacherSendMessageWithType(teacher, scenario, MessageType.text);
                    }
                );
            } else {
                const learner = getLearnerInterfaceFromRole(this, val);
                await learner.instruction(
                    `${val} open lesson conversation`,
                    async function (learner: LearnerInterface) {
                        await learnerSelectLessonChatGroup(learner);
                    }
                );
                //We have to wait for the conversation to be synced before we can send a new message
                await delay(10000);

                await learner.instruction(
                    `${val} send text message`,
                    async function (learner: LearnerInterface) {
                        await learnerSendMessageWithType(learner, scenario, MessageType.text);
                    }
                );
            }
        }
    }
);

Given(
    '{string} has ended lesson for all on Teacher App',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const teacher = getTeacherInterfaceFromRole(this, accountRole);
        await teacher.instruction(
            `${accountRole} ends lesson for all`,
            async function (teacher: TeacherInterface) {
                await teacherEndsLessonForAllOnTeacherApp(teacher);
            }
        );

        const learner = this.learner;
        await learner.instruction(
            'learner end lesson after receive end all',
            async function (learner: LearnerInterface) {
                await learnerHaveToEndLesson(learner);
            }
        );
    }
);

Then(
    '{string} does not sees old message of the previous session',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const isTeacherAccount = isTeacherRole(accountRole);
        if (isTeacherAccount) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                'open lesson conversation',
                async function (teacher: TeacherInterface) {
                    await teacherSelectLessonChatGroup(teacher);
                }
            );

            await teacher.instruction(
                'verify lesson conversation is empty',
                async function (teacher: TeacherInterface) {
                    await verifyLessonConversationIsEmpty(teacher);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            await learner.instruction(
                'open lesson conversation',
                async function (learner: LearnerInterface) {
                    await learnerSelectLessonChatGroup(learner);
                }
            );

            await learner.instruction(
                'verify lesson conversation is empty',
                async function (learner: LearnerInterface) {
                    await verifyLessonConversationIsEmpty(learner);
                }
            );
        }
    }
);

Given('all members leave lesson', async function (this: IMasterWorld): Promise<void> {
    const accountRoles = this.scenario.get<AccountRoles[]>(aliasAccountRoles);
    for (const val of accountRoles) {
        const isTeacher = isTeacherRole(val);
        if (isTeacher) {
            const teacher = getTeacherInterfaceFromRole(this, val);
            await teacher.instruction(
                'teacher leaves lesson conversation',
                async function (teacher: TeacherInterface) {
                    await teacherLeavesLessonOnTeacherApp(teacher);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, val);
            await learner.instruction(
                'learner leaves lesson conversation',
                async function (learner: LearnerInterface) {
                    await learnerLeavesLessonOnLearnerApp(learner);
                }
            );
        }
    }
});
