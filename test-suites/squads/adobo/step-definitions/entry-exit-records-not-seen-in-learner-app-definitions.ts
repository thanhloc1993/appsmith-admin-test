import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';

import { AccountRoles, LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function accountSeesEmptyEntryExitRecords(
    account: LearnerInterface,
    role: AccountRoles
) {
    await account.instruction(`${role} sees empty records`, async function () {
        const emptyRecordsFinder = new ByValueKey(LearnerKeys.emptyExitRecords);

        await account.flutterDriver?.waitFor(emptyRecordsFinder);
    });
}
