import { CMSInterface } from '@supports/app-types';
import { CustomBillingDate } from '@supports/entities/payment-billing-date';
import { formatDate } from '@supports/utils/time/time';

import { DiscountAmountParamsType } from './payment-create-one-time-material-order-common-definitions';
import { Product } from './payment-one-time-material-definition';
import { getCustomBillingDate, getDiscountPriceByType } from './payment-utils';
import { getTextInsideBrackets } from './utils';
import { DiscountAmountType } from 'manabuf/payment/v1/enums_pb';
import * as PaymentKeys from 'step-definitions/cms-selectors/payment';
import { ProductDataTable } from 'step-definitions/payment-create-one-time-material-order-with-inclusive-tax-and-discount-definitions';

export interface ProductDataTableWithCustomBillingDate extends ProductDataTable {
    discountAmountType: DiscountAmountParamsType;
    customBillingDate: string;
}

export interface UpcomingBillingDataTable {
    billingDate: string;
    discount: string;
    productAmount: number;
}

export function getBillingDate(billingDateRule: string): Date {
    // rule format: billingDate 1 (custom_billing_date > created order date)
    const condition = getTextInsideBrackets<CustomBillingDate>(billingDateRule);

    if (!condition) return new Date();

    return getCustomBillingDate(condition);
}

export async function verifyUpcomingBillingItems(
    cms: CMSInterface,
    productData: Product[],
    upcomingBillingData: UpcomingBillingDataTable[]
) {
    for (const [index, product] of productData.entries()) {
        await cms.attach(`Check discount number ${index + 1}:`);
        await assertUpcomingBillingItem(cms, product, upcomingBillingData[index]);
    }
}

export async function assertUpcomingBillingItem(
    cms: CMSInterface,
    productData: Product,
    upcomingBillingData: UpcomingBillingDataTable
) {
    await cms.instruction(
        `Check upcoming billing product item:
        - Product name: ${productData.product.name}
        - Product billing date: ${productData.product.custom_billing_date}`,
        async () => {
            await cms.waitForSelectorHasText(
                `${PaymentKeys.upcomingBillingSection} ${PaymentKeys.upcomingBillingProductName}`,
                productData.product.name
            );

            await cms.waitForSelectorHasText(
                `${PaymentKeys.upcomingBillingSection} ${PaymentKeys.upcomingBillingProductBillingDate}`,
                formatDate(new Date(upcomingBillingData.billingDate), 'YYYY/MM/DD')
            );
        }
    );

    if (!productData.discount) {
        await cms.instruction(
            `Check upcoming billing product price:
            - Product price: ${productData.price?.price}`,
            async () => {
                await cms.waitForSelectorHasText(
                    `${PaymentKeys.upcomingBillingSection} ${PaymentKeys.upcomingBillingProductAmount}`,
                    `${upcomingBillingData.productAmount}`
                );
            }
        );
    } else {
        const productAmount =
            (productData.price?.price || 0) -
            getDiscountPriceByType(
                DiscountAmountType[productData.discount!.discount_amount_type],
                productData.discount!.discount_amount_value,
                productData.price!.price
            );
        await cms.instruction(
            `Check discount:
        - Discount name: ${productData.discount?.name}
        - Product amount: ${productAmount}`,
            async () => {
                await cms.waitForSelectorHasText(
                    `${PaymentKeys.upcomingBillingSection} ${PaymentKeys.upcomingBillingProductDiscount}`,
                    upcomingBillingData.discount
                );

                await cms.waitForSelectorHasText(
                    `${PaymentKeys.upcomingBillingSection} ${PaymentKeys.upcomingBillingProductAmount}`,
                    `${productAmount}`
                );
            }
        );
    }
}
