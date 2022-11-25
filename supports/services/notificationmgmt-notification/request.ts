import { toRichTextManabuf, toTimestampNewProto } from '../common/request';
import {
    UpsertNotificationProps,
    NotificationEventKeys,
    NotificationStatusKeys,
    NotificationTypeKeys,
    UserGroupKeys,
} from './request-types';
import { questionnaireToGrpcObject } from './utils';
import {
    Notification,
    NotificationEvent,
    NotificationMessage,
    NotificationStatus,
    NotificationTargetGroup,
    NotificationTargetGroupSelect,
    NotificationType,
    Questionnaire,
} from 'manabuf/common/v1/notifications_pb';
import { UserGroup } from 'manabuf/common/v1/profiles_pb';
import {
    DiscardNotificationRequest,
    SendNotificationRequest,
    UpsertNotificationRequest,
} from 'manabuf/notificationmgmt/v1/notifications_pb';
import { arrayHasItem } from 'step-definitions/utils';

export const upsertNotificationRequest = (
    notification: UpsertNotificationProps,
    questionnaire?: Questionnaire.AsObject
): UpsertNotificationRequest => {
    const notificationReq = new Notification();
    if (notification.data) notificationReq.setData(notification.data);
    if (notification.notificationId) notificationReq.setNotificationId(notification.notificationId);
    const notificationMessageReq = new NotificationMessage();
    const richTextReq = toRichTextManabuf(
        notification.content.raw,
        notification.content.contentHTML
    );

    notificationMessageReq.setContent(richTextReq);
    notificationMessageReq.setMediaIdsList(notification.mediaIds || []);

    notificationMessageReq.setTitle(notification.title);
    notificationReq.setMessage(notificationMessageReq);
    notificationReq.setEditorId(notification.editorId!);

    notificationReq.setType(NotificationType[notification.type as NotificationTypeKeys]);
    notificationReq.setEvent(NotificationEvent[notification.event as NotificationEventKeys]);
    notificationReq.setStatus(NotificationStatus[notification.status as NotificationStatusKeys]);
    notificationReq.setExcludedGenericReceiverIdsList([]);

    notificationReq.setData('{}');
    notificationReq.setReceiverIdsList(notification.receiverIdsList);

    const targetGroupReq = new NotificationTargetGroup();
    const course = new NotificationTargetGroup.CourseFilter();
    const grade = new NotificationTargetGroup.GradeFilter();
    const userGroup = new NotificationTargetGroup.UserGroupFilter();
    const classFilter = new NotificationTargetGroup.ClassFilter();
    const location = new NotificationTargetGroup.LocationFilter();

    let type = NotificationTargetGroupSelect.NOTIFICATION_TARGET_GROUP_SELECT_ALL;

    if (!notification.isAllCourses) {
        if (notification.courseIds) course.setCourseIdsList(notification.courseIds);
        type = arrayHasItem(notification.courseIds)
            ? NotificationTargetGroupSelect.NOTIFICATION_TARGET_GROUP_SELECT_LIST
            : NotificationTargetGroupSelect.NOTIFICATION_TARGET_GROUP_SELECT_NONE;
    }
    course.setType(type);

    type = NotificationTargetGroupSelect.NOTIFICATION_TARGET_GROUP_SELECT_ALL;

    if (!notification.isAllGrades) {
        if (notification.gradeIds) grade.setGradesList(notification.gradeIds);
        type = arrayHasItem(notification.gradeIds)
            ? NotificationTargetGroupSelect.NOTIFICATION_TARGET_GROUP_SELECT_LIST
            : NotificationTargetGroupSelect.NOTIFICATION_TARGET_GROUP_SELECT_NONE;
    }
    grade.setType(type);

    classFilter.setType(NotificationTargetGroupSelect.NOTIFICATION_TARGET_GROUP_SELECT_NONE);
    classFilter.setClassIdsList([]);

    location.setType(NotificationTargetGroupSelect.NOTIFICATION_TARGET_GROUP_SELECT_NONE);
    location.setLocationIdsList([]);

    userGroup.setUserGroupsList(
        notification.targetGroup.map((e: string) => UserGroup[e as UserGroupKeys]) as UserGroup[]
    );

    targetGroupReq.setCourseFilter(course);
    targetGroupReq.setGradeFilter(grade);
    targetGroupReq.setUserGroupFilter(userGroup);
    targetGroupReq.setClassFilter(classFilter);
    targetGroupReq.setLocationFilter(location);

    notificationReq.setTargetGroup(targetGroupReq);

    if (notification.scheduledAt)
        notificationReq.setScheduledAt(toTimestampNewProto(notification.scheduledAt));

    const req = new UpsertNotificationRequest();
    req.setNotification(notificationReq);

    if (questionnaire != null) {
        req.setQuestionnaire(questionnaireToGrpcObject(questionnaire));
    }

    // TODO: @communication Add Filter Tag
    req.setTagIdsList([]);
    return req;
};

export const sendNotificationRequest = (id: string): SendNotificationRequest => {
    const req = new SendNotificationRequest();
    req.setNotificationId(id);
    return req;
};

export function discardNotificationRequest(id: string): DiscardNotificationRequest {
    const req = new DiscardNotificationRequest();
    req.setNotificationId(id);
    return req;
}
