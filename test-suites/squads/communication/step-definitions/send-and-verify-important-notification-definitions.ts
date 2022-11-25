import { LearnerInterface } from '@supports/app-types';
import { NotificationFilterEnum } from '@supports/enum';

import { firstIndex } from './communication-common-definitions';
import {
    notificationItem,
    notificationItemIcon,
    notificationsTabBarImportantOnly,
} from './learner-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerClicksOnImportantTabBar(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const importantTabBarFinder = new ByValueKey(notificationsTabBarImportantOnly);
    await driver.tap(importantTabBarFinder);
}

export async function verifyNotificationItemInNotificationList(
    learner: LearnerInterface,
    tab: NotificationFilterEnum,
    isImportant: boolean,
    isQuestionnaire: boolean
) {
    const driver = learner.flutterDriver!;
    const notificationItemFinder = new ByValueKey(notificationItem(firstIndex));

    if (tab == NotificationFilterEnum.importantOnly && isImportant == false) {
        await driver.waitForAbsent(notificationItemFinder);
    } else {
        await driver.waitFor(notificationItemFinder);

        const notificationItemIconFinder = new ByValueKey(
            notificationItemIcon(isImportant, isQuestionnaire)
        );
        await driver.waitFor(notificationItemIconFinder);
    }
}
