import { Given, Then, When } from '@cucumber/cucumber';

import { Courses, IMasterWorld } from '@supports/app-types';

import {
    assertStudentCourseNotChanged,
    discardPopupEditStudentCourse,
} from './user-cancel-student-course-with-location-definitions';
import {
    changeStartDateAndEndDateOfStudentCourse,
    createStudentCourse,
    getCourseAliasWithSuffix,
    OptionCancel,
    randomCourseStatus,
} from './user-definition-utils';

Given(
    'school admin adds draft {string} to edit course popup',
    async function (this: IMasterWorld, courses: Courses) {
        const cms = this.cms;
        const context = this.scenario;

        const courseData = getCourseAliasWithSuffix(context, courses);
        for (const course of courseData) {
            await createStudentCourse(cms, context, {
                courseStatus: randomCourseStatus(),
                courseId: course.id,
                courseName: course.name,
            });
        }
    }
);

When(
    'school admin cancels the editing process by using {string}',
    async function (this: IMasterWorld, discardOption: OptionCancel) {
        await discardPopupEditStudentCourse(this.cms, discardOption);
    }
);

When(
    'school admin changes start date and end date of the course',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        await cms.instruction('changes start date and end date of the course', async function () {
            await changeStartDateAndEndDateOfStudentCourse(cms);
        });
    }
);

Then('school admin sees nothing changed in course tab', async function (this: IMasterWorld) {
    await assertStudentCourseNotChanged(this.cms, this.scenario);
});
