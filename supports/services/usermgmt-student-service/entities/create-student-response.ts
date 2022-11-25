import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { ExcludeSubjectGradeCountry } from '@supports/types/cms-types';

import { UserProfileEntity } from '../../../entities/user-profile-entity';
import { UpsertCoursesRequest } from 'manabie-yasuo/course_pb';
import { UpsertCoursesRequest as UpsertMasterCoursesRequest } from 'manabuf/mastermgmt/v1/course_pb';
import { UpsertStudentCoursePackageResponse } from 'manabuf/usermgmt/v2/users_pb';
import { CreateStudentResponse } from 'manabuf/yasuo/v1/users_pb';

export interface CreateStudentResponseEntity {
    student: UserProfileEntity;
    parents: Array<UserProfileEntity>;
    /// TODO: Remove packages and courses, merge into studentCoursePackages
    packages: Array<
        | CreateStudentResponse.StudentPackageProfile.AsObject
        | UpsertStudentCoursePackageResponse.StudentPackageProfile.AsObject
    >;
    courses: Array<
        ExcludeSubjectGradeCountry<
            UpsertCoursesRequest.Course.AsObject | UpsertMasterCoursesRequest.Course.AsObject
        >
    >;
    studentCoursePackages: Array<StudentCoursePackageEntity>;
}
