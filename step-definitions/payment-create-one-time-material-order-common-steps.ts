import { DataTable, Given, When } from '@cucumber/cucumber';

import { aliasProductData } from './alias-keys/payment';
import {
    selectLocationAtCreateOrderForm,
    clickAddButtonOfProductList,
    selectProductOneTimeMaterial,
    selectDiscountAutocomplete,
    inputCommentOrder,
    DiscountAmountParamsType,
    assertBilledAtOrderOfOneTimeMaterial,
    assertBillingDateOfOneTimeMaterial,
    assertUpcomingBillingOfOneTimeMaterial,
    ProductDataTableWithDiscount,
} from './payment-create-one-time-material-order-common-definitions';
import { BilledAtOrderDataTable } from './payment-create-one-time-material-order-with-inclusive-tax-and-discount-definitions';
import {
    CreateOneTimeMaterialProp,
    createOneTimeOrderMaterial,
    ProductData,
} from './payment-one-time-material-definition';
import { ProductType } from './payment-utils';
import { pick1stElement } from './utils';
import { DiscountAmountType, TaxCategory } from 'manabuf/payment/v1/enums_pb';

Given(
    'school admin has created one-time material with discount',
    async function (oneTimeMaterialProductTable: DataTable) {
        const oneTimeMaterialProductData: ProductDataTableWithDiscount[] =
            oneTimeMaterialProductTable.hashes();

        const cms = this.cms;
        const scenario = this.scenario;

        const oneTimeMaterialProducts: CreateOneTimeMaterialProp[] = oneTimeMaterialProductData.map(
            (product) => {
                return {
                    discountAmountType: DiscountAmountType[product.discountAmountType],
                    discountAmountValue: product.discount,
                    price: product.price,
                    priceQuantity: 1,
                    taxPercentage: product.tax,
                    taxCategory: TaxCategory[product.taxCategory],
                };
            }
        );

        const products = await createOneTimeOrderMaterial(cms, scenario, oneTimeMaterialProducts);

        scenario.set(aliasProductData, products);
    }
);

When('school admin selects {string} for order', async function (productType: ProductType) {
    const cms = this.cms;
    const scenario = this.scenario;

    const productsData: ProductData = scenario.context.get(aliasProductData);

    await cms.waitingForLoadingIcon();

    await selectLocationAtCreateOrderForm(cms, productsData.location);

    await cms.attach(`Selecting products of ${productType}`);

    for (let i = 0; i < productsData.products.length; i++) {
        const product = productsData.products[i];

        await clickAddButtonOfProductList(cms);
        await selectProductOneTimeMaterial(cms, product.product.name, i);
    }
});

When(
    'school admin selects discount {string} for created one-time material',
    async function (discountAmountType: DiscountAmountParamsType) {
        const cms = this.cms;
        const scenario = this.scenario;

        const productsData: ProductData = scenario.context.get(aliasProductData);

        for (let i = 0; i < productsData.products.length; i++) {
            const product = productsData.products[i];

            await selectDiscountAutocomplete(cms, product, discountAmountType, i);
        }
    }
);

When('school admin adds comment for order', async function () {
    await inputCommentOrder(this.cms);
});

When(
    'school admin checks billed at order of {string} order',
    async function (productType: ProductType, billedAtOrderTable: DataTable) {
        const cms = this.cms;
        const scenario = this.scenario;

        const productsData: ProductData = scenario.context.get(aliasProductData);
        const billedAtOrderData: BilledAtOrderDataTable[] = billedAtOrderTable.hashes();
        const productList = productsData.products;

        await assertBillingDateOfOneTimeMaterial(cms, productList);

        await assertUpcomingBillingOfOneTimeMaterial(cms, productList);

        await cms.attach(`Calculator billed at order of ${productType}`);

        await assertBilledAtOrderOfOneTimeMaterial(
            cms,
            productList,
            pick1stElement(billedAtOrderData)
        );
    }
);

When(
    'school admin select the designated discounts for {string}',
    async function (productType: ProductType) {
        const cms = this.cms;
        const scenario = this.scenario;

        const productsData: ProductData = scenario.get(aliasProductData);

        await cms.waitingForLoadingIcon();

        await selectLocationAtCreateOrderForm(cms, productsData.location);

        await cms.attach(`Selecting products of ${productType}`);

        for (let i = 0; i < productsData.products.length; i++) {
            const product = productsData.products[i];

            await clickAddButtonOfProductList(cms);
            await selectProductOneTimeMaterial(cms, product.product.name, i);

            if (!product.discount?.discount_amount_type) {
                // TODO: refactor to add function to check if it has discount or not
                await cms.attach(
                    `No discount amount type found for product ${product.product.name}`
                );
                continue;
            }

            await selectDiscountAutocomplete(
                cms,
                product,
                product.discount.discount_amount_type,
                i
            );
        }
    }
);
