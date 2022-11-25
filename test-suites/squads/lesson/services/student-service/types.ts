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
