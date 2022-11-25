import { getTeacherInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getLearnerInterfaceFromRole } from 'test-suites/common/step-definitions/user-common-definitions';
import { assertStatusOfShareMaterialButton } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-can-see-active-share-material-and-polling-icon-in-lesson-waiting-room-definitions';
import { assertStatusOfPollingButton } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-create-polling-definitions';
import { assertJoinButtonVisible } from 'test-suites/squads/virtual-classroom/utils/navigation';
import { ButtonStatus } from 'test-suites/squads/virtual-classroom/utils/types';

Given(
    '{string} has seen {string} polling icon on Teacher App',
    async function (role: AccountRoles, buttonStatus: ButtonStatus) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} has seen Poll Button With ${buttonStatus} Status on Teacher App`,
            async function () {
                await assertStatusOfPollingButton(teacher, buttonStatus);
            }
        );
    }
);

Then('{string} sees join button on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} sees join button on Teacher App`, async function () {
        await assertJoinButtonVisible(teacher, false, true);
    });
});

Then(
    '{string} sees {string} share material icon in lesson waiting room on Teacher App',
    async function (role: AccountRoles, buttonStatus: ButtonStatus) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees ${buttonStatus} share material icon in lesson waiting room on Teacher App`,
            async function () {
                await assertStatusOfShareMaterialButton(teacher, buttonStatus);
            }
        );
    }
);

Then(
    '{string} sees {string} polling icon in lesson waiting room on Teacher App',
    async function (role: AccountRoles, buttonStatus: ButtonStatus) {
        const teacher = getLearnerInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees ${buttonStatus} polling icon in lesson waiting room on Teacher App`,
            async function () {
                await assertStatusOfPollingButton(teacher, buttonStatus);
            }
        );
    }
);
