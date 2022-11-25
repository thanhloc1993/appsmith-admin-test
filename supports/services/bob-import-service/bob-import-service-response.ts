import { UnaryOutput } from '@improbable-eng/grpc-web/dist/typings/unary';

import { MasterCategory } from '../../enum';
import { callGRPC } from '../grpc/grpc';
import { ImportBobDataRequest, ImportBobDataResponse } from './types';
import {
    ImportLocationRequest,
    ImportLocationResponse,
    ImportLocationTypeRequest,
    ImportLocationTypeResponse,
} from 'manabuf/bob/v1/masterdata_pb';

export const getImportBobDataResponse = async (
    request: ImportBobDataRequest,
    category: MasterCategory,
    serviceName: string,
    token: string
): Promise<UnaryOutput<ImportBobDataResponse> | null> => {
    if (!request) return null;

    switch (category) {
        case MasterCategory.Location:
            return await callGRPC<ImportLocationRequest, ImportLocationResponse>({
                serviceName,
                methodName: 'ImportLocation',
                request,
                requestType: ImportLocationRequest,
                responseType: ImportLocationResponse,
                token,
            });

        case MasterCategory.LocationType:
            return await callGRPC<ImportLocationTypeRequest, ImportLocationTypeResponse>({
                serviceName,
                methodName: 'ImportLocationType',
                request,
                requestType: ImportLocationTypeRequest,
                responseType: ImportLocationTypeResponse,
                token,
            });

        default:
            return null;
    }
};
