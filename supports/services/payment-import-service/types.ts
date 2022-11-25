import { MasterCategory } from '@supports/enum';

import {
    DiscountAmountType,
    DiscountType,
    FeeType,
    LeavingReasonType,
    MaterialType,
    PackageType,
    ProductAssociatedDataType,
    ProductType,
    TaxCategory,
} from 'manabuf/payment/v1/enums_pb';
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

type optionalNumber = number | '';

export interface ImportAccountingCategoryData {
    accounting_category_id: optionalNumber;
    name: string;
    remarks: string;
    is_archived: boolean;
}

export interface ImportDiscountData {
    discount_id: optionalNumber;
    name: string;
    discount_type: DiscountType;
    discount_amount_type: DiscountAmountType;
    discount_amount_value: number;
    recurring_valid_duration: optionalNumber;
    available_from: string;
    available_until: string;
    remarks: string;
    is_archived: boolean;
}

export interface ImportBillingScheduleData {
    billing_schedule_id: optionalNumber;
    name: string;
    remarks: string;
    is_archived: boolean;
}

export interface ImportBillingSchedulePeriodData {
    billing_schedule_period_id: optionalNumber;
    name: string;
    billing_schedule_id: number;
    start_date: string;
    end_date: string;
    billing_date: string;
    remarks: string;
    is_archived: boolean;
}

export interface ImportTaxData {
    tax_id: optionalNumber;
    name: string;
    tax_percentage: number;
    tax_category: TaxCategory;
    default_flag: boolean;
    is_archived: boolean;
}

export interface ImportPackageData {
    package_id: optionalNumber;
    name: string;
    package_type: PackageType;
    tax_id: optionalNumber;
    available_from: string;
    available_until: string;
    max_slot: optionalNumber;
    custom_billing_period: string;
    billing_schedule_id: optionalNumber;
    disable_pro_rating_flag: boolean;
    package_start_date: string;
    package_end_date: string;
    remarks: string;
    is_archived: boolean;
}

export interface ImportMaterialData {
    material_id: optionalNumber;
    name: string;
    material_type: MaterialType;
    tax_id: optionalNumber;
    available_from: string;
    available_until: string;
    custom_billing_period: string;
    custom_billing_date: string;
    billing_schedule_ID: optionalNumber;
    disable_pro_rating_flag: boolean;
    remarks: string;
    is_archived: boolean;
}

export interface ImportFeeData {
    fee_id: optionalNumber;
    name: string;
    fee_type: FeeType;
    tax_id: optionalNumber;
    available_from: string;
    available_until: string;
    custom_billing_period: string;
    billing_schedule_id: optionalNumber;
    disable_pro_rating_flag: boolean;
    remarks: string;
    is_archived: boolean;
}

export interface ImportProductGradeData {
    product_id: number;
    grade_id: number;
}

export interface ImportProductCourseData {
    product_id: number;
    course_id: string;
    mandatory_flag: boolean;
    course_weight: number;
}

export interface ImportProductAccountingCategoryData {
    product_id: number;
    accounting_category_id: number;
}

export interface ImportProductLocationData {
    product_id: number;
    location_id: string;
}

export interface ImportProductPriceData {
    product_id: number;
    billing_schedule_period_id: optionalNumber;
    quantity: optionalNumber;
    price: number;
}

export interface ImportBillingRatioData {
    billing_ratio_id: optionalNumber;
    start_date: string;
    end_date: string;
    billing_schedule_period_id: number;
    billing_ratio_numerator: number;
    billing_ratio_denominator: number;
    is_archived: boolean;
}

export interface ImportLeavingReasonData {
    leaving_reason_id: optionalNumber;
    name: string;
    leaving_reason_type: LeavingReasonType;
    remark: string;
    is_archived: boolean;
}

export type ImportPaymentDataPayload =
    | ImportAccountingCategoryData
    | ImportDiscountData
    | ImportBillingScheduleData
    | ImportBillingSchedulePeriodData
    | ImportTaxData
    | ImportPackageData
    | ImportMaterialData
    | ImportFeeData
    | ImportProductGradeData
    | ImportProductCourseData
    | ImportProductAccountingCategoryData
    | ImportProductLocationData
    | ImportProductPriceData
    | ImportBillingRatioData
    | ImportLeavingReasonData;

export type ImportPaymentDataRequest =
    | ImportAccountingCategoryRequest
    | ImportDiscountRequest
    | ImportBillingScheduleRequest
    | ImportBillingSchedulePeriodRequest
    | ImportTaxRequest
    | ImportProductRequest
    | ImportProductAssociatedDataRequest
    | ImportProductPriceRequest
    | ImportBillingRatioRequest
    | ImportLeavingReasonRequest
    | null;

export type ImportPaymentDataResponse =
    | ImportAccountingCategoryResponse
    | ImportDiscountResponse
    | ImportBillingScheduleResponse
    | ImportBillingSchedulePeriodResponse
    | ImportTaxResponse
    | ImportProductResponse
    | ImportProductAssociatedDataResponse
    | ImportProductPriceResponse
    | ImportBillingRatioResponse
    | ImportLeavingReasonResponse;

export const productType = {
    [MasterCategory.Package]: ProductType.PRODUCT_TYPE_PACKAGE,
    [MasterCategory.Fee]: ProductType.PRODUCT_TYPE_FEE,
    [MasterCategory.Material]: ProductType.PRODUCT_TYPE_MATERIAL,
};

export const productAssociatedType = {
    [MasterCategory.ProductAccountingCategory]:
        ProductAssociatedDataType.PRODUCT_ASSOCIATED_DATA_TYPE_ACCOUNTING_CATEGORY,
    [MasterCategory.ProductCourse]: ProductAssociatedDataType.PRODUCT_ASSOCIATED_DATA_TYPE_COURSE,
    [MasterCategory.ProductGrade]: ProductAssociatedDataType.PRODUCT_ASSOCIATED_DATA_TYPE_GRADE,
    [MasterCategory.ProductLocation]:
        ProductAssociatedDataType.PRODUCT_ASSOCIATED_DATA_TYPE_LOCATION,
};
