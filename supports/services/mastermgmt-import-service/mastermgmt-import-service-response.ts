import { UnaryOutput } from '@improbable-eng/grpc-web/dist/typings/unary';

import { MasterCategory } from '../../enum';
import { callGRPC } from '../grpc/grpc';
import { ImportBobDataRequest, ImportBobDataResponse } from './types';
import { ImportGradeRequest, ImportGradeResponse } from 'manabuf/bob/v1/grades_pb';
import { ImportClassRequest, ImportClassResponse } from 'manabuf/mastermgmt/v1/class_pb';

export const getImportBobDataResponse = async (
    request: ImportBobDataRequest,
    category: MasterCategory,
    token: string
): Promise<UnaryOutput<ImportBobDataResponse> | null> => {
    if (!request) return null;

    switch (category) {
        case MasterCategory.Grade:
            return await callGRPC<ImportGradeRequest, ImportGradeResponse>({
                serviceName: 'mastermgmt.v1.GradeService',
                methodName: 'ImportGrades',
                request,
                requestType: ImportGradeRequest,
                responseType: ImportGradeResponse,
                token,
            });

        case MasterCategory.Class:
            return await callGRPC<ImportClassRequest, ImportClassResponse>({
                serviceName: 'mastermgmt.v1.ClassService',
                methodName: 'ImportClass',
                request,
                requestType: ImportClassRequest,
                responseType: ImportClassResponse,
                token,
            });

        default:
            return null;
    }
};
