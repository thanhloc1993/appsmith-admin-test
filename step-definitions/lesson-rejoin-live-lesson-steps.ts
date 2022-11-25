import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerLeavesLessonOnLearnerApp,
    teacherLeavesLessonOnTeacherApp,
    userIsShownInListCameraOnLearnerApp,
    userIsShownInListCameraOnTeacherApp,
} from './lesson-leave-lesson-definitions';
import {
    cameraOfLearnerIs,
    cameraOfTeacherIs,
    learnerHasLeftLessonOnLearnerApp,
    learnerRejoinsOnLearnerApp,
    speakerOfLearnerIs,
    speakerOfTeacherIs,
} from './lesson-rejoin-live-lesson-definitions';
import { getUserIdFromRole } from './lesson-utils';
import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';
import { aliasLessonId, aliasLessonName } from 'step-definitions/alias-keys/lesson';

Given('{string} has left lesson on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} has left lesson on Teacher App`, async function () {
        await teacherLeavesLessonOnTeacherApp(teacher);
    });
});

Given('{string} has left lesson on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} has left lesson on Learner App`, async function () {
        await learnerLeavesLessonOnLearnerApp(learner);
        await learnerHasLeftLessonOnLearnerApp(learner);
    });
});

When(
    '{string} rejoins lesson on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get(aliasLessonName);
        await learner.instruction(`${role} rejoins lesson on Learner App`, async function () {
            await learnerRejoinsOnLearnerApp(learner, lessonId, lessonName);
        });
    }
);

When(
    '{string} rejoins lesson on Learner App after Teacher ends lesson for all',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get(aliasLessonName);
        await learner.instruction(
            `${role} rejoins lesson on Learner App after Teacher ends lesson for all`,
            async function () {
                await learnerRejoinsOnLearnerApp(learner, lessonId, lessonName);
            }
        );
    }
);

Then(
    '{string} sees all participant in gallery view on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const teacherId = getUserIdFromRole(this, role);
        const learnerId = getUserIdFromRole(this, 'student');
        await teacher.instruction(
            `${role} sees all participant in gallery view on Teacher App`,
            async function () {
                await userIsShownInListCameraOnTeacherApp(teacher, teacherId, true);
                await userIsShownInListCameraOnTeacherApp(teacher, learnerId, true);
            }
        );
    }
);

Then(
    '{string} sees {string} speaker icon on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, active: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees ${active} speaker icon on Teacher App`,
            async function () {
                const iconActive = active === 'active';
                await speakerOfTeacherIs(teacher, iconActive);
            }
        );
    }
);

Then(
    '{string} sees {string} speaker icon on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, active: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees ${active} speaker icon on Learner App`,
            async function () {
                const iconActive = active === 'active';
                await speakerOfLearnerIs(learner, iconActive);
            }
        );
    }
);

Then(
    '{string} sees {string} camera icon on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, active: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees ${active} camera icon on Teacher App`,
            async function () {
                const iconActive = active === 'active';
                await cameraOfTeacherIs(teacher, iconActive);
            }
        );
    }
);

Then(
    '{string} sees {string} camera icon on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, active: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees ${active} camera icon on Learner App`,
            async function () {
                const iconActive = active === 'active';
                await cameraOfLearnerIs(learner, iconActive);
            }
        );
    }
);

Then(
    `{string} sees teacher in gallery view on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const teacherId = getUserIdFromRole(this, 'teacher');
        await learner.instruction(
            `${role} sees teacher in gallery view on Learner App`,
            async function () {
                await userIsShownInListCameraOnLearnerApp(learner, teacherId, true);
            }
        );
    }
);

Then(
    `{string} sees {string} speaker and camera icon on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles, active: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees ${active} speaker and camera icon on Teacher App`,
            async function () {
                const iconActive = active === 'active';
                await speakerOfTeacherIs(teacher, iconActive);
                await cameraOfTeacherIs(teacher, iconActive);
            }
        );
    }
);

Then(
    `{string} sees {string} speaker and camera icon on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles, active: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees ${active} speaker and camera icon on Learner App`,
            async function () {
                const iconActive = active === 'active';
                await speakerOfLearnerIs(learner, iconActive);
                await cameraOfLearnerIs(learner, iconActive);
            }
        );
    }
);
