import { gql } from 'graphql-tag';

import { User_RoleListV2QueryVariables } from '@supports/graphql/bob/bob-types';
import { GraphqlBody } from '@supports/packages/graphql-client';

const getRolesListQuery = gql`
    query User_RoleListV2($is_system: Boolean = false) {
        role(where: { is_system: { _eq: $is_system } }) {
            role_id
            role_name
        }
        role_aggregate(where: { is_system: { _eq: $is_system } }) {
            aggregate {
                count
            }
        }
    }
`;

class UserRolesBobQuery {
    getTeacherAndSchoolAdminRoleList(
        variables?: User_RoleListV2QueryVariables
    ): GraphqlBody<User_RoleListV2QueryVariables> {
        return { query: getRolesListQuery, variables };
    }
}

const userRolesBobQuery = new UserRolesBobQuery();

export default userRolesBobQuery;
