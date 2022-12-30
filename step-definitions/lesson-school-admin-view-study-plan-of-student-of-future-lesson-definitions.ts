import { CMSInterface } from '@supports/app-types';

import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';

export async function cmsViewStudyPlanOfStudent(cms: CMSInterface, courseId: string) {
    const studyPlanLink = `localhost:3001/syllabus/courses/${courseId}/show?tab=CourseShow__studyPlanTab`;
    await cms.page!.goto(studyPlanLink);
}

export async function schoolAdminSeeStudyPlanInCourse(cms: CMSInterface) {
    await cms.page!.waitForSelector(LessonManagementKeys.courseSideBar);
    await cms.page!.waitForSelector(LessonManagementKeys.courseContainer);
}
