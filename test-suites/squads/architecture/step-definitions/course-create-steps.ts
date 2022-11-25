import { Given, Then, When } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld } from '@supports/app-types';

import {
    schoolAdminFillCourseData,
    schoolAdminIsOnCoursePage,
    teacherSeeNewCourse,
} from './course-create-definitions';
import { aliasCourseName } from 'step-definitions/alias-keys/syllabus';
import { courseTableName } from 'step-definitions/cms-selectors/course';
import {
    learnerNotSeeNewCourse,
    schoolAdminHasCreatedACourseByGrpc,
} from 'test-suites/common/step-definitions/course-definitions';
import { studentRefreshHomeScreen } from 'test-suites/common/step-definitions/student-screen-definitions';

Given('school admin is on the course page', async function (this: IMasterWorld) {
    const cms = this.cms;
    await cms.instruction('Go to the course page', schoolAdminIsOnCoursePage.bind(this));
});

When('school admin creates a new course', async function (this: IMasterWorld) {
    const cms = this.cms;

    await cms.instruction('Press create button to create course', async () => {
        await cms.waitForSkeletonLoading(); // Wait for the course table fetch data
        await cms.selectAButtonByAriaLabel('Create');
    });

    await cms.instruction(
        `Fill data to create a course name`,
        schoolAdminFillCourseData.bind(this)
    );

    await cms.instruction('Press save button to save course', async () => {
        await cms.selectAButtonByAriaLabel('Save');
    });
});

Then('school admin sees the new course on CMS', async function (this: IMasterWorld) {
    const cms = this.cms;
    const courseName = this.scenario.get<string>(aliasCourseName);

    await cms.instruction(`School admin sees new course with name = ${courseName} `, async () => {
        await cms.waitForSelectorWithText(courseTableName, courseName);
    });

    await cms.instruction(
        `School admin accesses to a new course with name = ${courseName} `,
        async () => {
            await cms.page?.click(`p:text-is("${courseName}")`);
            await cms.assertThePageTitle(courseName);
        }
    );
});

Then('teacher sees the new course on Teacher App', async function (this: IMasterWorld) {
    const teacher = this.teacher;
    const courseName = this.scenario.get<string>(aliasCourseName);

    await teacher.instruction(`Teacher reloads the screen`, async () => {
        await teacher.flutterDriver!.reload();
    });

    await teacher.instruction(
        `Teacher sees new course with name = ${courseName}`,
        async () => await teacherSeeNewCourse(teacher, courseName)
    );
});

Then('student can not see the new course on Learner App', async function (this: IMasterWorld) {
    const learner = this.learner;
    const courseName = this.scenario.get(aliasCourseName);

    await learner.instruction(
        'Student refreshes home screen',
        async () => await studentRefreshHomeScreen(learner)
    );

    await learner.instruction(
        `Student can not see the new course ${courseName}`,
        async () => await learnerNotSeeNewCourse(learner, courseName)
    );
});

Given(
    'school admin has created a new course without any location',
    async function (this: IMasterWorld): Promise<void> {
        const scenario = this.scenario;

        await this.cms.instruction('New course is created', async function (this: CMSInterface) {
            await schoolAdminHasCreatedACourseByGrpc(this, scenario);
        });
    }
);
