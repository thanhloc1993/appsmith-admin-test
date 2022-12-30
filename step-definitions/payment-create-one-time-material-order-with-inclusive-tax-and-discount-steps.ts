import { DataTable, Given } from '@cucumber/cucumber';

import { aliasProductData } from './alias-keys/payment';
import { DiscountAmountParamsType } from './payment-create-one-time-material-order-common-definitions';
import { ProductDataTable } from './payment-create-one-time-material-order-with-inclusive-tax-and-discount-definitions';
import {
    CreateOneTimeMaterialProp,
    createOneTimeOrderMaterial,
} from './payment-one-time-material-definition';
import { DiscountAmountType, TaxCategory } from 'manabuf/payment/v1/enums_pb';

Given(
    'school admin has created one-time material with discount {string}',
    async function (
        discountAmountType: DiscountAmountParamsType,
        oneTimeMaterialProductTable: DataTable
    ) {
        const oneTimeMaterialProductData: ProductDataTable[] = oneTimeMaterialProductTable.hashes();

        const cms = this.cms;
        const scenario = this.scenario;

        const oneTimeMaterialProducts: CreateOneTimeMaterialProp[] = oneTimeMaterialProductData.map(
            (product) => {
                return {
                    discountAmountType: DiscountAmountType[discountAmountType],
                    discountAmountValue: product.discount,
                    price: product.price,
                    priceQuantity: 1,
                    taxPercentage: product.tax,
                    taxCategory: TaxCategory[product.taxCategory],
                };
            }
        );

        const products = await createOneTimeOrderMaterial(cms, scenario, oneTimeMaterialProducts);

        scenario.context.set(aliasProductData, products);
    }
);
