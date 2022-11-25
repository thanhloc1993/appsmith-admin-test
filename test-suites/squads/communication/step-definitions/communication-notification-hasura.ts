import { arrayHasItem, pick1stElement } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import {
    Communication_Eibanam_InfoNotificationMsgsGetNotificationIdByTitleQuery,
    Communication_Eibanam_InfoNotificationMsgsGetNotificationIdByTitleQueryVariables,
    Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationIdQuery,
    Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationIdQueryVariables,
} from '@supports/graphql/bob/bob-types';
import bobNotificationQueries from '@supports/graphql/bob/notification.query';
import { ArrayElement } from '@supports/types/cms-types';
import { formatDate } from '@supports/utils/time/time';

import { NotificationStatusKeysType } from './communication-utils';

interface GetInfoNotificationStatusAndCountReadByNotificationIdWithHasuraReturn
    extends Omit<
        ArrayElement<
            Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationIdQuery['info_notifications']
        >,
        'status'
    > {
    status: NotificationStatusKeysType;
}

export async function getInfoNotificationStatusAndCountReadByNotificationIdWithHasura(
    cms: CMSInterface,
    notificationIds: Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationIdQueryVariables['notification_id']
): Promise<GetInfoNotificationStatusAndCountReadByNotificationIdWithHasuraReturn | undefined> {
    const data = await cms.graphqlClient?.callGqlBob<{
        info_notifications: GetInfoNotificationStatusAndCountReadByNotificationIdWithHasuraReturn[];
    }>({
        body: bobNotificationQueries.getStatusAndCountReadByNotificationId({
            notification_id: notificationIds,
        }),
    });

    const infoNotifications = data?.data.info_notifications || [];

    if (!arrayHasItem(infoNotifications)) {
        await cms.attach(
            `Call getInfoNotificationReadCountReceiversWithHasura with notification_ids: ${notificationIds} failed at: ${formatDate(
                new Date(),
                'YYYY/MM/DD, HH:mm:ss'
            )}`
        );

        return undefined;
    }

    await cms.attach(
        `Call getInfoNotificationReadCountReceiversWithHasura with notification_ids: ${notificationIds} successfully at: ${formatDate(
            new Date(),
            'YYYY/MM/DD, HH:mm:ss'
        )}
        
        Response: ${JSON.stringify(infoNotifications)}`
    );

    return pick1stElement(infoNotifications);
}

export async function getNotificationIdByTitleWithHasura(
    cms: CMSInterface,
    title: Communication_Eibanam_InfoNotificationMsgsGetNotificationIdByTitleQueryVariables['notificationTitle']
) {
    const response =
        await cms.graphqlClient?.callGqlBob<Communication_Eibanam_InfoNotificationMsgsGetNotificationIdByTitleQuery>(
            {
                body: bobNotificationQueries.getNotificationIdByTitle({
                    notificationTitle: title,
                }),
            }
        );

    await cms.attach(
        `Call getNotificationIdByTitleWithHasura with title: ${title} successfully at: ${formatDate(
            new Date(),
            'YYYY/MM/DD, HH:mm:ss'
        )}
            
            Response: ${JSON.stringify(response)}`
    );

    const notificationId =
        response?.data.info_notification_msgs[0].info_notifications[0].notification_id;

    return notificationId;
}
