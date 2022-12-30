import * as Types from '../__generated__/invoicemgmt/root-types';

export type Invoice_Eibanam_GetListBankBranchQueryVariables = Types.Exact<{
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;

export type Invoice_Eibanam_GetListBankBranchQuery = {
    bank_branch: Array<{
        bank_branch_id: string;
        bank_branch_code: string;
        bank_branch_name: string;
    }>;
};

export type Invoice_Eibanam_GetListBankQueryVariables = Types.Exact<{
    limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;

export type Invoice_Eibanam_GetListBankQuery = {
    bank: Array<{ bank_id: string; bank_code: string; bank_name: string }>;
};
