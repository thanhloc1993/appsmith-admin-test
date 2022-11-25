import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    isTeacherRole,
} from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import {
    AccountRoles,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';

import { verifyUnreadBadgeDisplayInLiveLesson } from './communication-badge-display-in-live-lesson-chat-group-definitions';

Then(
    '{string} sees unread badge is displayed',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const isTeacherAccount = isTeacherRole(accountRole);

        if (isTeacherAccount) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                'Teacher sees unread badge is displayed',
                async function (teacher: TeacherInterface) {
                    await verifyUnreadBadgeDisplayInLiveLesson(teacher);
                }
            );
        } else {
            const learner = getLearnerInterfaceFromRole(this, accountRole);
            await learner.instruction(
                'Student sees unread badge is displayed',
                async function (learner: LearnerInterface) {
                    await verifyUnreadBadgeDisplayInLiveLesson(learner);
                }
            );
        }
    }
);
