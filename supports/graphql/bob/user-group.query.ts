import { gql } from 'graphql-tag';

import { User_UserGroupListV2QueryVariables } from '@supports/graphql/bob/bob-types';
import { GraphqlBody } from '@supports/packages/graphql-client';

const getUserGroupListV2Query = gql`
    query User_UserGroupListV2($limit: Int = 10, $offset: Int = 0, $is_system: Boolean = false) {
        user_group(
            limit: $limit
            offset: $offset
            where: { is_system: { _eq: $is_system } }
            order_by: { created_at: desc }
        ) {
            user_group_id
            user_group_name
        }
        user_group_aggregate(where: { is_system: { _eq: $is_system } }) {
            aggregate {
                count
            }
        }
    }
`;

class UserGroupQueryBob {
    getListWithFilter(
        variables?: User_UserGroupListV2QueryVariables
    ): GraphqlBody<User_UserGroupListV2QueryVariables> {
        return { query: getUserGroupListV2Query, variables };
    }
}

const userGroupQueriesBob = new UserGroupQueryBob();

export default userGroupQueriesBob;
