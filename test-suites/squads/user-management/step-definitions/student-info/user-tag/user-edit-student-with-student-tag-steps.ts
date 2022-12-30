import { When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { StudentTagAction } from './type';
import { schoolAdminEditStudentWithTag } from './user-edit-student-with-student-tag-definitions';
import { clickOnSaveButtonInStudent } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

When(
    'school admin edits student tag by {string}',
    async function (this: IMasterWorld, studentTagAction: StudentTagAction) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await cms.selectAButtonByAriaLabel('Edit');

        await schoolAdminEditStudentWithTag(cms, scenarioContext, studentTagAction);

        await clickOnSaveButtonInStudent(cms);
    }
);
