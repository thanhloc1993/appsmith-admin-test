import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasCourseId, aliasCourseName, aliasStudyPlanName } from './alias-keys/syllabus';
import {
    schoolAdminChooseStudentStudyPlanTab,
    schoolAdminNotSeeStudyPlanInStudent,
} from './create-course-studyplan-definitions';
import {
    deleteCourseStudyPlan,
    schoolAdminNotSeeCourseStudyPlan,
    schoolAdminWaitingDeleteStudyPlan,
} from './delete-studyplan-from-course-definitions';
import { teacherNotSeeStudyPlan } from './delete-studyplan-from-course-definitions';
import {
    studentSeeNothingInCourse,
    studentWaitingSelectChapterWithBookScreenLoaded,
} from './syllabus-add-book-to-course-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';
import { schoolAdminChooseTabInCourseDetail } from 'test-suites/common/step-definitions/course-definitions';

Given('school admin deletes the current studyplan', schoolAdminDeleteCourseStudyPlan);

When('school admin deletes the course studyplan from course', schoolAdminDeleteCourseStudyPlan);

export async function schoolAdminDeleteCourseStudyPlan(this: IMasterWorld) {
    const context = this.scenario;
    const studyPlanName = context.get<string>(aliasStudyPlanName);

    await this.cms.instruction('School admin chooses the study plan tab', async (cms) => {
        await schoolAdminChooseTabInCourseDetail(cms, 'studyPlanCSV');
        await cms.waitForSkeletonLoading(); // wait for study plan table show up
    });

    await this.cms.instruction(`School admin deletes study plan: ${studyPlanName}`, async (cms) => {
        await deleteCourseStudyPlan(cms, studyPlanName);
    });

    await schoolAdminWaitingDeleteStudyPlan(this.cms);

    await this.cms.instruction(`Please waiting to get latest data after delete`, async (cms) => {
        await cms.waitForSkeletonLoading();
    });
}

Then('school admin does not see the studyplan in course on CMS', async function () {
    const studyPlanName = this.scenario.get<string>(aliasStudyPlanName);

    await this.cms.instruction(
        `School admin will not see course study plan: ${studyPlanName}`,
        async () => {
            await schoolAdminNotSeeCourseStudyPlan(this.cms, studyPlanName);
        }
    );
});

Then("school admin does not see the studyplan in course's student on CMS", async function () {
    const learnerProfile = await this.learner.getProfile();
    const studyPlanName = this.scenario.get<string>(aliasStudyPlanName);

    await this.cms.instruction('School admin choose the student study plan tab', async () => {
        await schoolAdminChooseStudentStudyPlanTab(this.cms);
    });

    await this.cms.instruction(
        `School admin not see study plan: ${studyPlanName} in ${learnerProfile.name}`,
        async () => {
            await schoolAdminNotSeeStudyPlanInStudent(this.cms, learnerProfile.name, studyPlanName);
        }
    );
});

Then('teacher does not see the studyplan on Teacher App', async function () {
    const courseId = this.scenario.get<string>(aliasCourseId);
    const studyPlanName = this.scenario.get<string>(aliasStudyPlanName);

    const learnerProfile = await this.learner.getProfile();

    await this.teacher.instruction('Teacher go to student study detail', async () => {
        await teacherGoesToStudyPlanDetails(this.teacher, courseId, learnerProfile.id);
    });

    await this.teacher.instruction(
        `Teacher not see study plan in the study plan select: ${studyPlanName}`,
        async () => {
            await teacherNotSeeStudyPlan(this.teacher, studyPlanName);
        }
    );
});

Then('student does not see studyplan items on Learner App', async function () {
    const courseName = this.scenario.get<string>(aliasCourseName);

    await this.learner.instruction('Refresh learner app', async () => {
        await studentRefreshHomeScreen(this.learner);
    });

    await this.cms.instruction(`Student go to the course: ${courseName}`, async () => {
        await studentGoToCourseDetail(this.learner, courseName);
        await studentWaitingSelectChapterWithBookScreenLoaded(this.learner);
    });

    await this.learner.instruction('Student see empty course', async () => {
        await studentSeeNothingInCourse(this.learner);
    });
});
