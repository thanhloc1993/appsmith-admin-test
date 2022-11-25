import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld, LearnerInterface } from '@supports/app-types';

import {
    interactiveEndLessonLearner,
    learnerJoinsLesson,
} from './lesson-learner-join-lesson-definitions';
import { userIsShownInListCameraOnLearnerApp } from './lesson-leave-lesson-definitions';
import { learnerJoinsLessonSuccessfully } from './lesson-student-interacts-in-lesson-waiting-room-definitions';
import { getUserIdFromRole } from './lesson-utils';
import { getLearnerInterfaceFromRole } from './utils';
import { aliasLessonId, aliasLessonName } from 'step-definitions/alias-keys/lesson';

Given(
    '{string} has joined lesson on Learner App',
    { timeout: 100 * 1000 },
    async function (this: IMasterWorld, learnerRole: AccountRoles) {
        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get(aliasLessonName);
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        await learner.instruction('student joins lesson on Learner App', async function () {
            await learnerJoinsLesson(learner, lessonId, lessonName);
            await learnerJoinsLessonSuccessfully(learner);
        });
    }
);

Then(
    'student sees all teacher in gallery view on Learner App',
    async function (this: IMasterWorld) {
        const masterWorld = this!;
        await this.learner.instruction(
            'student sees all teacher in gallery view on Learner App',
            async function (learner) {
                const teacherRoles = ['teacher T1', 'teacher T2'] as AccountRoles[];
                for (const teacherRole of teacherRoles) {
                    const teacherId = getUserIdFromRole(masterWorld, teacherRole);
                    await userIsShownInListCameraOnLearnerApp(learner, teacherId, true);
                }
            }
        );
    }
);

Then(
    '{string} ends lesson on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction('student ends lesson', async function (this: LearnerInterface) {
            await interactiveEndLessonLearner(this);
        });
    }
);

When(
    '{string} goes to lesson waiting room on Learner App',
    async function (this: IMasterWorld, learnerRole: AccountRoles) {
        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get(aliasLessonName);
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        await learner.instruction(
            `${learnerRole} goes to lesson waiting room on Learner App`,
            async function (learner) {
                await learnerJoinsLesson(learner, lessonId, lessonName);
            }
        );
    }
);
