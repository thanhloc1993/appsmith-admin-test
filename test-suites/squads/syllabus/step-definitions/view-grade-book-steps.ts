import { createSampleStudentWithCourseAndEnrolledStatus } from '@legacy-step-definitions/lesson-management-utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';

import {
    schoolAdminSearchStudentByName,
    schoolAdminSeesEmptyGradeBook,
    schoolAdminSeesGradeBookHasCorrectFormats,
    studentSeesGradeBookHasCorrectFormats,
} from './view-grade-book-definitions';

When('school admin is at grade book page', async function () {
    await this.cms.instruction('school admin goes to grade book page', async () => {
        await this.cms.schoolAdminIsOnThePage(Menu.GRADE_BOOK, 'Grade Book');
        await this.cms.waitForSkeletonLoading();
    });
});

When('school admin has created student with course and enrolled status', async function () {
    await createSampleStudentWithCourseAndEnrolledStatus({
        cms: this.cms,
        scenarioContext: this.scenario,
        studentRole: 'student',
    });
});

Then("school admin doesn't see student on grade book", async function () {
    const student = this.scenario.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student')
    );

    await schoolAdminSearchStudentByName(this.cms, student.email);

    await this.cms.instruction('school admin see grade book list is empty', async () => {
        await schoolAdminSeesEmptyGradeBook(this.cms);
    });
});

Then('school admin sees grade book list has correct data formats', async function () {
    const student = this.scenario.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student')
    );

    await schoolAdminSearchStudentByName(this.cms, student.email);

    // TODO: Do we need to scroll inside table to the far right to take report snapshot?
    // await this.cms.instruction('school admin scroll table to the rightmost', async () => {
    //     const table = await this.cms.page?.$('table');
    //     const tableWrapper = await table?.$('xpath=..');
    // });

    await schoolAdminSeesGradeBookHasCorrectFormats(this.cms);
});

Given('student is at total progress page', async function () {
    await this.learner.instruction('student is at total progress page', async () => {
        const learner = this.learner;
        const domainUrl = learner.page!.url().split('#')[0] + '#/';
        const path = 'tab?tab_name=stats/totalProgress?user_id=';
        const userId = await this.learner.getUserId();

        await learner.instruction(
            `student enters ${domainUrl}${path}${userId} on browser address`,
            async function () {
                await learner.page!.goto(`${domainUrl}${path}${userId}`);
            }
        );
    });
});

Then('student views grade book list has correct data format in cells', async function () {
    await this.learner.instruction(
        'student views grade book list has correct data format in cells',
        async () => {
            await studentSeesGradeBookHasCorrectFormats(this.learner, this.scenario);
        }
    );
});
