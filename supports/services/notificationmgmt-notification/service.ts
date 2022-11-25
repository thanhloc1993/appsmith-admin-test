import { callGRPC } from '../grpc/grpc';
import {
    upsertNotificationRequest,
    sendNotificationRequest,
    discardNotificationRequest,
} from './request';
import { UpsertNotificationProps } from './request-types';
import { Questionnaire } from 'manabuf/common/v1/notifications_pb';
import {
    DiscardNotificationRequest,
    DiscardNotificationResponse,
    SendNotificationRequest,
    SendNotificationResponse,
    UpsertNotificationRequest,
    UpsertNotificationResponse,
} from 'manabuf/notificationmgmt/v1/notifications_pb';

export default class NotificationMgmtNotificationService {
    readonly serviceName = 'notificationmgmt.v1.NotificationModifierService';

    async upsertNotification(
        token: string,
        notification: UpsertNotificationProps,
        questionnaire?: Questionnaire.AsObject
    ): Promise<{
        request: UpsertNotificationRequest.AsObject;
        response?: UpsertNotificationResponse.AsObject;
    }> {
        const request = upsertNotificationRequest(notification, questionnaire);
        const response = await callGRPC<UpsertNotificationRequest, UpsertNotificationResponse>({
            serviceName: this.serviceName,
            methodName: 'UpsertNotification',
            request,
            token,
            requestType: UpsertNotificationRequest,
            responseType: UpsertNotificationResponse,
        });
        return { request: request.toObject(), response: response.message?.toObject() };
    }

    async sendNotification(
        token: string,
        id: string
    ): Promise<{
        request: SendNotificationRequest.AsObject;
        response?: SendNotificationResponse.AsObject;
    }> {
        const request = sendNotificationRequest(id);

        const response = await callGRPC<SendNotificationRequest, SendNotificationResponse>({
            serviceName: this.serviceName,
            methodName: 'SendNotification',
            request,
            token,
            requestType: SendNotificationRequest,
            responseType: SendNotificationResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }

    async discardNotification(
        token: string,
        id: string
    ): Promise<{
        request: DiscardNotificationRequest.AsObject;
        response?: DiscardNotificationResponse.AsObject;
    }> {
        const request = discardNotificationRequest(id);

        const response = await callGRPC<DiscardNotificationRequest, DiscardNotificationResponse>({
            serviceName: this.serviceName,
            methodName: 'DiscardNotification',
            request,
            token,
            requestType: DiscardNotificationRequest,
            responseType: DiscardNotificationResponse,
        });

        return { request: request.toObject(), response: response.message?.toObject() };
    }
}
