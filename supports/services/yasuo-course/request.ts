import NsYasuoCourseServiceRequest from './request-types';
import { UpsertCoursesRequest } from 'manabie-yasuo/course_pb';
import { genId } from 'step-definitions/utils';

export const createUpsertCoursesRequest = (
    courses: NsYasuoCourseServiceRequest.UpsertCourses[]
) => {
    const request = new UpsertCoursesRequest();
    const requestCourses = courses.map((course) => {
        const requestCourse = new UpsertCoursesRequest.Course();

        requestCourse.setId(course.id || genId());
        requestCourse.setName(course.name);
        requestCourse.setDisplayOrder(course.displayOrder);
        requestCourse.setChapterIdsList(course.chapterIdsList);
        requestCourse.setBookIdsList(course.bookIdsList);
        requestCourse.setIcon(course.icon);
        requestCourse.setSchoolId(course.schoolId);

        return requestCourse;
    });

    request.setCoursesList(requestCourses);

    return request;
};
