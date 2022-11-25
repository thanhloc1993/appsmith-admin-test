import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';
import { aliasMaterialId } from 'test-suites/squads/lesson/common/alias-keys';
import { learnerSeesVideoOnLearnerApp } from 'test-suites/squads/virtual-classroom/step-definitions/learner-shares-file-definitions';
import { teacherSeesVideoOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-shares-file-definitions';
import { teacherSharesMaterialOnTeacherApp } from 'test-suites/squads/virtual-classroom/utils/lesson';

Given(
    "{string} has shared lesson's video on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId['video']);

        await teacher.instruction(
            `${role} has shared lesson's video on Teacher App`,
            async function () {
                await teacherSharesMaterialOnTeacherApp(teacher, mediaId);
            }
        );
    }
);

When(
    "{string} shares lesson's video on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId['video']);

        await teacher.instruction(
            `${role} shares lesson's video on Teacher App`,
            async function () {
                await teacherSharesMaterialOnTeacherApp(teacher, mediaId);
            }
        );
    }
);

Then(
    "{string} still sees lesson's video on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId['video']);

        await teacher.instruction(
            `${role} still sees lesson's video on Teacher App`,
            async function () {
                await teacherSeesVideoOnTeacherApp(teacher, mediaId, false);
            }
        );
    }
);

Then(
    "{string} does not see lesson's video on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId['video']);

        await teacher.instruction(
            `${role} does not see lesson's video on Teacher App`,
            async function () {
                await teacherSeesVideoOnTeacherApp(teacher, mediaId, true);
            }
        );
    }
);

Then(
    '{string} still sees video on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} still sees video on Learner App`, async function () {
            await learnerSeesVideoOnLearnerApp(learner, false);
        });
    }
);

Then(
    '{string} does not see video on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} does not see video on Learner App`, async function () {
            await learnerSeesVideoOnLearnerApp(learner, true);
        });
    }
);
