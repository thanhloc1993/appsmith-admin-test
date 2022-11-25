import { gql } from 'graphql-tag';

import { GraphqlBody } from '../../packages/graphql-client';
import { CoursesOneQueryVariables } from './bob-types';

const courseFragment = gql`
    fragment CourseAttrs on courses {
        course_id
        name
        icon
        grade
        subject
        country
        school_id
        display_order
    }
`;

const getOneQuery = gql`
    query CoursesOne($course_id: String!) {
        courses(where: { course_id: { _eq: $course_id } }) {
            ...CourseAttrs
            course_books {
                book_id
                books {
                    book_chapters {
                        chapter_id
                    }
                }
            }
        }
    }
    ${courseFragment}
`;

class BobCourseQuery {
    getOne(variables: CoursesOneQueryVariables): GraphqlBody<CoursesOneQueryVariables> {
        return {
            query: getOneQuery,
            variables,
        };
    }
}

/**
 * Example: 
    const response = await this.graphqlClient?.callGqlBob({
        body: bobCourseQueries.getOne({ course_id: '...' }),
    });
 */

const bobCourseQueries = new BobCourseQuery();

export default bobCourseQueries;
