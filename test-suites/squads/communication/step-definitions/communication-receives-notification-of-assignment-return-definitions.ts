import { LearnerInterface } from '@supports/app-types';

import { learnerClickOnNotificationIcon } from './communication-common-definitions';
import { notificationItem, readNotificationStatus } from './learner-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerSeesNewNotificationsFromHomeScreen(
    learner: LearnerInterface,
    numOfNotifications: number
): Promise<void> {
    const driver = learner.flutterDriver!;

    await learnerClickOnNotificationIcon(learner);

    for (let index = 0; index < numOfNotifications; index++) {
        const readNotificationStatusFinder = new ByValueKey(readNotificationStatus(true, index));
        await driver.waitFor(readNotificationStatusFinder);

        const notificationItemFinder = new ByValueKey(notificationItem(index));
        await driver.waitFor(notificationItemFinder);
    }
}
