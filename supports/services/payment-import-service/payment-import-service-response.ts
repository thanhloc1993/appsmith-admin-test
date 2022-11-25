import { MasterCategory } from '../../../supports/enum';
import { callGRPC } from '../../services/grpc/grpc';
import { ImportPaymentDataRequest } from './types';
import {
    ImportAccountingCategoryRequest,
    ImportAccountingCategoryResponse,
    ImportBillingRatioRequest,
    ImportBillingRatioResponse,
    ImportBillingSchedulePeriodRequest,
    ImportBillingSchedulePeriodResponse,
    ImportBillingScheduleRequest,
    ImportBillingScheduleResponse,
    ImportDiscountRequest,
    ImportDiscountResponse,
    ImportLeavingReasonRequest,
    ImportLeavingReasonResponse,
    ImportProductAssociatedDataRequest,
    ImportProductAssociatedDataResponse,
    ImportProductPriceRequest,
    ImportProductPriceResponse,
    ImportProductRequest,
    ImportProductResponse,
    ImportTaxRequest,
    ImportTaxResponse,
} from 'manabuf/payment/v1/import_pb';

export const getImportPaymentDataResponse = async (
    request: ImportPaymentDataRequest,
    category: MasterCategory,
    serviceName: string,
    token: string
) => {
    if (!request) return null;

    switch (category) {
        case MasterCategory.AccountingCategory:
            return await callGRPC<
                ImportAccountingCategoryRequest,
                ImportAccountingCategoryResponse
            >({
                serviceName,
                methodName: 'ImportAccountingCategory',
                request,
                requestType: ImportAccountingCategoryRequest,
                responseType: ImportAccountingCategoryResponse,
                token,
            });

        case MasterCategory.Discount:
            return await callGRPC<ImportDiscountRequest, ImportDiscountResponse>({
                serviceName,
                methodName: 'ImportDiscount',
                request,
                requestType: ImportDiscountRequest,
                responseType: ImportDiscountResponse,
                token,
            });

        case MasterCategory.BillingSchedule:
            return await callGRPC<ImportBillingScheduleRequest, ImportBillingScheduleResponse>({
                serviceName,
                methodName: 'ImportBillingSchedule',
                request,
                requestType: ImportBillingScheduleRequest,
                responseType: ImportBillingScheduleResponse,
                token,
            });
        case MasterCategory.BillingSchedulePeriod:
            return await callGRPC<
                ImportBillingSchedulePeriodRequest,
                ImportBillingSchedulePeriodResponse
            >({
                serviceName,
                methodName: 'ImportBillingSchedulePeriod',
                request,
                requestType: ImportBillingSchedulePeriodRequest,
                responseType: ImportBillingSchedulePeriodResponse,
                token,
            });

        case MasterCategory.Tax:
            return await callGRPC<ImportTaxRequest, ImportTaxResponse>({
                serviceName,
                methodName: 'ImportTax',
                request,
                requestType: ImportTaxRequest,
                responseType: ImportTaxResponse,
                token,
            });

        case MasterCategory.Fee:
        case MasterCategory.Material:
        case MasterCategory.Package:
            return await callGRPC<ImportProductRequest, ImportProductResponse>({
                serviceName,
                methodName: 'ImportProduct',
                request: request as ImportProductRequest,
                requestType: ImportProductRequest,
                responseType: ImportProductResponse,
                token,
            });

        case MasterCategory.ProductAccountingCategory:
        case MasterCategory.ProductCourse:
        case MasterCategory.ProductGrade:
        case MasterCategory.ProductLocation:
            return await callGRPC<
                ImportProductAssociatedDataRequest,
                ImportProductAssociatedDataResponse
            >({
                serviceName,
                methodName: 'ImportProductAssociatedData',
                request: request as ImportProductAssociatedDataRequest,
                requestType: ImportProductAssociatedDataRequest,
                responseType: ImportProductAssociatedDataResponse,
                token,
            });

        case MasterCategory.ProductPrice:
            return await callGRPC<ImportProductPriceRequest, ImportProductPriceResponse>({
                serviceName,
                methodName: 'ImportProductPrice',
                request: request,
                requestType: ImportProductPriceRequest,
                responseType: ImportProductPriceResponse,
                token,
            });

        case MasterCategory.BillingRatio:
            return await callGRPC<ImportBillingRatioRequest, ImportBillingRatioResponse>({
                serviceName,
                methodName: 'ImportBillingRatio',
                request,
                requestType: ImportBillingRatioRequest,
                responseType: ImportBillingRatioResponse,
                token,
            });

        case MasterCategory.LeavingReason:
            return await callGRPC<ImportLeavingReasonRequest, ImportLeavingReasonResponse>({
                serviceName,
                methodName: 'ImportLeavingReason',
                request,
                requestType: ImportLeavingReasonRequest,
                responseType: ImportLeavingReasonResponse,
                token,
            });

        default:
            return null;
    }
};
