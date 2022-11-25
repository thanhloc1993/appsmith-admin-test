import { Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getLearnerInterfaceFromRole } from 'test-suites/common/step-definitions/user-common-definitions';
import { LessonMaterialMultipleType } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    learnerDoesNotSeeSharingMaterialOnLearnerApp,
    learnerSeesSharingMaterialOnLearnerApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/learner-shares-file-definitions';

Then(
    '{string} sees sharing {string} in the main screen on Learner App',
    async function (role: AccountRoles, material: LessonMaterialMultipleType) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} sees sharing ${material}`, async function () {
            await learnerSeesSharingMaterialOnLearnerApp(learner, material);
        });
    }
);

Then('{string} does not see material on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);

    await learner.instruction(`${role} does not see material`, async function (learner) {
        await learnerDoesNotSeeSharingMaterialOnLearnerApp(learner);
    });
});

Then(
    '{string} sees {string} in the main screen on Learner App',
    async function (role: AccountRoles, material: LessonMaterialMultipleType) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} sees new ${material}`, async function () {
            await learnerSeesSharingMaterialOnLearnerApp(learner, material);
        });
    }
);
