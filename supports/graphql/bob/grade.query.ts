import { gql } from 'graphql-tag';

import { GraphqlBody } from '@supports/packages/graphql-client';

import { User_Eibanam_GetListGradeQueryVariables } from './bob-types';

export const getList = gql`
    query User_Eibanam_GetListGrade($limit: Int = 10) {
        grade(
            order_by: { created_at: desc }
            where: { is_archived: { _eq: false } }
            limit: $limit
        ) {
            grade_id
            name
            partner_internal_id
            sequence
        }
    }
`;

class GradeBobQuery {
    getList(
        variables?: User_Eibanam_GetListGradeQueryVariables
    ): GraphqlBody<User_Eibanam_GetListGradeQueryVariables> {
        return { query: getList, variables };
    }
}

const gradeBobQuery = new GradeBobQuery();

export default gradeBobQuery;
