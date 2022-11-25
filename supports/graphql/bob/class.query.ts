import { gql } from 'graphql-tag';

import { Lesson_ClassManyByLocationIdAndCourseIdAndNameQueryVariables } from 'supports/graphql/bob/bob-types';
import { GraphqlBody } from 'supports/packages/graphql-client';

const getClassesInCourseOfLocation = gql`
    query Lesson_ClassManyByLocationIdAndCourseIdAndName(
        $location_id: String!
        $course_id: String!
        $name: String
        $limit: Int = 30
        $order_by: [class_order_by!] = { name: asc }
    ) {
        class(
            where: {
                _and: [
                    { location_id: { _eq: $location_id } }
                    { course_id: { _eq: $course_id } }
                    { name: { _ilike: $name } }
                ]
            }
            limit: $limit
            order_by: $order_by
        ) {
            class_id
            name
        }
    }
`;

class BobClassQuery {
    getClassesInCourseOfLocation(
        variables: Lesson_ClassManyByLocationIdAndCourseIdAndNameQueryVariables
    ): GraphqlBody<Lesson_ClassManyByLocationIdAndCourseIdAndNameQueryVariables> {
        return {
            query: getClassesInCourseOfLocation,
            variables,
        };
    }
}

const bobClassQueries = new BobClassQuery();

export default bobClassQueries;
