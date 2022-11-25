import ServiceBase from '../../base';
import NsChapterModifierServiceRequest from './request-types';
import {
    UpsertChaptersRequest,
    UpsertChaptersResponse,
} from 'manabuf/eureka/v1/chapter_modifier_pb';

export interface IChapterModifierService extends ServiceBase {
    /**
     * Create and update chapters using gRPC endpoint
     * @param {string} bookId The ID of the book to add or update chapters
     * @param {NsChapterModifierServiceRequest.UpsertChapters} chaptersList The chapter's info
     * @param {string} token User's token
     * @returns {Promise<{ request: UpsertChaptersRequest.AsObject, response?: UpsertChaptersResponse.AsObject }>} A Promise that will be fulfilled with the request and response
     * @example
     *      const {request, response} = await chapterModifierService.upsertChapters(bookId, chaptersList, token);
     */
    upsertChapters(
        token: string,
        bookId: string,
        chaptersList: NsChapterModifierServiceRequest.UpsertChapters
    ): Promise<{
        request: UpsertChaptersRequest.AsObject;
        response?: UpsertChaptersResponse.AsObject;
    }>;
}
