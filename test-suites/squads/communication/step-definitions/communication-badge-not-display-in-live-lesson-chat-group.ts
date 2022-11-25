import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    isTeacherRole,
} from '@legacy-step-definitions/utils';

import { Given, Then } from '@cucumber/cucumber';

import {
    AccountRoles,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';

import { verifyUnreadBadgeNotDisplayInLiveLesson } from './communication-badge-display-in-live-lesson-chat-group-definitions';
import {
    learnerSelectLessonChatGroup,
    teacherSelectLessonChatGroup,
} from './communication-create-live-lesson-chat-group-definitions';

Given(
    '{string} has opened lesson chat group',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const isTeacherAccount = isTeacherRole(accountRole);

        if (isTeacherAccount) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                'Teacher select lesson chat group',
                async function (teacher: TeacherInterface) {
                    await teacherSelectLessonChatGroup(teacher);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            await learner.instruction(
                'Student select lesson chat group',
                async function (learner: LearnerInterface) {
                    await learnerSelectLessonChatGroup(learner);
                }
            );
        }
    }
);

Then(
    '{string} sees unread badge is not displayed',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const isTeacherAccount = isTeacherRole(accountRole);

        if (isTeacherAccount) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                'Teacher sees unread badge is not displayed',
                async function (teacher: TeacherInterface) {
                    await verifyUnreadBadgeNotDisplayInLiveLesson(teacher);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            await learner.instruction(
                'Student sees unread badge is not displayed',
                async function (learner: LearnerInterface) {
                    await verifyUnreadBadgeNotDisplayInLiveLesson(learner);
                }
            );
        }
    }
);
