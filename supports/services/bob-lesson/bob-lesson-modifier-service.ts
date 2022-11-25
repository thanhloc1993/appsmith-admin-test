import { UnaryOutput } from '@improbable-eng/grpc-web/dist/typings/unary';

import { toTimestampNewProto } from '../common/request';
import { callGRPC } from '../grpc/grpc';
import {
    DeleteLiveLessonRequest,
    DeleteLiveLessonResponse,
    CreateLiveLessonRequest,
    CreateLiveLessonResponse,
    UpdateLiveLessonRequest,
    UpdateLiveLessonResponse,
} from 'manabuf/bob/v1/lessons_pb';

interface LiveLessonUpsertData {
    id?: string;
    name: string;
    courseId: string;
    teacherIds: Array<string>;
    learnerIds: Array<string>;
    startTime?: Date;
    endTime?: Date;
}
export default class LessonModifierService {
    static serviceName = 'bob.v1.LessonModifierService';

    // Example
    // const response: any = await NotificationReaderService.retrieveNotifications(
    //     await learner.getToken()
    // );
    // retrieveNotifications same name with BE to help debug
    static async deleteLiveLesson(
        token: string,
        id: string
    ): Promise<UnaryOutput<DeleteLiveLessonResponse>> {
        const request = new DeleteLiveLessonRequest();
        request.setId(id);
        return callGRPC<DeleteLiveLessonRequest, DeleteLiveLessonResponse>({
            serviceName: this.serviceName,
            methodName: 'DeleteLiveLesson',
            request: request,
            token,
            requestType: DeleteLiveLessonRequest,
            responseType: DeleteLiveLessonResponse,
        });
    }

    static setRequestData = async (
        request: CreateLiveLessonRequest | UpdateLiveLessonRequest,
        requestData: LiveLessonUpsertData
    ) => {
        if (requestData.startTime !== undefined) {
            request.setStartTime(toTimestampNewProto(requestData.startTime));
        } else {
            const sd = new Date();
            sd.setFullYear(sd.getFullYear() + 1);
            const startTime = toTimestampNewProto(sd);
            request.setStartTime(startTime);
        }

        if (requestData.endTime !== undefined) {
            request.setEndTime(toTimestampNewProto(requestData.endTime));
        } else {
            const ed = new Date();
            ed.setFullYear(ed.getFullYear() + 2);
            const endTime = toTimestampNewProto(ed);
            request.setEndTime(endTime);
        }

        request.setName(requestData.name);
        request.setTeacherIdsList(requestData.teacherIds);
        request.setLearnerIdsList(requestData.learnerIds);
        request.setCourseIdsList([requestData.courseId]);
    };

    static async createLiveLesson(
        token: string,
        requestData: LiveLessonUpsertData
    ): Promise<{
        request: CreateLiveLessonRequest.AsObject;
        response: CreateLiveLessonResponse.AsObject | undefined;
    }> {
        const request = new CreateLiveLessonRequest();
        await this.setRequestData(request, requestData);

        const response = await callGRPC<CreateLiveLessonRequest, CreateLiveLessonResponse>({
            serviceName: this.serviceName,
            methodName: 'CreateLiveLesson',
            request: request,
            token,
            requestType: CreateLiveLessonRequest,
            responseType: CreateLiveLessonResponse,
        });
        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }

    static async updateLiveLesson(
        token: string,
        requestData: LiveLessonUpsertData
    ): Promise<{
        request: UpdateLiveLessonRequest.AsObject;
        response: UpdateLiveLessonResponse.AsObject | undefined;
    }> {
        const request = new UpdateLiveLessonRequest();
        request.setId(requestData.id!);
        await this.setRequestData(request, requestData);

        const response = await callGRPC<UpdateLiveLessonRequest, UpdateLiveLessonResponse>({
            serviceName: this.serviceName,
            methodName: 'UpdateLiveLesson',
            request: request,
            token,
            requestType: UpdateLiveLessonRequest,
            responseType: UpdateLiveLessonResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}
