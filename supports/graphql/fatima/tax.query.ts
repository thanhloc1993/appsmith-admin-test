import gql from 'graphql-tag';

import { GraphqlBody } from '../../packages/graphql-client';
import { Payment_Eibanam_GetTaxIdByNameQueryVariables } from './fatima-types';

const GetTaxIdByName = gql`
    query Payment_Eibanam_GetTaxIdByName($name: String) {
        tax(where: { name: { _eq: $name } }) {
            tax_id
        }
    }
`;

class TaxFatimaQuery {
    getTaxIdByName(
        variables?: Payment_Eibanam_GetTaxIdByNameQueryVariables
    ): GraphqlBody<Payment_Eibanam_GetTaxIdByNameQueryVariables> {
        return { query: GetTaxIdByName, variables };
    }
}

const TaxFatima = new TaxFatimaQuery();

export default TaxFatima;
