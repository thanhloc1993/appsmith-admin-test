import { Then } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles } from '@supports/app-types';

import { aliasLessonId, aliasLessonName } from './alias-keys/lesson';
import { learnerSeesPollingIconWithActiveStatusOnTeacherApp } from './lesson-hide-or-show-again-polling-definitions';
import { learnerRejoinsOnLearnerApp } from './lesson-rejoin-live-lesson-definitions';
import {
    learnerDoesNotSeePollingIconOnLearnerApp,
    learnerHasToEndLesson,
} from './lesson-teacher-or-student-leaves-lesson-then-rejoin-can-still-see-current-polling-definitions';
import { getLearnerInterfaceFromRole } from './utils';

Then(
    '{string} sees {string} polling icon on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, active: string) {
        const learner = getLearnerInterfaceFromRole(this, role);

        const isPollingIconActive = active === 'active';

        await learner.instruction(
            `${role} sees Poll Button With ${active} Status on Learner App`,
            async function () {
                await learnerSeesPollingIconWithActiveStatusOnTeacherApp(
                    learner,
                    isPollingIconActive
                );
            }
        );
    }
);

Then(
    '{string} rejoins lesson on Learner App after Teacher ends lesson and polling for all',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get(aliasLessonName);
        await learner.instruction(
            `${role} rejoins lesson on Learner App after Teacher ends lesson and polling for all`,
            async function () {
                await learnerHasToEndLesson(learner);
                await learnerRejoinsOnLearnerApp(learner, lessonId, lessonName);
            }
        );
    }
);

Then(
    '{string} does not see polling icon on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} does not see polling icon on Learner App`,
            async function () {
                await learnerDoesNotSeePollingIconOnLearnerApp(learner);
            }
        );
    }
);
