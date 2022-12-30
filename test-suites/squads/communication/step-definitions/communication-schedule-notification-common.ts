import { Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationIdQuery } from '@supports/graphql/bob/bob-types';
import { KeyNotificationStatus } from '@supports/services/notificationmgmt-notification/const';
import { ArrayElement } from '@supports/types/cms-types';

export interface CheckNotificationStatusInTimeReturn {
    all: number;
    read: number;
    isSent: boolean;
}

export const mappingResponseOfCheckNotificationStatusInTime = (
    result:
        | ArrayElement<
              Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationIdQuery['info_notifications']
          >
        | undefined
): CheckNotificationStatusInTimeReturn => {
    return {
        isSent: result?.status === KeyNotificationStatus.NOTIFICATION_STATUS_SENT,
        all: result?.all_receiver_aggregate.aggregate?.count || 0,
        read: result?.read_aggregate.aggregate?.count || 0,
    };
};
