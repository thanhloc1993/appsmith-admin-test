import { UnaryOutput } from '@improbable-eng/grpc-web/dist/typings/unary';

import { callGRPC } from '../grpc/grpc';
import {
    RetrieveNotificationsRequest,
    RetrieveNotificationsResponse,
} from 'manabuf/bob/v1/notifications_pb';

export class NotificationReaderService {
    readonly serviceName = 'bob.v1.NotificationReaderService';

    // Example
    // const response: UnaryOutput<RetrieveNotificationsResponse> = await NotificationReaderService.retrieveNotifications(
    //     await learner.getToken()
    // );
    // retrieveNotifications same name with BE to help debug
    async retrieveNotifications(
        token: string
    ): Promise<UnaryOutput<RetrieveNotificationsResponse>> {
        const request = new RetrieveNotificationsRequest();

        return callGRPC<RetrieveNotificationsRequest, RetrieveNotificationsResponse>({
            serviceName: this.serviceName,
            methodName: 'RetrieveNotifications',
            request,
            token,
            requestType: RetrieveNotificationsRequest,
            responseType: RetrieveNotificationsResponse,
        });
    }
}
