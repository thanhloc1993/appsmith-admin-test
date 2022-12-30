import { gql } from 'graphql-tag';

import {
    User_UserGroupListV2QueryVariables,
    User_UserGroupsManyReferenceV2QueryVariables,
} from '@supports/graphql/bob/bob-types';
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

const getUserGroupsManyReferenceQuery = gql`
    query User_UserGroupsManyReferenceV2(
        $user_group_name: String
        $is_system: Boolean = false
        $limit: Int = 13
        $offset: Int = 0
    ) {
        user_group(
            limit: $limit
            offset: $offset
            where: { user_group_name: { _ilike: $user_group_name }, is_system: { _eq: $is_system } }
            order_by: { created_at: desc }
        ) {
            user_group_id
            user_group_name
        }
    }
`;

class UserGroupQueryBob {
    getListWithFilter(
        variables?: User_UserGroupListV2QueryVariables
    ): GraphqlBody<User_UserGroupListV2QueryVariables> {
        return { query: getUserGroupListV2Query, variables };
    }
    userUserGroupGetManyReference(
        variables?: User_UserGroupsManyReferenceV2QueryVariables
    ): GraphqlBody<User_UserGroupsManyReferenceV2QueryVariables> {
        return { query: getUserGroupsManyReferenceQuery, variables };
    }
}

const userGroupQueriesBob = new UserGroupQueryBob();

export default userGroupQueriesBob;
