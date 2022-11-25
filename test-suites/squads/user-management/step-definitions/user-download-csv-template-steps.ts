import { Given, Then, When } from '@cucumber/cucumber';

import { Menu } from '@supports/enum';

import { FileCSV } from './user-definition-utils';
import {
    selectImportParents,
    schoolAdminDownloadsCsvTemplate,
    schoolAdminVerifiesDownload,
} from './user-download-csv-template-definitions';

type UserType = 'Parents' | 'Students';
const fileName = FileCSV.PARENT + '_template' + FileCSV.EXT;

Given('school admin is on Student Management page', async function () {
    const cms = this.cms;
    await cms.schoolAdminIsOnThePage(Menu.STUDENTS, 'Student Management');
});

When('school admin proceeds to import {string}', async function (user: UserType) {
    if (user === 'Parents') {
        const cms = this.cms;
        await selectImportParents(cms);
    }
});

When('school admin downloads template file', async function () {
    const cms = this.cms;
    await cms.instruction(
        'school admin clicks the download template file button',
        async function () {
            await schoolAdminDownloadsCsvTemplate(cms, fileName);
        }
    );
});

Then('school admin sees the csv template file is downloaded automatically', async function () {
    const cms = this.cms;
    await cms.instruction('school admin sees downloaded file', async function () {
        await schoolAdminVerifiesDownload(cms, fileName);
    });
});
