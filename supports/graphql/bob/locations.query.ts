import gql from 'graphql-tag';

import { GraphqlBody } from '@supports/packages/graphql-client';

import { User_Eibanam_GetPartnerInternalIdByLocationIdsQueryVariables } from './bob-types';

const User_Eibanam_GetPartnerInternalIdByLocationIdsQuery = gql`
    query User_Eibanam_GetPartnerInternalIdByLocationIds($location_ids: [String!] = []) {
        locations(where: { location_id: { _in: $location_ids } }) {
            location_id
            partner_internal_id
        }
    }
`;

class LocationsBobQuery {
    getPartnerInternalLocationIdByLocationIds(
        variables?: User_Eibanam_GetPartnerInternalIdByLocationIdsQueryVariables
    ): GraphqlBody<User_Eibanam_GetPartnerInternalIdByLocationIdsQueryVariables> {
        return { query: User_Eibanam_GetPartnerInternalIdByLocationIdsQuery, variables };
    }
}

const LocationsBob = new LocationsBobQuery();

export default LocationsBob;
