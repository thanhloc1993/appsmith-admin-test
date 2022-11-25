import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';

import { Given, When } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld } from '@supports/app-types';
import { Menu, MenuUnion } from '@supports/enum';

import {
    waitForFirstLoading,
    schoolAdminCreateStudentWithStudentTags,
} from './user-common-definitions';
import { applyOrgForLocationSetting } from './user-definition-utils';
import {
    schoolAdminWaitForGetAllDataStaffList,
    shoolAdminSeesStaffListHasManyRecords,
} from './user-view-staff-list-definitions';
import { shoolAdminSeesStudentListHasManyRecords } from './user-view-student-list-definitions';
import { StudentTagAction } from 'test-suites/squads/user-management/step-definitions/student-info/user-tag/type';

Given(
    'school admin is on the {string} page',
    async function (this: IMasterWorld, menuType: MenuUnion) {
        const { context } = this.scenario;
        await this.cms.selectMenuItemInSidebarByAriaLabel(menuType);
        await this.cms.instruction(
            `Initial ${menuType} data is created`,
            async function (cms: CMSInterface) {
                await waitForFirstLoading(menuType, cms, context);
            }
        );
    }
);

Given('student list has many records', async function (this: IMasterWorld) {
    const cms = this.cms;
    const page = cms.page!;
    const scenarioContext = this.scenario;

    await cms.instruction('School admin sees student list has many records', async function (cms) {
        await shoolAdminSeesStudentListHasManyRecords(cms, scenarioContext);
    });

    await page.reload();

    await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
});

Given('staff list has many records', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;
    const isEnableStaffLocation = await isEnabledFeatureFlag('STAFF_MANAGEMENT_STAFF_LOCATION');

    if (isEnableStaffLocation) {
        await cms.instruction(
            'School admin selects org location on location setting',
            async function () {
                await applyOrgForLocationSetting(cms);
            }
        );
    }

    await cms.instruction('School admin waits for get data staff list', async function () {
        await shoolAdminSeesStaffListHasManyRecords(cms);
    });
    await cms.schoolAdminIsOnThePage(Menu.STAFF, 'Staff Management');
    await cms.instruction('School admin waits for get data staff list', async function () {
        await schoolAdminWaitForGetAllDataStaffList(cms, scenarioContext);
    });
});

When(
    'school admin creates a new student with {string}',
    async function (this: IMasterWorld, studentTagAction: StudentTagAction) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        await schoolAdminCreateStudentWithStudentTags(cms, scenarioContext, studentTagAction);
    }
);
