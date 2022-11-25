import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { dialogFullScreen, studentDetail } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { learnerProfileAlias } from '@user-common/alias-keys/user';
import {
    dialogWithHeaderFooterWrapper,
    dialogWithHeaderFooterButtonClose,
    footerDialogConfirmButtonSave,
} from '@user-common/cms-selectors/students-page';
import { openPopupLocation } from '@user-common/utils/locations';

import { Given, When, Then } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles, CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { discardPopupLocation } from './user-cancel-add-location-for-student-definitions';
import { createARandomStudentGRPC } from './user-create-student-definitions';
import {
    schoolAdminGoesToStudentDetailAndEdit,
    OptionCancel,
    checkLocationInUpsertPage,
    addMoreLocations,
} from './user-definition-utils';
import { schoolAdminSeesEditedStudentOnCMS } from './user-update-student-definitions';

Given(
    '{string} has created a student with location info',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

        const { student } = await createARandomStudentGRPC(cms, {
            locations: [firstGrantedLocation],
        });
        scenarioContext.set(learnerProfileAlias, student);
    }
);

Given('{string} has been editing student', async function (this: IMasterWorld, role: AccountRoles) {
    if (role !== 'school admin') throw new Error('we do not allow create other role');
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
    await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile);
});

Given(
    '{string} has edited student location by adding more locations',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await openPopupLocation(cms);
        await addMoreLocations(cms, scenarioContext, 1);
    }
);

When(
    '{string} cancels the editing process by using {string}',
    async function (this: IMasterWorld, role: AccountRoles, button: OptionCancel) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        await discardPopupLocation(this.cms, button);
    }
);

When(
    '{string} cancels leaving editing student page',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        await this.cms.instruction(
            `school admin cancels leaving editing student page`,
            async function (cms: CMSInterface) {
                await cms.selectAButtonByAriaLabel('Cancel');

                const wrapper = await cms.page!.waitForSelector(dialogWithHeaderFooterWrapper);

                const cancelButton = await wrapper.waitForSelector(
                    dialogWithHeaderFooterButtonClose
                );
                await cancelButton.click();
            }
        );
    }
);

When(
    '{string} leaves editing student page',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        await this.cms.instruction(
            `school admin cancels leaving editing student page`,
            async function (cms: CMSInterface) {
                await cms.selectAButtonByAriaLabel('Cancel');

                const wrapper = await cms.page!.waitForSelector(dialogWithHeaderFooterWrapper);

                const cancelButton = await wrapper.waitForSelector(footerDialogConfirmButtonSave);
                await cancelButton.click();
            }
        );
    }
);

Then(
    '{string} is still in editing student page',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        await this.cms.instruction(
            `school admin is still in editing student page`,
            async function (cms: CMSInterface) {
                await cms.page!.waitForSelector(dialogFullScreen);
            }
        );
    }
);

Then(
    '{string} is redirected to Student Detail page',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        await this.cms.instruction(
            `school admin is redirected to Student Detail page`,
            async function (cms: CMSInterface) {
                await cms.page!.waitForSelector(studentDetail);
            }
        );
    }
);

Then(
    '{string} sees nothing changed in Student Detail page',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction(
            'school admin sees nothing changed in Student Detail page',
            async () => {
                const learnerProfile = scenario.get<UserProfileEntity>(learnerProfileAlias);

                await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
                await schoolAdminSeesEditedStudentOnCMS(cms, learnerProfile, {
                    hasLoggedInTag: false,
                    shouldVerifyNeverLoggedInTag: false,
                });
            }
        );
    }
);

Then(
    '{string} sees nothing changed in Student Edit page',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');
        await checkLocationInUpsertPage(this.cms, this.scenario);
    }
);
