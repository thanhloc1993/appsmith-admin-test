import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld, LearnerInterface } from '@supports/app-types';

import { aliasLessonId, aliasLessonName } from './alias-keys/lesson';
import { learnerGoToLesson } from './lesson-learner-join-lesson-definitions';
import { learnerCanNotJoinLessonOnLearnerApp } from './lesson-student-can-not-join-lesson-definitions';
import { learnerIsInWaitingRoom } from './lesson-student-interacts-in-lesson-waiting-room-definitions';
import { getLearnerInterfaceFromRole } from './utils';
import { learnerTapsLeaveForNowButton } from 'step-definitions/lesson-leave-lesson-definitions';

Given(
    '{string} has gone to lesson tab on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} has gone to lesson tab on Learner App`,
            async function () {
                await learnerGoToLesson(learner);
            }
        );
    }
);
When(
    '{string} goes to lesson tab on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} goes to lesson tab on Learner App`, async function () {
            await learnerGoToLesson(learner);
        });
    }
);

Then(
    '{string} can not join lesson on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get(aliasLessonName);
        await learner.instruction(
            `${role} can not join lesson on Learner App with lesson id is ${lessonId}`,
            async function (this: LearnerInterface) {
                await learnerCanNotJoinLessonOnLearnerApp(learner, lessonId, lessonName);
            }
        );
    }
);

Then(
    '{string} is directed to lesson waiting room on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} is directed to lesson waiting room on Learner App`,
            async function (this: LearnerInterface) {
                await learnerIsInWaitingRoom(learner);
            }
        );
    }
);

Then('{string} leaves lesson for now', async function (this: IMasterWorld, role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(
        `${role} leaves lesson from waiting room`,
        async function (this: LearnerInterface) {
            await learnerTapsLeaveForNowButton(learner);
        }
    );
});
