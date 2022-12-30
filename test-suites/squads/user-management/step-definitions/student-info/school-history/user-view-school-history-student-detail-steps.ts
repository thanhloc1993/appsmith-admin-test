import { AccessTypes, ExpectedResultTypes, UserMasterEntity } from '@user-common/types/bdd';
import { goToStudentDetailByMenu, goToStudentDetailByURL } from '@user-common/utils/goto-page';

import { Given, Then, When } from '@cucumber/cucumber';

import { rootSchoolHistoryDetail } from './school-history-keys';
import {
    checkMasterDataSchoolLevelSchoolInfoSchoolCourse,
    schoolAdminSeesSchoolHistoryInStudentDetail,
} from './user-view-school-history-student-detail-definitions';

Given('the master has data of {string} correctly', async function (entity: UserMasterEntity) {
    const scenarioContext = this.scenario;
    const cms = this.cms;

    await cms.instruction(`school admin checks data of ${entity} in master`, async function () {
        switch (entity) {
            case 'School Level & School & School Course':
                await checkMasterDataSchoolLevelSchoolInfoSchoolCourse(cms, scenarioContext);
                break;
        }
    });
});

When('school admin goes to student detail by {string}', async function (conditions: AccessTypes) {
    const scenarioContext = this.scenario;
    const cms = this.cms;

    await cms.instruction(
        `school admin goes to student detail by ${conditions}`,
        async function () {
            switch (conditions) {
                case 'URL':
                    await goToStudentDetailByURL(cms, scenarioContext);
                    break;
                case 'Menu':
                    await goToStudentDetailByMenu(cms, scenarioContext);
                    break;
            }
        }
    );

    await cms.waitingForLoadingIcon();
});

Then(
    'school admin {string} school history of the student displayed',
    async function (expectedResult: ExpectedResultTypes) {
        const scenarioContext = this.scenario;
        const cms = this.cms;

        switch (expectedResult) {
            case 'sees':
                await cms.instruction(
                    'school admin sees school history of the student displayed correctly',
                    async function () {
                        await schoolAdminSeesSchoolHistoryInStudentDetail(cms, scenarioContext);
                    }
                );
                break;
            case 'does not see':
                await cms.page!.isHidden(rootSchoolHistoryDetail);
                break;
        }
    }
);
