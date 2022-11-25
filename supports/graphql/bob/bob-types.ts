import * as Types from '../__generated__/bob/root-types';

export type User_Eibanam_GetListBankBranchQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type User_Eibanam_GetListBankBranchQuery = { bank_branch: Array<{ bank_branch_id: string, bank_branch_code: string, bank_branch_name: string }> };

export type User_Eibanam_GetListBankQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type User_Eibanam_GetListBankQuery = { bank: Array<{ bank_id: string, bank_code: string, bank_name: string }> };

export type Lesson_ClassManyByLocationIdAndCourseIdAndNameQueryVariables = Types.Exact<{
  location_id: Types.Scalars['String'];
  course_id: Types.Scalars['String'];
  name?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  order_by?: Types.InputMaybe<Array<Types.Class_Order_By> | Types.Class_Order_By>;
}>;


export type Lesson_ClassManyByLocationIdAndCourseIdAndNameQuery = { class: Array<{ class_id: string, name: string }> };

export type CourseAttrsFragment = { course_id: string, name: string, icon?: string | null | undefined, grade?: number | null | undefined, subject?: string | null | undefined, country?: string | null | undefined, school_id: number, display_order?: number | null | undefined };

export type CoursesOneQueryVariables = Types.Exact<{
  course_id: Types.Scalars['String'];
}>;


export type CoursesOneQuery = { courses: Array<{ course_id: string, name: string, icon?: string | null | undefined, grade?: number | null | undefined, subject?: string | null | undefined, country?: string | null | undefined, school_id: number, display_order?: number | null | undefined, course_books: Array<{ book_id: string, books: Array<{ book_chapters: Array<{ chapter_id: string }> }> }> }> };

export type User_Eibanam_GetListGradeQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type User_Eibanam_GetListGradeQuery = { grade: Array<{ grade_id: string, name: string, partner_internal_id: string, sequence?: number | null | undefined }> };

export type Payment_Eibanam_GetLowestLocationTypesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Payment_Eibanam_GetLowestLocationTypesQuery = { get_lowest_location_types: Array<{ location_type_id: string, display_name?: string | null | undefined, name: string, parent_name?: string | null | undefined, parent_location_type_id?: string | null | undefined }> };

export type User_Eibanam_GetPartnerInternalIdByLocationIdsQueryVariables = Types.Exact<{
  location_ids?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type User_Eibanam_GetPartnerInternalIdByLocationIdsQuery = { locations: Array<{ location_id: string, partner_internal_id?: string | null | undefined }> };

export type Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationIdQueryVariables = Types.Exact<{
  notification_id: Types.Scalars['String'];
}>;


export type Communication_Eibanam_InfoNotificationsGetStatusAndCountReadByNotificationIdQuery = { info_notifications: Array<{ status?: string | null | undefined, all_receiver_aggregate: { aggregate?: { count?: number | null | undefined } | null | undefined }, read_aggregate: { aggregate?: { count?: number | null | undefined } | null | undefined } }> };

export type Communication_Eibanam_InfoNotificationMsgsGetNotificationIdByTitleQueryVariables = Types.Exact<{
  notificationTitle: Types.Scalars['String'];
}>;


export type Communication_Eibanam_InfoNotificationMsgsGetNotificationIdByTitleQuery = { info_notification_msgs: Array<{ notification_msg_id: string, title: string, info_notifications: Array<{ notification_id: string }> }> };

export type Users_PrefectureListQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Users_PrefectureListQuery = { prefecture: Array<{ prefecture_id: string, name: string }> };

export type User_RoleListV2QueryVariables = Types.Exact<{
  is_system?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;


export type User_RoleListV2Query = { role: Array<{ role_id: string, role_name: string }>, role_aggregate: { aggregate?: { count?: number | null | undefined } | null | undefined } };

export type User_Eibanam_GetListSchoolCourseQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type User_Eibanam_GetListSchoolCourseQuery = { school_course: Array<{ school_course_id: string, school_course_name: string, school_course_partner_id: string }> };

export type User_GetManyReferenceSchoolCourseQueryVariables = Types.Exact<{
  school_id?: Types.Scalars['String'];
  name?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type User_GetManyReferenceSchoolCourseQuery = { school_course: Array<{ school_course_id: string, school_course_name: string, is_archived: boolean }> };

export type User_Eibanam_GetListSchoolInfoQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type User_Eibanam_GetListSchoolInfoQuery = { school_info: Array<{ school_id: string, school_name: string, school_partner_id: string }> };

export type User_Eibanam_GetManyReferenceSchoolInfoQueryVariables = Types.Exact<{
  school_level_id?: Types.InputMaybe<Types.Scalars['String']>;
  name?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type User_Eibanam_GetManyReferenceSchoolInfoQuery = { school_info: Array<{ school_id: string, school_name: string, address?: string | null | undefined, is_archived: boolean, school_level_id: string, school_partner_id: string }> };

export type User_Eibanam_GetSchoolLevelGradeByIdsQueryVariables = Types.Exact<{
  grade_id?: Types.InputMaybe<Types.Scalars['String']>;
  school_level_id?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type User_Eibanam_GetSchoolLevelGradeByIdsQuery = { school_level_grade: Array<{ grade_id: string, school_level_id: string }> };

export type User_Eibanam_GetListSchoolLevelQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type User_Eibanam_GetListSchoolLevelQuery = { school_level: Array<{ school_level_id: string, school_level_name: string, sequence: number }> };

export type User_Eibanam_CountSchoolLevelBySequenceQueryVariables = Types.Exact<{
  sequence: Types.Scalars['Int'];
}>;


export type User_Eibanam_CountSchoolLevelBySequenceQuery = { school_level_aggregate: { aggregate?: { count?: number | null | undefined } | null | undefined } };

export type User_GetManyReferenceSchoolLevelV2QueryVariables = Types.Exact<{
  school_id?: Types.InputMaybe<Types.Scalars['String']>;
  name?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type User_GetManyReferenceSchoolLevelV2Query = { school_level: Array<{ school_level_id: string, school_level_name: string, is_archived: boolean, school_infos: Array<{ school_id: string }> }> };

export type User_UserGroupListV2QueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  is_system?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;


export type User_UserGroupListV2Query = { user_group: Array<{ user_group_id: string, user_group_name: string }>, user_group_aggregate: { aggregate?: { count?: number | null | undefined } | null | undefined } };

export type User_Eibanam_GetListUserTagQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type User_Eibanam_GetListUserTagQuery = { user_tag: Array<{ user_tag_id: string, user_tag_name: string, user_tag_partner_id: string, user_tag_type: string }> };

export type User_Eibanam_GetTagsByUserTagTypesQueryVariables = Types.Exact<{
  user_tag_types?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
  user_tag_name?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type User_Eibanam_GetTagsByUserTagTypesQuery = { user_tag: Array<{ user_tag_id: string, user_tag_name: string, user_tag_type: string, user_tag_partner_id: string }> };

export type UserAttrsFragment = { user_id: string, name: string, email?: string | null | undefined, avatar?: string | null | undefined, phone_number?: string | null | undefined, user_group: string, country: string };

export type UserByEmailQueryVariables = Types.Exact<{
  email?: Types.InputMaybe<Types.Scalars['String']>;
  phone_number?: Types.InputMaybe<Types.Scalars['String']>;
  user_id?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type UserByEmailQuery = { users: Array<{ user_id: string, name: string, email?: string | null | undefined, avatar?: string | null | undefined, phone_number?: string | null | undefined, user_group: string, country: string }> };
