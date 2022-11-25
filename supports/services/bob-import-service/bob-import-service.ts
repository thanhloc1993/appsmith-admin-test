import { MasterCategory } from '../../../supports/enum';
import { getImportBobDataRequest } from './bob-import-service-request';
import { getImportBobDataResponse } from './bob-import-service-response';
import { ImportBobDataPayload } from './types';

export default class BobImportService {
    readonly serviceName = 'bob.v1.MasterDataImporterService';

    async importBobData(token: string, category: MasterCategory, payload?: ImportBobDataPayload) {
        const request = getImportBobDataRequest(category, payload);

        if (!request) return null;

        const response = await getImportBobDataResponse(request, category, this.serviceName, token);

        return {
            request: request.toObject(),
            response: response ? response.message?.toObject() : null,
        };
    }
}
