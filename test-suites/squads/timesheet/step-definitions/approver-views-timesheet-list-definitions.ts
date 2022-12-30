import { buttonNextPageTable } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { CMSInterface, AccountRoles } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';

import * as TimesheetDetailSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-detail';
import * as TimesheetListSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-list';
import * as TimesheetUpsertSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-upsert';
import { assertLabelAndOrderOfColumnsOnTable } from 'test-suites/squads/timesheet/common/step-definitions/common-assertion-definitions';
import { waitForCreateTimesheetResponse } from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';
import {
    TimesheetStatus,
    HyperlinkColumns,
    HyperlinkPages,
} from 'test-suites/squads/timesheet/common/types';
import { getCountInStatusTab } from 'test-suites/squads/timesheet/common/utils';
import {
    getStaffNewLocation,
    fillGeneralInfoSection,
    openCreateTimesheetPage,
    saveTimesheet,
} from 'test-suites/squads/timesheet/step-definitions/create-timesheet-with-transportation-expense-definitions';
import { clickTimesheetActionPanel } from 'test-suites/squads/timesheet/step-definitions/view-locations-list-with-updated-confirmation-status-definitions';

type CreateTimesheetWithStatusProps = {
    cms: CMSInterface;
    role: AccountRoles;
    scenarioContext: ScenarioContext;
    numOfTimesheets: number;
    timesheetStatus: TimesheetStatus;
    useRandomLocation?: boolean;
};

export const createTimesheet = async (
    cms: CMSInterface,
    role: AccountRoles,
    scenarioContext: ScenarioContext,
    randomLocation?: boolean
) => {
    const page = cms.page!;

    await cms.instruction(`${role} select Timesheet Management in side bar`, async () => {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
    });

    await cms.instruction('Open create timesheet page', async () => {
        openCreateTimesheetPage(cms, role);
    });

    await cms.instruction('Fill in general info section', async () => {
        const staffProfile = getUserProfileFromContext(
            scenarioContext,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );
        const currentDate = new Date();
        const staffName = staffProfile?.name;

        await cms.instruction(
            `${role} fills in general info form fields for teacher`,
            async function () {
                let locationName = undefined;
                if (!randomLocation) {
                    const { name } = await getStaffNewLocation(cms);
                    locationName = name;
                }
                await fillGeneralInfoSection({
                    cms,
                    location: locationName,
                    timesheetDate: currentDate,
                    staff: staffName,
                });
            }
        );
    });

    await cms.instruction('Add other working hours', async () => {
        await cms.instruction('Click other working hours add button', async () => {
            const otherWorkingHoursAddButton = TimesheetUpsertSelectors.otherWorkingHoursAddBtn;
            await page.click(otherWorkingHoursAddButton);
        });
        await cms.instruction('select working type', async () => {
            const workingTypeInput = page.locator(
                TimesheetUpsertSelectors.workingTypeAutocompleteInput
            );

            await workingTypeInput.click();
            await cms.waitingAutocompleteLoading();
            await cms.chooseOptionInAutoCompleteBoxByOrder(1);
        });
        await cms.instruction('select start time', async () => {
            const startTimeInput = page.locator(
                TimesheetUpsertSelectors.startTimeAutocompleteInput
            );

            await startTimeInput.click();
            await cms.waitingAutocompleteLoading();
            await cms.chooseOptionInAutoCompleteBoxByText('10:00');
        });
        await cms.instruction('select end time', async () => {
            const endTimeInput = page.locator(TimesheetUpsertSelectors.endTimeAutocompleteInput);

            await endTimeInput.click();
            await cms.waitingAutocompleteLoading();
            cms.chooseOptionInAutoCompleteBoxByText('11:30');
        });
    });

    await cms.instruction('Click save button', async () => {
        await Promise.all([
            waitForCreateTimesheetResponse(cms, scenarioContext),
            saveTimesheet(cms),
        ]);
    });

    await cms.waitForSelectorHasText(TimesheetDetailSelectors.timesheetStatusChip, 'Draft');
};

