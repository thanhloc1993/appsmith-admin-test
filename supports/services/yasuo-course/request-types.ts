import { ExcludeSubjectGradeCountry } from '@supports/types/cms-types';

import {
    AddBooksRequest,
    UpsertBooksRequest,
    UpsertChapterRequest,
    UpsertCoursesRequest,
} from 'manabie-yasuo/course_pb';

declare namespace NsYasuoCourseServiceRequest {
    export interface UpsertBooks
        extends ExcludeSubjectGradeCountry<UpsertBooksRequest.Book.AsObject> {}

    export interface UpsertCourses
        extends ExcludeSubjectGradeCountry<UpsertCoursesRequest.Course.AsObject> {}

    export interface AddBooks extends AddBooksRequest.AsObject {}

    export interface UpsertChapters
        extends Array<
            ExcludeSubjectGradeCountry<UpsertChapterRequest.AsObject['chaptersList'][0]>
        > {}
}

export default NsYasuoCourseServiceRequest;
