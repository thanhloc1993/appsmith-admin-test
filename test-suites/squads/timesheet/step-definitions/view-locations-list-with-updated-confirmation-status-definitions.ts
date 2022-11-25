import {
    createLocationType,
    createParentLocation,
} from '@legacy-step-definitions/payment-common-definitions';
import { createLocationData } from '@legacy-step-definitions/payment-utils';
import { getRandomNumber, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { MasterCategory, Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import bobImportService from '@supports/services/bob-import-service';
import { ImportLocationData } from '@supports/services/bob-import-service/types';

import { shuffle } from 'lodash';
import { getTestId } from 'step-definitions/cms-selectors/cms-keys';
import {
    locationNameAlias,
    recentlyConfirmedLocationsAlias,
    staffProfileAlias,
    timesheetDateAlias,
    timesheetLocationsMapAlias,
} from 'test-suites/squads/timesheet/common/alias-keys';
import {
    actionPanelTriggerButton,
    confirmDialogButtonSave,
    tableBaseRow,
} from 'test-suites/squads/timesheet/common/cms-selectors/common';
import {
    locationConfirmationStatusCell,
    locationConfirmButton,
} from 'test-suites/squads/timesheet/common/cms-selectors/locations-list';
import { timesheetStatusChip } from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-detail';
import { waitForCreateTimesheetResponse } from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';
import {
    ConfirmationStatus,
    LocationData,
    TimesheetStatus,
} from 'test-suites/squads/timesheet/common/types';
import {
    addOtherWorkingHours,
    addTransportationExpenses,
    fillGeneralInfoSection,
    openCreateTimesheetPage,
    saveTimesheet,
} from 'test-suites/squads/timesheet/step-definitions/create-timesheet-with-transportation-expense-definitions';
import { updateLocation } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export const createNewLocationWithPrefix = async (
    cms: CMSInterface,
    prefix: string
): Promise<ImportLocationData> => {
    const token = await cms.getToken();

    const { locationTypeName, parentLocationTypeName } = await createLocationType(cms);
    const randomNumber = getRandomNumber();
    // Import the parent location of E2E to keep E2E centers consistent in every runs
    await createParentLocation(cms, parentLocationTypeName!);

    const importLocationData = {
        ...createLocationData(locationTypeName, parentLocationTypeName!),
        name: `${prefix}${locationTypeName} E2E ${randomNumber}`,
    };

    await bobImportService.importBobData(token, MasterCategory.Location, importLocationData);

    return importLocationData;
};

export const archiveLocations = async (cms: CMSInterface, locations: LocationData[]) => {
    return Promise.all(
        locations.map(async (location) => {
            const newData: Omit<LocationData, 'location_id'> & { location_id?: string } = {
                ...location,
                is_archived: true,
            };
            delete newData.location_id;
            await updateLocation(cms, newData);
        })
    );
};

export const getLocationsWithNoTimesheets = (
    locationsList: LocationData[],
    // a map with location id as key and a list of timesheet ids for the value
    timesheetLocationsMap: Record<string, string[]>,
    numLocations: number
) => {
    const availableLocations: Pick<LocationData, 'location_id' | 'name'>[] = [];
    locationsList.forEach(({ location_id, name }) => {
        const timesheetsForLocation = timesheetLocationsMap[location_id];
        if (
            (timesheetsForLocation && timesheetsForLocation.length > 0) ||
            availableLocations.length >= numLocations
        )
            return;
        availableLocations.push({
            location_id,
            name,
        });
    });

    return availableLocations;
};

export const createTimesheetsForMultipleLocationsWithStatus = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    role: AccountRoles,
    locationsList: LocationData[],
    timesheetStatus: TimesheetStatus,
    numTimesheets: number,
    numLocations: number
) => {
    const page = cms.page!;
    let timesheetLocationsMap: Record<string, string[]> = {};
    if (!scenario.has(timesheetLocationsMapAlias)) {
        scenario.set(timesheetLocationsMapAlias, {});
    } else {
        timesheetLocationsMap = scenario.get(timesheetLocationsMapAlias);
    }

    const availableLocations = getLocationsWithNoTimesheets(
        shuffle(locationsList),
        timesheetLocationsMap,
        numLocations
    );
    for (let k = 0; k < availableLocations.length; k++) {
        const { location_id, name } = availableLocations[k];
        for (let i = 0; i < numTimesheets; i++) {
            await createTimesheetForLocationWithStatus(cms, scenario, role, name, timesheetStatus);
        }
        if (!timesheetLocationsMap[location_id]) {
            timesheetLocationsMap[location_id] = [];
        }
        const url = new URL(page.url());
        const timesheetId = url.pathname.split('/')[3];
        timesheetLocationsMap[location_id].push(timesheetId);
    }
    scenario.set(timesheetLocationsMapAlias, timesheetLocationsMap);
};

export const searchLocationOnConfirmerTable = async (cms: CMSInterface, locationName: string) => {
    const page = cms.page!;

    const searchFilterInput = page.locator(`${getTestId('FormFilterAdvanced__textField')} input`);

    await cms.waitForSkeletonLoading();

    await searchFilterInput.click();
    await searchFilterInput.fill(locationName);
    await page.keyboard.press('Enter');

    await cms.waitForSkeletonLoading();
};

export const assertLocationRowWithConfirmationStatus = async (
    cms: CMSInterface,
    locationId: string,
    status: ConfirmationStatus
) => {
    await cms.waitForSelectorHasText(
        `tr[data-value="${locationId}"] ${locationConfirmationStatusCell}`,
        status
    );
};

export const assertRecentlyConfirmedLocationsStatus = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    status: ConfirmationStatus
) => {
    const locationIds = scenario.get<string[]>(recentlyConfirmedLocationsAlias);

    for (let i = 0; i < locationIds.length; i++) {
        const locationId = locationIds[i];

        await assertLocationRowWithConfirmationStatus(cms, locationId, status);
    }
};

