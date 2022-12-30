import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';

import { AccountRoles, LearnerInterface } from '@supports/app-types';
import { EntryExitEntity } from '@supports/entities/entry-exit-entity';
import { formatDate } from '@supports/utils/time/time';

import { ByValueKey } from 'flutter-driver-x';

export type TouchType = 'Entry' | 'Exit';

export async function tapOnMyEntryExitRecords(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    await learner.instruction('Select My Entry & Exit Records in app drawer', async function () {
        const myEntryExitRecordsDrawerFinder = new ByValueKey(
            LearnerKeys.entryExitRecordsDrawerItem
        );
        await driver.tap(myEntryExitRecordsDrawerFinder);
    });
}

export async function accountSeesEntryExitRecord(
    learner: LearnerInterface,
    record: EntryExitEntity,
    touchType: TouchType,
    role: AccountRoles
) {
    const driver = learner.flutterDriver!;

    const { id, entry, exit } = record;

    // convert record timestamp to milliseconds
    const touchDateTimestamp = touchType === 'Entry' ? entry : exit!;
    const touchDate = new Date(touchDateTimestamp / 1000);

    const formattedDate = formatDate(touchDate, 'M/D H:mm');

    const finder = new ByValueKey(LearnerKeys.recordTimeText(id, touchType, formattedDate));

    await learner.instruction(
        `${role} sees ${touchType} time ${formattedDate} has been recorded`,
        async function () {
            await driver.waitFor(finder);
        }
    );
}

export async function accountSeesNoExitRecord(learner: LearnerInterface, recordId: number) {
    const driver = learner.flutterDriver!;

    const finder = new ByValueKey(LearnerKeys.recordTimeText(recordId, 'Exit', '--'));
    await driver.waitFor(finder);
}
