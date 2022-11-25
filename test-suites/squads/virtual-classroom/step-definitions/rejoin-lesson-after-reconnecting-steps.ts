import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { delay } from 'flutter-driver-x';
import {
    getLearnerInterfaceFromRole,
    getUserIdFromRole,
    getUserProfileFromContext,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    disconnectingScreenDisplayOnLearnerApp,
    disconnectingScreenDisplayOnTeacherApp,
    disconnectsInternetFromLearnerApp,
    reconnectsInternetFromLearnerApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/rejoin-lesson-after-reconnecting-definitions';
import { turnOwnRaiseHandOnLearnerApp } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-raise-hand-definitions';
import {
    learnerSeesCameraViewInGalleryViewOnLearnerApp,
    teacherSeesCameraViewInGalleryViewOnTeacherApp,
    turnOwnCameraStatusOnLearnerApp,
    turnOwnSpeakerStatusOnLearnerApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-speaker-and-camera-definitions';
import {
    teacherTurnsTheirCameraOnTeacherApp,
    teacherTurnsTheirSpeakerOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/user-can-turn-on-micro-and-cam-after-allowing-permission-definitions';

Given(
    '{string} turns on speaker, camera and raise hand on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} turns on speaker, camera and raise hand on Learner App`,
            async function () {
                await turnOwnRaiseHandOnLearnerApp(learner, false);
                await turnOwnCameraStatusOnLearnerApp(learner, false);
                await turnOwnSpeakerStatusOnLearnerApp(learner, false);
            }
        );
    }
);

Given('{string} has disconnected on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} has disconnected on Teacher App`, async function () {
        await teacher.setOffline(true);
        await teacher.flutterDriver!.webDriver!.page!.waitForLoadState('networkidle');
    });
});

Given('{string} sees disconnecting screen on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(
        `${role} sees disconnecting screen on Teacher App`,
        async function () {
            await disconnectingScreenDisplayOnTeacherApp(teacher, true);
        }
    );
});

Given(
    '{string} has turned on speaker and camera on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} has turned on speaker and camera on Teacher App`,
            async function () {
                await teacherTurnsTheirCameraOnTeacherApp(teacher, false);
                await teacherTurnsTheirSpeakerOnTeacherApp(teacher, false);
            }
        );
    }
);

When('{string} disconnects on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} disconnects on Teacher App`, async function () {
        await teacher.setOffline(true);
        await teacher.flutterDriver!.webDriver!.page!.waitForLoadState('networkidle');
        await delay(3000);
    });
});

When('{string} reconnects on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} reconnects on Teacher App`, async function () {
        await teacher.setOffline(false);
    });
});

Then(
    '{string} does not see disconnecting screen on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} does not see disconnecting screen on Teacher App`,
            async function () {
                await disconnectingScreenDisplayOnTeacherApp(teacher, false);
            }
        );
    }
);

Then(`{string} sees student's stream on Teacher App`, async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    const learnerId = getUserIdFromRole(this.scenario, 'student');
    await teacher.instruction(`${role} sees student's stream on Teacher App`, async function () {
        await teacherSeesCameraViewInGalleryViewOnTeacherApp(teacher, learnerId, true);
    });
});

Then(`{string} sees teacher's stream on Learner App`, async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    const teacherId = getUserProfileFromContext(
        this.scenario,
        staffProfileAliasWithAccountRoleSuffix('teacher')
    ).id;
    await learner.instruction(`${role} sees teacher's stream on Learner App`, async function () {
        await learnerSeesCameraViewInGalleryViewOnLearnerApp(learner, teacherId, true);
    });
});

Given('{string} has been disconnected on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} has been disconnected on Learner App`, async function () {
        await disconnectsInternetFromLearnerApp(learner);
    });
});

Given('{string} sees disconnecting screen on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(
        `${role} sees disconnecting screen on Learner App`,
        async function () {
            await disconnectingScreenDisplayOnLearnerApp(learner, true);
        }
    );
});

When('{string} reconnects on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} reconnects on Learner App`, async function () {
        await reconnectsInternetFromLearnerApp(learner);
    });
});

When('{string} disconnects on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);
    await learner.instruction(`${role} disconnects on Learner App`, async function () {
        await disconnectsInternetFromLearnerApp(learner);
    });
});

Then(
    `{string} does not see disconnecting screen on Learner App`,
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} does not see disconnecting screen on Learner App`,
            async function () {
                await disconnectingScreenDisplayOnLearnerApp(learner, false);
            }
        );
    }
);
