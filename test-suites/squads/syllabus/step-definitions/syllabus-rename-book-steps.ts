import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';

import { aliasBookName, aliasCourseName, aliasRandomBookB1 } from './alias-keys/syllabus';
import * as CMSKeys from './cms-selectors/cms-keys';
import { schoolAdminRenameBook } from './syllabus-rename-book-definitions';
import {
    selectABookInBookList,
    studentGoToCourseDetail,
    studentNotSeeSelectBookInCourseDetail,
    studentRefreshHomeScreen,
    studentSeeBookNameAtSelectBookDialogInCourseDetail,
} from './syllabus-utils';
import { Book } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When('school admin renames book B1', async function (this: IMasterWorld) {
    const context = this.scenario;
    const bookB1 = context.get<Book>(aliasRandomBookB1);

    await this.cms.instruction(
        `School admin chooses book ${bookB1.name} in book list`,
        async function (cms) {
            await selectABookInBookList(cms, bookB1.name);
        }
    );

    await this.cms.instruction(
        `School admin renames book ${bookB1.name} in book list`,
        async function (cms) {
            const renamedBookName = await schoolAdminRenameBook(cms, bookB1.name);

            context.set(aliasBookName, renamedBookName);
        }
    );
});

Then('school admin sees the edited book B1 name on CMS', async function (this: IMasterWorld) {
    const context = this.scenario;
    const bookB1Name = context.get<string>(aliasBookName);

    await this.cms.instruction(
        `School admin sees the edited book ${bookB1Name} in book list`,
        async function (cms) {
            const bookItemRow = CMSKeys.tableRowByText(CMSKeys.bookListTable, bookB1Name);

            await cms.schoolAdminIsOnThePage(Menu.BOOKS, 'Book');

            await cms.searchInFilter(bookB1Name);
            await cms.waitForSkeletonLoading();

            await cms.page?.waitForSelector(bookItemRow);
        }
    );
});

Then(
    'teacher does not see the edited book B1 name on Teacher App',
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const bookB1Name = context.get<string>(aliasBookName);

        console.log(`Expect the edited book ${bookB1Name} is not displayed on Teacher App`);
    }
);

Then(
    'student does not see the edited book B1 name on Learner App',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseName = context.get(aliasCourseName);
        const bookB1Name = context.get<string>(aliasBookName);

        await this.learner.instruction('Student refreshes home screen', async function (learner) {
            await studentRefreshHomeScreen(learner);
        });

        await this.learner.instruction(
            `Student goes to course ${courseName} detail`,
            async function (learner) {
                await studentGoToCourseDetail(learner, courseName);
            }
        );

        await this.learner.instruction(
            `Student does not see the edited book ${bookB1Name} name`,
            async function (learner) {
                await studentNotSeeSelectBookInCourseDetail(learner);
            }
        );
    }
);

Then('student sees the edited book B1 name on Learner App', async function (this: IMasterWorld) {
    const context = this.scenario;
    const courseName = context.get(aliasCourseName);
    const bookB1Name = context.get<string>(aliasBookName);

    await this.learner.instruction('Student refreshes home screen', async function (learner) {
        await studentRefreshHomeScreen(learner);
    });

    await this.learner.instruction(
        `Student goes to course ${courseName} detail`,
        async function (learner) {
            await studentGoToCourseDetail(learner, courseName);
        }
    );

    await this.learner.instruction(
        `Student sees the edited book ${bookB1Name} name`,
        async function (learner) {
            await studentSeeBookNameAtSelectBookDialogInCourseDetail(learner, bookB1Name);
        }
    );
});
