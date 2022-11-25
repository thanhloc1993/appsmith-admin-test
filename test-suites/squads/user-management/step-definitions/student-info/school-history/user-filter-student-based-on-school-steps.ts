import { studentDetailDataAlias } from '@user-common/alias-keys/student';
import { StudentInformation } from '@user-common/types/student';
import { clickApplyFilterAndCloseDialogFilter } from '@user-common/utils/click-actions';
import { schoolAdminFindsStudentOnStudentTable } from '@user-common/utils/find-student';
import { reloadPageAndGoToStudentList } from '@user-common/utils/goto-page';

import { Then, When } from '@cucumber/cucumber';

import { ConditionFilterCurrentSchool } from './types';
import { schoolAdminFilterStudentBySchoolConditions } from './user-filter-student-based-on-school-definitions';

When(
    'school admin filters students by {string}',
    async function (conditions: ConditionFilterCurrentSchool) {
        const cms = this.cms;
        const scenario = this.scenario;

        await reloadPageAndGoToStudentList(cms);

        await schoolAdminFilterStudentBySchoolConditions(cms, scenario, conditions);

        await clickApplyFilterAndCloseDialogFilter(cms);
    }
);

Then(
    'school admin sees the results filtered match to {string}',
    async function (conditions: ConditionFilterCurrentSchool) {
        const cms = this.cms;

        const scenarioContext = this.scenario;

        const student = scenarioContext.get<StudentInformation>(studentDetailDataAlias);

        const username = student.name || student.firstName + student.lastName;

        await cms.instruction(
            `school admin sees the student ${username} filtered match to the conditions ${conditions}`,
            async function () {
                await schoolAdminFindsStudentOnStudentTable(cms, username);
            }
        );
    }
);
