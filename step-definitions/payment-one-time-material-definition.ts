import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';
import {
    ImportDiscountData,
    ImportMaterialData,
    ImportProductPriceData,
    ImportTaxData,
} from '@supports/services/payment-import-service/types';

import { DiscountType, MaterialType } from 'manabuf/payment/v1/enums_pb';
import { aliasLearnerProfile } from 'step-definitions/alias-keys/payment';
import {
    createDiscount,
    createLocation,
    createLocationType,
    createMaterial,
    createProductGrade,
    createProductLocation,
    createProductPrice,
    createTax,
} from 'step-definitions/payment-common-definitions';
import {
    CreateProductPriceData,
    fromDate,
    getOneTimeMaterialAlias,
    toDate,
} from 'step-definitions/payment-utils';

export interface CreateOneTimeMaterialProp {
    taxPercentage?: ImportTaxData['tax_percentage'];
    taxCategory?: ImportTaxData['tax_category'];
    price?: ImportProductPriceData['price'];
    priceQuantity?: ImportProductPriceData['quantity'];
    discountType?: ImportDiscountData['discount_type'];
    discountAmountType?: ImportDiscountData['discount_amount_type'];
    discountAmountValue?: ImportDiscountData['discount_amount_value'];
    customBillingDate?: ImportMaterialData['custom_billing_date'];
}

export interface Product {
    alias?: string;
    tax?: ImportTaxData;
    price?: CreateProductPriceData;
    discount?: ImportDiscountData;
    product: ImportMaterialData;
    billingDate?: ImportMaterialData['custom_billing_date'];
}

export interface ProductData {
    location: {
        locationName: string;
        locationId: string;
    };
    products: Product[];
}

export const createOneTimeOrderMaterial = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    oneTimeMaterialProps: CreateOneTimeMaterialProp[] = []
) => {
    const studentProfile = scenario.get<UserProfileEntity>(aliasLearnerProfile);

    const { locationTypeName, parentLocationTypeName } = await createLocationType(cms);

    const { locationId, locationName } = await createLocation(
        cms,
        scenario,
        locationTypeName,
        parentLocationTypeName!
    );

    const materialProductList: Product[] = [];

    for (const [productIndex, materialProps] of oneTimeMaterialProps.entries()) {
        const {
            taxCategory,
            taxPercentage,
            discountAmountType,
            discountAmountValue,
            discountType = DiscountType.DISCOUNT_TYPE_REGULAR,
            price,
            priceQuantity,
            customBillingDate,
        } = materialProps;

        let taxData: ImportTaxData | undefined = undefined;

        if (taxCategory && taxPercentage) {
            taxData = await createTax(cms, scenario, {
                tax_percentage: taxPercentage,
                tax_category: taxCategory,
                default_flag: false,
                is_archived: false,
            });
        }

        const productData = await createMaterial(cms, scenario, {
            material_type: MaterialType.MATERIAL_TYPE_ONE_TIME,
            tax_id: taxData?.tax_id || '',
            available_from: fromDate,
            available_until: toDate,
            custom_billing_period: '',
            custom_billing_date: customBillingDate || '',
            billing_schedule_ID: '',
            disable_pro_rating_flag: false,
            remarks: '',
            is_archived: false,
        });

        const { material_id: productId } = productData;

        let discountData: ImportDiscountData | undefined;

        if (discountType && discountAmountType && discountAmountValue) {
            discountData = await createDiscount(cms, scenario, {
                discount_type: discountType,
                discount_amount_type: discountAmountType,
                discount_amount_value: discountAmountValue,
                recurring_valid_duration: '',
                available_from: fromDate,
                available_until: toDate,
                remarks: '',
                is_archived: false,
            });
        }

        await createProductGrade(cms, productId as number, studentProfile.gradeValue!);

        await createProductLocation(cms, productId as number, locationId);

        let productPriceData: CreateProductPriceData | undefined;

        if (price && priceQuantity)
            productPriceData = await createProductPrice(cms, {
                product_id: productId as number,
                billing_schedule_period_id: '',
                quantity: priceQuantity,
                price,
            });

        materialProductList.push({
            alias: getOneTimeMaterialAlias(productIndex + 1),
            tax: taxData,
            price: productPriceData,
            discount: discountData,
            product: productData,
            billingDate: customBillingDate || '',
        });
    }

    const materialProductData: ProductData = {
        location: {
            locationId,
            locationName,
        },
        products: materialProductList,
    };

    return materialProductData;
};
