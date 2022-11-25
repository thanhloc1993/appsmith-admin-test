import { CMSInterface, IMasterWorld, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { aliasCourseName } from 'step-definitions/alias-keys/syllabus';
import { courseFormName } from 'step-definitions/cms-selectors/course';
import { LearnerKeys } from 'step-definitions/learner-keys/learner-key';
import { getRandomNumber } from 'step-definitions/utils';

export async function schoolAdminFillCourseData(this: IMasterWorld) {
    const courseName = `Course Name ${getRandomNumber()}`;
    const scenario = this.scenario;

    await this.cms.instruction(
        `Fill data to create a course name = ${courseName}`,
        async function (this: CMSInterface) {
            const cms = this.page!;
            await cms.fill(courseFormName, courseName);

            //store in ScenarioContext to compare in mobile
            await scenario.set(aliasCourseName, courseName);
        }
    );
}

export async function schoolAdminCreateACourse(this: IMasterWorld) {
    await this.cms.selectAButtonByAriaLabel('Create');
    await schoolAdminFillCourseData.call(this);
    await this.cms.selectAButtonByAriaLabel('Save');
}

export async function schoolAdminIsOnCoursePage(this: IMasterWorld) {
    await this.cms.selectMenuItemInSidebarByAriaLabel('Course');
    await this.cms!.assertThePageTitle('Course');
}

export async function schoolAdminSeeNewCourseInCMS(this: IMasterWorld) {
    //already redirect to course page
    await this.cms!.assertThePageTitle('Course');
    await this.cms!.waitForSkeletonLoading();
    const cms = this.cms;
    const courseName = this.scenario.get(aliasCourseName);

    await cms.instruction(
        `School admin see new course with name = ${courseName} `,
        async function () {
            await cms.waitForSelectorWithText(
                `[data-testid="CourseTable__courseName"]`,
                courseName
            );
        }
    );
}

export async function teacherSeeNewCourse(teacher: TeacherInterface, courseName: string) {
    const couseFinder = new ByValueKey(LearnerKeys.course(courseName));
    const driver = teacher.flutterDriver!;

    await driver.tap(couseFinder);
}
