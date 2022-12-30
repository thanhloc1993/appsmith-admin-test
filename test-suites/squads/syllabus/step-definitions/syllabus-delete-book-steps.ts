import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import { aliasRandomBookB1, aliasRandomBookB3 } from './alias-keys/syllabus';
import * as CMSKeys from './cms-selectors/cms-keys';
import { selectABookInBookList } from './syllabus-utils';
import { Book } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When('school admin deletes the book B1', async function (this: IMasterWorld) {
    const context = this.scenario;
    const bookB1 = context.get<Book>(aliasRandomBookB1);

    await this.cms.instruction(
        `School admin chooses book ${bookB1.name} in book list`,
        async function (cms) {
            await selectABookInBookList(cms, bookB1.name);
        }
    );

    await this.cms.instruction(
        `School admin deletes book ${bookB1.name} in book detail page`,
        async function (cms) {
            await cms.selectActionButton(ActionOptions.DELETE, {
                target: 'actionPanelTrigger',
            });
            await cms.confirmDialogAction();
        }
    );
});

Then('school admin does not see book B1 on CMS', async function (this: IMasterWorld) {
    const context = this.scenario;
    const bookB1 = context.get<Book>(aliasRandomBookB1);
    const bookItemRow = CMSKeys.tableRowByText(CMSKeys.bookListTable, bookB1.name);

    await this.cms.instruction(
        `School admin does not see book ${bookB1.name} in book list`,
        async function (cms) {
            await cms.page?.waitForSelector(bookItemRow, {
                state: 'hidden',
            });
        }
    );
});

Then('school admin still sees book B3 on CMS', async function (this: IMasterWorld) {
    const context = this.scenario;
    const bookB3 = context.get<Book>(aliasRandomBookB3);
    const bookItemRow = CMSKeys.tableRowByText(CMSKeys.bookListTable, bookB3.name);

    await this.cms.instruction(
        `School admin still sees book ${bookB3.name} in book list`,
        async function (cms) {
            await cms.page?.waitForSelector(bookItemRow);
        }
    );
});
