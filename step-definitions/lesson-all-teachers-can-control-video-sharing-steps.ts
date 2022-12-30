import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerSeesVideoIsPlayingOnLearnerApp,
    teacherActionsVideoOnTeacherApp,
    teacherSeesVideoControlBarOnTeacherApp,
    teacherSeesVideoIsPlayingOnTeacherApp,
} from './lesson-all-teachers-can-control-video-sharing-definitions';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from './utils';
import { aliasMaterialId } from 'test-suites/squads/lesson/common/alias-keys';

Given(
    "{string} has played lesson's video on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const videoId = this.scenario.get(aliasMaterialId['video']);

        await teacher.instruction(`${role} plays video on Teacher App`, async function () {
            await teacherActionsVideoOnTeacherApp(teacher, videoId, 'play');
        });
    }
);

Given(
    "{string} has paused lesson's video on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const videoId = this.scenario.get(aliasMaterialId['video']);

        await teacher.instruction(`${role} pauses video on Teacher App`, async function () {
            await teacherActionsVideoOnTeacherApp(teacher, videoId, 'pause');
        });
    }
);

When(
    "{string} pauses lesson's video on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const videoId = this.scenario.get(aliasMaterialId['video']);

        await teacher.instruction(`${role} pauses video on Teacher App`, async function () {
            await teacherActionsVideoOnTeacherApp(teacher, videoId, 'pause');
        });
    }
);

When(
    "{string} replays lesson's video on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const videoId = this.scenario.get(aliasMaterialId['video']);

        await teacher.instruction(`${role} replays video on Teacher App`, async function () {
            await teacherActionsVideoOnTeacherApp(teacher, videoId, 'play');
        });
    }
);

Then(
    `{string} sees video control bar on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees video control bar on Teacher App`,
            async function () {
                await teacherSeesVideoControlBarOnTeacherApp(teacher, true);
            }
        );
    }
);

Then(
    `{string} see lesson's video is playing on Teacher App`,
    async function (this: IMasterWorld, roles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        const videoId = this.scenario.get(aliasMaterialId['video']);

        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} sees video is playing on Teacher App`,
                async function () {
                    await teacherSeesVideoIsPlayingOnTeacherApp(teacher, videoId, true);
                }
            );
        }
    }
);

Then(
    "{string} do not see lesson's video is playing on Teacher App",
    async function (this: IMasterWorld, roles: string) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        const videoId = this.scenario.get(aliasMaterialId['video']);

        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} does not see video is playing on Teacher App`,
                async function () {
                    await teacherSeesVideoIsPlayingOnTeacherApp(teacher, videoId, false);
                }
            );
        }
    }
);

Then(
    `{string} sees video is playing on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees video is playing on Learner App`,
            async function () {
                await learnerSeesVideoIsPlayingOnLearnerApp(learner, true);
            }
        );
    }
);

Then(
    `{string} does not see video is playing on Learner App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} does not see video is playing on Teacher App`,
            async function () {
                await learnerSeesVideoIsPlayingOnLearnerApp(learner, false);
            }
        );
    }
);
