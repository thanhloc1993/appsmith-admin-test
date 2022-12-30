import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Lesson_ClassManyByLocationIdAndCourseIdAndNameQuery } from '@supports/graphql/bob/bob-types';
import { ArrayElement, LocationInfoGRPC } from '@supports/types/cms-types';

export interface StudentWithPackage {
    student: UserProfileEntity;
    location: LocationInfoGRPC;
    course: { courseId: string; name: string };
    classHasura: ClassHasura;
}

export type ClassHasura = ArrayElement<
    Lesson_ClassManyByLocationIdAndCourseIdAndNameQuery['class']
>;

export type CourseDuration =
    | 'within 30 days since now'
    | 'start date < lesson date < end date'
    | 'end date = lesson date';
