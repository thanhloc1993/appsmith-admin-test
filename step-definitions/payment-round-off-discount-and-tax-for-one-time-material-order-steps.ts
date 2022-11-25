import { DataTable, Given, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { DiscountAmountType, TaxCategory } from 'manabuf/payment/v1/enums_pb';
import { aliasProductData } from 'step-definitions/alias-keys/payment';
import {
    assertBilledAtOrderOfOneTimeMaterial,
    assertBillingDateOfOneTimeMaterial,
    assertUpcomingBillingOfOneTimeMaterial,
} from 'step-definitions/payment-create-one-time-material-order-common-definitions';
import { BilledAtOrderDataTable } from 'step-definitions/payment-create-one-time-material-order-with-inclusive-tax-and-discount-definitions';
import {
    CreateOneTimeMaterialProp,
    createOneTimeOrderMaterial,
    ProductData,
} from 'step-definitions/payment-one-time-material-definition';
import {
    BilledAtOrderWithRoundTypeDataTable,
    filterDataTableByRoundType,
    ProductDataTableWithRoundType,
    RoundType,
} from 'step-definitions/payment-round-off-discount-and-tax-for-one-time-material-order-definitions';
import { ProductType } from 'step-definitions/payment-utils';
import { pick1stElement } from 'step-definitions/utils';

Given(
    'school admin has created one-time material with price and inclusive tax with {string}',
    async function (
        this: IMasterWorld,
        roundType: RoundType,
        productWithRoundTypeDataTable: DataTable
    ) {
        const cms = this.cms;
        const scenario = this.scenario;

        const productsWithRoundType: ProductDataTableWithRoundType[] = filterDataTableByRoundType(
            productWithRoundTypeDataTable,
            roundType
        );

        const oneTimeMaterialProp: CreateOneTimeMaterialProp[] = productsWithRoundType.map(
            ({ price, taxPercentage }) => ({
                price,
                taxPercentage,
                taxCategory: TaxCategory.TAX_CATEGORY_INCLUSIVE,
                priceQuantity: 1,
            })
        );

        const materialProductData = await createOneTimeOrderMaterial(
            cms,
            scenario,
            oneTimeMaterialProp
        );

        scenario.context.set(aliasProductData, materialProductData);
    }
);

When(
    'school admin checks billed at order of {string} order with {string}',
    async function (productType: ProductType, roundType: RoundType, billedAtOrderTable: DataTable) {
        const cms = this.cms;
        const scenario = this.scenario;

        const productsData: ProductData = scenario.context.get(aliasProductData);
        const productList = productsData.products;

        const billedAtOrderDataWithRoundType: BilledAtOrderWithRoundTypeDataTable[] =
            filterDataTableByRoundType(billedAtOrderTable, roundType);

        const billedAtOrderData: BilledAtOrderDataTable[] = billedAtOrderDataWithRoundType.map(
            ({ subTotal, taxAmountText, productTotal }) => ({
                subTotal,
                taxAmountText,
                productTotal,
            })
        );

        await assertBillingDateOfOneTimeMaterial(cms, productList);

        await assertUpcomingBillingOfOneTimeMaterial(cms, productList);

        await cms.attach(`Calculate billed at order of ${productType} with ${roundType}`);

        await assertBilledAtOrderOfOneTimeMaterial(
            cms,
            productList,
            pick1stElement(billedAtOrderData)
        );
    }
);

Given(
    'school admin has created one-time material with price and discount by percent with {string}',
    async function (roundType: RoundType, productWithDiscountRoundTypeDataTable: DataTable) {
        const cms = this.cms;
        const scenario = this.scenario;

        const productsWithDiscountRoundType: ProductDataTableWithRoundType[] =
            filterDataTableByRoundType(productWithDiscountRoundTypeDataTable, roundType);

        const oneTimeMaterialProp: CreateOneTimeMaterialProp[] = productsWithDiscountRoundType.map(
            ({ price, discountPercentage }) => ({
                price,
                discountAmountType: DiscountAmountType.DISCOUNT_AMOUNT_TYPE_PERCENTAGE,
                discountAmountValue: discountPercentage,
                priceQuantity: 1,
            })
        );

        const materialProductData = await createOneTimeOrderMaterial(
            cms,
            scenario,
            oneTimeMaterialProp
        );

        scenario.context.set(aliasProductData, materialProductData);
    }
);
