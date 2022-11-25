import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { dialogFullScreen } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { StudentFieldRequired, StudentInformation } from '@legacy-step-definitions/types/content';
import { learnerProfileAlias } from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { Then, When } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import {
    clickOnSaveButtonInStudent,
    createRandomStudentData,
    goToAddStudentPageAndFillInStudentInformation,
} from './user-definition-utils';
import { discardStudentUpsertForm } from './user-update-student-definitions';

When(
    'school admin creates a new student with draft information',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const context = this.scenario;

        const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
        const studentData: StudentInformation = await createRandomStudentData(cms, {
            locations: [firstGrantedLocation],
        });

        /// Have instructions inside
        await goToAddStudentPageAndFillInStudentInformation(cms, context, studentData);
    }
);

When(
    'school admin cancels the creating student using {string}',
    async function (this: IMasterWorld, button: string) {
        const cms = this.cms;

        await cms.instruction(
            `school admin cancels the updating student using ${button}`,
            async function (cms: CMSInterface) {
                await discardStudentUpsertForm(cms, button);
            }
        );

        await cms.instruction(
            'school admin confirm cancel edit dialog',
            async function (cms: CMSInterface) {
                await cms.selectAButtonByAriaLabel('Leave');
            }
        );
    }
);

Then('school admin sees create student full-screen dialog closed', async function () {
    const cms = this.cms;
    const cmsPage = cms.page!;

    await cms.instruction('Assert the dialog is closed', async function () {
        await cmsPage.waitForSelector(dialogFullScreen, {
            state: 'hidden',
        });
    });
});

When(
    'school admin creates a student with missing {string}',
    async function (this: IMasterWorld, field: string) {
        const cms = this.cms;
        const context = this.scenario;

        const missingField = (
            field === 'enrollment status' ? 'enrollmentStatus' : field
        ) as keyof StudentFieldRequired;
        const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

        const studentData: StudentInformation = await createRandomStudentData(cms, {
            missingField,
            locations: [firstGrantedLocation],
        });

        /// Have instructions inside
        await goToAddStudentPageAndFillInStudentInformation(cms, context, studentData);

        await cms.instruction('School admin click save button', async function () {
            await clickOnSaveButtonInStudent(cms);
        });
    }
);

When(
    'school admin creates a new student with existing unique email',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const { name, email } = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

        const randomStudentData = await createRandomStudentData(cms);
        const studentData: StudentInformation = {
            ...randomStudentData,
            email,
            name: `new-${name}`,
            locations: [firstGrantedLocation],
        };

        /// Have instructions inside
        await goToAddStudentPageAndFillInStudentInformation(cms, scenarioContext, studentData);

        await cms.instruction('School admin click save button', async function () {
            await clickOnSaveButtonInStudent(cms);
        });
    }
);

Then(
    'school admin can not create a new student with existing unique email',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const { name } = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        await cms.instruction(
            `School admin goes back Student Management screen using cancel button`,
            async (cms: CMSInterface) => {
                await discardStudentUpsertForm(cms, 'cancel');
            }
        );

        await this.cms.instruction(
            `School admin goes back Student Management screen using leave button`,
            async (cms: CMSInterface) => {
                await cms.selectAButtonByAriaLabel('Leave');
            }
        );

        await this.cms.instruction(
            `School admin checks the student does not exist in the teacher list`,
            async function (cms: CMSInterface) {
                await cms.waitForSelectorHasTextWithOptions(
                    studentPageSelectors.tableBaseRow,
                    `new-${name}`,
                    { state: 'hidden' }
                );
            }
        );
    }
);
