import { gql } from 'graphql-tag';

import { GraphqlBody } from '@supports/packages/graphql-client';

import {
    StudyPlanOneV2QueryVariables,
    Syllabus_StudyPlanItems_MasterQueryVariables,
} from './eureka-types';

export const studyPlanFragment = gql`
    fragment StudyPlanAttrs on study_plans {
        name
        study_plan_id
    }
`;

export const studyPlanFragmentV2 = gql`
    fragment StudyPlanAttrsV2 on study_plans {
        name
        study_plan_id
        created_at
        master_study_plan_id
        book_id
        grades
        status
    }
`;

export const studyPlanFragmentV3 = gql`
    fragment StudyPlanAttrsV3 on study_plans {
        name
        study_plan_id
        created_at
        master_study_plan_id
        book_id
        grades
        status
    }
`;

export const studyPlanItemFragment = gql`
    fragment StudyPlanItemAttrs on study_plan_items {
        study_plan_item_id
        available_from
        available_to
        content_structure
        start_date
        end_date
        status
        assignment_study_plan_item {
            assignment_id
        }
        lo_study_plan_item {
            lo_id
        }
    }
`;

const getOneQuery = gql`
    query StudyPlanOneV2($study_plan_id: String!) {
        study_plans(where: { study_plan_id: { _eq: $study_plan_id } }) {
            ...StudyPlanAttrsV2
            study_plan_type
            course_id
            track_school_progress
            study_plan_items {
                ...StudyPlanItemAttrs
            }
        }
    }
    ${studyPlanFragmentV2}
    ${studyPlanItemFragment}
`;

const getMasterStudyPlanItems = gql`
    query Syllabus_StudyPlanItems_Master($study_plan_id: String!) {
        master_study_plan_view(
            where: { study_plan_id: { _eq: $study_plan_id } }
            order_by: { lm_display_order: asc }
        ) {
            study_plan_id
            book_id
            chapter_id
            chapter_display_order
            topic_id
            topic_display_order
            learning_material_id
            lm_display_order
            start_date
            end_date
            available_from
            available_to
            status
            learning_material {
                name
                type
            }
        }
    }
`;

class StudyPlanEurekaQuery {
    getOne(variables: StudyPlanOneV2QueryVariables): GraphqlBody<StudyPlanOneV2QueryVariables> {
        return {
            query: getOneQuery,
            variables,
        };
    }

    getMasterStudyPlanItems(
        variables: Syllabus_StudyPlanItems_MasterQueryVariables
    ): GraphqlBody<Syllabus_StudyPlanItems_MasterQueryVariables> {
        return {
            query: getMasterStudyPlanItems,
            variables,
        };
    }
}

export const eurekaStudyPlanQueries = new StudyPlanEurekaQuery();
