import { aliasFirstGrantedLocation } from '@user-common/alias-keys/locations';
import {
    FieldsConditionTypes,
    PositionsMessagesType,
    ResultsConditionTypes,
} from '@user-common/types/bdd';
import {
    checkMessageOnCMSByText,
    schoolAdminSeesMultipleSnackbar,
} from '@user-common/utils/check-messages';
import {
    clickButtonInNotFullScreenDialogByText,
    clickOnSaveFullScreenDialog,
} from '@user-common/utils/click-actions';
import { createRandomStudentData } from '@user-common/utils/create-student';
import { goToAddStudentPage } from '@user-common/utils/goto-page';

import { Given, When } from '@cucumber/cucumber';

import { LocationObjectGRPC } from '@supports/types/cms-types';

import { fillFormStudentInformation } from '../upsert-student/user-create-student-utils';
import {
    clickSaveToCreateAndSavingResp,
    modifySchoolHistoryData,
} from './user-add-school-history-student-definitions';
import { fillStudentSchoolHistory } from './user-view-school-history-student-detail-definitions';

Given('school admin is adding student with all required fields in General Info', async function () {
    const scenarioContext = this.scenario;
    const cms = this.cms;

    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    const randomStudentData = await createRandomStudentData(cms, {
        locations: [firstGrantedLocation],
    });

    await cms.instruction(
        'School admin is adding student with all required fields in General Info',
        async function () {
            await goToAddStudentPage(cms);
            await fillFormStudentInformation(cms, scenarioContext, randomStudentData);
        }
    );
});

When(
    'school admin adds School History {string}',
    async function (conditions: FieldsConditionTypes) {
        const scenarioContext = this.scenario;
        const cms = this.cms;
        await cms.instruction(`school admin adds School History ${conditions}`, async function () {
            await modifySchoolHistoryData(cms, scenarioContext, conditions);

            await fillStudentSchoolHistory(cms, scenarioContext);
        });
    }
);

When(
    'school admin clicks save a student {string} with {string} on the {string}',
    async function (
        results: ResultsConditionTypes,
        messages: string,
        positions: PositionsMessagesType
    ) {
        const scenarioContext = this.scenario;
        const cms = this.cms;

        await cms.instruction(
            `School admin clicks save a student ${results} with ${messages} on the ${positions}`,
            async function () {
                switch (results) {
                    case 'successfully':
                        await clickSaveToCreateAndSavingResp(cms, scenarioContext);
                        if (positions === 'snackbar')
                            await schoolAdminSeesMultipleSnackbar(cms, 'successful', messages);
                        await clickButtonInNotFullScreenDialogByText(cms, 'Close');
                        break;
                    case 'unsuccessfully':
                        await clickOnSaveFullScreenDialog(cms);
                        if (positions === 'student form')
                            await checkMessageOnCMSByText(cms, messages);
                        break;
                }
            }
        );
    }
);
