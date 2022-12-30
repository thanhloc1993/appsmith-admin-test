import { genId } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import { aliasBookNameEdited } from './alias-keys/syllabus';
import { dialogWithHeaderFooter } from './cms-selectors/cms-keys';
import { schoolAdminFillBookForm } from './syllabus-content-book-create-definitions';
import { schoolAdminSelectBulkActionOfBookDetail } from './syllabus-edit-book.definitions';
import { schoolAdminSeesErrorMessageField } from './syllabus-utils';

When('school admin edits book', async function (this: IMasterWorld) {
    const newBookName = `Book edit name ${genId()}`;

    await schoolAdminSelectBulkActionOfBookDetail(this.cms, ActionOptions.EDIT);

    await this.cms.instruction(`school admin edit book name to ${newBookName}`, async () => {
        await schoolAdminFillBookForm(this.cms, newBookName);
        await this.cms.selectAButtonByAriaLabel(`Save`);
    });

    this.scenario.set(aliasBookNameEdited, newBookName);
});

When(
    'school admin edits book with missing {string}',
    async function (this: IMasterWorld, _: string) {
        await schoolAdminSelectBulkActionOfBookDetail(this.cms, ActionOptions.EDIT);

        await this.cms.instruction(`school admin edit book name to empty`, async () => {
            await schoolAdminFillBookForm(this.cms, '');
            await this.cms.selectAButtonByAriaLabel(`Save`);
        });
    }
);

Then('school admin cannot edit book', async function (this: IMasterWorld) {
    await this.cms.instruction(
        'school admin still see dialog edit book form with error message',
        async () => {
            await schoolAdminSeesErrorMessageField(this.cms, {
                wrapper: dialogWithHeaderFooter,
            });
        }
    );
});

Then('school admin sees the edited book in book detail page', async function (this: IMasterWorld) {
    const newBookName = this.scenario.get(aliasBookNameEdited);

    await this.cms.instruction(`school admin sees book edited to ${newBookName}`, async () => {
        await this.cms.assertThePageTitle(`${newBookName}`);
    });
});
