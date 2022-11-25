import { ContactPreference } from '@supports/app-types';
import { User_Eibanam_GetListGradeQuery } from '@supports/graphql/bob/bob-types';
import { ArrayElement } from '@supports/types/cms-types';

import { LocationInfoGRPC } from './../types/cms-types';
import { UserTag } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';

export interface UserProfileEntity {
    id: string;
    email: string;
    name: string;
    firstName?: string;
    lastName?: string;
    firstNamePhonetic?: string;
    lastNamePhonetic?: string;
    fullNamePhonetic?: string;
    avatar: string;
    phoneNumber: string;
    givenName: string;
    password: string;

    /// Data field from Learner/Parent/Teacher GET_PROFILE function
    countryEnum?: string;
    userGroupEnum?: string;
    gradeValue?: number;
    gradeMaster?: ArrayElement<User_Eibanam_GetListGradeQuery['grade']>;
    studentTags?: UserTag[];
    enrollmentStatus?: string;
    studentExternalId?: string;
    studentNote?: string;
    birthday?: Date | string;
    gender?: string;
    locations?: LocationInfoGRPC[];
    userGroupIdsList?: string[];
}

export interface UserAddress {
    postalCode?: string;
    prefecture?: {
        id: string;
        name: string;
    };
    city?: string;
    firstStreet?: string;
    secondStreet?: string;
}

export interface UserPhoneNumber {
    studentPhoneNumber?: string;
    homePhoneNumber?: string;
    parentPrimaryPhoneNumber?: string;
    parentSecondaryPhoneNumber?: string;
    contactPreference?: ContactPreference;
}

export type UserCredentials = Pick<UserProfileEntity, 'email' | 'password'>;

export type MappedLearnerProfile = {
    id: string;
    name: string;
    email: string;
    courses: string[];
    grade: string;
    gradeMaster?: ArrayElement<User_Eibanam_GetListGradeQuery['grade']>;
};
