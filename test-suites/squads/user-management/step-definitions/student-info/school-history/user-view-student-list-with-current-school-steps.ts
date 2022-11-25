import { schoolHistoriesAlias, studentDetailDataGRPCAlias } from '@user-common/alias-keys/student';
import { getDataValue } from '@user-common/helper/get-key';
import { AccessTypes, ConditionStatusTypes } from '@user-common/types/bdd';
import { CreateStudentResp, SchoolHistoriesTypes } from '@user-common/types/student';
import { schoolAdminSeesNewStudentBySearch } from '@user-common/utils/find-student';
import { goToStudentListByMenu, goToStudentListByURL } from '@user-common/utils/goto-page';
import { schoolAdminWaitForLoadingInTable } from '@user-common/utils/loading';

import { Then, When } from '@cucumber/cucumber';

When('school admin goes to student list by {string}', async function (conditions: AccessTypes) {
    const cms = this.cms;
    switch (conditions) {
        case 'Menu':
            await goToStudentListByMenu(cms);
            break;
        case 'URL':
            await goToStudentListByURL(cms);
            break;
    }
});

Then(
    'school admin {string} current school in student list',
    async function (conditions: ConditionStatusTypes) {
        const cms = this.cms;
        const scenario = this.scenario;

        const student = scenario.get<CreateStudentResp>(studentDetailDataGRPCAlias);
        const schoolHistories = scenario.get<SchoolHistoriesTypes[]>(schoolHistoriesAlias);
        const userProfile = student.studentProfile?.student?.userProfile;

        await cms.instruction(
            `School admin sees student: ${userProfile?.name} on student list`,
            async function () {
                await schoolAdminSeesNewStudentBySearch(cms, userProfile!.name, 'sees');

                await schoolAdminWaitForLoadingInTable(cms, 'TableBaseRowObserveVisible__skeleton');

                const schoolName = cms
                    .page!.locator(getDataValue(userProfile!.userId))
                    .getByTestId('StudentTableCell__columnSchool');

                switch (conditions) {
                    case 'sees':
                        {
                            // Current school always is in the first row
                            const textContent = await schoolName
                                .getByText(schoolHistories[0].schoolInfo.school_name)
                                .textContent();
                            weExpect(textContent).toBe(schoolHistories[0].schoolInfo.school_name);
                        }

                        break;
                    case 'does not see': {
                        const textContent = await schoolName.getByText('--').textContent();
                        weExpect(textContent).toBe('--');
                        break;
                    }
                }
            }
        );
    }
);
