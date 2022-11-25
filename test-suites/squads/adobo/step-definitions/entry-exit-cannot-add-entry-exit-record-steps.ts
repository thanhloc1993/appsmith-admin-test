import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    addEntryExitRecordOnCMS,
    cmsGoToStudentEntryExitTab,
} from './entry-exit-add-entry-exit-record-definitions';
import {
    findEntryEarlierThanExitValidation,
    schoolAdminSeesDisabledAddButton,
} from './entry-exit-cannot-add-entry-exit-record-definitions';
import { getCorrectDateForEntryExit } from './entry-exit-utils';

const withExit = true;
const earlierExitTime = true;
const currentDate = new Date();

const correctDate = getCorrectDateForEntryExit(currentDate);

When(
    '{string} adds new entry & exit record with exit time earlier than entry time for {string}',
    async function (
        this: IMasterWorld,
        schoolAdminRole: AccountRoles,
        studentRole: AccountRoles
    ): Promise<void> {
        const cms = this.cms;
        const scenario = this.scenario;

        const learnerProfile = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await cms.instruction(
            `${schoolAdminRole} goes to Entry & Exit tab in Student Detail page of ${studentRole}`,
            async function () {
                await cmsGoToStudentEntryExitTab(cms, learnerProfile);
            }
        );

        await cms.instruction(
            `${schoolAdminRole} creates an Entry and Exit record for ${studentRole}`,
            async function () {
                await addEntryExitRecordOnCMS(cms, withExit, earlierExitTime, correctDate);
            }
        );
    }
);

Then(
    '{string} sees an error message displayed',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles) {
        const cms = this.cms;

        await cms.instruction(
            `${schoolAdminRole} sees a validation warning in the form`,
            async function () {
                await findEntryEarlierThanExitValidation(cms);
            }
        );
    }
);

Then(
    '{string} sees that they cannot add a record',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles) {
        const cms = this.cms;

        await cms.instruction(
            `${schoolAdminRole} sees that Add button is disabled`,
            async function () {
                await schoolAdminSeesDisabledAddButton(cms);
            }
        );
    }
);
