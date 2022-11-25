declare namespace NsBobUploadReaderService {
    export interface UpsertMedia {
        type: MediaType;
        name: string;
        resource: string;
    }
}

export enum MediaType {
    MEDIA_TYPE_NONE = 0,
    MEDIA_TYPE_VIDEO = 1,
    MEDIA_TYPE_IMAGE = 2,
    MEDIA_TYPE_PDF = 3,
    MEDIA_TYPE_AUDIO = 4,
}

export default NsBobUploadReaderService;
