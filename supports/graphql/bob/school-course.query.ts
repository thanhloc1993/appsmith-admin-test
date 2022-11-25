import { gql } from 'graphql-tag';

import { GraphqlBody } from '@supports/packages/graphql-client';

import {
    User_Eibanam_GetListSchoolCourseQueryVariables,
    User_GetManyReferenceSchoolCourseQueryVariables,
} from './bob-types';

export const getList = gql`
    query User_Eibanam_GetListSchoolCourse($limit: Int = 10) {
        school_course(
            order_by: { created_at: desc }
            where: { is_archived: { _eq: false } }
            limit: $limit
        ) {
            school_course_id
            school_course_name
            school_course_partner_id
        }
    }
`;

export const getManyReferenceSchoolCourse = gql`
    query User_GetManyReferenceSchoolCourse(
        $school_id: String! = ""
        $name: String
        $limit: Int = 10
        $offset: Int = 0
    ) {
        school_course(
            limit: $limit
            offset: $offset
            where: { school_id: { _eq: $school_id }, school_course_name: { _ilike: $name } }
        ) {
            school_course_id
            school_course_name
            is_archived
        }
    }
`;

class SchoolCourseBobQuery {
    getList(
        variables?: User_Eibanam_GetListSchoolCourseQueryVariables
    ): GraphqlBody<User_Eibanam_GetListSchoolCourseQueryVariables> {
        return { query: getList, variables };
    }

    getManyReferenceSchoolCourse(
        variables?: User_GetManyReferenceSchoolCourseQueryVariables
    ): GraphqlBody<User_GetManyReferenceSchoolCourseQueryVariables> {
        return { query: getManyReferenceSchoolCourse, variables };
    }
}

const schoolCourseBobQuery = new SchoolCourseBobQuery();

export default schoolCourseBobQuery;
