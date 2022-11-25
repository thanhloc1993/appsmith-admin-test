import { callGRPC } from '../../grpc/grpc';
import { createUpsertBooksRequest } from './request';
import NsBookModifierServiceRequest from './request-types';
import { IBookModifierServiceService } from './types';
import { UpsertBooksRequest, UpsertBooksResponse } from 'manabuf/eureka/v1/book_modifier_pb';

export default class BookModifierService implements IBookModifierServiceService {
    serviceName = 'eureka.v1.BookModifierService';

    async upsertBooks(
        bookList: NsBookModifierServiceRequest.UpsertBooks[],
        token: string
    ): Promise<{
        request: UpsertBooksRequest.AsObject;
        response?: UpsertBooksResponse.AsObject | undefined;
    }> {
        const request = createUpsertBooksRequest(bookList);
        const response = await callGRPC<UpsertBooksRequest, UpsertBooksResponse>({
            serviceName: this.serviceName,
            methodName: 'UpsertBooks',
            request,
            token,
            requestType: UpsertBooksRequest,
            responseType: UpsertBooksResponse,
        });

        return {
            request: request.toObject(),
            response: response.message?.toObject(),
        };
    }
}