export const submitTimesheet = async (cms: CMSInterface) => {
    const page = cms.page!;
    await clickTimesheetActionPanel(cms);
    await cms.instruction('click submit button', async () => {
        const submitButton = page.locator(TimesheetDetailSelectors.submitTimesheetButton);
        submitButton.click();
    });
    await cms.waitForSelectorHasText(TimesheetDetailSelectors.timesheetStatusChip, 'Submitted');
};

export const approveTimesheet = async (cms: CMSInterface) => {
    const page = cms.page!;
    await clickTimesheetActionPanel(cms);
    await cms.instruction('click approve button', async () => {
        const approveButton = page.locator(TimesheetDetailSelectors.approveTimesheetButton);

        await approveButton.click();
        await cms.waitForSelectorHasText(TimesheetDetailSelectors.timesheetStatusChip, 'Approved');
    });
    await cms.waitForSkeletonLoading();
};

export const createTimesheetsWithStatus = async ({
    cms,
    role,
    scenarioContext,
    numOfTimesheets,
    timesheetStatus,
    useRandomLocation,
}: CreateTimesheetWithStatusProps) => {
    switch (timesheetStatus) {
        case 'Draft':
            for (let i = 0; i < numOfTimesheets; i++) {
                await cms.instruction(`create ${numOfTimesheets} draft timesheet/s`, async () => {
                    await createTimesheet(cms, role, scenarioContext, useRandomLocation);
                });
            }
            break;
        case 'Submitted':
            for (let i = 0; i < numOfTimesheets; i++) {
                await cms.instruction(
                    `create and submit ${numOfTimesheets} timesheet/s`,
                    async () => {
                        await createTimesheet(cms, role, scenarioContext, useRandomLocation);
                        await submitTimesheet(cms);
                    }
                );
            }
            break;
        case 'Approved':
            for (let i = 0; i < numOfTimesheets; i++) {
                await cms.instruction(
                    `create, submit and, approve ${numOfTimesheets} timesheet/s`,
                    async () => {
                        await createTimesheet(cms, role, scenarioContext, useRandomLocation);
                        await submitTimesheet(cms);
                        await approveTimesheet(cms);
                    }
                );
            }
            break;
    }
};

export const selectTimesheetRows = async (cms: CMSInterface, numOfRows: number) => {
    const page = cms.page!;

    await cms.waitForSkeletonLoading();

    await cms.instruction(`select ${numOfRows} rows`, async () => {
        const checkBoxRows = await page.$$(TimesheetListSelectors.checkBoxTableRow);
        for (let i = 0; i < numOfRows; i++) {
            checkBoxRows[i].click();
        }
    });

    await page.waitForSelector(getTestId('CheckBoxIcon'), { timeout: 10000 });
};

export async function clickNextPageButton(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction('click on next page button', async () => {
        const nextButton = await page.waitForSelector(buttonNextPageTable);
        await nextButton.click();
    });

    await cms.waitForSkeletonLoading();
}

export const assertApproveButtonIsEnabled = async (cms: CMSInterface) => {
    const page = cms.page!;

    await cms.instruction(`see approve button is enabled`, async () => {
        const approveButton = await page.waitForSelector(TimesheetListSelectors.approveButton);
        const isEnabled = await approveButton.isEnabled();
        weExpect(isEnabled).toBeTruthy();
    });
};

