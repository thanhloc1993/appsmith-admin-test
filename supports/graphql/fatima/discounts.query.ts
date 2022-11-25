import gql from 'graphql-tag';

import { GraphqlBody } from '../../packages/graphql-client';
import {
    Payment_Eibanam_GetManyDiscountsQueryVariables,
    Payment_Eibanam_GetDiscountIdByNameQueryVariables,
} from './fatima-types';

const DiscountsManyQuery = gql`
    query Payment_Eibanam_GetManyDiscounts {
        discount(where: { is_archived: { _eq: false } }) {
            available_from
            available_until
            created_at
            discount_amount_type
            discount_amount_value
            discount_type
            discount_id
            name
            recurring_valid_duration
            remarks
            updated_at
        }
    }
`;

const GetDiscountIdByName = gql`
    query Payment_Eibanam_GetDiscountIdByName($name: String) {
        discount(where: { name: { _eq: $name } }) {
            discount_id
        }
    }
`;

class DiscountsFatimaQuery {
    getMany(
        variables?: Payment_Eibanam_GetManyDiscountsQueryVariables
    ): GraphqlBody<Payment_Eibanam_GetManyDiscountsQueryVariables> {
        return { query: DiscountsManyQuery, variables };
    }
    getDiscountIdByName(
        variables?: Payment_Eibanam_GetDiscountIdByNameQueryVariables
    ): GraphqlBody<Payment_Eibanam_GetDiscountIdByNameQueryVariables> {
        return { query: GetDiscountIdByName, variables };
    }
}

const discountsFatima = new DiscountsFatimaQuery();

export default discountsFatima;
