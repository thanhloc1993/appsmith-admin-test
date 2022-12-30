import { rowOption, rowsPerPage } from '@user-common/cms-selectors/student';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { Menu } from '@supports/enum';

export async function notSeeNewlyCreatedStudentOnCMS(
    cms: CMSInterface,
    learnerProfileName: string
) {
    const cmsPage = cms.page!;

    await cms.instruction(`Go to student management page`, async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    });

    await cms.instruction(`Search student name: ${learnerProfileName}`, async function () {
        try {
            await cmsPage.click(rowsPerPage);
            await cmsPage.click(rowOption('100'));

            await cmsPage.fill(
                studentPageSelectors.formFilterAdvancedTextFieldInput,
                learnerProfileName
            );
            await cmsPage.keyboard.press('Enter');
        } catch (error) {
            await cms.attach(`User_Error findNewlyCreatedLearnerOnCMSStudentsPage ${error}`);

            await cmsPage.fill(
                studentPageSelectors.formFilterAdvancedTextFieldInput,
                learnerProfileName
            );
            await cmsPage.keyboard.press('Enter');
        }
    });

    await cms.instruction(`School Admin see nothing on students management`, async function () {
        await cmsPage.waitForSelector(studentPageSelectors.tableStudentName, { state: 'hidden' });
    });
}
