import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { StudentDetailTab } from '@supports/types/cms-types';
import { formatDate } from '@supports/utils/time/time';

import {
    cmsGoToStudentEntryExitTab,
    viewEntryExitRecordInBackOffice,
} from './entry-exit-add-entry-exit-record-definitions';
import { attemptEditOrDeleteEntryExitRecord } from './entry-exit-cannot-edit-entry-exit-record-definitions';
import {
    deleteEntryExitRecordOnCMS,
    schoolAdminSeesDisabledDeleteEntryExitRecord,
} from './entry-exit-delete-entry-exit-record-definitions';
import { createExistingRecordForStudent } from './entry-exit-records-list-definitions';
import { checkIfWithExitTime, getCorrectDateForEntryExit } from './entry-exit-utils';
import { schoolAdminChooseTabInStudentDetail } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

const currentDate = new Date();
const correctDate = getCorrectDateForEntryExit(currentDate);

const previousDate = new Date(
    correctDate.getFullYear(),
    correctDate.getMonth(),
    correctDate.getDate() - 1
);

const previousDateWithFormat = formatDate(previousDate, 'YYYY/MM/DD');

Given(
    'at least 2 entry & exit records have been created for {string}',
    async function (this: IMasterWorld, studentRole: AccountRoles) {
        const cms = this.cms;
        const scenario = this.scenario;

        const learnerProfile = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        // yesterday
        await cms.instruction(`School admin creates a record from yesterday`, async function () {
            previousDate.setHours(8);

            await createExistingRecordForStudent(
                cms,
                learnerProfile,
                previousDate,
                checkIfWithExitTime(previousDate)
            );
        });

        // today
        await cms.instruction(`School admin creates a record from today`, async function () {
            await createExistingRecordForStudent(
                cms,
                learnerProfile,
                correctDate,
                checkIfWithExitTime(correctDate)
            );
        });
    }
);

When(
    '{string} deletes the selected entry & exit record of {string}',
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
            `${schoolAdminRole} deletes record for ${studentRole}`,
            async function () {
                await deleteEntryExitRecordOnCMS(cms, 'confirm');
            }
        );
    }
);

When(
    '{string} tries to delete the selected entry & exit record of {string}',
    async function (
        this: IMasterWorld,
        schoolAdminRole: AccountRoles,
        studentRole: AccountRoles
    ): Promise<void> {
        const cms = this.cms;

        // We are already on Student Detail page
        await cms.instruction(
            `${schoolAdminRole} goes to Entry & Exit tab in Student Detail page of ${studentRole}`,
            async function () {
                await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.ENTRY_EXIT);
                await cms.waitForSkeletonLoading();
            }
        );

        await cms.instruction(
            `${schoolAdminRole} tries to delete record for ${studentRole}`,
            async function () {
                await attemptEditOrDeleteEntryExitRecord(cms);
            }
        );
    }
);

Then(
    '{string} sees entry & exit record has been deleted',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles) {
        const cms = this.cms;

        await cms.instruction(`${schoolAdminRole} only sees yesterday's record`, async function () {
            await viewEntryExitRecordInBackOffice(cms, previousDateWithFormat);
        });
    }
);

Then(
    '{string} sees that they cannot delete the record',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles) {
        const cms = this.cms;

        await cms.instruction(
            `${schoolAdminRole} sees that the Delete action is disabled`,
            async function () {
                await schoolAdminSeesDisabledDeleteEntryExitRecord(cms);
            }
        );
    }
);
