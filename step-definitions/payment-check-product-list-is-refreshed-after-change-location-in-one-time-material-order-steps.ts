import { DataTable, Given, When } from '@cucumber/cucumber';

import { aliasProductData, aliasProductDataWithMultipleLocations } from './alias-keys/payment';
import {
    ProductDataTableWithLocations,
    assertEmptyProductListTable,
} from './payment-check-product-list-is-refreshed-after-change-location-in-one-time-material-order-definitions';
import {
    clickAddButtonOfProductList,
    LocationsType,
    ProductNameType,
    selectLocationAtCreateOrderForm,
    selectProductOneTimeMaterial,
} from './payment-create-one-time-material-order-common-definitions';
import {
    CreateOneTimeMaterialProp,
    createOneTimeOrderMaterial,
    ProductData,
} from './payment-one-time-material-definition';
import { getPaymentError } from './payment-utils';
import { pick1stElement } from './utils';
import { DiscountAmountType, TaxCategory } from 'manabuf/payment/v1/enums_pb';

Given(
    'school admin has created one-time material with mutiple locations',
    async function (productWithLocations: DataTable) {
        const cms = this.cms;
        const scenario = this.scenario;

        const productWithLocationsData: ProductDataTableWithLocations[] =
            productWithLocations.hashes();

        for (const product of productWithLocationsData) {
            await cms.attach(`Create one-time material with ${product.productLocation}:`);

            const oneTimeMaterialProduct: CreateOneTimeMaterialProp[] = [
                {
                    discountAmountType: DiscountAmountType[product.discountAmountType],
                    discountAmountValue: product.discount,
                    price: product.price,
                    priceQuantity: 1,
                    taxPercentage: product.tax,
                    taxCategory: TaxCategory[product.taxCategory],
                },
            ];

            const productData: ProductData = await createOneTimeOrderMaterial(
                cms,
                scenario,
                oneTimeMaterialProduct
            );

            scenario.set(
                aliasProductDataWithMultipleLocations(product.productLocation),
                productData
            );
        }
    }
);

When(
    'school admin selects {string} with {string} for order',
    async function (productName: ProductNameType, locationsType: LocationsType) {
        const cms = this.cms;
        const scenario = this.scenario;

        const productData: ProductData = scenario.get(
            aliasProductDataWithMultipleLocations(locationsType)
        );

        await cms.waitingForLoadingIcon();

        await selectLocationAtCreateOrderForm(cms, productData.location);

        const product = pick1stElement(productData.products);

        if (!product) {
            throw getPaymentError(`No product found with ${locationsType}`);
        }

        await cms.attach(
            `Selecting ${productName} product with ${locationsType}
             - Product Id: ${product.product.material_id}
             - Product Name: ${product.product.name}`
        );

        await clickAddButtonOfProductList(cms);
        await selectProductOneTimeMaterial(cms, product.product.name, 0);

        scenario.set(aliasProductData, productData);
    }
);

When('school admin changes to {string}', async function (locationsType: LocationsType) {
    const cms = this.cms;
    const scenario = this.scenario;

    const productData: ProductData = scenario.get(
        aliasProductDataWithMultipleLocations(locationsType)
    );

    await cms.waitingForLoadingIcon();

    await selectLocationAtCreateOrderForm(cms, productData.location);
});

When('school admin sees {string} is removed', async function (productName: ProductNameType) {
    const cms = this.cms;

    await cms.instruction(
        `Check product list table without ${productName} data`,
        async function () {
            await assertEmptyProductListTable(cms);
        }
    );
});
