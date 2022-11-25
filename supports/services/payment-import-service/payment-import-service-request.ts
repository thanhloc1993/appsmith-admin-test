import { convertCSVStringToBase64, convertToCSVString } from '../../../step-definitions/utils';
import { MasterCategory } from '../../../supports/enum';
import {
    ImportPaymentDataPayload,
    ImportPaymentDataRequest,
    productAssociatedType,
    productType,
} from './types';
import {
    ImportAccountingCategoryRequest,
    ImportBillingRatioRequest,
    ImportBillingSchedulePeriodRequest,
    ImportBillingScheduleRequest,
    ImportDiscountRequest,
    ImportLeavingReasonRequest,
    ImportProductAssociatedDataRequest,
    ImportProductPriceRequest,
    ImportProductRequest,
    ImportTaxRequest,
} from 'manabuf/payment/v1/import_pb';

export const getImportPaymentDataRequest = (
    payload: ImportPaymentDataPayload,
    category: MasterCategory
): ImportPaymentDataRequest => {
    let request: ImportPaymentDataRequest;

    switch (category) {
        case MasterCategory.AccountingCategory:
            request = new ImportAccountingCategoryRequest();
            break;

        case MasterCategory.Discount:
            request = new ImportDiscountRequest();
            break;

        case MasterCategory.BillingSchedule:
            request = new ImportBillingScheduleRequest();
            break;

        case MasterCategory.BillingSchedulePeriod:
            request = new ImportBillingSchedulePeriodRequest();
            break;

        case MasterCategory.Tax:
            request = new ImportTaxRequest();
            break;

        case MasterCategory.Fee:
            request = new ImportProductRequest();
            (request as ImportProductRequest).setProductType(productType[category]);
            break;

        case MasterCategory.Material:
            request = new ImportProductRequest();
            (request as ImportProductRequest).setProductType(productType[category]);
            break;

        case MasterCategory.Package:
            request = new ImportProductRequest();
            (request as ImportProductRequest).setProductType(productType[category]);
            break;

        case MasterCategory.ProductAccountingCategory:
            request = new ImportProductAssociatedDataRequest();
            (request as ImportProductAssociatedDataRequest).setProductAssociatedDataType(
                productAssociatedType[category]
            );
            break;

        case MasterCategory.ProductCourse:
            request = new ImportProductAssociatedDataRequest();
            (request as ImportProductAssociatedDataRequest).setProductAssociatedDataType(
                productAssociatedType[category]
            );
            break;

        case MasterCategory.ProductGrade:
            request = new ImportProductAssociatedDataRequest();
            (request as ImportProductAssociatedDataRequest).setProductAssociatedDataType(
                productAssociatedType[category]
            );
            break;

        case MasterCategory.ProductLocation:
            request = new ImportProductAssociatedDataRequest();
            (request as ImportProductAssociatedDataRequest).setProductAssociatedDataType(
                productAssociatedType[category]
            );
            break;

        case MasterCategory.ProductPrice:
            request = new ImportProductPriceRequest();
            break;

        case MasterCategory.BillingRatio:
            request = new ImportBillingRatioRequest();
            break;

        case MasterCategory.LeavingReason:
            request = new ImportLeavingReasonRequest();
            break;

        default:
            request = null;
            break;
    }

    if (!request) return null;

    const csvStringFormat = convertToCSVString([payload]);

    const base64Format = convertCSVStringToBase64(csvStringFormat);

    request.setPayload(base64Format);

    return request;
};
