import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function tapOnMyQrCode(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    await learner.instruction('Select My Qr Code in app drawer', async function () {
        const myQrCodeDrawerItemFinder = new ByValueKey(LearnerKeys.myQrCodeDrawerItem);
        await driver.tap(myQrCodeDrawerItemFinder);
    });
}

export async function learnerSeesQrCode(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    await learner.instruction('See student QR code', async function () {
        const learnerQrCodeFinder = new ByValueKey(LearnerKeys.qrCode);

        // make sure animation widget find key
        await driver.runUnsynchronized(async () => {
            await driver.waitFor(learnerQrCodeFinder);
        });
    });
}
