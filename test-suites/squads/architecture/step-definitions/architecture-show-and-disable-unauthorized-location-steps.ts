import { getCMSInterfaceByRole, getTeacherInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { teacherSeeNumberUnAuthorizedLocation } from './architecture-show-and-disable-unauthorized-location-definitions';

Then(
    '{string} sees {string} unauthorized location in location dialog and unable to select on CMS',
    async function (role: AccountRoles, number: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const cms = getCMSInterfaceByRole(this, role);

        await teacher.instruction(
            `${role} sees ${number} unauthorized location in location dialog and unable to select on CMS`,
            async function () {
                await teacherSeeNumberUnAuthorizedLocation(cms, parseInt(number));
            }
        );
    }
);
