import { callGRPC } from '../../grpc/grpc';
import { createUpsertChaptersRequest } from './request';
import NsChapterModifierServiceRequest from './request-types';
import { IChapterModifierService } from './types';
import {
    UpsertChaptersRequest,
    UpsertChaptersResponse,
} from 'manabuf/eureka/v1/chapter_modifier_pb';

export default class ChapterModifierService implements IChapterModifierService {
    serviceName = 'eureka.v1.ChapterModifierService';

    async upsertChapters(
        token: string,
        bookId: string,
        chaptersList: NsChapterModifierServiceRequest.UpsertChapters
    ): Promise<{
        request: UpsertChaptersRequest.AsObject;
        response?: UpsertChaptersResponse.AsObject | undefined;
    }> {
        const request = createUpsertChaptersRequest(bookId, chaptersList);
        const response = await callGRPC<UpsertChaptersRequest, UpsertChaptersResponse>({
            serviceName: this.serviceName,
            methodName: 'UpsertChapters',
            request,
            token,
            requestType: UpsertChaptersRequest,
            responseType: UpsertChaptersResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}