export const assertLocationRowsStatusCount = async (
    cms: CMSInterface,
    status: ConfirmationStatus,
    expectedCount: number
) => {
    const page = cms.page!;

    const rows = await page.locator(locationConfirmationStatusCell).elementHandles();
    let currentCount = 0;

    for (let i = 0; i < rows.length; i++) {
        const rowStatus = await rows[i].textContent();

        if (rowStatus === status) currentCount++;
    }

    weExpect(currentCount, `Expect row count with ${status} status to be ${expectedCount}`).toBe(
        expectedCount
    );
};

export const assertLocationStatusSortedToTop = async (
    cms: CMSInterface,
    status: ConfirmationStatus
) => {
    const page = cms.page!;

    const rows = await page.locator(locationConfirmationStatusCell).elementHandles();

    const rowStatuses = [];

    for (let i = 0; i < rows.length; i++) {
        const rowStatus = await rows[i].textContent();
        rowStatuses.push(rowStatus);
    }
    const sortedRows = status === 'Confirmed' ? rowStatuses.sort() : rowStatuses.sort().reverse();

    weExpect(rowStatuses, 'Expect row statuses to be ordered correctly').toEqual(sortedRows);
};

export const confirmLocationRows = async (cms: CMSInterface, scenario: ScenarioContext) => {
    const page = cms.page!;

    await cms.waitForSkeletonLoading();

    const allRows = await page.locator(`${tableBaseRow}:has(.Mui-checked)`).elementHandles();

    const recentlyConfirmedLocations: string[] = [];

    await Promise.all(
        allRows.map(async (row) => {
            const locationId = await row.getAttribute('data-value');
            if (locationId) {
                recentlyConfirmedLocations.push(locationId);
            }
        })
    );

    scenario.set(recentlyConfirmedLocationsAlias, recentlyConfirmedLocations);

    await cms.instruction('Click confirm button', async () => {
        const confirmButton = page.locator(locationConfirmButton);

        await confirmButton.click();
    });

    await cms.instruction('Click on proceed button on dialog', async () => {
        await page.waitForSelector(confirmDialogButtonSave);

        const proceedButton = page.locator(confirmDialogButtonSave);

        await proceedButton.click();
    });
};

export const clickTimesheetActionPanel = async (cms: CMSInterface) => {
    const page = cms.page!;

    const actionPanelTrigger = page.locator(actionPanelTriggerButton);
    await actionPanelTrigger.click();
};

export const createTimesheetForLocationWithStatus = async (
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    role: AccountRoles,
    locationName: string,
    timesheetStatus: TimesheetStatus
) => {
    const page = cms.page!;
    await cms.instruction('Navigate to timesheet management page', async () => {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
    });

    await cms.instruction('Open create timesheet page', async () => {
        await openCreateTimesheetPage(cms, role);
    });

    await cms.instruction('Fill in general info section for timesheet', async () => {
        const staffProfile = getUserProfileFromContext(
            scenarioContext,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );
        const currentDate = new Date();
        const staffName = staffProfile.name;

        await cms.instruction(
            `${role} fills in general info form fields for teacher`,
            async function () {
                await fillGeneralInfoSection({
                    cms,
                    location: locationName,
                    timesheetDate: currentDate,
                    staff: staffName,
                });

                scenarioContext.set(locationNameAlias, locationName);
                scenarioContext.set(timesheetDateAlias, currentDate);
                scenarioContext.set(staffProfileAlias, staffProfile);
            }
        );
    });

    await cms.instruction('Fill other working hours', async () => {
        await addOtherWorkingHours(cms, [
            {
                workingType: 'Office',
                startTime: '00:00',
                endTime: '00:45',
                remarks: 'test',
            },
        ]);
    });

    await cms.instruction('Fill in transportation expense section', async () => {
        await addTransportationExpenses(cms, [
            {
                transportationType: 'Train',
                from: 'Home',
                to: 'School',
                amount: '100',
                roundTrip: 'Yes',
                remarks: 'test',
            },
        ]);
    });

    await cms.instruction('Save timesheet', async () => {
        await saveTimesheet(cms);
        await waitForCreateTimesheetResponse(cms, scenarioContext);
        await cms.waitForSkeletonLoading();
    });

    if (timesheetStatus === 'Approved' || timesheetStatus === 'Submitted') {
        await cms.instruction('Submit timesheet', async () => {
            await clickTimesheetActionPanel(cms);

            const submitTimesheetButton = page.locator(
                `${getTestId('ActionPanel__menuList')} [aria-label="Submit"]`
            );

            await submitTimesheetButton.click();
            await cms.waitForSelectorHasText(timesheetStatusChip, 'Submitted');
        });

        if (timesheetStatus === 'Approved') {
            await clickTimesheetActionPanel(cms);

            const approveTimesheetButton = page.locator(
                `${getTestId('ActionPanel__menuList')} [aria-label="Approve"]`
            );

            await approveTimesheetButton.click();
            await cms.waitForSelectorHasText(timesheetStatusChip, 'Approved');
        }
    }
};

export const selectAllOnTable = async (cms: CMSInterface, selector: string) => {
    const page = cms.page!;
    const selectAllCb = page.locator(`table ${getTestId(selector)}`);

    await page.waitForTimeout(1500);
    await selectAllCb.click();
};
