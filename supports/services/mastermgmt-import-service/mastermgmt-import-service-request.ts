import { convertCSVStringToBase64, convertToCSVString } from '../../../step-definitions/utils';
import { MasterCategory } from '../../enum';
import {
    getImportClassDataPayload,
    getImportGradeMasterDataPayload,
} from './mastermgmt-import-service-payload';
import { ImportBobDataRequest, ImportBobDataPayload } from './types';
import { ImportGradeRequest } from 'manabuf/bob/v1/grades_pb';
import { ImportClassRequest } from 'manabuf/mastermgmt/v1/class_pb';

export const getImportBobDataRequest = (
    category: MasterCategory,
    payload?: ImportBobDataPayload
): ImportBobDataRequest => {
    let request: ImportBobDataRequest;
    let formattedPayload;

    switch (category) {
        case MasterCategory.Grade:
            request = new ImportGradeRequest();
            formattedPayload = getImportGradeMasterDataPayload();
            break;

        case MasterCategory.Class:
            request = new ImportClassRequest();
            formattedPayload = getImportClassDataPayload();
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
