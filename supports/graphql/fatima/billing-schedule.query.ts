import gql from 'graphql-tag';

import { GraphqlBody } from '../../packages/graphql-client';
import { Payment_Eibanam_GetBillingScheduleIdByNameQueryVariables } from './fatima-types';

const GetBillingScheduleIdByName = gql`
    query Payment_Eibanam_GetBillingScheduleIdByName($name: String) {
        billing_schedule(where: { name: { _eq: $name } }) {
            billing_schedule_id
        }
    }
`;

class BillingSchedulesFatimaQuery {
    getBillingScheduleIdByName(
        variables?: Payment_Eibanam_GetBillingScheduleIdByNameQueryVariables
    ): GraphqlBody<Payment_Eibanam_GetBillingScheduleIdByNameQueryVariables> {
        return { query: GetBillingScheduleIdByName, variables };
    }
}

const BillingSchedulesFatima = new BillingSchedulesFatimaQuery();

export default BillingSchedulesFatima;
