import { When } from '@cucumber/cucumber';

import { aliasProductData } from './alias-keys/payment';
import {
    selectLocationAtCreateOrderForm,
    clickAddButtonOfProductList,
    selectProductOneTimeMaterial,
    selectDiscountAutocomplete,
    inputCommentOrder,
    ProductNameType,
    DiscountAmountParamsType,
    assertOrderCommentInput,
} from './payment-create-one-time-material-order-common-definitions';
import { ProductData } from './payment-one-time-material-definition';
import { getPaymentError, getProductByDiscountAmountType } from 'step-definitions/payment-utils';

When(
    'school admin select {string} and designated {string} discount',
    async function (firstProductName: ProductNameType, discountType: DiscountAmountParamsType) {
        const cms = this.cms;
        const scenario = this.scenario;

        const productsData: ProductData = scenario.get(aliasProductData);

        await cms.waitingForLoadingIcon();

        await selectLocationAtCreateOrderForm(cms, productsData.location);

        const product = getProductByDiscountAmountType(productsData.products, discountType);

        if (!product) {
            throw getPaymentError(`No product found with ${discountType} discount type`);
        }

        if (!product.discount?.discount_amount_type) {
            throw getPaymentError(
                `No discount amount type found for product ${product.product.name}`
            );
        }

        await cms.attach(
            `Selecting ${firstProductName} product with 
             - Product Id: ${product.product.material_id}
             - Product Name: ${product.product.name}
             - Discount Id:  ${product.discount.discount_id}
             - Discount Name:${product.discount.name}}
             - Discount Type: ${discountType}`
        );

        await clickAddButtonOfProductList(cms);
        await selectProductOneTimeMaterial(cms, product.product.name, 0);
        await selectDiscountAutocomplete(cms, product, discountType, 0);
    }
);

When(
    'school admin edits to {string} and designated {string} discount',
    async function (secondProductName: ProductNameType, discountType: DiscountAmountParamsType) {
        const cms = this.cms;
        const scenario = this.scenario;

        const productsData: ProductData = scenario.get(aliasProductData);

        await cms.waitingForLoadingIcon();

        const product = getProductByDiscountAmountType(productsData.products, discountType);

        if (!product) {
            throw getPaymentError(`No product found with ${discountType} discount type`);
        }

        if (!product.discount?.discount_amount_type) {
            throw getPaymentError(
                `No discount amount type found for product ${product.product.name}`
            );
        }

        await cms.attach(
            `Selecting ${secondProductName} product with 
             - Product Id: ${product.product.material_id}
             - Product Name: ${product.product.name}
             - Discount Id:  ${product.discount.discount_id}
             - Discount Name:${product.discount.name}}
             - Discount Type: ${discountType}`
        );

        await selectProductOneTimeMaterial(cms, product.product.name, 0);
        await selectDiscountAutocomplete(cms, product, discountType, 0);

        const updatedProductsData: ProductData = {
            ...productsData,
            products: [product],
        };

        scenario.context.set('aliasProductData', updatedProductsData);
    }
);

When('school admin edits comment for order', async function () {
    const cms = this.cms;
    const comment = 'Edited Comment for order E2E';

    await inputCommentOrder(cms, comment);

    await assertOrderCommentInput(cms, comment);
});
