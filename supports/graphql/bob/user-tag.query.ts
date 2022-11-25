import { gql } from 'graphql-tag';

import { GraphqlBody } from '@supports/packages/graphql-client';

import {
    User_Eibanam_GetListUserTagQueryVariables,
    User_Eibanam_GetTagsByUserTagTypesQueryVariables,
} from './bob-types';

export const getList = gql`
    query User_Eibanam_GetListUserTag($limit: Int = 10) {
        user_tag(
            order_by: { created_at: desc }
            where: { is_archived: { _eq: false } }
            limit: $limit
        ) {
            user_tag_id
            user_tag_name
            user_tag_partner_id
            user_tag_type
        }
    }
`;

export const getListByType = gql`
    query User_Eibanam_GetTagsByUserTagTypes(
        $user_tag_types: [String!]
        $user_tag_name: String
        $limit: Int = 30
    ) {
        user_tag(
            limit: $limit
            where: {
                is_archived: { _eq: false }
                user_tag_type: { _in: $user_tag_types }
                user_tag_name: { _ilike: $user_tag_name }
            }
        ) {
            user_tag_id
            user_tag_name
            user_tag_type
            user_tag_partner_id
        }
    }
`;

class UserTagBobQuery {
    getList(
        variables?: User_Eibanam_GetListUserTagQueryVariables
    ): GraphqlBody<User_Eibanam_GetListUserTagQueryVariables> {
        return { query: getList, variables };
    }

    getListByType(
        variables?: User_Eibanam_GetTagsByUserTagTypesQueryVariables
    ): GraphqlBody<User_Eibanam_GetTagsByUserTagTypesQueryVariables> {
        return { query: getListByType, variables };
    }
}

const userTagBobQuery = new UserTagBobQuery();

export default userTagBobQuery;
