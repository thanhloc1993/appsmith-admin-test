import { CMSInterface } from '@supports/app-types';
import { dateIsAfter, formatDate } from '@supports/utils/time/time';

import { tableBaseRowWithId } from './cms-selectors/cms-keys';
import { createOrderFormButtonAdd } from './cms-selectors/payment';
import {
    BilledAtOrderDataTable,
    ProductDataTable,
} from './payment-create-one-time-material-order-with-inclusive-tax-and-discount-definitions';
import { Product, ProductData } from './payment-one-time-material-definition';
import {
    calculateTaxInclusions,
    calculateTotalValueForItems,
    getDiscountAmountType,
    getDiscountPriceByType,
    getPaymentError,
    isBilledAtOrderDataHavingTax,
} from './payment-utils';
import { DiscountAmountType } from 'manabuf/payment/v1/enums_pb';
import * as PaymentKeys from 'step-definitions/cms-selectors/payment';
import { getEnumKey } from 'step-definitions/utils';

export type ProductNameType = 'one-time material 1' | 'one-time material 2';

export type LocationsType = 'location L1' | 'location L2';

export type DiscountAmountParamsType = keyof typeof DiscountAmountType;

export interface ProductDataTableWithDiscount extends ProductDataTable {
    discountAmountType: DiscountAmountParamsType;
}

export const clickAddButtonOfProductList = async (cms: CMSInterface) => {
    await cms.instruction('Click Add button in table product list', async () => {
        await cms.page?.click(createOrderFormButtonAdd);
    });
};

export const selectLocationAtCreateOrderForm = async (
    cms: CMSInterface,
    productLocation: ProductData['location']
) => {
    const page = cms.page!;
    const locationName = productLocation.locationName;

    await cms.waitingAutocompleteLoading(); // wait for locationAutocomplete get value

    const locationAutocompleteValue = await page.inputValue(
        PaymentKeys.locationsLowestLevelAutocompleteId
    );

    if (locationAutocompleteValue !== locationName) {
        await cms.instruction(`Select location name ${locationName}`, async () => {
            await page.click(PaymentKeys.locationsLowestLevelAutocomplete);
            await page.type(PaymentKeys.locationsLowestLevelAutocomplete, '');

            await cms.waitingAutocompleteLoading();

            await page.type(PaymentKeys.locationsLowestLevelAutocomplete, locationName);

            await cms.chooseOptionInAutoCompleteBoxByText(locationName);
        });
    }
};

export const selectProductOneTimeMaterial = async (
    cms: CMSInterface,
    productName: string,
    index: number
) => {
    await cms.waitingForLoadingIcon();

    const productItem = await cms.page!.$(tableBaseRowWithId(index));

    if (!productItem) throw getPaymentError(`No product item found at index ${index}`);

    await cms.instruction(`Select product name ${productName} at index:${index}`, async () => {
        const productAutocomplete = await productItem.$(PaymentKeys.productAutocomplete);

        const productAutocompleteInput = await productAutocomplete?.$('input');

        await productAutocompleteInput?.click();
        await productAutocompleteInput?.fill(productName);

        await cms.chooseOptionInAutoCompleteBoxByText(productName);
    });
};

export const selectDiscountAutocomplete = async (
    cms: CMSInterface,
    materialProduct: Product,
    discountAmountType: DiscountAmountParamsType | DiscountAmountType,
    index: number
) => {
    await cms.waitingForLoadingIcon();

    if (!materialProduct.discount || !materialProduct.discount.name) {
        await cms.attach(
            `Product id: ${materialProduct.product.material_id} name: ${materialProduct.product.name} at index: ${index} doesn't have discount`
        );
    } else {
        const productItem = await cms.page!.$(tableBaseRowWithId(index));

        if (!productItem) throw getPaymentError(`No product item found at index ${index}`);

        const discountAmountTypeText = getDiscountAmountType(discountAmountType);

        await cms.instruction(
            `Select discount type ${discountAmountTypeText} and name ${materialProduct.discount.name} at product index: ${index}`,
            async () => {
                const discountAutocomplete = await productItem.waitForSelector(
                    PaymentKeys.discountAutocomplete
                );
                const discountAutocompleteInput = await discountAutocomplete?.$('input');

                await discountAutocompleteInput?.click();
                await discountAutocompleteInput?.fill(materialProduct.discount!.name);

                await cms.chooseOptionInAutoCompleteBoxByText(materialProduct.discount!.name);
            }
        );
    }
};

