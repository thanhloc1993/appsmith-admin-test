import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    cmsGoToStudentEntryExitTab,
    viewEntryExitRecordInBackOffice,
} from './entry-exit-add-entry-exit-record-definitions';
import { editEntryExitRecordOnCms } from './entry-exit-edit-entry-exit-record-definitions';
import { checkIfWithExitTime, getCorrectDateForEntryExit } from './entry-exit-utils';

Then(
    '{string} edits the entry & exit record for {string}',
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
            `${schoolAdminRole} edits entry & exit record for ${studentRole}`,
            async function () {
                await editEntryExitRecordOnCms(cms);
            }
        );
    }
);

Then(
    '{string} sees entry & exit record with the updated data',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles) {
        const cms = this.cms;

        const currentDate = new Date();
        const correctDate = getCorrectDateForEntryExit(currentDate);

        const entryDate = new Date(correctDate);
        if (checkIfWithExitTime(entryDate)) entryDate.setHours(entryDate.getHours() - 1);
        const entryHour = entryDate.getHours();
        const exitHour = entryDate.getHours();

        const editedEntryTime = `${entryHour}:00`;
        const editedExitTime = `${exitHour}:05`;

        await cms.instruction(`${schoolAdminRole} sees updated entry record`, async function () {
            await viewEntryExitRecordInBackOffice(cms, editedEntryTime);
        });

        await cms.instruction(`${schoolAdminRole} sees updated entry record`, async function () {
            await viewEntryExitRecordInBackOffice(cms, editedExitTime);
        });
    }
);
