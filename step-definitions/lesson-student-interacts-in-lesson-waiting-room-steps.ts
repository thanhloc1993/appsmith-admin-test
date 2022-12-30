import { Given, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasLessonId, aliasLessonName } from './alias-keys/lesson';
import { learnerJoinsLesson } from './lesson-learner-join-lesson-definitions';
import { learnerTapsLeaveForNowButton } from './lesson-leave-lesson-definitions';
import { learnerIsInWaitingRoom } from './lesson-student-interacts-in-lesson-waiting-room-definitions';
import { getLearnerInterfaceFromRole } from './utils';

Given(
    `{string} has joined lesson's waiting room on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get(aliasLessonName);

        await learner.instruction(
            `${role} has joined lesson's waiting room on Learner App`,
            async function () {
                await learnerJoinsLesson(learner, lessonId, lessonName);
                await learnerIsInWaitingRoom(learner);
            }
        );
    }
);

When(
    '{string} leaves lesson while in waiting room on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} leaves lesson while in waiting room on Learner App`,
            async function () {
                await learnerTapsLeaveForNowButton(learner);
            }
        );
    }
);