export const inputCommentOrder = async (cms: CMSInterface, comment = 'Comment for order E2E') => {
    await cms.page?.click(PaymentKeys.createOrderBilledAtOrderProductSection); // Click outside when having No options

    await cms.instruction('Input comment for order', async () => {
        await cms.page!.fill(PaymentKeys.createOrderFormCommentTextarea, comment);
    });
};

export const checkBillingDateText = async (cms: CMSInterface, expectedDay: Date, index: number) => {
    const formattedExpectedDay = formatDate(expectedDay, 'YYYY/MM/DD');

    const productItem = await cms.page!.$(tableBaseRowWithId(index));

    if (!productItem) throw getPaymentError(`No product item found at index ${index}`);

    await cms.instruction(
        `Assert billing text: ${formattedExpectedDay} at product index: ${index}`,
        async () => {
            const billingDate = await productItem.waitForSelector(PaymentKeys.itemListBillingDate);

            const billingDateText = await billingDate?.textContent();

            weExpect(billingDateText).toEqual(formattedExpectedDay);
        }
    );
};

export const assertBillingDateOfOneTimeMaterial = async (
    cms: CMSInterface,
    materialList: Product[]
) => {
    const today = new Date();
    const formatToday = formatDate(today, 'YYYY/MM/DD, HH:mm');

    for (let i = 0; i < materialList.length; i++) {
        const material = materialList[0];

        if (!material.billingDate) {
            await cms.instruction(
                `BillingDate is empty, check billing date is set to ${formatToday} for product at index ${i}`,
                async () => {
                    await checkBillingDateText(cms, today, i);
                }
            );

            continue;
        }

        const billingDate = new Date(material.billingDate);
        const formatBillingDate = formatDate(billingDate, 'YYYY/MM/DD, HH:mm');

        if (dateIsAfter(billingDate, today)) {
            await cms.attach(
                `BillingDate is in the future ${formatBillingDate} with today ${formatToday} for product at index ${i}. Not show item in billed at order`
            );
        } else {
            await cms.instruction(
                `BillingDate is ${formatBillingDate} with today ${formatToday} for product at index ${i}`,
                async () => {
                    await checkBillingDateText(cms, billingDate, i);
                }
            );
        }
    }
};

export const assertUpcomingBillingOfOneTimeMaterial = async (
    cms: CMSInterface,
    materialList: Product[]
) => {
    const isUpComingBillingAvailable = materialList.some((material) => {
        return material.billingDate && dateIsAfter(new Date(material.billingDate), new Date());
    });

    if (isUpComingBillingAvailable)
        await cms.instruction(
            `One of the product has billing date, check upcoming billing with data`,
            async () => {
                // TODO: @payment Assert upcoming billing here following the rule of the billing date
                await cms.attach(`Not implemented yet`);
            }
        );
    else {
        await cms.instruction(
            'BillingDate are all empty, check upcoming billing with no data',
            async () => {
                await cms.page?.waitForSelector(PaymentKeys.paymentNoDataMessage);
            }
        );
    }
};

