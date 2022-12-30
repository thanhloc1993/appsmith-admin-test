import { tableEmptyMessage } from '@legacy-step-definitions/cms-selectors/cms-keys';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { StudentDetailTab } from '@supports/types/cms-types';

import { schoolAdminChooseTabInStudentDetail } from './user-create-student-definitions';
import { findNewlyCreatedStudent, searchStudentOnCMS } from './user-definition-utils';

export async function schoolAdminDoesNotSeeAnySiblingInSiblingSection(
    cms: CMSInterface,
    studentProfile: UserProfileEntity
) {
    const page = cms.page!;
    await cms.instruction('school admin goes to student list', async function () {
        await cms.schoolAdminIsOnThePage(Menu.STUDENTS, 'Student Management');
    });

    await cms.instruction(
        `school admin searches for student ${studentProfile.name}`,
        async function () {
            await searchStudentOnCMS(cms, studentProfile.name);
            await page.waitForTimeout(1000);
        }
    );

    const student = await findNewlyCreatedStudent(cms, studentProfile);

    await cms.instruction('school admin goes to Family tab', async function () {
        await (await student?.waitForSelector(studentPageSelectors.tableStudentName))?.click();
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
        await cms.waitForSkeletonLoading();
    });

    await cms.instruction(`School admin sees empty message on sibling table`, async function () {
        await page.waitForSelector(tableEmptyMessage);
    });
}
