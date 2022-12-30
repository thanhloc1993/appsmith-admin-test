import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getLearnerInterfaceFromRole } from 'test-suites/common/step-definitions/user-common-definitions';
import {
    assertSharingPdfWithZoomRatio,
    zoomsInPdfOnLearner,
    zoomsOutPdfOnLearner,
} from 'test-suites/squads/virtual-classroom/step-definitions/student-can-zoom-in-and-zoom-out-pdf-definitions';

Given(
    '{string} has zoomed in {string} time on Learner App',
    async function (role: AccountRoles, click: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const count: number = parseInt(click);
        await learner.instruction(
            `${role} has zoomed in ${click} time on Learner App`,
            async function () {
                await zoomsInPdfOnLearner(learner, count);
            }
        );
    }
);

When(
    '{string} zooms in {string} time on Learner App',
    async function (role: AccountRoles, click: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const count: number = parseInt(click);
        await learner.instruction(
            `${role} zooms in ${click} time on Learner App`,
            async function () {
                await zoomsInPdfOnLearner(learner, count);
            }
        );
    }
);

When(
    '{string} zooms out {string} time on Learner App',
    async function (role: AccountRoles, click: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const count: number = parseInt(click);
        await learner.instruction(
            `${role} zooms out ${click} time on Learner App`,
            async function () {
                await zoomsOutPdfOnLearner(learner, count);
            }
        );
    }
);

Then(
    '{string} sees current zoom in {string} in zoom controller bar on Learner App',
    async function (role: AccountRoles, percentage: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        await learner.instruction(
            `${role} sees current zoom in ${percentage} in zoom controller bar on Learner App`,
            async function () {
                await assertSharingPdfWithZoomRatio(learner, percentage);
            }
        );
    }
);
