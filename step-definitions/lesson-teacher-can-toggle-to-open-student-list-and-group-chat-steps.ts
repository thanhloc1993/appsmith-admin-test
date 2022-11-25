import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    learnerSeesChatTabVisibleOnLearnerApp,
    LessonLiveLessonRightDrawerIcon,
    LessonLiveLessonRightDrawerTab,
    teacherHidesRightDrawerByIcon,
    teacherOpensRightDrawerByIcon,
    teacherSeesTabVisibleOfRightDrawerOnTeacherApp,
} from './lesson-teacher-can-toggle-to-open-student-list-and-group-chat-definitions';
import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';
import { learnerSelectLessonChatGroup } from 'test-suites/squads/communication/step-definitions/communication-create-live-lesson-chat-group-definitions';

Given(
    '{string} has opened {string} by {string} in the main bar on Teacher App',
    async function (
        role: AccountRoles,
        tab: LessonLiveLessonRightDrawerTab,
        icon: LessonLiveLessonRightDrawerIcon
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} has opened ${tab} by ${icon} in the main bar on Teacher App`,
            async function () {
                await teacherOpensRightDrawerByIcon(teacher, icon);
            }
        );
    }
);

Given(
    '{string} has opened group chat by group chat icon in the main bar on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} has opened group chat by group chat icon in the main bar on Learner App`,
            async function () {
                await learnerSelectLessonChatGroup(learner);
            }
        );
    }
);

When(
    '{string} opens {string} by {string} in the main bar on Teacher App',
    async function (
        role: AccountRoles,
        tab: LessonLiveLessonRightDrawerTab,
        icon: LessonLiveLessonRightDrawerIcon
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} opens ${tab} by ${icon} in the main bar on Teacher App`,
            async function () {
                await teacherOpensRightDrawerByIcon(teacher, icon);
            }
        );
    }
);

When(
    '{string} hides {string} by {string} in the main bar on Teacher App',
    async function (
        role: AccountRoles,
        tab: LessonLiveLessonRightDrawerTab,
        icon: LessonLiveLessonRightDrawerIcon
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} hides ${tab} by ${icon} in the main bar on Teacher App`,
            async function () {
                await teacherHidesRightDrawerByIcon(teacher, icon);
            }
        );
    }
);

When(
    '{string} opens group chat by group chat icon in the main bar on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} opens group chat by group chat icon in the main bar on Learner App`,
            async function () {
                await learnerSelectLessonChatGroup(learner);
            }
        );
    }
);

When(
    '{string} hides group chat by group chat icon in the main bar on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} hides group chat by group chat icon in the main bar on Learner App`,
            async function () {
                await learnerSelectLessonChatGroup(learner);
            }
        );
    }
);

Then(
    '{string} sees opening {string} in the right side on Teacher App',
    async function (role: AccountRoles, tab: LessonLiveLessonRightDrawerTab) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees opening ${tab} in the right side on Teacher App`,
            async function () {
                await teacherSeesTabVisibleOfRightDrawerOnTeacherApp(teacher, tab, true);
            }
        );
    }
);

Then(
    '{string} does not see {string} in the right side on Teacher App',
    async function (role: AccountRoles, tab: LessonLiveLessonRightDrawerTab) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} does not see ${tab} in the right side on Teacher App`,
            async function () {
                await teacherSeesTabVisibleOfRightDrawerOnTeacherApp(teacher, tab, false);
            }
        );
    }
);

Then(
    '{string} sees opening group chat in the right side on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees opening group chat in the right side on Learner App`,
            async function () {
                await learnerSeesChatTabVisibleOnLearnerApp(learner, true);
            }
        );
    }
);

Then(
    '{string} does not see group chat in the right side on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} does not see group chat in the right side on Learner App`,
            async function () {
                await learnerSeesChatTabVisibleOnLearnerApp(learner, false);
            }
        );
    }
);
