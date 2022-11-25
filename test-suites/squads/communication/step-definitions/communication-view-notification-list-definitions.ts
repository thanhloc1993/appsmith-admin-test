import { CMSInterface } from '@supports/app-types';
import notificationMgmtNotificationService from '@supports/services/notificationmgmt-notification';
import {
    KeyNotificationStatus,
    UserRoles,
} from '@supports/services/notificationmgmt-notification/const';
import { formatDate } from '@supports/utils/time/time';

import { createANotificationGrpc } from './communication-create-notification-definitions';

export async function createNotificationWithStatus(cms: CMSInterface, learnId: string) {
    const token = await cms.getToken();

    const currentDate = new Date();

    const scheduledAt = new Date(new Date(currentDate).setDate(currentDate.getDate() + 1));

    scheduledAt.setHours(currentDate.getHours());

    const scheduleDateStr = formatDate(scheduledAt, 'YYYY/MM/DD, HH:mm');

    const createdNotificationData = createANotificationGrpc({
        courseIds: [],
        gradeIds: [],
        mediaIds: [],
        isAllCourses: false,
        isAllGrades: false,
        targetGroup: [UserRoles.USER_GROUP_STUDENT],
        receiverIdsList: [learnId],
    });

    const createdNotificationScheduleData = createANotificationGrpc({
        ...createdNotificationData,
        title: `Notification E2E gRPC test Schedule ${scheduleDateStr}`,
        scheduledAt,
        status: KeyNotificationStatus.NOTIFICATION_STATUS_SCHEDULED,
    });

    await cms.attach(`Create Draft Notification by gRPC ${createdNotificationScheduleData.title}`);
    await notificationMgmtNotificationService.upsertNotification(token, createdNotificationData);

    await cms.attach(
        `Create Schedule Notification by gRPC ${createdNotificationScheduleData.title}`
    );
    await notificationMgmtNotificationService.upsertNotification(
        token,
        createdNotificationScheduleData
    );

    await cms.attach(`Send Notification by gRPC ${createdNotificationScheduleData.title}`);
    const { response } = await notificationMgmtNotificationService.upsertNotification(
        token,
        createdNotificationData
    );

    if (!response) throw Error('cannot send notification');

    await notificationMgmtNotificationService.sendNotification(token, response.notificationId);
}
