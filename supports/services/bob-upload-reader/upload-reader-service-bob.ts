import { callGRPC } from '../grpc/grpc';
import { newUpsertMediaReq } from './request';
import NsBobUploadReaderService from './request-types';
import { IBobUploadReaderService } from './types';
import { UpsertMediaRequest, UpsertMediaResponse } from 'manabie-bob/class_pb';

export default class BobUploadReaderService implements IBobUploadReaderService {
    readonly serviceName = 'manabie.bob.Class';

    async upsertMedia(
        token: string,
        medias: NsBobUploadReaderService.UpsertMedia[]
    ): Promise<{
        request: UpsertMediaRequest.AsObject;
        response?: UpsertMediaResponse.AsObject;
    }> {
        const req = newUpsertMediaReq(medias!);

        const resp = await callGRPC<UpsertMediaRequest, UpsertMediaResponse>({
            serviceName: this.serviceName,
            methodName: 'UpsertMedia',
            request: req,
            token,
            requestType: UpsertMediaRequest,
            responseType: UpsertMediaResponse,
        });

        return { request: req.toObject(), response: resp.message?.toObject() };
    }
}
