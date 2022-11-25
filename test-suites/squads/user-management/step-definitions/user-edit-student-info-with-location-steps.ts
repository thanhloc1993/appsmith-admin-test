import { randomInteger } from '@legacy-step-definitions/utils';
import { learnerProfileAlias, locationAddMoreAlias } from '@user-common/alias-keys/user';
import { openPopupLocation } from '@user-common/utils/locations';

import { Given, When, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import { createAStudentPromise } from './user-create-student-definitions';
import {
    schoolAdminGoesToStudentDetailAndEdit,
    clickOnSaveInDialog,
    addMoreLocations,
    selectLocations,
    checkLocationItem,
    createRandomStudentData,
    fillInStudentInformation,
    clickOnSaveStudent,
} from './user-definition-utils';
import {
    AmountLocation,
    checkLocationOnDialog,
    checkSelectedPart,
} from './user-edit-student-info-with-location-definitions';
import { schoolAdminSeesEditedStudentOnCMS } from './user-update-student-definitions';

Given(
    'school admin has created a student with {string} location',
    async function (this: IMasterWorld, locationLength: number) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const student = await createAStudentPromise(cms, { locationLength });
        scenarioContext.set(learnerProfileAlias, student);
    }
);

When(
    'school admin edits student location by adding {string} location',
    async function (this: IMasterWorld, amountLocation: AmountLocation) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile);

        await openPopupLocation(cms);
        const locationLength = amountLocation === AmountLocation.ONE ? 1 : randomInteger(2, 5);
        await addMoreLocations(cms, scenarioContext, locationLength);
    }
);

When(
    'school admin sees {string} location on Location Selection popup',
    async function (this: IMasterWorld, amountLocation: AmountLocation) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await cms.instruction(
            `School admin sees ${amountLocation} location on Location Selection popup`,
            async () => {
                await checkLocationOnDialog(cms, scenarioContext);

                await clickOnSaveInDialog(cms);
            }
        );
    }
);

When('school admin saves the editing process', async function (this: IMasterWorld) {
    await clickOnSaveStudent(this.cms);
});

Then(
    'school admin sees {string} new location with {string} previous added locations on student detail page',
    async function (this: IMasterWorld, amountLocation: AmountLocation, numberLocation: number) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        await cms.instruction(
            `school admin sees ${amountLocation} new location with ${numberLocation} previous added locations on student detail page`,
            async () => {
                await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
                await schoolAdminSeesEditedStudentOnCMS(cms, learnerProfile, {
                    hasLoggedInTag: false,
                    shouldVerifyNeverLoggedInTag: false,
                });
            }
        );
    }
);

When('school admin saves the Select Location popup', async function (this: IMasterWorld) {
    await clickOnSaveInDialog(this.cms);
});

When('school admin deselects previously added location', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;
    const locationAddMore = scenarioContext.get<LocationInfoGRPC[]>(locationAddMoreAlias) || [];

    await selectLocations(cms, scenarioContext, locationAddMore);
});

Then(
    'school admin sees previously added location is unselected',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const locationAddMore = scenarioContext.get<LocationInfoGRPC[]>(locationAddMoreAlias) || [];

        await openPopupLocation(cms);

        await checkLocationItem(cms, locationAddMore, false);
    }
);

Then(
    'school admin does not see previously added location display on Selected part',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const locationAddMore = scenarioContext.get<LocationInfoGRPC[]>(locationAddMoreAlias) || [];

        await checkSelectedPart(cms, locationAddMore, false);
    }
);

When(
    'school admin edits student general info except location',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        const {
            name,
            firstName,
            lastName,
            firstNamePhonetic,
            lastNamePhonetic,
            fullNamePhonetic,
            email,
            gradeMaster,
            enrollmentStatus,
            studentExternalId,
            studentNote,
            birthday,
            gender,
        } = await createRandomStudentData(cms);

        const newDataStudent = {
            name,
            firstName,
            lastName,
            firstNamePhonetic,
            lastNamePhonetic,
            fullNamePhonetic,
            email,
            grade: gradeMaster?.name,
            gradeValue: gradeMaster?.name,
            gradeMaster,
            enrollmentStatus,
            studentExternalId,
            studentNote,
            birthday,
            gender,
        };

        await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile, true);

        await fillInStudentInformation(cms, scenarioContext, newDataStudent);

        const newStudent = { ...learnerProfile, ...newDataStudent };

        scenarioContext.set(learnerProfileAlias, newStudent);
    }
);

Then(
    'school admin sees general info display with updated information except location',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        await cms.instruction(
            `school admin sees new student without location on student detail page`,
            async () => {
                await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
                await schoolAdminSeesEditedStudentOnCMS(cms, learnerProfile, {
                    hasLoggedInTag: false,
                    shouldVerifyNeverLoggedInTag: false,
                });
            }
        );
    }
);
