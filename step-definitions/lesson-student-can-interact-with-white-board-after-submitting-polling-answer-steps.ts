import { Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    learnerSeesRespectiveIconInWhiteBoardBarOnLearnerApp,
    learnerSelectsAnnotationToolOnLearnerApp,
    learnerSelectsOptionInPollingAnswerBar,
    LessonWhiteBoardAnnotationToolIconType,
    LessonWhiteBoardAnnotationToolType,
} from './lesson-student-can-interact-with-white-board-after-submitting-polling-answer-definitions';
import { getLearnerInterfaceFromRole } from './utils';

When(
    '{string} selects {string} option in polling answer bar on Learner App',
    async function (role: AccountRoles, option: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} selects ${option} option in polling answer bar on Learner App`,
            async function () {
                await learnerSelectsOptionInPollingAnswerBar(learner, option);
            }
        );
    }
);

When(
    '{string} selects {string} in white board bar on Learner App',
    async function (role: AccountRoles, tool: LessonWhiteBoardAnnotationToolType) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} selects ${tool} in white board bar on Learner App`,
            async function () {
                await learnerSelectsAnnotationToolOnLearnerApp(learner, tool);
            }
        );
    }
);

Then(
    '{string} sees respective {string} in white board bar on Learner App',
    async function (role: AccountRoles, icon: LessonWhiteBoardAnnotationToolIconType) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} selects ${icon} in white board bar on Learner App`,
            async function () {
                await learnerSeesRespectiveIconInWhiteBoardBarOnLearnerApp(learner, icon);
            }
        );
    }
);
