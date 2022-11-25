import { randomInteger, retrieveLowestLocations } from '@legacy-step-definitions/utils';

import { CMSInterface, AccountRoles } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import { remarksAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import { actionPanelTriggerButton } from 'test-suites/squads/timesheet/common/cms-selectors/common';
import * as TimesheetDetailSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-detail';
import * as TimesheetUpsertSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-upsert';
import { autocompleteTransportationTypeWithNth } from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-upsert';
import {
    selectDateAndMonthInPicker,
    waitingAutocompleteLoadingWithRetry,
} from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';
import {
    OtherWorkingHoursDataTable,
    TransportationExpensesDataTable,
    TimesheetInfo,
} from 'test-suites/squads/timesheet/common/types';
import { formatLongDate } from 'test-suites/squads/timesheet/common/utils';

export const openCreateTimesheetPage = async (cms: CMSInterface, role: AccountRoles) => {
    const page = cms.page!;

    if (role === 'teacher') {
        const createButton = await page.waitForSelector(
            TimesheetUpsertSelectors.staffCreateTimesheetBtn
        );
        await createButton.click();
    } else {
        await cms.selectElementByDataTestId(actionPanelTriggerButton);
        const createButton = await page.waitForSelector(
            TimesheetUpsertSelectors.adminCreateTimesheetBtn
        );
        await createButton.click();
    }
};

export const getStaffFirstGrantedLocation = async (
    cms: CMSInterface
): Promise<{ locationId: string; locationName: string; location: LocationInfoGRPC }> => {
    const locations = await retrieveLowestLocations(cms);
    const locationsList = locations.slice(0, 5);
    const firstGrantedLocation = locationsList[locationsList.length - 1];

    return {
        locationId: firstGrantedLocation.locationId,
        locationName: firstGrantedLocation.name,
        location: firstGrantedLocation,
    };
};

export const getStaffNewLocation = async (cms: CMSInterface) => {
    const locationData = await retrieveLowestLocations(cms);
    const randomIndex = randomInteger(0, locationData.length - 1);
    return locationData[randomIndex];
};

export const selectStaff = async (cms: CMSInterface, staffName?: string) => {
    const page = cms.page!;

    const staffAutocompleteInput = page.locator(TimesheetUpsertSelectors.staffAutocompleteInput);

    await staffAutocompleteInput.click();

    if (staffName) {
        await cms.instruction(`Select staff ${staffName}`, async () => {
            await staffAutocompleteInput.fill(staffName);
            await waitingAutocompleteLoadingWithRetry(
                cms,
                TimesheetUpsertSelectors.staffAutocompleteInput
            );
            await cms.chooseOptionInAutoCompleteBoxByText(staffName);
        });
    } else {
        const randomOrder = Math.floor(Math.random() * 3 + 1);
        await cms.instruction(`Select staff at position ${randomOrder} on list`, async () => {
            await cms.chooseOptionInAutoCompleteBoxByOrder(randomOrder);
        });
    }
};

export const selectLocation = async (cms: CMSInterface, locationName?: string) => {
    const page = cms.page!;

    const locationAutocompleteInput = page.locator(
        TimesheetUpsertSelectors.locationAutocompleteInput
    );

    await locationAutocompleteInput.click();

    if (locationName) {
        await cms.instruction(`Select location ${locationName}`, async () => {
            await locationAutocompleteInput.fill(locationName);
            await cms.waitingAutocompleteLoading();
            await cms.chooseOptionInAutoCompleteBoxByText(locationName);
        });
    } else {
        const randomOrder = Math.floor(Math.random() * 3 + 1);
        await cms.instruction(`Select location at position ${randomOrder} on list`, async () => {
            await cms.chooseOptionInAutoCompleteBoxByOrder(randomOrder);
        });
    }
};

export const fillGeneralInfoSection = async ({
    cms,
    location,
    timesheetDate,
    staff,
}: {
    cms: CMSInterface;
    timesheetDate: Date;
    location?: string;
    staff?: string;
}) => {
    if (staff) {
        await cms.instruction(`Select ${staff}`, async () => {
            await selectStaff(cms, staff);
        });
    }

    await cms.instruction('Select location', async () => {
        await selectLocation(cms, location);
    });

    await cms.instruction('Open date picker and select date', async () => {
        await selectDateAndMonthInPicker(
            cms,
            timesheetDate,
            TimesheetUpsertSelectors.generalInfoDateInput
        );
    });
};

export const addOtherWorkingHours = async (
    cms: CMSInterface,
    otherWorkingHours: OtherWorkingHoursDataTable[]
) => {
    const page = cms.page!;

    for (let i = 0; i < otherWorkingHours.length; i++) {
        await cms.instruction('Click other working hours add button', async () => {
            const otherWorkingHoursAddButton = TimesheetUpsertSelectors.otherWorkingHoursAddBtn;

            await page.click(otherWorkingHoursAddButton);
        });
        await cms.instruction('Select working type', async () => {
            const workingType = otherWorkingHours[i].workingType;
            const workingTypeInput = page
                .locator(TimesheetUpsertSelectors.workingTypeAutocompleteInput)
                .nth(i);

            await workingTypeInput.click();
            await cms.chooseOptionInAutoCompleteBoxByText(workingType);
        });
        await cms.instruction('Select start time', async () => {
            const startTime = otherWorkingHours[i].startTime;
            const startTimeInput = page
                .locator(TimesheetUpsertSelectors.startTimeAutocompleteInput)
                .nth(i);

            await startTimeInput.click();
            await cms.chooseOptionInAutoCompleteBoxByText(startTime);
        });

        await cms.instruction('Select end time', async () => {
            const endTime = otherWorkingHours[i].endTime;
            const endTimeInput = page
                .locator(TimesheetUpsertSelectors.endTimeAutocompleteInput)
                .nth(i);

            await endTimeInput.click();
            cms.chooseOptionInAutoCompleteBoxByText(endTime);
        });

        if (otherWorkingHours[i].remarks) {
            await cms.instruction('Fill in remarks', async () => {
                const remarks = otherWorkingHours[i].remarks!;
                const remarksInput = page
                    .locator(TimesheetUpsertSelectors.otherWorkingHoursRemarksInput)
                    .nth(i);

                await remarksInput.click();
                await remarksInput.fill(remarks);
            });
        }
    }
};

export const addTransportationExpenses = async (
    cms: CMSInterface,
    transportationExpenses: TransportationExpensesDataTable[]
) => {
    const page = cms.page!;
    for (let i = 0; i < transportationExpenses.length; i++) {
        await cms.instruction('Click transportation expenses add button', async () => {
            const transportationExpensesAddButton =
                TimesheetUpsertSelectors.transportationExpensesAddBtn;

            await page.click(transportationExpensesAddButton);
        });

        await cms.instruction(
            `Select transportation type ${transportationExpenses[i].transportationType} for row ${i}`,
            async () => {
                const transportationType = transportationExpenses[i].transportationType;
                await page?.click(autocompleteTransportationTypeWithNth(i));
                await cms.chooseOptionInAutoCompleteBoxByText(transportationType);
            }
        );

        await cms.instruction('Fill in transportation from', async () => {
            const transportationFrom = transportationExpenses[i].from;

            const transportationFromInput = page
                .locator(TimesheetUpsertSelectors.transportationFromInput)
                .nth(i);

            await transportationFromInput.click();
            await transportationFromInput.fill(transportationFrom);
        });

        await cms.instruction('Fill in transportation to', async () => {
            const transportationTo = transportationExpenses[i].to;
            const transportationToInput = page
                .locator(TimesheetUpsertSelectors.transportationToInput)
                .nth(i);

            await transportationToInput.click();
            await transportationToInput.fill(transportationTo);
        });

        await cms.instruction('Fill in transportation amount', async () => {
            const amount = transportationExpenses[i].amount;
            const amountInput = page.locator(TimesheetUpsertSelectors.amountInput).nth(i);

            await amountInput.click();
            await amountInput.fill(amount);
        });

        await cms.instruction('Select round trip', async () => {
            const roundTrip = transportationExpenses[i].roundTrip;
            const roundTripInput = page
                .locator(TimesheetUpsertSelectors.roundTripAutocompleteInput)
                .nth(i);

            await roundTripInput.click();
            await cms.chooseOptionInAutoCompleteBoxByText(roundTrip);
        });

        if (transportationExpenses[i].remarks) {
            const remarks = transportationExpenses[i].remarks!;
            await cms.instruction('Fill in remarks', async () => {
                const remarksInput = page
                    .locator(TimesheetUpsertSelectors.transportationExpensesRemarksInput)
                    .nth(i);

                await remarksInput.click();
                await remarksInput.fill(remarks);
            });
        }
    }
};

export const fillRemarksSection = async (cms: CMSInterface, scenarioContext: ScenarioContext) => {
    const page = cms.page!;
    const remarks = 'test remarks';

    await cms.instruction('Fill in remarks', async () => {
        const timesheetRemarksTextField = page.locator(
            TimesheetUpsertSelectors.timesheetRemarksInput
        );

        await timesheetRemarksTextField.fill(remarks);
    });

    scenarioContext.set(remarksAlias, remarks);
};

export const saveTimesheet = async (cms: CMSInterface) => {
    await cms.selectAButtonByAriaLabel('Save');
};

export const assertSeeTimesheetInfoOnTimesheetDetailPage = async (
    cms: CMSInterface,
    timesheetInfo: TimesheetInfo
) => {
    const page = cms.page!;

    await cms.instruction('see correct general info', async () => {
        await cms.waitForSelectorHasText(
            TimesheetDetailSelectors.staffName,
            timesheetInfo.staffName
        );
        await cms.waitForSelectorHasText(
            TimesheetDetailSelectors.staffEmail,
            timesheetInfo.staffEmail
        );
        await cms.waitForSelectorHasText(
            TimesheetDetailSelectors.locationName,
            timesheetInfo.locationName
        );
        await cms.waitForSelectorHasText(
            TimesheetDetailSelectors.generalInfoDate,
            formatLongDate(timesheetInfo.date)
        );
    });

    await cms.instruction('see correct other working hours', async () => {
        const otherWorkingHours = timesheetInfo.otherWorkingHours;
        const otherWorkingHoursTableRows = await page.$$(
            TimesheetDetailSelectors.otherWorkingHoursTableBaseRow
        );

        for (let i = 0; i < otherWorkingHoursTableRows.length; i++) {
            const startTime = otherWorkingHours[i].startTime;
            const endTime = otherWorkingHours[i].endTime;

            await cms.waitForSelectorHasText(
                TimesheetDetailSelectors.workingType,
                otherWorkingHours[i].workingType
            );

            await cms.waitForSelectorHasText(
                TimesheetDetailSelectors.timeRange,
                `${startTime} - ${endTime}`
            );

            if (otherWorkingHours[i].remarks) {
                await cms.waitForSelectorHasText(
                    TimesheetDetailSelectors.otherWorkingHourRemarks,
                    otherWorkingHours[i].remarks!
                );
            }
        }
    });

    await cms.instruction('see correct transportation expenses', async () => {
        const transportationExpenses = timesheetInfo.transportationExpenses;
        const transportationExpensesTableRows = await page.$$(
            TimesheetDetailSelectors.transportationExpensesTableBaseRow
        );

        for (let i = 0; i < transportationExpensesTableRows.length; i++) {
            await cms.waitForSelectorHasText(
                TimesheetDetailSelectors.transportationType,
                transportationExpenses[i].transportationType
            );

            await cms.waitForSelectorHasText(
                TimesheetDetailSelectors.transportationFrom,
                transportationExpenses[i].from
            );

            await cms.waitForSelectorHasText(
                TimesheetDetailSelectors.transportationTo,
                transportationExpenses[i].to
            );

            await cms.waitForSelectorHasText(
                TimesheetDetailSelectors.roundTrip,
                transportationExpenses[i].roundTrip
            );

            await cms.waitForSelectorHasText(
                TimesheetDetailSelectors.amount,
                transportationExpenses[i].amount
            );

            if (transportationExpenses[i].remarks) {
                await cms.waitForSelectorHasText(
                    TimesheetDetailSelectors.transportationExpenseRemarks,
                    transportationExpenses[i].remarks!
                );
            }
        }
    });

    await cms.instruction('see correct remarks', async () => {
        const remarksSelector = TimesheetDetailSelectors.remarks;

        await cms.waitForSelectorHasText(remarksSelector, timesheetInfo.remarks);
    });
};
