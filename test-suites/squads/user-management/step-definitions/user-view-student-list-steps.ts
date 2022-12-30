import { Given, Then, When } from '@cucumber/cucumber';

import { Menu } from '@supports/enum';

import { createARandomStudentGRPC } from './user-create-student-definitions';
import {
    schoolAdminSeesCorrectStudentsInTable,
    shoolAdminSeesAmountStudentPagesCorrectly,
    schoolAdminWaitForGetAllDataStudentsList,
    schoolAdminSeesAmountStudentsDisplayedCorrectly,
    schoolAdminGoesToActionPagesInTableStudent,
    waitScrollPageToTop,
} from './user-view-student-list-definitions';

export enum PageTypes {
    FIRST = 'first',
    END = 'end',
}
export enum ActionTypes {
    NEXT = 'next',
    PERVIOUS = 'previous',
}

Given('school admin goes to student list', async function (this) {
    const scenarioContext = this.scenario;

    await this.cms.selectMenuItemInSidebarByAriaLabel('Students');

    await createARandomStudentGRPC(this.cms, { studentPackageProfileLength: 1 });

    await this.cms.instruction(
        'School admin waits for get data students list',
        async function (cms) {
            await schoolAdminWaitForGetAllDataStudentsList(cms, scenarioContext);
        }
    );
    await this.cms.schoolAdminIsOnThePage(Menu.STUDENTS, 'Student Management');
});

When('school admin views student list', async function (this) {
    const scenarioContext = this.scenario;

    await this.cms.instruction('school admin assert table student', async function (cms) {
        await schoolAdminSeesCorrectStudentsInTable(cms, scenarioContext);
    });
});

Then('all student of this school is displayed', async function (this) {
    const scenarioContext = this.scenario;

    await this.cms.instruction(
        'School admin sees total records is displayed correct data',
        async function (cms) {
            await schoolAdminSeesAmountStudentsDisplayedCorrectly(cms, scenarioContext);
        }
    );
});

// Examples:
// | page  | action   |
// | first | previous |
// | end   | next     |

Given('student list has more than {int} pages', async function (this, numberPage: number) {
    const scenarioContext = this.scenario;
    await this.cms.selectMenuItemInSidebarByAriaLabel('Students');

    await this.cms.instruction(
        'School admin waits for get data students list',
        async function (cms) {
            await schoolAdminWaitForGetAllDataStudentsList(cms, scenarioContext);
        }
    );
    await this.cms.instruction(
        `School admin sees student list is more ${numberPage} pages`,
        async function (cms) {
            await shoolAdminSeesAmountStudentPagesCorrectly(cms, scenarioContext, numberPage);
        }
    );
    await waitScrollPageToTop(this.cms);
    await this.cms.schoolAdminIsOnThePage(Menu.STUDENTS, 'Student Management');
});

Given(
    'school admin is not on the {string} page of student list',
    async function (this, page: PageTypes) {
        const scenarioContext = this.scenario;
        const action = PageTypes.FIRST ? ActionTypes.NEXT : ActionTypes.PERVIOUS;
        await this.cms.instruction(
            `School admin goes to ${action} page, if current page is in ${page} page`,
            async function (cms) {
                await schoolAdminGoesToActionPagesInTableStudent(
                    cms,
                    scenarioContext,
                    action,
                    false
                );
            }
        );
    }
);

When(
    'school admin goes to {string} page of student list',
    async function (this, action: ActionTypes) {
        const scenarioContext = this.scenario;
        await schoolAdminGoesToActionPagesInTableStudent(this.cms, scenarioContext, action);
    }
);
Then('data of current page is displayed correct after moving page', async function (this) {
    const scenarioContext = this.scenario;
    await this.cms.instruction(
        'School admin sees total records of current page is displayed correct after moving page',
        async function (cms) {
            await schoolAdminSeesCorrectStudentsInTable(cms, scenarioContext);
        }
    );
});
