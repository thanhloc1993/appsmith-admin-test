import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerHaveToEndLesson,
    learnerLeavesLessonOnLearnerApp,
    learnerBacksToLessonPage,
    learnerSeesMessageTeacherHasLeft,
    learnerTapsLeaveForNowButton,
    teacherBacksToLessonDetailScreenOnTeacherApp,
    teacherEndsLessonForAllOnTeacherApp,
    teacherHaveToEndLesson,
    teacherLeavesLessonOnTeacherApp,
    userIsShownInListCameraOnLearnerApp,
    userIsShownInListCameraOnTeacherApp,
} from './lesson-leave-lesson-definitions';
import { getUserIdFromRole } from './lesson-utils';
import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';

When(
    '{string} leaves lesson on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`${role} leaves lesson on Teacher App`, async function () {
            await teacherLeavesLessonOnTeacherApp(teacher);
        });
    }
);

When(
    '{string} leaves lesson on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} leaves lesson on Learner App`, async function () {
            await learnerLeavesLessonOnLearnerApp(learner);
        });
    }
);

When(
    '{string} ends lesson for all on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`${role} end lesson for all on Teacher App`, async function () {
            await teacherEndsLessonForAllOnTeacherApp(teacher);
        });
    }
);

Then(
    '{string} backs to lesson list on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} backs to lesson list on Learner App`, async function () {
            await learnerBacksToLessonPage(learner);
        });
    }
);

Then(
    '{string} does not see student in the lesson on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const learnerId = getUserIdFromRole(this, 'student');

        await teacher.instruction(
            `${role} does not see student in the lesson on Teacher App`,
            async function () {
                await userIsShownInListCameraOnTeacherApp(teacher, learnerId, false);
            }
        );
    }
);

Then(
    '{string} backs to lesson detail screen on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} backs to lesson detail screen on Teacher App`,
            async function () {
                await teacherBacksToLessonDetailScreenOnTeacherApp(teacher);
            }
        );
    }
);

Then(
    '{string} sees message Teacher has left the class on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees message Teacher has left the class on Learner App`,
            async function () {
                await learnerSeesMessageTeacherHasLeft(learner);
            }
        );
    }
);

Then(
    '{string} is not shown in gallery view on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const learnerId = getUserIdFromRole(this, role);
        await learner.instruction(
            `${role} is not shown in gallery view on Learner App`,
            async function () {
                await userIsShownInListCameraOnLearnerApp(learner, learnerId, false);
            }
        );
    }
);

Then(
    '{string} is shown in gallery view on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const learnerId = getUserIdFromRole(this, role);
        await learner.instruction(
            `${role} is shown in gallery view on Learner App`,
            async function () {
                await userIsShownInListCameraOnLearnerApp(learner, learnerId, true);
            }
        );
    }
);

Then(
    `{string} is not shown in gallery view on {string}'s Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles, ownerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, ownerRole);
        const userId = getUserIdFromRole(this, role);

        await teacher.instruction(
            `${role} is not shown in gallery view on Teacher App`,
            async function () {
                await userIsShownInListCameraOnTeacherApp(teacher, userId, false);
            }
        );
    }
);

Then(
    '{string} have to end lesson on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`${role} have to end lesson on Teacher App`, async function () {
            await teacherHaveToEndLesson(teacher);
        });
    }
);

Then(
    '{string} has to end lesson on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(`${role} has to end lesson on Learner App`, async function () {
            await learnerHaveToEndLesson(learner);
        });
    }
);

Then(
    '{string} can only leave lesson on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} can only leave lesson on Learner App`,
            async function () {
                await learnerTapsLeaveForNowButton(learner);
            }
        );
    }
);
