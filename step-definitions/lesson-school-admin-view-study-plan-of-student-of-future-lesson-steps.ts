import { Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasCourseId } from './alias-keys/syllabus';
import {
    cmsViewStudyPlanOfStudent,
    schoolAdminSeeStudyPlanInCourse,
} from './lesson-school-admin-view-study-plan-of-student-of-future-lesson-definitions';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';

Then('school admin views studyplan of student', async function (this: IMasterWorld) {
    const cms = this.cms;
    const context = this.scenario;
    const courseId = context.get(aliasCourseId);

    await cms.instruction('school admin views studyplan of student', async function () {
        await cms.page!.waitForSelector(LessonManagementKeys.viewStudyPlanButton);
        await cmsViewStudyPlanOfStudent(cms, courseId);
    });
});

Then('school admin sees studyplan of student in course', async function (this: IMasterWorld) {
    const cms = this.cms;
    await cms.instruction(
        'school admin sees studyplan of student in new browser',
        async function () {
            await schoolAdminSeeStudyPlanInCourse(cms);
        }
    );
});
