import { NotificationBadgeBehavior } from './communication-common-definitions';

export function getNotificationBadgeNumber(badgeBehavior: NotificationBadgeBehavior): number {
    if (badgeBehavior === 'without number') return 0;
    return Number(badgeBehavior);
}
