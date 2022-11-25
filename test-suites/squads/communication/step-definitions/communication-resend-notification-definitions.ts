import { saveButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';

import { CMSInterface, LearnerInterface } from '@supports/app-types';

import { resendNotificationButton } from './cms-selectors/communication';
import {
    firstIndex,
    learnerClickOnNotificationIcon,
    learnerClickOnNotificationItem,
    learnerSeesNotificationDetail,
} from './communication-common-definitions';
import { notificationItem, readNotificationStatus } from './learner-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

export async function confirmToResendNotification(cms: CMSInterface): Promise<void> {
    await cms.page?.click(saveButton);
}

export async function resendButtonIsDisable(cms: CMSInterface): Promise<void> {
    await cms.page?.isDisabled(resendNotificationButton);
}

export async function learnerSeesNotificationReadStatus(
    learner: LearnerInterface,
    status: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;

    const activeFinder = new ByValueKey(readNotificationStatus(status, firstIndex));
    await driver.waitFor(activeFinder);

    const contentDetailFinder = new ByValueKey(notificationItem(firstIndex));
    await driver.waitFor(contentDetailFinder);
}

export async function learnerReadNotification(learner: LearnerInterface): Promise<void> {
    await learner.instruction(
        `Click on notification button`,
        async function (this: LearnerInterface) {
            await learnerClickOnNotificationIcon(this);
        }
    );

    await learner.instruction(`Click on notification`, async function (this: LearnerInterface) {
        await learnerClickOnNotificationItem(this, true);
    });

    await learner.instruction(`Sees notification detail`, async function (this: LearnerInterface) {
        await learnerSeesNotificationDetail(this);
    });
}

export async function learnerWaitNotification(learner: LearnerInterface): Promise<void> {
    const notificationFinder = new ByValueKey(LearnerKeys.notificationIcon);
    await learner.flutterDriver?.waitFor(notificationFinder);
}
