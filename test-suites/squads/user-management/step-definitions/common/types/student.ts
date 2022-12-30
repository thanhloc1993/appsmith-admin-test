import {
    User_Eibanam_GetListGradeQuery,
    User_GetManyReferenceSchoolLevelV2Query,
    User_Eibanam_GetManyReferenceSchoolInfoQuery,
    User_GetManyReferenceSchoolCourseQuery,
} from '@supports/graphql/bob/bob-types';
import { ArrayElement, LocationInfoGRPC } from '@supports/types/cms-types';

import { FamilyRelationship } from 'manabuf/usermgmt/v2/enums_pb';
import { CreateStudentResponse } from 'manabuf/usermgmt/v2/users_pb';
import { UserTagType } from 'node_modules/manabuf/usermgmt/v2/enums_pb';
import { UserTag } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';

export type EnrollmentStatus = 'potential' | 'enrolled' | 'withdrawn' | 'graduated' | 'loa';

export type GenderType = 'MALE' | 'FEMALE' | 'NONE';

export type LoginStatus = 'success' | 'failed';

export type KeyUserTagType = keyof typeof UserTagType;

export type SchoolHistoriesTypes = {
    schoolLevel: ArrayElement<User_GetManyReferenceSchoolLevelV2Query['school_level']>;
    schoolInfo: ArrayElement<User_Eibanam_GetManyReferenceSchoolInfoQuery['school_info']>;
    schoolCourse?: ArrayElement<User_GetManyReferenceSchoolCourseQuery['school_course']>;
    startDate?: Date;
    endDate?: Date;
};
export interface CreateStudentResp extends CreateStudentResponse.AsObject {}
export interface StudentInformation {
    name: string;
    firstName: string;
    lastName: string;
    firstNamePhonetic?: string;
    lastNamePhonetic?: string;
    fullNamePhonetic?: string;
    email: string;
    grade: string;
    enrollmentStatus: EnrollmentStatus;
    phoneNumber: string;
    studentExternalId: string;
    studentNote: string;
    birthday: Date;
    gender: GenderType;
    locations?: LocationInfoGRPC[];
    gradeMaster?: ArrayElement<User_Eibanam_GetListGradeQuery['grade']>;
    schoolHistories?: SchoolHistoriesTypes[];
}

export type StudentFieldNotRequired = Pick<
    StudentInformation,
    | 'phoneNumber'
    | 'studentExternalId'
    | 'studentNote'
    | 'birthday'
    | 'gender'
    | 'locations'
    | 'firstNamePhonetic'
    | 'lastNamePhonetic'
>;

export type StudentFieldRequired = Pick<
    StudentInformation,
    'name' | 'email' | 'grade' | 'enrollmentStatus'
>;

export type ParentInformation = {
    id?: string;
    email: string;
    name: string;
    numberPhone?: string;
    relationship: FamilyRelationship;
    parentTags?: UserTag[];
};

export interface StudentCSV {
    name?: string;
    first_name?: string;
    last_name?: string;
    first_name_phonetic?: string;
    last_name_phonetic?: string;
    email: string;
    enrollment_status: string;
    grade: string;
    phone_number?: string;
    birthday?: string;
    gender?: string;
    location?: string;
    postal_code?: string;
    prefecture?: string;
    city?: string;
    first_street?: string;
    second_street?: string;
    student_phone_number?: string;
    home_phone_number?: string;
    student_tag?: string;
    contact_preference?: string;
}

export interface ParentCSV {
    name?: string;
    email: string;
    phone_number?: string;
    student_email?: string;
    relationship?: string;
    parent_tag?: string;
}
