import { gql } from 'graphql-tag';

import { KeyNotificationStatus } from '@supports/services/notificationmgmt-notification/const';

import { GraphqlBody } from '../../packages/graphql-client';
import {
    Communication_Eibanam_InfoNotificationMsgsGetNotificationIdByTitleQueryVariables,
    Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationIdQueryVariables,
} from './bob-types';

const getStatusAndCountReadByNotificationId = gql`
    query Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationId(
        $notification_id: String!
    ) {
        info_notifications(where: { notification_id: { _eq: $notification_id } }) {
            status

            all_receiver_aggregate: users_info_notifications_aggregate {
                aggregate {
                    count
                }
            }
            read_aggregate: users_info_notifications_aggregate(
                where: { status: { _eq: "USER_NOTIFICATION_STATUS_READ" } }
            ) {
                aggregate {
                    count
                }
            }
        }
    }
`;

const getNotificationIdByTitle = gql`
    query Communication_Eibanam_InfoNotificationMsgsGetNotificationIdByTitle(
        $notificationTitle: String!
    ) {
        info_notification_msgs(where: { title: { _eq: $notificationTitle } }) {
            info_notifications {
                notification_id
            }
            notification_msg_id
            title
        }
    }
`;

export type NotificationStatusType = keyof typeof KeyNotificationStatus;

class BobNotificationQuery {
    getStatusAndCountReadByNotificationId(
        variables: Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationIdQueryVariables
    ): GraphqlBody<Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationIdQueryVariables> {
        return {
            query: getStatusAndCountReadByNotificationId,
            variables,
        };
    }

    getNotificationIdByTitle(
        variables: Communication_Eibanam_InfoNotificationMsgsGetNotificationIdByTitleQueryVariables
    ): GraphqlBody<Communication_Eibanam_InfoNotificationMsgsGetNotificationIdByTitleQueryVariables> {
        return {
            query: getNotificationIdByTitle,
            variables,
        };
    }
}

const bobNotificationQueries = new BobNotificationQuery();

export default bobNotificationQueries;
