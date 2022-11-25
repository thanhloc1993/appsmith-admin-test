import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { saveButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { studentHomeAddressAlias } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { getLearnerInformationAfterCreateStudentSuccessfully } from './user-create-student-definitions';
import {
    assertStudentHomeAddressOnCMS,
    createRandomStudentHomeAddressData,
    fillInStudentHomeAddress,
} from './user-create-student-with-home-address-definitions';
import {
    createRandomStudentData,
    fillInStudentInformation,
    goToAddStudentPage,
} from './user-definition-utils';

When('school admin creates a new student with home address', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    await cms.instruction('school admin goes to student upsert page', async function () {
        await goToAddStudentPage(cms);
    });

    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
    const studentGeneralInfo = await createRandomStudentData(cms, {
        locations: [firstGrantedLocation],
    });
    const studentHomeAddress = await createRandomStudentHomeAddressData(cms);

    await cms.instruction(`school admin fills in student general info`, async function () {
        await fillInStudentInformation(cms, scenarioContext, studentGeneralInfo);
    });

    await cms.instruction(`school admin fills in student home address`, async function () {
        await fillInStudentHomeAddress(cms, studentHomeAddress);
        scenarioContext.set(studentHomeAddressAlias, studentHomeAddress);
    });

    await cms.instruction(`school admin clicks on save button`, async function () {
        await cms.selectElementByDataTestId(saveButton);
        await cms.waitingForLoadingIcon();
    });

    await cms.instruction(
        `school admin gets learner new credentials after create account successfully`,
        async function () {
            await getLearnerInformationAfterCreateStudentSuccessfully(
                cms,
                scenarioContext,
                studentGeneralInfo
            );
        }
    );
});

Then(
    'school admin sees newly created student with home address on CMS',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await cms.instruction(`school admin goes to student management page`, async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        });

        await assertStudentHomeAddressOnCMS(cms, scenarioContext);
    }
);
