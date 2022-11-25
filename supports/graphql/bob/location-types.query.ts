import gql from 'graphql-tag';

import { Payment_Eibanam_GetLowestLocationTypesQueryVariables } from '@supports/graphql/bob/bob-types';

import { GraphqlBody } from '../../packages/graphql-client';

const Payment_Eibanam_GetLowestLocationTypesQuery = gql`
    query Payment_Eibanam_GetLowestLocationTypes {
        get_lowest_location_types {
            location_type_id
            display_name
            name
            parent_name
            parent_location_type_id
        }
    }
`;

class LocationTypesBobQuery {
    getLowestLocationTypes(
        variables?: Payment_Eibanam_GetLowestLocationTypesQueryVariables
    ): GraphqlBody<Payment_Eibanam_GetLowestLocationTypesQueryVariables> {
        return { query: Payment_Eibanam_GetLowestLocationTypesQuery, variables };
    }
}

const LocationTypesBob = new LocationTypesBobQuery();

export default LocationTypesBob;