export const assertBilledAtOrderOfOneTimeMaterial = async (
    cms: CMSInterface,
    materialList: Product[],
    billedAtOrderData?: BilledAtOrderDataTable
) => {
    if (!billedAtOrderData) {
        throw getPaymentError(
            "assertBilledAtOrderOfOneTimeMaterial Don't have Billed At Order Data"
        );
    }

    for (const materialProduct of materialList) {
        const {
            product: { material_id: productId, name: productName },
            price: productDataPrice,
            discount: productDataDiscount,
        } = materialProduct;

        const productPrice = productDataPrice!.price;

        let productDiscountName = '';
        let productDiscountType = '';
        let productDiscountValue = 0;

        await cms.instruction(
            `Check product item:
            - Product name: ${productName}
            - Product amount: ${productPrice}`,
            async () => {
                await cms.waitForSelectorHasText(
                    `${PaymentKeys.createOrderBilledAtOrderProductSection} ${PaymentKeys.billedAtOrderItemName}`,
                    productName
                );

                await cms.waitForSelectorHasText(
                    `${PaymentKeys.createOrderBilledAtOrderProductSection} ${PaymentKeys.billedAtOrderItemPrice}`,
                    `${productPrice}`
                );
            }
        );

        if (!productDataDiscount) {
            await cms.attach(`Don't have Billed At Order Discount of product id ${productId}`);
        } else {
            productDiscountName = productDataDiscount!.name;
            productDiscountValue = productDataDiscount!.discount_amount_value;
            productDiscountType = getEnumKey(
                DiscountAmountType,
                productDataDiscount!.discount_amount_type
            );

            await cms.instruction(
                `Check discount:
                - Discount name: ${productDiscountName}
                - Discount amount original value: ${productDiscountValue}
                - Discount amount rounded value: ${getDiscountPriceByType(
                    productDiscountType,
                    productDiscountValue,
                    productPrice
                )}`,
                async () => {
                    await cms.waitForSelectorHasText(
                        `${PaymentKeys.createOrderBilledAtOrderDiscountSection} ${PaymentKeys.billedAtOrderItemName}`,
                        productDiscountName
                    );

                    await cms.waitForSelectorHasText(
                        `${PaymentKeys.createOrderBilledAtOrderDiscountSection} ${PaymentKeys.billedAtOrderItemPrice}`,
                        `${getDiscountPriceByType(
                            productDiscountType,
                            productDiscountValue,
                            productPrice
                        )}`
                    );
                }
            );
        }
    }

    if (!isBilledAtOrderDataHavingTax(billedAtOrderData.taxAmountText)) {
        await cms.attach(`BilledAtOrderDataTable don't have taxAmountText`);
    } else {
        const totalTaxEntries = calculateTaxInclusions(materialList);
        let iterator = 0;

        for (const [taxName, totalTaxInclusion] of totalTaxEntries) {
            const taxAmountText = billedAtOrderData.taxAmountText.split(',');

            await cms.instruction(
                `Check tax amount:
                    - Tax: ${taxAmountText[iterator]}
                    - Tax value: ${totalTaxInclusion}`,
                async () => {
                    await cms.waitForSelectorHasText(
                        `${PaymentKeys.createOrderBilledAtOrderTaxInclusionsSection} ${PaymentKeys.billedAtOrderItemName}`,
                        taxName
                    );

                    await cms.waitForSelectorHasText(
                        `${PaymentKeys.createOrderBilledAtOrderTaxInclusionsSection} ${PaymentKeys.billedAtOrderItemPrice}`,
                        `${totalTaxInclusion}`
                    );
                }
            );

            iterator++;
        }
    }

    const totalProductsPrice = calculateTotalValueForItems(materialList);

    await cms.instruction(
        `Check sub-total and total of all products:
            - Total: ${billedAtOrderData.productTotal}
            - Sub-total: ${billedAtOrderData.subTotal}`,
        async () => {
            await cms.waitForSelectorHasText(
                `${PaymentKeys.billedAtOrderSubTotal} ${PaymentKeys.billedAtOrderItemPrice}`,
                `${totalProductsPrice}`
            );

            await cms.waitForSelectorHasText(
                `${PaymentKeys.billedAtOrderTotal} ${PaymentKeys.billedAtOrderItemPrice}`,
                `${totalProductsPrice}`
            );
        }
    );
};

export const assertOrderCommentInput = async (cms: CMSInterface, comment: string) => {
    await cms.instruction(`Check comment section for "${comment}" order form`, async () => {
        const commentSectionInputValue = await cms.page?.inputValue(
            PaymentKeys.createOrderFormCommentTextarea
        );
        weExpect(commentSectionInputValue).toEqual(comment);
    });
};
