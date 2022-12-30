import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { saveButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { WithOrWithout } from '@legacy-step-definitions/types/common';
import { learnerProfileAlias, studentHomeAddressAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { UserAddress, UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { createAStudentPromise } from './user-create-student-definitions';
import {
    assertStudentHomeAddressOnCMS,
    createRandomStudentHomeAddressData,
    fillInStudentHomeAddress,
} from './user-create-student-with-home-address-definitions';
import { schoolAdminGoesToStudentDetailAndEdit } from './user-definition-utils';

export type AddressType = 'blank' | 'another address';

Given(
    'school admin has created a student {string} home address',
    async function (this: IMasterWorld, option: WithOrWithout) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        let userAddressList: UserAddress[] = [];
        if (option === 'with') {
            userAddressList = [await createRandomStudentHomeAddressData(cms)];
        }
        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
        const studentProfile = await createAStudentPromise(cms, {
            userAddressList,
            locations: [firstGrantedLocation],
        });
        scenarioContext.set(learnerProfileAlias, studentProfile);
    }
);

When(
    'school admin edits student home address into {string}',
    async function (this: IMasterWorld, valueType: AddressType) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const studentProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        let randomStudentHomeAddress = await createRandomStudentHomeAddressData(cms);
        if (valueType === 'blank') randomStudentHomeAddress = {};
        scenarioContext.set(studentHomeAddressAlias, randomStudentHomeAddress);

        await schoolAdminGoesToStudentDetailAndEdit(cms, studentProfile);

        await cms.instruction(`school admin edits home address to ${valueType}`, async function () {
            await fillInStudentHomeAddress(cms, randomStudentHomeAddress);
        });

        await cms.instruction(`school admin clicks on save button`, async function () {
            await cms.selectElementByDataTestId(saveButton);
            await cms.waitingForLoadingIcon();
        });
    }
);

Then(
    'school admin sees the edited student home address data on CMS',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await cms.instruction(`school admin goes to student management page`, async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        });

        await assertStudentHomeAddressOnCMS(cms, scenarioContext);
    }
);
