import * as Types from '../__generated__/fatima/root-types';

export type Payment_Eibanam_GetBillingSchedulePeriodIdByNameQueryVariables = Types.Exact<{
  name?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type Payment_Eibanam_GetBillingSchedulePeriodIdByNameQuery = { billing_schedule_period: Array<{ billing_schedule_period_id: number }> };

export type Payment_Eibanam_GetBillingScheduleIdByNameQueryVariables = Types.Exact<{
  name?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type Payment_Eibanam_GetBillingScheduleIdByNameQuery = { billing_schedule: Array<{ billing_schedule_id: number }> };

export type Payment_Eibanam_GetManyDiscountsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Payment_Eibanam_GetManyDiscountsQuery = { discount: Array<{ available_from: any, available_until: any, created_at: any, discount_amount_type: string, discount_amount_value: number, discount_type: string, discount_id: number, name: string, recurring_valid_duration?: number | null | undefined, remarks?: string | null | undefined, updated_at: any }> };

export type Payment_Eibanam_GetDiscountIdByNameQueryVariables = Types.Exact<{
  name?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type Payment_Eibanam_GetDiscountIdByNameQuery = { discount: Array<{ discount_id: number }> };

export type Payment_Eibanam_GetProductIdByNameQueryVariables = Types.Exact<{
  name?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type Payment_Eibanam_GetProductIdByNameQuery = { product: Array<{ product_id: number }> };

export type Payment_Eibanam_GetTaxIdByNameQueryVariables = Types.Exact<{
  name?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type Payment_Eibanam_GetTaxIdByNameQuery = { tax: Array<{ tax_id: number }> };
