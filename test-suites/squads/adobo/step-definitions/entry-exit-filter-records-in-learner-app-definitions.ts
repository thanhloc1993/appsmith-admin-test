import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';

import { AccountRoles, LearnerInterface } from '@supports/app-types';
import { EntryExitEntity } from '@supports/entities/entry-exit-entity';

import { FilterTypes } from './entry-exit-filter-records-in-learner-app-steps';
import { accountSeesEntryExitRecord } from './entry-exit-record-entry-exit-time-learner-app-definitions';
import { TouchType } from './entry-exit-record-entry-exit-time-learner-app-steps';
import { ByValueKey } from 'flutter-driver-x';

export type FilterKey = 'thisMonth' | 'thisYear' | 'lastMonth';

export async function accountSeesAllEntryExitRecords(
    learner: LearnerInterface,
    records: EntryExitEntity[],
    touchType: TouchType,
    role: AccountRoles
) {
    for (let i = 0; i < records.length; i++) {
        await accountSeesEntryExitRecord(learner, records[i], touchType, role);
    }
}

export async function tapOnEntryExitRecordsFilter(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    await learner.instruction('Tap on entry exit records filter', async function () {
        const recordsFilterFinder = new ByValueKey(LearnerKeys.recordsFilterButton);
        await driver.tap(recordsFilterFinder);
    });
}

export async function tapOnChildItemOnEntryExitRecordsFilter(
    learner: LearnerInterface,
    filter: FilterTypes
) {
    const driver = learner.flutterDriver!;

    let filterKey = 'default';

    switch (filter) {
        case 'last month':
            filterKey = 'lastMonth';
            break;
        case 'this month':
            filterKey = 'thisMonth';
            break;
        case 'this year':
            filterKey = 'thisYear';
            break;
        default:
            break;
    }

    await learner.instruction(`Filter entry/exit records by ${filter}`, async function () {
        const recordsFilterChildItemFinder = new ByValueKey(
            LearnerKeys.recordsFilterChildItem(filterKey)
        );
        await driver.tap(recordsFilterChildItemFinder);
    });
}

export async function filterEntryExitRecordsByDate(learner: LearnerInterface, filter: FilterTypes) {
    await tapOnEntryExitRecordsFilter(learner);

    await tapOnChildItemOnEntryExitRecordsFilter(learner, filter);
}
