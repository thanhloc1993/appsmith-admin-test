import { CMSInterface } from '@supports/app-types';

import {
    DiscountAmountParamsType,
    LocationsType,
} from './payment-create-one-time-material-order-common-definitions';
import { ProductDataTable } from './payment-create-one-time-material-order-with-inclusive-tax-and-discount-definitions';
import * as PaymentKeys from 'step-definitions/cms-selectors/payment';

export interface ProductDataTableWithLocations extends ProductDataTable {
    discountAmountType: DiscountAmountParamsType;
    productLocation: LocationsType;
}

export const assertEmptyProductListTable = async (cms: CMSInterface) => {
    const page = cms.page!;

    await cms.instruction('Check product list table to be empty', async () => {
        await page.waitForSelector(PaymentKeys.paymentTableNoDataMessage);
    });
};
