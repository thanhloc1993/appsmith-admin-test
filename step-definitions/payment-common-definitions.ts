import { CMSInterface } from '@supports/app-types';
import { MasterCategory } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import bobImportService from '@supports/services/bob-import-service';
import { ImportLocationTypeData } from '@supports/services/bob-import-service/types';
import paymentImportService from '@supports/services/payment-import-service';
import {
    ImportDiscountData,
    ImportMaterialData,
    ImportTaxData,
} from '@supports/services/payment-import-service/types';

import { RetrieveLowestLevelLocationsResponse } from 'manabuf/bob/v1/masterdata_pb';
import {
    aliasDiscount,
    aliasLocation,
    aliasMaterial,
    aliasTax,
    aliasLearnerProfile,
} from 'step-definitions/alias-keys/payment';
import {
    getDiscountIdByName,
    getLocationByName,
    getLowestLocationType,
    getProductIdByName,
    getTaxIdByName,
} from 'step-definitions/payment-hasura';
import {
    createDiscountData,
    CreateDiscountData,
    createLocationData,
    CreateMaterialData,
    createMaterialData,
    createParentLocationData,
    createProductGradeData,
    createProductLocationData,
    CreateProductPriceData,
    CreateTaxData,
    createTaxData,
    getPaymentError,
    ProductIdOfAssociateTablesType,
} from 'step-definitions/payment-utils';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';
import { retry } from 'ts-retry-promise';

export const createDiscount = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    discountData: CreateDiscountData
): Promise<ImportDiscountData> => {
    const token = await cms.getToken();
    const importDiscountData = createDiscountData(discountData);
    const {
        name: discountName,
        discount_type: discountType,
        discount_amount_type: discountAmountType,
        discount_amount_value: discountAmountValue,
        available_from: availableFrom,
        available_until: availableUntil,
    } = importDiscountData;

    await cms.attach(`Import discount ${discountName} with:
        - DiscountType: ${discountType}
        - DiscountAmountType: ${discountAmountType}
        - DiscountAmountValue: ${discountAmountValue}
        - AvailableFrom: ${availableFrom}
        - AvailableUntil: ${availableUntil}`);

    await paymentImportService.importPaymentData(
        token,
        importDiscountData,
        MasterCategory.Discount
    );

    const { discount_id: discountId } = await getDiscountIdByName(cms, discountName);

    const createdDiscount = { ...importDiscountData, discount_id: discountId };

    scenario.set(aliasDiscount, createdDiscount);

    return createdDiscount;
};

export const createTax = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    taxData: CreateTaxData
): Promise<ImportTaxData> => {
    const token = await cms.getToken();
    const importTaxData = createTaxData(taxData);
    const {
        name: taxName,
        tax_category: taxCategory,
        tax_percentage: taxPercentage,
    } = importTaxData;

    await cms.attach(`Import tax ${taxName} with:
        - taxCategory: ${taxCategory}
        - taxPercentage: ${taxPercentage}
    `);

    await paymentImportService.importPaymentData(token, importTaxData, MasterCategory.Tax);

    const { tax_id: taxId } = await getTaxIdByName(cms, taxName);

    const createdTax = { ...importTaxData, tax_id: taxId };

    scenario.set(aliasTax, createdTax);

    return createdTax;
};

export const createLocationType = async (cms: CMSInterface) => {
    const token = await cms.getToken();

    const { locationTypeName, parentLocationTypeName } = await getLowestLocationType(cms);

    if (!locationTypeName || typeof parentLocationTypeName === 'undefined') {
        // Keep the location types of all squads consistent by importing the location-type.csv
        await cms.attach('Import location types from assets/master-data/location-type.csv');
        await bobImportService.importBobData(token, MasterCategory.LocationType);
        const importedLocationType = await getLowestLocationType(cms);

        return importedLocationType;
    }

    return { locationTypeName, parentLocationTypeName };
};

