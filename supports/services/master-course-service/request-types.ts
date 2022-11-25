import { ExcludeSubjectGradeCountry } from '@supports/types/cms-types';

import {
    UpsertCoursesRequest as UpsertMasterCoursesRequest,
    UpsertCoursesResponse as UpsertMasterCoursesResponse,
} from 'manabuf/mastermgmt/v1/course_pb';

// TODO: Omit teachingMethod then Lesson will check it later
declare namespace NsMasterCourseService {
    export interface UpsertCoursesRequest
        extends Omit<
            ExcludeSubjectGradeCountry<UpsertMasterCoursesRequest.Course.AsObject>,
            'locationIdsList' | 'chapterIdsList' | 'teachingMethod' | 'courseType'
        > {
        locationIdsList?: UpsertMasterCoursesRequest.Course.AsObject['locationIdsList'];
        teachingMethod?: UpsertMasterCoursesRequest.Course.AsObject['teachingMethod'];
        courseType?: UpsertMasterCoursesRequest.Course.AsObject['courseType'];
    }
    export interface UpsertCoursesResponse extends UpsertMasterCoursesResponse.AsObject {}
}

export default NsMasterCourseService;
