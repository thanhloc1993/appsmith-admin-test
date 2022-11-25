import ServiceBase from '../base';
import NsBobUploadReaderService from './request-types';
import { UpsertMediaRequest, UpsertMediaResponse } from 'manabie-bob/class_pb';

export interface IBobUploadReaderService extends ServiceBase {
    /**
     * Creates or updates media using gRPC endpoint.
     * @param {string} token The user's token
     * @param {NsBobUploadReaderService.UpsertMedia[]} medias The media to be created or updated
     * @returns {Promise<{ request: UpsertAssignmentRequest.AsObject, response?: UpsertAssignmentResponse.AsObject }>} A Promise that will be fulfilled with the request and a response containing the IDs of the processed assignments
     */
    upsertMedia(
        token: string,
        medias: NsBobUploadReaderService.UpsertMedia[]
    ): Promise<{
        request: UpsertMediaRequest.AsObject;
        response?: UpsertMediaResponse.AsObject;
    }>;
}
