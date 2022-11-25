import { gql } from 'graphql-tag';

import { GraphqlBody } from '@supports/packages/graphql-client';

import {
    User_Eibanam_GetListSchoolLevelQueryVariables,
    User_Eibanam_CountSchoolLevelBySequenceQueryVariables,
    User_GetManyReferenceSchoolLevelV2QueryVariables,
} from './bob-types';

export const getList = gql`
    query User_Eibanam_GetListSchoolLevel($limit: Int = 10) {
        school_level(
            order_by: { created_at: desc }
            where: { is_archived: { _eq: false } }
            limit: $limit
        ) {
            school_level_id
            school_level_name
            sequence
        }
    }
`;

export const countBySequence = gql`
    query User_Eibanam_CountSchoolLevelBySequence($sequence: Int!) {
        school_level_aggregate(where: { sequence: { _eq: $sequence } }) {
            aggregate {
                count
            }
        }
    }
`;

export const getManyReferenceSchoolLevel = gql`
    query User_GetManyReferenceSchoolLevelV2(
        $school_id: String
        $name: String
        $limit: Int = 30
        $offset: Int = 0
    ) {
        school_level(
            where: {
                school_level_name: { _ilike: $name }
                school_infos: { school_id: { _eq: $school_id } }
            }
            limit: $limit
            offset: $offset
        ) {
            school_level_id
            school_level_name
            is_archived
            school_infos {
                school_id
            }
        }
    }
`;

class SchoolLevelBobQuery {
    getList(
        variables?: User_Eibanam_GetListSchoolLevelQueryVariables
    ): GraphqlBody<User_Eibanam_GetListSchoolLevelQueryVariables> {
        return { query: getList, variables };
    }

    countBySequence(
        variables: User_Eibanam_CountSchoolLevelBySequenceQueryVariables
    ): GraphqlBody<User_Eibanam_CountSchoolLevelBySequenceQueryVariables> {
        return {
            query: countBySequence,
            variables,
        };
    }
    getManyReferenceSchoolLevel(
        variables: User_GetManyReferenceSchoolLevelV2QueryVariables
    ): GraphqlBody<User_GetManyReferenceSchoolLevelV2QueryVariables> {
        return {
            query: getManyReferenceSchoolLevel,
            variables,
        };
    }
}

const schoolLevelBobQuery = new SchoolLevelBobQuery();

export default schoolLevelBobQuery;
