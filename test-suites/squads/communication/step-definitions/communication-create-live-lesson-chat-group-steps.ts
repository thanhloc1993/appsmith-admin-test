import { aliasLessonId, aliasLessonName } from '@legacy-step-definitions/alias-keys/lesson';
import { learnerJoinsLesson } from '@legacy-step-definitions/lesson-learner-join-lesson-definitions';
import { learnerJoinsLessonSuccessfully } from '@legacy-step-definitions/lesson-student-interacts-in-lesson-waiting-room-definitions';
import {
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

import {
    assertLessonConversationDetail,
    learnerSelectLessonChatGroup,
    teacherSelectLessonChatGroup,
} from './communication-create-live-lesson-chat-group-definitions';

When(
    '{string} joins lesson on Learner App',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const scenario = this.scenario;
        const lessonId = scenario.get(aliasLessonId);
        const lessonName = scenario.get(aliasLessonName);
        const learner = getLearnerInterfaceFromRole(this, accountRole);
        await learner.instruction('student joins lesson on Learner App', async function () {
            await learnerJoinsLesson(learner, lessonId, lessonName);
            await learnerJoinsLessonSuccessfully(learner);
        });
    }
);

Then(
    '{string} sees lesson chat group is created',
    async function (this: IMasterWorld, accountRole: AccountRoles): Promise<void> {
        const isTeacherAccount = isTeacherRole(accountRole);

        if (isTeacherAccount) {
            const teacher = getTeacherInterfaceFromRole(this, accountRole);
            await teacher.instruction(
                'select lesson chat group',
                async function (teacher: TeacherInterface) {
                    await teacherSelectLessonChatGroup(teacher);
                }
            );
            await teacher.instruction(
                'sees lesson chat group',
                async function (teacher: TeacherInterface) {
                    await assertLessonConversationDetail(teacher);
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
                'sees lesson chat group',
                async function (learner: LearnerInterface) {
                    await assertLessonConversationDetail(learner);
                }
            );
        }
    }
);
