import * as Types from '../__generated__/eureka/root-types';

export type StudyPlanAttrsFragment = { name?: string | null | undefined, study_plan_id: string };

export type StudyPlanAttrsV2Fragment = { name?: string | null | undefined, study_plan_id: string, created_at: any, master_study_plan_id?: string | null | undefined, book_id?: string | null | undefined, grades?: any | null | undefined, status?: string | null | undefined };

export type StudyPlanAttrsV3Fragment = { name?: string | null | undefined, study_plan_id: string, created_at: any, master_study_plan_id?: string | null | undefined, book_id?: string | null | undefined, grades?: any | null | undefined, status?: string | null | undefined };

export type StudyPlanItemAttrsFragment = { study_plan_item_id: string, available_from?: any | null | undefined, available_to?: any | null | undefined, content_structure?: any | null | undefined, start_date?: any | null | undefined, end_date?: any | null | undefined, status?: string | null | undefined, assignment_study_plan_item?: { assignment_id: string } | null | undefined, lo_study_plan_item?: { lo_id: string } | null | undefined };

export type StudyPlanOneV2QueryVariables = Types.Exact<{
  study_plan_id: Types.Scalars['String'];
}>;

export type StudyPlanOneV2Query = { study_plans: Array<{ study_plan_type?: string | null | undefined, course_id?: string | null | undefined, track_school_progress?: boolean | null | undefined, name?: string | null | undefined, study_plan_id: string, created_at: any, master_study_plan_id?: string | null | undefined, book_id?: string | null | undefined, grades?: any | null | undefined, status?: string | null | undefined, study_plan_items: Array<{ study_plan_item_id: string, available_from?: any | null | undefined, available_to?: any | null | undefined, content_structure?: any | null | undefined, start_date?: any | null | undefined, end_date?: any | null | undefined, status?: string | null | undefined, assignment_study_plan_item?: { assignment_id: string } | null | undefined, lo_study_plan_item?: { lo_id: string } | null | undefined }> }> };

export type Syllabus_StudyPlanItems_MasterQueryVariables = Types.Exact<{
  study_plan_id: Types.Scalars['String'];
}>;

export type Syllabus_StudyPlanItems_MasterQuery = { master_study_plan_view: Array<{ study_plan_id?: string | null | undefined, book_id?: string | null | undefined, chapter_id?: string | null | undefined, chapter_display_order?: number | null | undefined, topic_id?: string | null | undefined, topic_display_order?: number | null | undefined, learning_material_id?: string | null | undefined, lm_display_order?: number | null | undefined, start_date?: any | null | undefined, end_date?: any | null | undefined, available_from?: any | null | undefined, available_to?: any | null | undefined, status?: string | null | undefined, learning_material?: { name: string, type?: string | null | undefined } | null | undefined }> };