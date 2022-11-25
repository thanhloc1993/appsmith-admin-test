import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    getLearnerInterfaceFromRole,
    getUserProfileFromContext,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    learnerTapActionFromRequestModalOnLearnerApp,
    teacherTurnOnStudentDeviceOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-requests-to-turn-on-speaker-and-camera-definitions';
import {
    checkSpeakerAndCameraStatusOnLearnerApp,
    checkSpeakerAndCameraStatusOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-speaker-and-camera-definitions';
import { CameraOrSpeaker } from 'test-suites/squads/virtual-classroom/utils/types';

export type AcceptsOrDeclines = 'accepts' | 'declines';

Given(`all students's speaker and camera are inactive`, async function () {
    const studentRoles = ['student S1', 'student S2'] as AccountRoles[];

    for (const studentRole of studentRoles) {
        const learner = getLearnerInterfaceFromRole(this, studentRole);
        await learner.instruction(
            `${studentRole}'s speaker and camera are inactive on Learner App`,
            async function () {
                await checkSpeakerAndCameraStatusOnLearnerApp(learner, 'inactive');
            }
        );
    }
});

When(
    "{string} requests to turn on {string}'s {string} on Teacher App",
    { timeout: 15000 },
    async function (teacherRole: AccountRoles, studentRole: AccountRoles, device: CameraOrSpeaker) {
        const scenarioContext = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);

        const learnerProfile = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        )!;

        await teacher.instruction(
            `${teacherRole} requests to turn on ${studentRole}'s speaker on Teacher App`,
            async function () {
                await teacherTurnOnStudentDeviceOnTeacherApp(teacher, learnerProfile.id, device);
            }
        );
    }
);

When(
    "{string} accepts teacher's request on Learner App",
    async function (studentRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, studentRole);

        await learner.instruction(
            `${studentRole} accepts teacher's request on Learner App`,
            async function () {
                await learnerTapActionFromRequestModalOnLearnerApp(learner, 'accepts');
            }
        );
    }
);

When(
    "{string} declines teacher's request on Learner App",
    async function (studentRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, studentRole);

        await learner.instruction(
            `${studentRole} declines teacher's request on Learner App`,
            async function () {
                await learnerTapActionFromRequestModalOnLearnerApp(learner, 'declines');
            }
        );
    }
);

Then('all students see nothing change on Learner App', async function () {
    const studentRoles = ['student S1', 'student S2'] as AccountRoles[];

    for (const studentRole of studentRoles) {
        const learner = getLearnerInterfaceFromRole(this, studentRole);

        await learner.instruction(
            `${studentRole}'s see nothing change on Learner App`,
            async function () {
                await checkSpeakerAndCameraStatusOnLearnerApp(learner, 'inactive');
            }
        );
    }
});

Then('all teachers see nothing change on Teacher App', async function () {
    const teacherRoles = ['teacher T1', 'teacher T2'] as AccountRoles[];

    for (const teacherRole of teacherRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);

        await teacher.instruction(
            `${teacherRole}'s see nothing change on Learner App`,
            async function () {
                await checkSpeakerAndCameraStatusOnTeacherApp(teacher, 'inactive');
            }
        );
    }
});
