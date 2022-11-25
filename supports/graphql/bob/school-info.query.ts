import { gql } from 'graphql-tag';

import { GraphqlBody } from '@supports/packages/graphql-client';

import {
    User_Eibanam_GetListSchoolInfoQueryVariables,
    User_Eibanam_GetManyReferenceSchoolInfoQueryVariables,
} from './bob-types';

export const getList = gql`
    query User_Eibanam_GetListSchoolInfo($limit: Int = 10) {
        school_info(
            order_by: { created_at: desc }
            where: { is_archived: { _eq: false } }
            limit: $limit
        ) {
            school_id
            school_name
            school_partner_id
        }
    }
`;
export const getManyReferenceSchoolInfo = gql`
    query User_Eibanam_GetManyReferenceSchoolInfo(
        $school_level_id: String
        $name: String
        $limit: Int = 30
        $offset: Int = 0
    ) {
        school_info(
            limit: $limit
            offset: $offset
            where: { school_name: { _ilike: $name }, school_level_id: { _eq: $school_level_id } }
        ) {
            school_id
            school_name
            address
            is_archived
            school_level_id
            school_partner_id
        }
    }
`;

class SchoolInfoBobQuery {
    getList(
        variables?: User_Eibanam_GetListSchoolInfoQueryVariables
    ): GraphqlBody<User_Eibanam_GetListSchoolInfoQueryVariables> {
        return { query: getList, variables };
    }
    getManyReferenceSchoolInfo(
        variables: User_Eibanam_GetManyReferenceSchoolInfoQueryVariables
    ): GraphqlBody<User_Eibanam_GetManyReferenceSchoolInfoQueryVariables> {
        return { query: getManyReferenceSchoolInfo, variables };
    }
}

const schoolInfoBobQuery = new SchoolInfoBobQuery();

export default schoolInfoBobQuery;
