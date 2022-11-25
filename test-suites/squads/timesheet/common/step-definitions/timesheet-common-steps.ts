import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld } from '@supports/app-types';

import { staffProfileAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import { createARandomStaffFromGRPC } from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';

Given('school admin has created a requestor', async function (this: IMasterWorld) {
    const context = this.scenario;
    const cms = this.cms;
    await this.cms.instruction(
        'school admin create a staff by API',
        async function (this: CMSInterface) {
            const createdStaff = await createARandomStaffFromGRPC(cms);
            context.set(staffProfileAliasWithAccountRoleSuffix('teacher'), createdStaff);
            context.set(staffProfileAlias, createdStaff);
        }
    );
});
