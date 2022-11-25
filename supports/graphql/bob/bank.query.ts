import { gql } from 'graphql-tag';

import { GraphqlBody } from '@supports/packages/graphql-client';

import { User_Eibanam_GetListBankQueryVariables } from './bob-types';

export const getList = gql`
    query User_Eibanam_GetListBank($limit: Int = 10) {
        bank(
            order_by: { created_at: desc }
            where: { is_archived: { _eq: false } }
            limit: $limit
        ) {
            bank_id
            bank_code
            bank_name
        }
    }
`;

class BankBobQuery {
    getList(
        variables?: User_Eibanam_GetListBankQueryVariables
    ): GraphqlBody<User_Eibanam_GetListBankQueryVariables> {
        return { query: getList, variables };
    }
}

const bankBobQuery = new BankBobQuery();

export default bankBobQuery;
