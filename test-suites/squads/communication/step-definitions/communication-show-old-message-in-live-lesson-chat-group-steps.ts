import { aliasLessonId, aliasLessonName } from '@legacy-step-definitions/alias-keys/lesson';
import {
    learnerLeavesLessonOnLearnerApp,
    teacherLeavesLessonOnTeacherApp,
} from '@legacy-step-definitions/lesson-leave-lesson-definitions';
import { learnerRejoinsOnLearnerApp } from '@legacy-step-definitions/lesson-rejoin-live-lesson-definitions';
import { teacherJoinsLesson } from '@legacy-step-definitions/lesson-teacher-join-lesson-definitions';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    isTeacherRole,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import {
    AccountRoles,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';

import { aliasMessageType, messageContentKey } from './alias-keys/communication';
import { MessageType } from './communication-common-definitions';
import {
    learnerSelectLessonChatGroup,
    teacherSelectLessonChatGroup,
} from './communication-create-live-lesson-chat-group-definitions';
import { teacherSeesMessageIsSent } from './communication-send-message-definitions';
import {
    learnerSeesMessage,
    learnerSendMessageWithType,
    teacherSendMessageWithType,
} from './communication-send-receive-message-definitions';

Given(
    '{string} has left lesson',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const isTeacher = isTeacherRole(accountRole);
        if (isTeacher) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                `${accountRole} leaves lesson conversation`,
                async function (teacher: TeacherInterface) {
                    await teacherLeavesLessonOnTeacherApp(teacher);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            await learner.instruction(
                `${accountRole} leaves lesson conversation`,
                async function (learner: LearnerInterface) {
                    await learnerLeavesLessonOnLearnerApp(learner);
                }
            );
        }
    }
);

When(
    '{string} rejoins lesson',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const isTeacher = isTeacherRole(accountRole);
        if (isTeacher) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                `${accountRole} rejoins lesson on Teacher App`,
                async function () {
                    await teacherJoinsLesson(teacher, true);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            const lessonId = this.scenario.get(aliasLessonId);
            const lessonName = this.scenario.get(aliasLessonName);
            await learner.instruction(
                `${accountRole} rejoins lesson on Learner App`,
                async function () {
                    await learnerRejoinsOnLearnerApp(learner, lessonId, lessonName);
                }
            );
        }
    }
);

Then(
    '{string} sees old message display in lesson chat box',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const isTeacher = isTeacherRole(accountRole);
        const messageText = this.scenario.get<string>(messageContentKey);

        if (isTeacher) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                `${accountRole} open lesson conversation`,
                async function (teacher: TeacherInterface) {
                    await teacherSelectLessonChatGroup(teacher);
                }
            );

            await teacher.instruction(
                `${accountRole} see old messages`,
                async function (teacher: TeacherInterface) {
                    await teacherSeesMessageIsSent(teacher, MessageType.text, messageText);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            await learner.instruction(
                `${accountRole} open lesson conversation`,
                async function (learner: LearnerInterface) {
                    await learnerSelectLessonChatGroup(learner);
                }
            );

            await learner.instruction(
                `${accountRole} see old messages`,
                async function (learner: LearnerInterface) {
                    await learnerSeesMessage(learner, MessageType.text, messageText);
                }
            );
        }
    }
);

Given(
    '{string} has sent new message',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const scenario = this.scenario;
        scenario.set(aliasMessageType, MessageType.text);

        const isTeacher = isTeacherRole(accountRole);
        if (isTeacher) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                `${accountRole} sends text message`,
                async function (teacher: TeacherInterface) {
                    await teacherSendMessageWithType(teacher, scenario, MessageType.text);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            await learner.instruction(
                `${accountRole} send text message`,
                async function (learner: LearnerInterface) {
                    await learnerSendMessageWithType(learner, scenario, MessageType.text);
                }
            );
        }
    }
);

Then(
    '{string} sees old message and new message display in lesson chat box',
    async function (this: IMasterWorld, accountRoles: AccountRoles): Promise<void> {
        const isTeacherAccount = isTeacherRole(accountRoles);
        const messageText = this.scenario.get<string>(messageContentKey);
        if (isTeacherAccount) {
            const teacher = getTeacherInterfaceFromRole(this, accountRoles);
            await teacher.instruction(
                `${accountRoles} open lesson conversation`,
                async function (teacher: TeacherInterface) {
                    await teacherSelectLessonChatGroup(teacher);
                }
            );
            await teacher.instruction(
                `${accountRoles} see old messages`,
                async function (teacher: TeacherInterface) {
                    await teacherSeesMessageIsSent(teacher, MessageType.text, messageText);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, accountRoles);
            await learner.instruction(
                `${accountRoles} open lesson conversation`,
                async function (learner: LearnerInterface) {
                    await learnerSelectLessonChatGroup(learner);
                }
            );

            await learner.instruction(
                `${accountRoles} see old messages`,
                async function (learner: LearnerInterface) {
                    await learnerSeesMessage(learner, MessageType.text, messageText);
                }
            );
        }
    }
);
