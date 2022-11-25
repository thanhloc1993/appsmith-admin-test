import gql from 'graphql-tag';

import { GraphqlBody } from '../../packages/graphql-client';
import { Payment_Eibanam_GetProductIdByNameQueryVariables } from './fatima-types';

const GetProductIdByName = gql`
    query Payment_Eibanam_GetProductIdByName($name: String) {
        product(where: { name: { _eq: $name } }) {
            product_id
        }
    }
`;

class ProductFatimaQuery {
    getProductIdByName(
        variables?: Payment_Eibanam_GetProductIdByNameQueryVariables
    ): GraphqlBody<Payment_Eibanam_GetProductIdByNameQueryVariables> {
        return { query: GetProductIdByName, variables };
    }
}

const ProductFatima = new ProductFatimaQuery();

export default ProductFatima;
