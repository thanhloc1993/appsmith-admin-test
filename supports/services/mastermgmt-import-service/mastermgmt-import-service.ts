import { MasterCategory } from '../../enum';
import { getImportBobDataRequest } from './mastermgmt-import-service-request';
import { getImportBobDataResponse } from './mastermgmt-import-service-response';
import { ImportBobDataPayload } from './types';

export default class MastermgmtImportService {
    async importBobData(token: string, category: MasterCategory, payload?: ImportBobDataPayload) {
        const request = getImportBobDataRequest(category, payload);

        if (!request) return null;

        const response = await getImportBobDataResponse(request, category, token);

        return {
            request: request.toObject(),
            response: response ? response.message?.toObject() : null,
        };
    }
}