export const checkNumberOfTimesheetsWithStatusCreated = async (
    cms: CMSInterface,
    role: AccountRoles,
    scenarioContext: ScenarioContext,
    numOfTimesheets: number,
    timesheetStatus: TimesheetStatus,
    statusTabSelector: string
) => {
    const page = cms.page!;
    const statusTab = await page.textContent(statusTabSelector);
    const countInStatusTab = Number(getCountInStatusTab(statusTab || ''));
    const hasTimesheetsWithStatus = countInStatusTab >= numOfTimesheets;

    if (!hasTimesheetsWithStatus) {
        const numOfTimesheetsToCreate = numOfTimesheets - countInStatusTab;
        await cms.instruction(
            `create ${numOfTimesheetsToCreate} timesheets with ${timesheetStatus} status`,
            async function (cms) {
                await createTimesheetsWithStatus({
                    cms,
                    role,
                    scenarioContext,
                    numOfTimesheets: numOfTimesheetsToCreate,
                    timesheetStatus,
                });
            }
        );

        await cms.instruction(`${role} goes to timesheet management page`, async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
            await cms.waitForSkeletonLoading();
            await cms.waitForSelectorHasText(statusTabSelector, timesheetStatus);
        });
    }
};

export const assertColumnsOnAdminTimesheetListTable = async (cms: CMSInterface) => {
    const columnLabels = [
        'Date',
        'Name',
        'Email',
        'Status',
        'Location',
        'Number of Lessons',
        'Lesson Hours',
        'Other Working Hours',
        'Transportation Expense',
    ];

    await cms.instruction(
        'See correct column label and order on timesheet list table',
        async function (cms) {
            await assertLabelAndOrderOfColumnsOnTable({
                cms,
                columnLabels,
                tableTestId: 'AdminTimesheetList__table',
            });
        }
    );
};

export const assertAndSelectHyperlinkByColumn = async (
    cms: CMSInterface,
    column: HyperlinkColumns
) => {
    const page = cms.page!;
    if (column === 'Date') {
        const timesheetDateRows = await cms.page!.$$(TimesheetListSelectors.timesheetDateLink);
        const firstTimesheetDateHyperlink = timesheetDateRows[0];
        const hrefAttribute = await firstTimesheetDateHyperlink.getAttribute('href');
        const href = hrefAttribute?.split('/');
        weExpect(href?.includes('timesheet_management')).toBeTruthy();
        weExpect(href?.includes('show')).toBeTruthy();

        await cms.instruction(`click on timesheet ${column} hyperlink`, async () => {
            const [newPage] = await Promise.all([
                page.context().waitForEvent('page'),
                firstTimesheetDateHyperlink.click(),
            ]);
            await newPage.waitForLoadState();
            await cms.instruction('see Timesheet Detail page', async () => {
                await (await newPage.waitForSelector('[aria-label="title"]')).textContent();
            });
        });
    } else {
        const staffNameRows = await cms.page!.$$(TimesheetListSelectors.timesheetStaffNameCell);
        const firstStaffNameHyperLink = staffNameRows[0];
        const hrefAttribute = await firstStaffNameHyperLink.getAttribute('href');
        const href = hrefAttribute?.split('/');
        weExpect(href?.includes('staff')).toBeTruthy();
        weExpect(href?.includes('show')).toBeTruthy();
        await cms.instruction(`click on timesheet ${column} of staff`, async () => {
            const [newPage] = await Promise.all([
                page.context().waitForEvent('page'),
                firstStaffNameHyperLink.click(),
            ]);
            await newPage.waitForLoadState();
            await cms.instruction('see Staff Detail page', async () => {
                await (await newPage.waitForSelector('[aria-label="title"]')).textContent();
            });
        });
    }
};

export const assertRedirectToPageOnNewTab = async (cms: CMSInterface, page: HyperlinkPages) => {
    if (page === 'Timesheet Detail') {
        const timesheetDateRows = await cms.page!.$$(TimesheetListSelectors.timesheetDateLink);
        const firstTimesheetDateHyperlink = timesheetDateRows[0];
        const targetAttribute = await firstTimesheetDateHyperlink.getAttribute('target');
        weExpect(targetAttribute).toEqual('_blank');
    } else {
        const staffNameRows = await cms.page!.$$(TimesheetListSelectors.timesheetStaffNameCell);
        const firstStaffNameHyperLink = staffNameRows[0];
        const targetAttribute = await firstStaffNameHyperLink.getAttribute('target');
        weExpect(targetAttribute).toEqual('_blank');
    }
};
