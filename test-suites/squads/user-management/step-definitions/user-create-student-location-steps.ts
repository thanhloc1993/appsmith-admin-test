import { StudentInformation } from '@legacy-step-definitions/types/content';
import {
    locationListAlias,
    studentCreatingDataAlias,
    studentLocationsAlias,
} from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { LocationInfoGRPC, StudentDetailTab } from '@supports/types/cms-types';

import {
    clickOnSaveButtonInParentElement,
    getLearnerInformationAfterCreateStudentSuccessfully,
    schoolAdminChooseTabInStudentDetail,
} from './user-create-student-definitions';
import {
    AmountLocation,
    LocationResult,
    LocationType,
    schoolAdminFillsAllFieldsWithLocations,
    schoolAdminFillsAllFieldsWithLocationType,
    schoolAdminSeesOnlyChildrenLocationDisplayOnPopup,
    schoolAdminSeesParentLocationAndChildrenLocation,
    schoolAdminSeesSelectedLocationsOnStudentDetail,
    seesLocationChipsAndRemainingChip,
} from './user-create-student-location-definitions';
import { goToAddStudentPage } from './user-definition-utils';
import {
    randomInteger,
    getRandomElementsWithLength,
    retrieveLowestLocations,
} from 'step-definitions/utils';

Given('school admin has many locations', async function (this: IMasterWorld) {
    const cms = this.cms;
    const context = this.scenario;

    await cms.instruction('Get Location list by GRPC', async () => {
        const locationsList = await retrieveLowestLocations(cms);

        context.set(locationListAlias, locationsList);
    });
});

When('school admin wants to add a new student', async function (this: IMasterWorld) {
    const cms = this.cms;
    await goToAddStudentPage(cms);
});

When(
    'school admin fills all fields with {string} locations',
    async function (this: IMasterWorld, amount: AmountLocation) {
        const cms = this.cms;
        const context = this.scenario;

        const locationList = context.get<LocationInfoGRPC[]>(locationListAlias);

        let randomLength: number;

        switch (amount) {
            case AmountLocation.LTE_10:
                randomLength = randomInteger(1, 10);
                break;
            case AmountLocation.GT_10:
                // randomLength = randomInteger(11, locationList.length);
                randomLength = randomInteger(11, 20);
                break;
            default:
                randomLength = 0;
                break;
        }

        const locations = getRandomElementsWithLength(locationList, randomLength);

        await schoolAdminFillsAllFieldsWithLocations(cms, context, locations);
    }
);

When(
    'school admin sees first {string} selected locations display with {string} number chips',
    async function (this: IMasterWorld, amount: AmountLocation, result: string) {
        const cms = this.cms;
        const context = this.scenario;

        const studentLocations = context.get<LocationInfoGRPC[]>(studentLocationsAlias) || [];

        switch (amount) {
            case AmountLocation.LTE_10:
                await seesLocationChipsAndRemainingChip(cms, context, 0);
                break;
            case AmountLocation.GT_10: {
                const remaining = result !== 'no' ? studentLocations.length - 10 : 0;
                await seesLocationChipsAndRemainingChip(cms, context, remaining);
                break;
            }
            default:
                break;
        }
    }
);

When('school admin creates student', async function (this: IMasterWorld) {
    const cms = this.cms;
    const context = this.scenario;

    await cms.instruction(`Click on save button after fill in student`, async function () {
        await clickOnSaveButtonInParentElement(cms);
        await cms.waitingForLoadingIcon();
    });

    const studentCreatingData = context.get<StudentInformation>(studentCreatingDataAlias);

    await cms.instruction(
        `Get learner new credentials after create account successfully`,
        async function () {
            await getLearnerInformationAfterCreateStudentSuccessfully(
                cms,
                context,
                studentCreatingData
            );
        }
    );
});

When(
    'school admin fills all fields with {string} locations of {string}',
    async function (this: IMasterWorld, amount: AmountLocation, locationType: LocationType) {
        const cms = this.cms;
        const context = this.scenario;

        await schoolAdminFillsAllFieldsWithLocationType(cms, context, amount, locationType);
    }
);

When(
    'school admin sees parent location {string} and {string} children locations are selected',
    async function (
        this: IMasterWorld,
        result: LocationResult,
        childrenLocationAmount: AmountLocation
    ) {
        const cms = this.cms;
        const context = this.scenario;
        await schoolAdminSeesParentLocationAndChildrenLocation(
            cms,
            context,
            result,
            childrenLocationAmount
        );
    }
);

When(
    'school admin sees only children location display on Selected on Select Location popup',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const context = this.scenario;

        await schoolAdminSeesOnlyChildrenLocationDisplayOnPopup(cms, context);
    }
);

When(
    'school admin clicks save button on Select Location popup',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const page = cms.page!;

        await cms.instruction(
            'School admin click Save button on the Select Location Popup',
            async function () {
                const dialogTreeLocations = await page.waitForSelector(
                    studentPageSelectors.treeLocationDialog
                );
                await clickOnSaveButtonInParentElement(cms, dialogTreeLocations);
            }
        );
    }
);

Then(
    'school admin sees selected locations on student detail page',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const context = this.scenario;

        await cms.instruction(`Go to DETAIL Tab`, async function () {
            await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.DETAIL);
        });

        await schoolAdminSeesSelectedLocationsOnStudentDetail(cms, context);
    }
);
