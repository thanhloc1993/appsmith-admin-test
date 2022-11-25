import { TaxCategory } from 'manabuf/payment/v1/enums_pb';

export interface ProductDataTable {
    price: number;
    discount: number;
    tax: number;
    taxCategory: keyof typeof TaxCategory;
}

export interface BilledAtOrderDataTable {
    subTotal: number;
    taxAmountText: string;
    productTotal: number;
}
