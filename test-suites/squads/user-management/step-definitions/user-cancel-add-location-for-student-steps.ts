import { dialogFullScreen, tableBaseRow } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { StudentInformation } from '@legacy-step-definitions/types/content';
import { studentCreatingDataAlias } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import { openPopupLocation } from '@user-common/utils/locations';

import { Given, When, Then } from '@cucumber/cucumber';

import { IMasterWorld, AccountRoles, CMSInterface } from '@supports/app-types';
import { Menu } from '@supports/enum';

import { discardPopupLocation } from './user-cancel-add-location-for-student-definitions';
import {
    goToAddStudentPage,
    createRandomStudentData,
    fillInStudentInformation,
    OptionCancel,
    applyOrgForStudentLocation,
} from './user-definition-utils';
import { strictEqual } from 'assert';

Given(
    '{string} has been creating student',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        const cms = this.cms;
        const scenarioContext = this.scenario;

        await goToAddStudentPage(cms);

        const studentData = await createRandomStudentData(cms);
        scenarioContext.set(studentCreatingDataAlias, studentData);

        await fillInStudentInformation(cms, scenarioContext, studentData);
    }
);

Given(
    '{string} has filled all fields along with location',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');
        const cms = this.cms;

        await this.cms.instruction(
            'School admin selects all locations in the popup',
            async function () {
                await applyOrgForStudentLocation({ cms, isClickedSaveButton: false });
            }
        );
    }
);

When(
    '{string} cancels the adding process by using {string}',
    async function (this: IMasterWorld, role: AccountRoles, button: OptionCancel) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        await discardPopupLocation(this.cms, button);
    }
);

When(
    '{string} cancels leaving adding student page',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        await this.cms.instruction(
            `school admin cancels leaving adding student page`,
            async function (cms: CMSInterface) {
                await cms.selectAButtonByAriaLabel('Cancel');

                const wrapper = await cms.page!.waitForSelector(
                    studentPageSelectors.dialogWithHeaderFooterWrapper
                );

                const cancelButton = await wrapper.waitForSelector(
                    studentPageSelectors.dialogWithHeaderFooterButtonClose
                );
                await cancelButton.click();
            }
        );
    }
);

When(
    '{string} leaves adding student page',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        await this.cms.instruction(
            `school admin cancels leaving adding student page`,
            async function (cms: CMSInterface) {
                await cms.selectAButtonByAriaLabel('Cancel');

                const wrapper = await cms.page!.waitForSelector(
                    studentPageSelectors.dialogWithHeaderFooterWrapper
                );

                const cancelButton = await wrapper.waitForSelector(
                    studentPageSelectors.footerDialogConfirmButtonSave
                );
                await cancelButton.click();
            }
        );
    }
);

Then(
    '{string} is still in adding student page',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        await this.cms.instruction(
            `school admin is still in adding student page`,
            async function (cms: CMSInterface) {
                await cms.page!.waitForSelector(dialogFullScreen);
            }
        );
    }
);

Then(
    '{string} is redirected to Student Management page',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');
        const cms = this.cms;

        await cms.instruction('Find and click Students tab', async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        });
    }
);

Then(
    '{string} does not see new student on CMS',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const studentCreatingData =
            scenarioContext.get<StudentInformation>(studentCreatingDataAlias);

        await cms.instruction('Find student name in student list', async function () {
            await cms.page?.waitForSelector(
                `${tableBaseRow}:has-text("${studentCreatingData.name}")`,
                {
                    state: 'hidden',
                }
            );
        });
    }
);

Given(
    '{string} has opened Location Selection popup',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');

        await openPopupLocation(this.cms);
    }
);

Given('{string} selects location', async function (this: IMasterWorld, role: AccountRoles) {
    if (role !== 'school admin') throw new Error('we do not allow create other role');
    const cms = this.cms;

    await this.cms.instruction(
        'School admin selects all locations in the popup',
        async function () {
            await applyOrgForStudentLocation({
                cms,
                isClickedSaveButton: false,
                isOpenPopup: false,
            });
        }
    );
});

Then(
    '{string} sees Selection popup closed',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');
        const cms = this.cms;

        await cms.instruction('Selection popup closed', async function () {
            await cms.page?.waitForSelector(studentPageSelectors.dialogWithHeaderFooterWrapper, {
                state: 'hidden',
            });
        });
    }
);

Then(
    '{string} does not sees the selected location in adding student page',
    async function (this: IMasterWorld, role: AccountRoles) {
        if (role !== 'school admin') throw new Error('we do not allow create other role');
        const cms = this.cms;

        await cms.instruction('does not sees the selected location', async function () {
            const locationInput = await cms.page!.waitForSelector(
                studentPageSelectors.locationInput
            );

            const locationChips = await locationInput.$$(studentPageSelectors.locationChips);
            strictEqual(0, locationChips.length, `location field has no location chips`);
        });
    }
);
