import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { randomString } from '@legacy-step-definitions/utils';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { transportationExpensesAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import { tabLayout } from 'test-suites/squads/timesheet/common/cms-selectors/common';
import * as StaffTransportationExpenseListSelectors from 'test-suites/squads/timesheet/common/cms-selectors/staff-transportation-expense';
import {
    amountInput as amountInputSelector,
    transportationToInput as transportationToInputSelector,
    transportationFromInput as transportationFromInputSelector,
    roundTripAutocompleteInput,
    transportationExpensesRemarksInput,
    autocompleteTransportationTypeWithNth,
} from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-upsert';
import { upsertStaffTransportationExpenseEndpoint } from 'test-suites/squads/timesheet/common/endpoint';
import { StaffTransportationExpensesDataTable } from 'test-suites/squads/timesheet/common/types';

export const autocompleteLocationWithNth = (nth: number) =>
    `${getTestId('TransportationExpenseUpsertDialog__location')} >> nth =${nth}`;

export const openTransportationExpenseModal = async (cms: CMSInterface) => {
    const page = cms.page!;

    const editTransportationExpenseButton = page.locator(
        getTestId('TransportationExpenseConfigSection__buttonEdit')
    );

    await editTransportationExpenseButton.click();
    await page.waitForSelector(getTestId('DialogWithHeaderFooter__dialogTitle'));
};

export const addEmptyTransportationExpenseRow = async (cms: CMSInterface) => {
    const page = cms.page!;

    const addButton = page.locator(getTestId('TransportationExpenseUpsertDialog__buttonAdd'));
    await addButton.click();
};

export const fillInValidStaffTransportationExpenseInputs = async (
    cms: CMSInterface,
    role: AccountRoles,
    scenarioContext: ScenarioContext
) => {
    const existingTransportationExpenses =
        scenarioContext.get<StaffTransportationExpensesDataTable[] | null | undefined>(
            `${transportationExpensesAlias}-${role}`
        ) || [];
    const transportationExpenses: StaffTransportationExpensesDataTable[] = [
        ...existingTransportationExpenses,
        {
            transportationType: 'Train',
            from: 'Home-' + randomString(4),
            to: 'School-' + randomString(4),
            amount: '100',
            roundTrip: 'Yes',
            remarks: 'test',
        },
    ];
    await fillInStaffTransportationExpenseInputs(
        cms,
        transportationExpenses,
        existingTransportationExpenses.length
    );
    scenarioContext.set(`${transportationExpensesAlias}-${role}`, transportationExpenses);
};

export const fillInStaffTransportationExpenseInputs = async (
    cms: CMSInterface,
    transportationExpenses: StaffTransportationExpensesDataTable[],
    startAt = -1
) => {
    const page = cms.page!;

    for (let i = startAt >= 0 ? startAt : 0; i < transportationExpenses.length; i++) {
        await cms.instruction(
            `Select ${transportationExpenses[i].locationName || 'first'} location for row ${i}`,
            async () => {
                const location = transportationExpenses[i].locationName;
                await page?.click(autocompleteLocationWithNth(i));
                if (location) {
                    await cms.chooseOptionInAutoCompleteBoxByText(location);
                } else {
                    await cms.chooseOptionInAutoCompleteBoxByOrder(1);
                }
            }
        );
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

            const transportationFromInput = page.locator(transportationFromInputSelector).nth(i);

            await transportationFromInput.click();
            await transportationFromInput.fill(transportationFrom);
        });

        await cms.instruction('Fill in transportation to', async () => {
            const transportationTo = transportationExpenses[i].to;
            const transportationToInput = page.locator(transportationToInputSelector).nth(i);

            await transportationToInput.click();
            await transportationToInput.fill(transportationTo);
        });

        await cms.instruction('Fill in transportation amount', async () => {
            const amount = transportationExpenses[i].amount;
            const amountInput = page.locator(amountInputSelector).nth(i);

            await amountInput.click();
            await amountInput.fill(amount);
        });

        await cms.instruction('Select round trip', async () => {
            const roundTrip = transportationExpenses[i].roundTrip;
            const roundTripInput = page.locator(roundTripAutocompleteInput).nth(i);

            await roundTripInput.click();
            await cms.chooseOptionInAutoCompleteBoxByText(roundTrip);
        });

        if (transportationExpenses[i].remarks) {
            const remarks = transportationExpenses[i].remarks!;
            await cms.instruction('Fill in remarks', async () => {
                const remarksInput = page.locator(transportationExpensesRemarksInput).nth(i);

                await remarksInput.click();
                await remarksInput.fill(remarks);
            });
        }
    }
};

export const saveStaffTransportationExpenses = async (cms: CMSInterface) => {
    const page = cms.page!;

    const saveButton = page.locator(getTestId('FooterDialogConfirm__buttonSave'));
    await Promise.all([
        saveButton.click(),
        cms.waitForGRPCResponse(upsertStaffTransportationExpenseEndpoint, {
            timeout: 30000,
        }),
    ]);
    await cms.waitForSkeletonLoading();
};

export const reloadTimesheetSettingTab = async (cms: CMSInterface) => {
    await cms.page!.reload();
    await cms.selectTabButtonByText(tabLayout, 'Timesheet Settings');
    await cms.waitForSkeletonLoading();
};

export const assertStaffTransportationExpenseIsSaved = async (
    cms: CMSInterface,
    transportationExpenses: StaffTransportationExpensesDataTable[]
) => {
    const rowSelectorMap: Record<keyof StaffTransportationExpensesDataTable, string> = {
        locationName: StaffTransportationExpenseListSelectors.location,
        transportationType: StaffTransportationExpenseListSelectors.transportationType,
        from: StaffTransportationExpenseListSelectors.transportationFrom,
        to: StaffTransportationExpenseListSelectors.transportationTo,
        amount: StaffTransportationExpenseListSelectors.amount,
        roundTrip: StaffTransportationExpenseListSelectors.roundTrip,
        remarks: StaffTransportationExpenseListSelectors.transportationExpenseRemarks,
    };
    const keys = Object.keys(rowSelectorMap);
    for (let i = 0; i < transportationExpenses.length; i++) {
        const transportationExpense = transportationExpenses[i];
        for (let k = 0; k < keys.length; k++) {
            const prop = keys[k] as keyof StaffTransportationExpensesDataTable;
            const selector = rowSelectorMap[prop];
            const textValue = transportationExpense[prop];
            if (textValue) {
                await cms.waitForSelectorHasText(selector, textValue);
            }
        }
    }
};
