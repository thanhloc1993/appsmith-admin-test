import { gql } from 'graphql-tag';

import { GraphqlBody } from '@supports/packages/graphql-client';

import { Invoice_Eibanam_GetListBankBranchQueryVariables } from './invoicemgmt-types';

export const getList = gql`
    query Invoice_Eibanam_GetListBankBranch($limit: Int = 10) {
        bank_branch(
            order_by: { created_at: desc }
            where: { is_archived: { _eq: false } }
            limit: $limit
        ) {
            bank_branch_id
            bank_branch_code
            bank_branch_name
        }
    }
`;

class BankBranchBobQuery {
    getList(
        variables?: Invoice_Eibanam_GetListBankBranchQueryVariables
    ): GraphqlBody<Invoice_Eibanam_GetListBankBranchQueryVariables> {
        return { query: getList, variables };
    }
}

const bankBranchBobQuery = new BankBranchBobQuery();

export default bankBranchBobQuery;
