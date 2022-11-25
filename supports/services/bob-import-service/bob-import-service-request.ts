import { convertCSVStringToBase64, convertToCSVString } from '../../../step-definitions/utils';
import { MasterCategory } from '../../enum';
import {
    getImportLocationDataPayload,
    getImportLocationTypeDataPayload,
} from './bob-import-service-payload';
import { ImportBobDataRequest, ImportBobDataPayload } from './types';
import { ImportLocationRequest, ImportLocationTypeRequest } from 'manabuf/bob/v1/masterdata_pb';

export const getImportBobDataRequest = (
    category: MasterCategory,
    payload?: ImportBobDataPayload
): ImportBobDataRequest => {
    let request: ImportBobDataRequest;
    let formattedPayload;

    switch (category) {
        case MasterCategory.Location:
            request = new ImportLocationRequest();
            formattedPayload = getImportLocationDataPayload();
            break;

        case MasterCategory.LocationType:
            request = new ImportLocationTypeRequest();
            formattedPayload = getImportLocationTypeDataPayload();
            break;

        default:
            request = null;
            formattedPayload = '';
            break;
    }

    if (!request) return null;

    if (payload) {
        const csvStringFormat = convertToCSVString([payload]);
        const base64Format = convertCSVStringToBase64(csvStringFormat);

        request.setPayload(base64Format);
    } else {
        request.setPayload(formattedPayload);
    }

    return request;
};
