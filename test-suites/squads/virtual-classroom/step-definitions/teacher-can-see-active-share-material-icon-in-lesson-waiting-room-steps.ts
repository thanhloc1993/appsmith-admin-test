import { getTeacherInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { assertStatusOfShareMaterialButton } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-can-see-active-share-material-icon-in-lesson-waiting-room-definitions';
import { assertJoinButtonVisible } from 'test-suites/squads/virtual-classroom/utils/navigation';
import { ButtonStatus } from 'test-suites/squads/virtual-classroom/utils/types';

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
