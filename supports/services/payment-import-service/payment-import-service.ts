import { UnaryOutput } from '@improbable-eng/grpc-web/dist/typings/unary';

import { MasterCategory } from '@supports/enum';

import { getImportPaymentDataRequest } from './payment-import-service-request';
import { getImportPaymentDataResponse } from './payment-import-service-response';
import { ImportPaymentDataPayload, ImportPaymentDataResponse } from './types';
import { ImportAccountingCategoryResponse } from 'manabuf/payment/v1/import_pb';
import { getPaymentError } from 'step-definitions/payment-utils';

export default class PaymentImportService {
    readonly serviceName = 'payment.v1.ImportMasterDataService';

    async importPaymentData(
        token: string,
        requestPayload: ImportPaymentDataPayload,
        category: MasterCategory
    ) {
        const request = getImportPaymentDataRequest(requestPayload, category);

        if (!request) return null;

        const response: UnaryOutput<ImportPaymentDataResponse> | null =
            await getImportPaymentDataResponse(request, category, this.serviceName, token);

        const errors: ImportAccountingCategoryResponse.AsObject | undefined =
            response?.message?.toObject();

        if (errors?.errorsList.length) {
            throw getPaymentError(
                `PaymentImportService 
                request ${JSON.stringify(requestPayload)}
                category: ${category} error ${JSON.stringify(errors.errorsList)}`
            );
        }

        return {
            request: request.toObject(),
            response: response ? response.message?.toObject() : null,
        };
    }
}
