import { CustomBillingDate } from '@supports/entities/payment-billing-date';
import { Payment_Eibanam_GetLowestLocationTypesQuery } from '@supports/graphql/bob/bob-types';
import {
    ImportLocationData,
    ImportLocationTypeData,
} from '@supports/services/bob-import-service/types';
import {
    ImportDiscountData,
    ImportFeeData,
    ImportMaterialData,
    ImportPackageData,
    ImportProductGradeData,
    ImportProductLocationData,
    ImportProductPriceData,
    ImportTaxData,
} from '@supports/services/payment-import-service/types';
import { ArrayElement } from '@supports/types/cms-types';
import { getDateWithOffset } from '@supports/utils/time/time';

import { KeyDiscountAmountTypes, KeyTaxCategoryTypes } from './payment-constant';
import { DiscountAmountParamsType } from './payment-create-one-time-material-order-common-definitions';
import { RetrieveLowestLevelLocationsResponse } from 'manabuf/bob/v1/masterdata_pb';
import { DiscountAmountType, TaxCategory } from 'manabuf/payment/v1/enums_pb';
import { Product } from 'step-definitions/payment-one-time-material-definition';
import { getEnumKey, getRandomNumber } from 'step-definitions/utils';

export type ProductType = 'one-time material';

export type ProductIdOfAssociateTablesType =
    | Exclude<ImportMaterialData['material_id'], ''>
    | Exclude<ImportPackageData['package_id'], ''>
    | Exclude<ImportFeeData['fee_id'], ''>;

export interface CreateDiscountData extends Omit<ImportDiscountData, 'discount_id' | 'name'> {}

export interface CreateTaxData extends Omit<ImportTaxData, 'tax_id' | 'name'> {}

export interface CreateMaterialData extends Omit<ImportMaterialData, 'material_id' | 'name'> {}

export interface CreateProductPriceData extends ImportProductPriceData {}

export type LocationType = ArrayElement<
    Payment_Eibanam_GetLowestLocationTypesQuery['get_lowest_location_types']
>['name'];

export type ParentLocationType = ArrayElement<
    Payment_Eibanam_GetLowestLocationTypesQuery['get_lowest_location_types']
>['parent_name'];

export interface GetLowestLocationTypeReturn {
    locationTypeName: LocationType;
    parentLocationTypeName: ParentLocationType;
}

export const fromDate = new Date('2022-03-07T17:00:00.000Z').toISOString();
export const toDate = new Date('2122-03-07T17:00:00.000Z').toISOString();

export const createDiscountData = (createDiscountData: CreateDiscountData): ImportDiscountData => ({
    discount_id: '',
    name: `Discount E2E Name ${getRandomNumber()}`,
    ...createDiscountData,
});

export const createTaxData = (createTaxData: CreateTaxData): ImportTaxData => ({
    tax_id: '',
    name: `Tax E2E Name ${getRandomNumber()}`,
    ...createTaxData,
});

export const createMaterialData = (createMaterialData: CreateMaterialData): ImportMaterialData => ({
    material_id: '',
    name: `Material Name E2E ${getRandomNumber()}`,
    ...createMaterialData,
});

export const createLocationTypeData = (): ImportLocationTypeData => {
    const randomNumber = getRandomNumber();
    return {
        name: `location ${randomNumber}`,
        display_name: `location ${randomNumber}`,
        parent_name: '',
        is_archived: false,
    };
};

export const createParentLocationData = (
    locationType: ImportLocationTypeData['name']
): ImportLocationData => {
    return {
        partner_internal_id: `${locationType}_e2e`,
        name: 'E2E Testing',
        location_type: locationType,
        partner_internal_parent_id: '',
        is_archived: false,
    };
};

export const createLocationData = (
    locationType: ImportLocationTypeData['name'],
    parentLocationType: ImportLocationTypeData['name']
): ImportLocationData => {
    const randomNumber = getRandomNumber();
    return {
        partner_internal_id: `${locationType}_e2e_${randomNumber}`,
        name: `${locationType} E2E ${randomNumber}`,
        location_type: locationType,
        partner_internal_parent_id: `${parentLocationType}_e2e`,
        is_archived: false,
    };
};

export const createProductGradeData = (
    productId: ProductIdOfAssociateTablesType,
    gradeId: number
): ImportProductGradeData => ({
    product_id: productId,
    grade_id: gradeId,
});

export const createProductLocationData = (
    productId: ProductIdOfAssociateTablesType,
    locationId: RetrieveLowestLevelLocationsResponse.Location.AsObject['locationId']
): ImportProductLocationData => ({
    product_id: productId,
    location_id: locationId,
});

