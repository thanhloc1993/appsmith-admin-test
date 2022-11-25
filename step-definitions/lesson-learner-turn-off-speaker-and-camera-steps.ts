import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerSeesDeviceStatusOfOtherOnLearnerApp,
    learnerSeesDeviceStatusOnLearnerApp,
    turnOffDeviceOnLearnerApp,
} from './lesson-learner-turn-off-speaker-and-camera-definitions';
import { StatusCameraAndSpeaker } from './lesson-turn-on-speaker-and-camera-definitions';
import { getUserIdFromRole } from './lesson-utils';
import { getLearnerInterfaceFromRole } from './utils';

export type CameraOrSpeaker = 'camera' | 'speaker';

When(
    '{string} turns off their {string} on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, device: CameraOrSpeaker) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} turn off ${device}`, async function () {
            await turnOffDeviceOnLearnerApp(learner, device);
        });
    }
);

Then(
    '{string} sees {string} {string} mode on Learner App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        deviceStatus: StatusCameraAndSpeaker,
        device: CameraOrSpeaker
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} sees ${device} is ${deviceStatus}`, async function () {
            await learnerSeesDeviceStatusOnLearnerApp(learner, device, deviceStatus);
        });
    }
);

Then(
    'all students see {string} {string} {string} mode on Learner App',
    async function (
        this: IMasterWorld,
        deviceStatus: StatusCameraAndSpeaker,
        role: AccountRoles,
        device: CameraOrSpeaker
    ) {
        const learnerRoles: AccountRoles[] = ['student S1', 'student S2'];
        const otherUserId = await getUserIdFromRole(this, role);

        for (const learnerRole of learnerRoles) {
            const learner = getLearnerInterfaceFromRole(this, learnerRole);

            await learner.instruction(
                `${learnerRole} sees ${role}'s ${device} is ${deviceStatus}`,
                async function () {
                    await learnerSeesDeviceStatusOfOtherOnLearnerApp(
                        learner,
                        deviceStatus,
                        device,
                        otherUserId
                    );
                }
            );
        }
    }
);

Then(
    'all students see their {string} are {string} mode on Learner App',
    async function (
        this: IMasterWorld,
        device: CameraOrSpeaker,
        deviceStatus: StatusCameraAndSpeaker
    ) {
        const learnerRoles: AccountRoles[] = ['student S1', 'student S2'];

        for (const learnerRole of learnerRoles) {
            const learner = getLearnerInterfaceFromRole(this, learnerRole);

            await learner.instruction(
                `${learnerRole} sees all device is ${deviceStatus}`,
                async function () {
                    await learnerSeesDeviceStatusOnLearnerApp(learner, device, deviceStatus);
                }
            );
        }
    }
);
