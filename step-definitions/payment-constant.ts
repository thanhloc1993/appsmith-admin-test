/* eslint-disable @typescript-eslint/naming-convention */
import { convertEnumKeys } from './utils';
import { DiscountAmountType, TaxCategory } from 'manabuf/payment/v1/enums_pb';

export const KeyDiscountAmountTypes = convertEnumKeys(DiscountAmountType);
export const KeyTaxCategoryTypes = convertEnumKeys(TaxCategory);

export enum OrderCurrency {
    JAPANESE_YEN = '¥',
}