export const getPaymentError = (message: string) => new Error(`Payment ${message}`);

export function getPaymentResponseObject<T>(data: { data: T }) {
    return data.data;
}

export const getProductTaxPrice = (
    productPrice = 0,
    discountPrice = 0,
    taxPercentage = 0
): number => {
    return Math.round((productPrice - discountPrice) * (taxPercentage / 100));
};

export const getDiscountPriceByType = (
    discountAmountType: string,
    discountPrice: number,
    productPrice: number
): number => {
    switch (discountAmountType) {
        case KeyDiscountAmountTypes.DISCOUNT_AMOUNT_TYPE_PERCENTAGE:
            return Math.round(productPrice * (discountPrice / 100));
        case KeyDiscountAmountTypes.DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT:
        case KeyDiscountAmountTypes.DISCOUNT_AMOUNT_TYPE_NONE:
        default:
            return Math.round(discountPrice);
    }
};

export const calculateTaxInclusions = (billedAtOrderProducts: Product[]): [string, number][] => {
    const billedAtOrderTaxInclusions: Record<number, number> = {};

    for (const product of billedAtOrderProducts) {
        const productTax = product.tax!;

        const taxCategory = getEnumKey(TaxCategory, productTax.tax_category);

        const taxPercentage = Number(productTax.tax_percentage);

        switch (taxCategory) {
            case KeyTaxCategoryTypes.TAX_CATEGORY_INCLUSIVE: {
                const currentValue = billedAtOrderTaxInclusions[taxPercentage]
                    ? billedAtOrderTaxInclusions[taxPercentage]
                    : 0;

                const { price: productPrice, discount: productDiscount } = product;

                const taxPrice = getProductTaxPrice(
                    productPrice?.price,
                    productDiscount?.discount_amount_value,
                    taxPercentage
                );

                billedAtOrderTaxInclusions[taxPercentage] = currentValue + taxPrice;
                break;
            }
            case KeyTaxCategoryTypes.TAX_CATEGORY_EXCLUSIVE: // TODO: handle accordingly
            case KeyTaxCategoryTypes.TAX_CATEGORY_NONE: // TODO: handle accordingly
                break;
        }
    }

    return Object.entries(billedAtOrderTaxInclusions);
};

// Implement the rounding off logic for calculating total and subtotal values
export const calculateTotalValueForItems = (billedAtOrderProducts: Product[]): number => {
    return billedAtOrderProducts.reduce((previousValue, billedAtOrderProduct) => {
        const productPrice = Number(billedAtOrderProduct.price?.price);

        const discountPrice = billedAtOrderProduct.discount
            ? billedAtOrderProduct.discount.discount_amount_value
            : 0;

        const discountAmountType = getEnumKey(
            DiscountAmountType,
            Number(billedAtOrderProduct.discount?.discount_amount_type)
        );

        const productDiscount = getDiscountPriceByType(
            discountAmountType,
            discountPrice,
            productPrice
        );

        return previousValue + productPrice - productDiscount;
    }, 0);
};

export const isBilledAtOrderDataHavingTax = (taxAmountText: string): boolean => {
    return taxAmountText !== 'TAX_NONE';
};

export const getOneTimeMaterialAlias = (aliasIndex: number) => `one-time material ${aliasIndex}`;

export function getEnumString<T extends string>(objEnum = {}, value: any): T | undefined {
    const index = Object.values(objEnum).indexOf(value);
    if (index >= 0) {
        return Object.keys(objEnum)[index] as T;
    }
}

function isDiscountAmountType(
    discountAmountType: DiscountAmountParamsType | DiscountAmountType
): discountAmountType is DiscountAmountType {
    return discountAmountType in Object.values(DiscountAmountType);
}

export const getDiscountAmountType = (
    discountAmountType: DiscountAmountParamsType | DiscountAmountType
): DiscountAmountParamsType | undefined => {
    return isDiscountAmountType(discountAmountType)
        ? getEnumString<DiscountAmountParamsType>(DiscountAmountType, discountAmountType)
        : discountAmountType;
};

export const getProductByDiscountAmountType = (
    products: Product[],
    discountAmountType: DiscountAmountParamsType
): Product | undefined => {
    return products.find(
        (product) =>
            product.discount?.discount_amount_type === DiscountAmountType[discountAmountType]
    );
};

export function getCustomBillingDate(condition: CustomBillingDate): Date {
    const currentDate = new Date();
    switch (condition) {
        case 'custom_billing_date < created order date': {
            return getDateWithOffset(-1);
        }
        case 'custom_billing_date > created order date': {
            return getDateWithOffset(1);
        }
        default: {
            return currentDate;
        }
    }
}
