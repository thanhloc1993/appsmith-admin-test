import { DataTable } from '@cucumber/cucumber';

import { BilledAtOrderDataTable } from 'step-definitions/payment-create-one-time-material-order-with-inclusive-tax-and-discount-definitions';

export type RoundType =
    | 'inclusive tax is rounded up'
    | 'inclusive tax is rounded down'
    | 'discount is rounded up'
    | 'discount is rounded down';

export interface ProductDataTableWithRoundType {
    price: number;
    taxPercentage?: number;
    discountPercentage?: number;
    roundType: RoundType;
}

export interface BilledAtOrderWithRoundTypeDataTable extends BilledAtOrderDataTable {
    roundType: RoundType;
}

export const filterDataTableByRoundType = (
    productWithRoundTypeDataTable: DataTable,
    roundType: RoundType
) => productWithRoundTypeDataTable.hashes().filter((product) => product.roundType === roundType);
