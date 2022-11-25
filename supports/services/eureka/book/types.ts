import ServiceBase from '../../base';
import NsBookModifierServiceRequest from './request-types';
import { UpsertBooksRequest, UpsertBooksResponse } from 'manabuf/eureka/v1/book_modifier_pb';

export interface IBookModifierServiceService extends ServiceBase {
    /**
     * Create and update books using gRPC endpoint
     * @param {IBookModifierServiceService.UpsertBooks} bookList The book's info
     * @param {string} token User's token
     * @returns {Promise<{ request: UpsertBooksRequest.AsObject, response?: UpsertBooksResponse.AsObject }>} A Promise that will be fulfilled with the request and response
     * @example
     *      const {request, response} = await bookModifierService.upsertBooks(bookList, token);
     */
    upsertBooks(
        bookList: NsBookModifierServiceRequest.UpsertBooks[],
        token: string
    ): Promise<{
        request: UpsertBooksRequest.AsObject;
        response?: UpsertBooksResponse.AsObject;
    }>;
}
