import { DataTable, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasProductData,
    aliasProductDiscountWithIndex,
    aliasProductBillingDateWithIndex,
} from './alias-keys/payment';
import { billAtOrderWithNoInfo } from './cms-selectors/payment';
import {
    ProductDataTableWithCustomBillingDate,
    UpcomingBillingDataTable,
    verifyUpcomingBillingItems,
} from './payment-check-billing-date-and-upcoming-billing-definitions';
import { getBillingDate } from './payment-check-billing-date-and-upcoming-billing-definitions';
import {
    CreateOneTimeMaterialProp,
    createOneTimeOrderMaterial,
    Product,
    ProductData,
} from './payment-one-time-material-definition';
import { ProductType } from './payment-utils';
import { DiscountAmountType, TaxCategory } from 'manabuf/payment/v1/enums_pb';

When(
    'school admin has created one-time material with custom billing date for created student',
    async function (oneTimeMaterialProductTable: DataTable) {
        const oneTimeMaterialProductData: ProductDataTableWithCustomBillingDate[] =
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
                    customBillingDate: getBillingDate(product.customBillingDate).toISOString(),
                };
            }
        );

        const products: ProductData = await createOneTimeOrderMaterial(
            cms,
            scenario,
            oneTimeMaterialProducts
        );
        scenario.context.set(aliasProductData, products);
        products.products.forEach((product, index) => {
            scenario.set(aliasProductDiscountWithIndex(index), product.discount?.name || '');
            scenario.set(
                aliasProductBillingDateWithIndex(index),
                product.product.custom_billing_date
            );
        });
    }
);

When(
    'school admin checks upcoming billing item of {string} order',
    async function (productType: ProductType, upcomingBillingTable: DataTable) {
        const cms = this.cms;
        const scenario = this.scenario;

        const productData: ProductData = scenario.context.get(aliasProductData);
        const productList: Product[] = productData.products;

        const upcomingBillingData: UpcomingBillingDataTable[] = upcomingBillingTable.hashes();

        await cms.attach(`Calculator upcoming billing of ${productType}`);

        const convertedUpcomingBillingData = upcomingBillingData.map((item, index) => {
            return {
                ...item,
                discount: scenario.get(aliasProductDiscountWithIndex(index)),
                billingDate: scenario.get(aliasProductBillingDateWithIndex(index)),
            };
        });

        await verifyUpcomingBillingItems(cms, productList, convertedUpcomingBillingData);
    }
);

When('school admin sees billed at order section has no data', async function (this: IMasterWorld) {
    const cms = this.cms;

    await cms.instruction(
        'School admin sees No Information in Bill At Order Section',
        async function () {
            await cms.page?.waitForSelector(billAtOrderWithNoInfo);
        }
    );
});
