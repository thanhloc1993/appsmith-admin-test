import gql from 'graphql-tag';

import { GraphqlBody } from '../../packages/graphql-client';
import { Payment_Eibanam_GetBillingSchedulePeriodIdByNameQueryVariables } from './fatima-types';

const GetBillingSchedulePeriodIdByName = gql`
    query Payment_Eibanam_GetBillingSchedulePeriodIdByName($name: String) {
        billing_schedule_period(where: { name: { _eq: $name } }) {
            billing_schedule_period_id
        }
    }
`;

class BillingSchedulePeriodsFatimaQuery {
    getBillingSchedulePeriodIdByName(
        variables?: Payment_Eibanam_GetBillingSchedulePeriodIdByNameQueryVariables
    ): GraphqlBody<Payment_Eibanam_GetBillingSchedulePeriodIdByNameQueryVariables> {
        return { query: GetBillingSchedulePeriodIdByName, variables };
    }
}

const BillingSchedulePeriodsFatima = new BillingSchedulePeriodsFatimaQuery();

export default BillingSchedulePeriodsFatima;
