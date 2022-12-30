import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    turnOwnCameraStatusOnLearnerApp,
    turnOwnSpeakerStatusOnLearnerApp,
} from './lesson-turn-on-speaker-and-camera-definitions';
import {
    checkSpeakerAndCameraStatusOnLearnerApp,
    teacherSeesStatusCameraIconInStudentListOnTeacherApp,
    teacherSeesStatusSpeakerIconInStudentListOnTeacherApp,
} from './lesson-turn-on-speaker-and-camera-definitions';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    getUserProfileFromContext,
} from './utils';
import { turnOwnRaiseHandOnLearnerApp } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';

When(
    '{string} turns on speaker and camera on Learner App',
    async function (this: IMasterWorld, role: string) {
        const roles = role.split(', ');
        for (const learnerRole of roles) {
            const learner = getLearnerInterfaceFromRole(this, learnerRole as AccountRoles);
            await learner.instruction(
                `${learnerRole} turns on speaker and camera on Learner App`,
                async function () {
                    await turnOwnCameraStatusOnLearnerApp(learner, false);
                    await turnOwnSpeakerStatusOnLearnerApp(learner, false);
                }
            );
        }
    }
);

When(
    '{string} turns off their speaker and camera on Learner App',
    async function (this: IMasterWorld, role: string) {
        const roles = role.split(', ');
        for (const learnerRole of roles) {
            const learner = getLearnerInterfaceFromRole(this, learnerRole as AccountRoles);
            await learner.instruction(
                `${learnerRole} turns off their speaker and camera on Learner App`,
                async function () {
                    await turnOwnCameraStatusOnLearnerApp(learner, true);
                    await turnOwnSpeakerStatusOnLearnerApp(learner, true);
                }
            );
        }
    }
);

Then(
    '{string} sees active {string} speaker and camera icon in student list on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const learnerProfileFromContext = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(learnerRole)
        );
        const studentId = learnerProfileFromContext.id;
        await teacher.instruction(
            `${role} sees active ${learnerRole} speaker and camera icon in student list on Teacher App`,
            async function () {
                await teacherSeesStatusCameraIconInStudentListOnTeacherApp(
                    teacher,
                    true,
                    studentId
                );
                await teacherSeesStatusSpeakerIconInStudentListOnTeacherApp(
                    teacher,
                    true,
                    studentId
                );
            }
        );
    }
);

Then(
    '{string} sees inactive {string} speaker and camera icon in student list on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const learnerProfileFromContext = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(learnerRole)
        );
        const studentId = learnerProfileFromContext.id;
        await teacher.instruction(
            `${role} sees active ${learnerRole} speaker and camera icon in student list on Teacher App`,
            async function () {
                await teacherSeesStatusCameraIconInStudentListOnTeacherApp(
                    teacher,
                    false,
                    studentId
                );
                await teacherSeesStatusSpeakerIconInStudentListOnTeacherApp(
                    teacher,
                    false,
                    studentId
                );
            }
        );
    }
);

Then(
    '{string} sees active speaker and camera icon on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees active speaker and camera icon on Learner App`,
            async function () {
                await checkSpeakerAndCameraStatusOnLearnerApp(learner, 'active');
            }
        );
    }
);

Then(
    '{string} sees inactive speaker and camera icon on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees inactive speaker and camera icon on Learner App`,
            async function () {
                await checkSpeakerAndCameraStatusOnLearnerApp(learner, 'inactive');
            }
        );
    }
);

Given(
    '{string} has turned on raise hand on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} has turned on raise hand on Learner App`,
            async function () {
                await turnOwnRaiseHandOnLearnerApp(learner, false);
            }
        );
    }
);

Given(
    '{string} has turned on speaker and camera on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} has turned on speaker and camera on Learner App`,
            async function () {
                await turnOwnCameraStatusOnLearnerApp(learner, false);
                await turnOwnSpeakerStatusOnLearnerApp(learner, false);
            }
        );
    }
);
