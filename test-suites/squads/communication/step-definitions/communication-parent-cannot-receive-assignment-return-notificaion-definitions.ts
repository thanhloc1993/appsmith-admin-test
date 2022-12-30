import { LearnerInterface } from '@supports/app-types';

import { firstIndex } from './communication-common-definitions';
import { notificationItem } from './learner-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerDoesNotSeeNotificationInNotificationList(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const notificationItemFinder = new ByValueKey(notificationItem(firstIndex));
    await driver.waitForAbsent(notificationItemFinder);
}
