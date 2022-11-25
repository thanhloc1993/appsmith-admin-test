import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { formatDate } from '@supports/utils/time/time';

import {
    cmsGoToStudentEntryExitTab,
    StatusTypes,
    viewEntryExitRecordInBackOffice,
} from './entry-exit-add-entry-exit-record-definitions';
import { FilterTypes } from './entry-exit-filter-records-in-learner-app-steps';
import {
    createExistingRecordForStudent,
    filterEntryExitRecordsByDateInBackOffice,
} from './entry-exit-records-list-definitions';
import {
    checkIfWithExitTime,
    getCorrectDateForEntryExit,
    retrieveRecordDataByFilter,
} from './entry-exit-utils';

const currentDate = new Date();
const correctDate = getCorrectDateForEntryExit(currentDate);

const lastMonthDate = new Date(
    correctDate.getFullYear(),
    correctDate.getMonth() - 1,
    correctDate.getDate()
);
const thisYearDate = new Date(
    correctDate.getFullYear(),
    correctDate.getMonth() - 2,
    correctDate.getDate()
);
const lastYearDate = new Date(
    correctDate.getFullYear() - 1,
    correctDate.getMonth(),
    correctDate.getDate()
);

lastMonthDate.setHours(8);
thisYearDate.setHours(8);
lastYearDate.setHours(8);

const recordDates = [lastYearDate, thisYearDate, lastMonthDate, correctDate];
const timeFrames = ['last year', 'this year', 'last month', 'this month'];

Given(
    '{string} has at least 1 entry & exit record at this month, last month, this year and the last 2 years',
    async function (this: IMasterWorld, studentRole: AccountRoles) {
        const cms = this.cms;
        const scenario = this.scenario;

        const learnerProfile = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        for (let i = 0; i < timeFrames.length; i++) {
            const instruction = `School admin creates a record from ` + timeFrames[i];
            await cms.instruction(instruction, async function () {
                await createExistingRecordForStudent(
                    cms,
                    learnerProfile,
                    recordDates[i],
                    checkIfWithExitTime(recordDates[i])
                );
            });
        }
    }
);

When(
    '{string} views entry & exit information of {string} {string}',
    async function (
        this: IMasterWorld,
        schoolAdminRole: AccountRoles,
        status: StatusTypes,
        studentRole: AccountRoles
    ) {
        const cms = this.cms;

        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await cms.instruction(
            `${schoolAdminRole} goes to Entry & Exit tab in Student Detail page of ${studentRole} with status: ${status}`,
            async function () {
                await cmsGoToStudentEntryExitTab(cms, learnerProfile);
            }
        );
    }
);

Then(
    '{string} sees all records displayed as default',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles) {
        const cms = this.cms;

        for (let i = 0; i < timeFrames.length; i++) {
            const instruction = `${schoolAdminRole} sees record from ` + timeFrames[i];
            await cms.instruction(instruction, async function () {
                await viewEntryExitRecordInBackOffice(
                    cms,
                    formatDate(recordDates[i], 'YYYY/MM/DD')
                );
            });
        }
    }
);

When(
    '{string} selects filter = {string}',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles, filter: FilterTypes) {
        const cms = this.cms;
        await cms.instruction(
            `${schoolAdminRole} sees all records under ${filter}`,
            async function () {
                await filterEntryExitRecordsByDateInBackOffice(cms, filter);
            }
        );
    }
);

Then(
    `{string} sees all records from {string} displayed`,
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles, filter: FilterTypes) {
        const cms = this.cms;
        const recordDates = retrieveRecordDataByFilter(
            correctDate,
            lastMonthDate,
            thisYearDate,
            filter
        );

        await cms.instruction(`${schoolAdminRole} sees all ${filter} records`, async function () {
            for (let i = 0; i < recordDates.length; i++) {
                await viewEntryExitRecordInBackOffice(
                    cms,
                    formatDate(recordDates[i], 'YYYY/MM/DD')
                );
            }
        });
    }
);
