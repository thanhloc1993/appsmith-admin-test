import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasCourseName } from './alias-keys/lesson';
import { allAutocompleteInputs } from './cms-selectors/lesson-management';
import { getCMSInterfaceByRole } from './utils';
import { schoolAdminGoToCourseDetail } from 'test-suites/common/step-definitions/course-definitions';
import { gotoEditPageOnCMS } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

When(
    '{string} goes to detail course page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        const courseName = this.scenario.get<string>(aliasCourseName);

        await cms.instruction(`${role} goes to the detail course page`, async function () {
            await schoolAdminGoToCourseDetail(cms, courseName);
        });
    }
);

When('{string} opens editing course page', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} opens editing course page`, async function () {
        await gotoEditPageOnCMS(cms, 'Course');
    });
});

Then(
    '{string} sees teaching method field is disable',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees teaching method field is disable`, async function () {
            const teacherMethodField = await cms.page!.isEnabled(allAutocompleteInputs);
            weExpect(teacherMethodField, 'should be disable').toEqual(true);
        });
    }
);
