import { ExcludeSubjectGradeCountry, LocationInfoGRPC } from '@supports/types/cms-types';

/// Entity to receive data from Learner/Teacher
export interface CourseEntity {
    id: string;
    name: string;
    country: string;
    subject: string;
    grade: string;
    iconUrl: string;
}

export type CourseEntityWithLocation = ExcludeSubjectGradeCountry<CourseEntity> & {
    locations?: LocationInfoGRPC[];
};
