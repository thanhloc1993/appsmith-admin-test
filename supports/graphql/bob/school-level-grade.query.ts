import { gql } from 'graphql-tag';

import { GraphqlBody } from '@supports/packages/graphql-client';

import { User_Eibanam_GetSchoolLevelGradeByIdsQueryVariables } from './bob-types';

export const getSchoolLevelGradeByIds = gql`
    query User_Eibanam_GetSchoolLevelGradeByIds($grade_id: String, $school_level_id: String) {
        school_level_grade(
            where: { grade_id: { _eq: $grade_id }, school_level_id: { _eq: $school_level_id } }
        ) {
            grade_id
            school_level_id
        }
    }
`;

class SchoolLevelGradeBobQuery {
    getSchoolLevelGradeByIds(
        variables?: User_Eibanam_GetSchoolLevelGradeByIdsQueryVariables
    ): GraphqlBody<User_Eibanam_GetSchoolLevelGradeByIdsQueryVariables> {
        return { query: getSchoolLevelGradeByIds, variables };
    }
}

const schoolLevelGradeBobQuery = new SchoolLevelGradeBobQuery();

export default schoolLevelGradeBobQuery;
