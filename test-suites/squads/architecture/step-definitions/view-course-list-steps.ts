import { coursesAlias, totalCoursesAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld } from '@supports/app-types';
import { PageAction, PagePosition } from '@supports/types/cms-types';

import {
    checkCourseTableRecord,
    checkTotalCourses,
    schoolAdminSeesCourseTable,
    schoolAdminClickNavigationButton,
    schoolAdminGoesToNextPage,
    checkCourseTablePagesAtLeast,
} from './view-course-list-definitions';
import { waitForFetchingCourses } from 'test-suites/common/step-definitions/course-definitions';

When('school admin views course list', async function (this: IMasterWorld) {
    const { context } = this.scenario;

    await this.cms.instruction(
        'school admin sees course table',
        async function (cms: CMSInterface) {
            const courses = context.get(coursesAlias);
            await schoolAdminSeesCourseTable(cms, courses);
        }
    );
});

Then('all courses are displayed', async function (this: IMasterWorld) {
    const { context } = this.scenario;

    await this.cms.instruction(
        'school admin sees that total courses is correct',
        async function (cms: CMSInterface) {
            const totalCourses = context.get(totalCoursesAlias);
            await checkTotalCourses(cms, totalCourses);
        }
    );

    await this.cms.instruction(
        "school admin sees that course's record is correct",
        async function (cms: CMSInterface) {
            const courses = context.get(coursesAlias);
            await checkCourseTableRecord(cms, courses);
        }
    );
});

Given(
    'course list has at least {int} pages',
    async function (this: IMasterWorld, pageNumber: number) {
        const { context } = this.scenario;
        await this.cms.instruction(
            `shool admin sees course table with at least ${pageNumber} pages`,
            async function (cms: CMSInterface) {
                const totalCourses = context.get(totalCoursesAlias);
                await checkCourseTablePagesAtLeast(cms, totalCourses, pageNumber);
            }
        );
    }
);

Given(
    'school admin is not on the {string} page of course list',
    async function (this: IMasterWorld, page: PagePosition) {
        await this.cms.instruction(
            `school admin goes to ${
                page === PagePosition.First ? PageAction.Next : PageAction.Previous
            } page, if current page is in ${page} page`,
            async function (cms: CMSInterface) {
                await schoolAdminGoesToNextPage(cms);
            }
        );
        await this.cms.waitForSkeletonLoading();
    }
);

When(
    'school admin goes to the {string} page',
    async function (this: IMasterWorld, action: PageAction) {
        const { context } = this.scenario;

        await this.cms.instruction(
            `school admin click ${action} button`,
            async function (cms: CMSInterface) {
                await schoolAdminClickNavigationButton(cms, action);
            }
        );

        await this.cms.instruction(
            'shool admin waits for fetching courses completely after moving page',
            async function (cms: CMSInterface) {
                await waitForFetchingCourses(cms, context);
            }
        );
    }
);

Then(
    'all courses of current page are displayed correctly after moving page',
    async function (this: IMasterWorld) {
        const { context } = this.scenario;
        await this.cms.instruction(
            'school admin sees that total courses is correct',
            async function (cms: CMSInterface) {
                const totalCourses = context.get(totalCoursesAlias);
                await checkTotalCourses(cms, totalCourses);
            }
        );

        await this.cms.instruction(
            "school admin sees that course's record is correct after moving page",
            async function (cms: CMSInterface) {
                const courses = context.get(coursesAlias);
                await checkCourseTableRecord(cms, courses);
            }
        );
    }
);
