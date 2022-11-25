import { EditorState } from 'draft-js';
import {
    Notification,
    NotificationEvent,
    NotificationMessage as NotificationMessageInformation,
    NotificationStatus,
    NotificationTargetGroup,
    NotificationType,
} from 'manabuf/common/v1/notifications_pb';
import { UserGroup } from 'manabuf/common/v1/profiles_pb';
import {
    DiscardNotificationRequest,
    NotifyUnreadUserRequest,
    SendNotificationRequest,
} from 'manabuf/notificationmgmt/v1/notifications_pb';

export type UserGroupKeys = keyof typeof UserGroup;
export type NotificationEventKeys = keyof typeof NotificationEvent;
export type NotificationStatusKeys = keyof typeof NotificationStatus;
export type NotificationTypeKeys = keyof typeof NotificationType;
export type NotificationTargetGroupKeys = keyof typeof NotificationTargetGroup;

export interface SendNotification extends SendNotificationRequest.AsObject {}

export interface NotificationTypes extends Notification.AsObject {}

export interface DiscardNotification extends DiscardNotificationRequest.AsObject {}

export interface NotifyUnreadUser extends NotifyUnreadUserRequest.AsObject {}

export interface NotificationMessage extends NotificationMessageInformation.AsObject {}

export interface GradesTargetGroup extends NotificationTargetGroup.GradeFilter.AsObject {}

export interface CoursesTargetGroup extends NotificationTargetGroup.CourseFilter.AsObject {}

export interface UpsertNotificationProps
    extends Omit<
        NotificationTypes,
        | 'data'
        | 'editorId'
        | 'type'
        | 'event'
        | 'status'
        | 'targetGroup'
        | 'schoolId'
        | 'genericReceiverIdsList'
    > {
    notificationId: NotificationTypes['notificationId'];
    content: {
        raw: EditorState;
        contentHTML: string;
    };
    title: NotificationMessage['title'];
    gradeIds: GradesTargetGroup['gradesList'];
    courseIds: CoursesTargetGroup['courseIdsList'];
    receiverIdsList: NotificationTypes['receiverIdsList'];

    status: string; // NotificationStatusKeys
    type: string; // NotificationTypeKeys
    event: string; // NotificationEventKeys
    targetGroup: string[]; // NotificationTargetGroupKeys

    files?: File[];
    data?: NotificationTypes['data'];
    editorId?: NotificationTypes['editorId'];

    scheduledAt?: NotificationTypes['scheduledAt'];
    mediaIds?: NotificationMessage['mediaIdsList'];

    isAllCourses: boolean;
    isAllGrades: boolean;
}
