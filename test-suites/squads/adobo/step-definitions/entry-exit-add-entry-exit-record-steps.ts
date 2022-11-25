import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { formatDate } from '@supports/utils/time/time';

import {
    addEntryExitRecordOnCMS,
    cmsGoToStudentEntryExitTab,
    createStudentWithStatus,
    StatusTypes,
    viewEntryExitRecordInBackOffice,
} from './entry-exit-add-entry-exit-record-definitions';
import { getCorrectDateForEntryExit } from './entry-exit-utils';

const withExit = true;
const currentDate = new Date();
const correctDate = getCorrectDateForEntryExit(currentDate);

Given(
    '{string} has created {string} with {string} status and parent info',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        studentRole: AccountRoles,
        status: StatusTypes
    ) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        await cms.instruction(
            `${role} creates ${studentRole} with ${status} status and parent info`,
            async function () {
                await createStudentWithStatus(cms, scenarioContext, status, studentRole);
            }
        );
    }
);

// entry and exit record

When(
    '{string} adds new entry & exit record for {string}',
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
                await addEntryExitRecordOnCMS(cms, withExit, false, correctDate);
            }
        );
    }
);

Then(
    '{string} sees new entry & exit record has been saved',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles) {
        const cms = this.cms;

        const entryDate = formatDate(correctDate, 'YYYY/MM/DD');

        await cms.instruction(`${schoolAdminRole} sees new entry & exit record`, async function () {
            await viewEntryExitRecordInBackOffice(cms, entryDate);
        });
    }
);

// entry record only

When(
    '{string} adds new entry record for {string}',
    async function (
        this: IMasterWorld,
        schoolAdminRole: AccountRoles,
        studentRole: AccountRoles
    ): Promise<void> {
        const cms = this.cms;

        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await cms.instruction(
            `${schoolAdminRole} goes to Entry & Exit tab in Student Detail page of ${studentRole}`,
            async function () {
                await cmsGoToStudentEntryExitTab(cms, learnerProfile);
            }
        );

        await cms.instruction(
            `${schoolAdminRole} creates an Entry record for ${studentRole}`,
            async function () {
                await addEntryExitRecordOnCMS(cms, !withExit, false, correctDate);
            }
        );
    }
);

Then(
    '{string} sees new entry record has been saved',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles) {
        const cms = this.cms;

        const entryDate = formatDate(correctDate, 'YYYY/MM/DD');

        await cms.instruction(`${schoolAdminRole} sees new entry record`, async function () {
            await viewEntryExitRecordInBackOffice(cms, entryDate);
        });
    }
);
