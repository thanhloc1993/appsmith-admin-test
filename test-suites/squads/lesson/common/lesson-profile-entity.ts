import { ArrayElement, LocationInfoGRPC } from '@supports/types/cms-types';

import { User_Eibanam_GetListGradeQuery } from '@graphql/bob/bob-types';

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
    enrollmentStatus?: string;
    studentExternalId?: string;
    studentNote?: string;
    birthday?: Date | string;
    gender?: string;
    locations?: LocationInfoGRPC[];
    userGroupIdsList?: string[];
}
