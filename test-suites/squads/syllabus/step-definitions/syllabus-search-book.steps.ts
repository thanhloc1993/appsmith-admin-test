import { schoolAdminSeeEmptyTableMsg } from '@legacy-step-definitions/cms-common-definitions';
import { genId } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { aliasBookName, aliasSearchStringTestCase } from './alias-keys/syllabus';
import { bookListItemName } from './cms-selectors/cms-keys';

type SearchBookCase = 'exist' | 'does not exist';

When('school admin searches book {string} name', async function (searchCase: SearchBookCase) {
    const bookName = this.scenario.get(aliasBookName);

    let searchKeyword = bookName;

    if (searchCase === 'does not exist') searchKeyword = genId();

    await this.cms.instruction(`school admin searches: ${searchKeyword}`, async () => {
        await this.cms.searchInFilter(searchKeyword);
    });

    await this.cms.waitForSkeletonLoading();

    this.scenario.set(aliasSearchStringTestCase, searchCase);
});

Then('school admin sees {string} books matches with search', async function (_: string) {
    const bookName = this.scenario.get(aliasBookName);
    const searchCase = this.scenario.get<SearchBookCase>(aliasSearchStringTestCase);

    if (searchCase === 'does not exist') {
        await this.cms.instruction('school admin sees book table is empty', async () => {
            await schoolAdminSeeEmptyTableMsg(this.cms);
        });
        return;
    }

    await this.cms.instruction(
        `school admin sees at least a book match with search: ${bookName}`,
        async () => {
            await this.cms.waitForSelectorHasText(bookListItemName, bookName);
        }
    );
});
