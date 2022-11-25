export const aliasLearnerProfile = 'aliasLearnerProfile';
export const aliasDiscount = 'aliasDiscount';
export const aliasTax = 'aliasTax';
export const aliasMaterial = 'aliasMaterial';
export const aliasLocation = 'aliasLocation';
export const aliasProductDiscount = 'aliasDiscount';
export const aliasProductBillingDate = 'aliasBillingDate';

// ONE TIME MATERIAL

export const aliasProductData = 'aliasProductData';

export function aliasProductDiscountWithIndex(index: number) {
    return `${aliasDiscount} D${index}`;
}

export function aliasProductBillingDateWithIndex(index: number) {
    return `${aliasProductBillingDate} ${index}`;
}

export function aliasProductDataWithMultipleLocations(location: string) {
    return `${aliasProductData} ${location}`;
}
