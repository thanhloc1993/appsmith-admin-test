import { toArr } from '../../../step-definitions/utils';
import NsBobUploadReaderService from './request-types';
import { Media, UpsertMediaRequest } from 'manabie-bob/class_pb';

export function newUpsertMediaReq(
    medias: Required<NsBobUploadReaderService.UpsertMedia[]>
): UpsertMediaRequest {
    const req = new UpsertMediaRequest();
    const arrData = toArr(medias);

    arrData.forEach((e: NsBobUploadReaderService.UpsertMedia) => {
        const media = new Media();

        media.setName(e.name);
        media.setResource(e.resource);
        media.setType(e.type);

        req.addMedia(media);
    });

    return req;
}
