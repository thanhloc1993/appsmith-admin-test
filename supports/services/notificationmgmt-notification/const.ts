import { convertEnumKeys } from '../../../step-definitions/utils';
import { UserGroup, UserNotificationStatus, MediaType } from 'manabie-bob/enum_pb';
import {
    NotificationStatus,
    NotificationType,
    NotificationEvent,
    NotificationTargetGroupSelect,
} from 'manabuf/common/v1/notifications_pb';

// Notification
export const UserRoles = convertEnumKeys(UserGroup);
export const KeyMediaTypes = convertEnumKeys(MediaType);
export const KeyNotificationType = convertEnumKeys(NotificationType);
export const KeyNotificationTargetGroupSelect = convertEnumKeys(NotificationTargetGroupSelect);
export const KeyNotificationStatus = convertEnumKeys(NotificationStatus);
export const KeyNotificationEvent = convertEnumKeys(NotificationEvent);
export const KeyUserNotificationStatus = convertEnumKeys(UserNotificationStatus);