export const createParentLocation = async (
    cms: CMSInterface,
    locationType: ImportLocationTypeData['name']
) => {
    const token = await cms.getToken();
    const importParentLocationData = createParentLocationData(locationType);
    const locationName = importParentLocationData.name;

    await cms.attach(`Import location ${locationName}`);

    await bobImportService.importBobData(token, MasterCategory.Location, importParentLocationData);
};

export const createLocation = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    locationType: ImportLocationTypeData['name'],
    parentOfLocationType: ImportLocationTypeData['parent_name']
) => {
    const token = await cms.getToken();

    // Import the parent location of E2E to keep E2E centers consistent in every runs
    await createParentLocation(cms, parentOfLocationType);

    const importLocationData = createLocationData(locationType, parentOfLocationType);
    const locationName = importLocationData.name;

    await cms.attach(`Import location ${locationName}`);

    await bobImportService.importBobData(token, MasterCategory.Location, importLocationData);

    const { locationId } = await getLocationByName(cms, locationName);

    scenario.set(aliasLocation, locationName);

    return { locationId, locationName };
};

export const createMaterial = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    materialData: CreateMaterialData
): Promise<ImportMaterialData> => {
    const token = await cms.getToken();

    const importMaterialData = createMaterialData(materialData);
    const {
        name: materialName,
        material_type: materialType,
        available_from: availableFrom,
        available_until: availableUntil,
        custom_billing_date: customBillingDate,
    } = importMaterialData;

    await cms.attach(`Import one-time material ${materialName} with
        - materialType: ${materialType}
        - availableFrom: ${availableFrom}
        - availableUntil: ${availableUntil}
        - customBillingDate: ${customBillingDate}`);

    await paymentImportService.importPaymentData(
        token,
        importMaterialData,
        MasterCategory.Material
    );

    const { product_id: productId } = await getProductIdByName(cms, materialName);

    const createdMaterial = { ...importMaterialData, material_id: productId };

    scenario.set(aliasMaterial, createdMaterial);

    return createdMaterial;
};

export const createProductGrade = async (
    cms: CMSInterface,
    productId: ProductIdOfAssociateTablesType,
    gradeId: number
) => {
    const token = await cms.getToken();
    const productGradeData = createProductGradeData(productId, gradeId);

    await cms.attach(`Import ProductGrade with productId: ${productId} and grade: ${gradeId}`);

    await paymentImportService.importPaymentData(
        token,
        productGradeData,
        MasterCategory.ProductGrade
    );
};

export const createProductLocation = async (
    cms: CMSInterface,
    productId: ProductIdOfAssociateTablesType,
    locationId: RetrieveLowestLevelLocationsResponse.Location.AsObject['locationId']
) => {
    const token = await cms.getToken();
    const productLocationData = createProductLocationData(productId, locationId);

    await cms.attach(
        `Import ProductLocation with productId: ${productId} and locationId: ${locationId}`
    );

    await retry(
        async function () {
            await paymentImportService.importPaymentData(
                token,
                productLocationData,
                MasterCategory.ProductLocation
            );
        },
        { retries: 2, delay: 10000 } // Retry 2 times with delay 10000ms
    ).catch(function (reason) {
        throw getPaymentError(
            `Import product_location master data failed: ${JSON.stringify(reason)}`
        );
    });
};

export const createProductPrice = async (
    cms: CMSInterface,
    productPriceData: CreateProductPriceData
) => {
    const token = await cms.getToken();

    await cms.attach(
        `Import ProductPrice with productId: ${productPriceData.product_id} and billingSchedulePeriodID: ${productPriceData.billing_schedule_period_id}`
    );

    await paymentImportService.importPaymentData(
        token,
        productPriceData,
        MasterCategory.ProductPrice
    );

    return productPriceData;
};

export async function createStudentWithCourseAndGrade(
    cms: CMSInterface,
    context: ScenarioContext,
    parentLength = 1
) {
    const { student } = await createARandomStudentGRPC(cms, {
        parentLength,
        studentPackageProfileLength: 1,
    });

    await cms.attach(
        `Create a student with course, grade by gRPC:
        Student name: ${student.name}
        Grade: ${student.gradeValue}`
    );

    context.set(aliasLearnerProfile, student);
}
