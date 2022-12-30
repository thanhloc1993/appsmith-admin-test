import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    accountSeesAllEntryExitRecords,
    filterEntryExitRecordsByDate,
} from './entry-exit-filter-records-in-learner-app-definitions';

export type FilterTypes = 'default' | 'this month' | 'this year' | 'last month';

When(
    `{string} and {string} select filter {string}`,
    async function (
        this: IMasterWorld,
        studentRole: AccountRoles,
        parentRole: AccountRoles,
        filter: FilterTypes
    ) {
        const learner = getLearnerInterfaceFromRole(this, studentRole);
        const parent = this.parent!;

        await learner.instruction(
            `${studentRole} sees all records under ${filter}`,
            async function () {
                await filterEntryExitRecordsByDate(learner, filter);
            }
        );

        await parent.instruction(
            `${parentRole} sees all records under ${filter}`,
            async function () {
                await filterEntryExitRecordsByDate(parent, filter);
            }
        );
    }
);

Then(
    `{string} and {string} sees all records from {string} display`,
    async function (
        this: IMasterWorld,
        studentRole: AccountRoles,
        parentRole: AccountRoles,
        filter: FilterTypes
    ) {
        const learner = getLearnerInterfaceFromRole(this, studentRole);
        const parent = this.parent!;
        const { records } = await learner.getEntryExitRecords();

        await learner.instruction(`${studentRole} sees all ${filter} records`, async function () {
            await accountSeesAllEntryExitRecords(learner, records, 'Entry', studentRole);
            await accountSeesAllEntryExitRecords(learner, records, 'Exit', studentRole);
        });

        await parent.instruction(`${parentRole} sees all ${filter} records`, async function () {
            await accountSeesAllEntryExitRecords(parent, records, 'Entry', parentRole);
            await accountSeesAllEntryExitRecords(parent, records, 'Exit', parentRole);
        });
    }
);
