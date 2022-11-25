import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { tableBaseRow } from 'test-suites/squads/timesheet/common/cms-selectors/common';
import { confirmDialogButtonSave } from 'test-suites/squads/timesheet/common/cms-selectors/common';
import * as LessonDetailSelectors from 'test-suites/squads/timesheet/common/cms-selectors/lesson-detail';
import * as StaffDetailSelectors from 'test-suites/squads/timesheet/common/cms-selectors/staff-detail';
import * as TimesheetDetailSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-detail';
import * as TimesheetListSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-list';
import { TimesheetStatus } from 'test-suites/squads/timesheet/common/types';
import {
    clickApproveTimesheetButton,
    clickProceedApproveTimesheetButton,
} from 'test-suites/squads/timesheet/step-definitions/approver-approves-the-timesheet-definitions';
import { clickLessonActionPanel } from 'test-suites/squads/timesheet/step-definitions/switch-state-without-reverse-definitions';

export const revertToPublishedLesson = async (cms: CMSInterface) => {
    const page = cms.page!;
    await clickLessonActionPanel(cms);
    await page.waitForTimeout(500);
    await cms.instruction('Click Revert to Published button', async () => {
        const revertToPublishedButton = page.locator(LessonDetailSelectors.revertToPublishedButton);
        await revertToPublishedButton.click();
        await page.waitForSelector(confirmDialogButtonSave);
        await page.click(confirmDialogButtonSave);
        await cms.waitForSelectorHasText(LessonDetailSelectors.lessonStatusChip, 'Published');
    });
};

export const proceedToApproveTimesheets = async (cms: CMSInterface) => {
    await cms.instruction('approve selected submitted timesheets', async () => {
        await clickApproveTimesheetButton(cms);
        await cms.page!.waitForSelector(confirmDialogButtonSave);
        await clickProceedApproveTimesheetButton(cms);
    });
};

export const assertTimesheetStatus = async (
    cms: CMSInterface,
    timesheetStatus: TimesheetStatus
) => {
    const page = cms.page!;

    const statusChip = await (
        await page.waitForSelector(TimesheetDetailSelectors.timesheetStatusChip)
    ).textContent();

    weExpect(statusChip).toEqual(timesheetStatus);
};

export const getTimesheetRowIndex = async (cms: CMSInterface, locationName: string) => {
    const page = cms.page!;
    const timesheetLocationRows = await page.$$(TimesheetListSelectors.timesheetLocation);
    const locationNames = await Promise.all(
        timesheetLocationRows.map(async (item) => await item.textContent())
    );
    const index = locationNames.findIndex((item) => item === locationName);
    return index;
};

export const assertTimesheetRowIsSelected = async (cms: CMSInterface, locationName: string) => {
    const page = cms.page!;
    const index = await getTimesheetRowIndex(cms, locationName);
    const timesheetListRows = await page.$$(tableBaseRow);
    const timesheetCheckbox = await timesheetListRows[index].waitForSelector(
        'input[type="checkbox"]'
    );
    const isRowSelected = await timesheetCheckbox.isChecked();

    weExpect(isRowSelected).toBe(true);
};

export const assertTimesheetRowIsNotSelected = async (cms: CMSInterface, locationName: string) => {
    const page = cms.page!;
    const index = await getTimesheetRowIndex(cms, locationName);
    const timesheetListRows = await page.$$(tableBaseRow);
    const timesheetCheckbox = await timesheetListRows[index].waitForSelector(
        'input[type="checkbox"]'
    );
    const isRowSelected = await timesheetCheckbox.isChecked();

    weExpect(isRowSelected).toBe(false);
};

export const goToStaffDetailPage = async (cms: CMSInterface, staff: UserProfileEntity) => {
    await cms.instruction(`Go to staff detail page of staff ${staff.name}`, async function () {
        await cms.page?.goto(`/user/staff/${staff.id}/show`);
        await cms.assertThePageTitle(staff.name);
    });
};

export const selectLocationByName = async (cms: CMSInterface, locationName: string) => {
    const page = cms.page!;
    await cms.instruction('Select location input', async function () {
        const locationInput = await page.waitForSelector(StaffDetailSelectors.locationInput);
        locationInput.click();
        await page.waitForSelector(StaffDetailSelectors.itemLocationContainer);
    });

    await cms.instruction('Select location and save', async function () {
        const locationItems = await page.$$(StaffDetailSelectors.locationLabel);
        const locationNames = await Promise.all(
            locationItems.map(async (item) => await item.textContent())
        );
        const index = locationNames.findIndex((item) => item === locationName);

        const locationItemContainers = await page.$$(StaffDetailSelectors.itemLocationContainer);
        const targetLocation = locationItemContainers[index];
        targetLocation.click();
        const saveLocationButton = page.locator(StaffDetailSelectors.saveLocationButton);
        await saveLocationButton.click();
    });
};

export const grantLocationsByParentLocationNameForStaff = async (
    cms: CMSInterface,
    staff: UserProfileEntity,
    parentLocationName: string
) => {
    const page = cms.page!;

    await goToStaffDetailPage(cms, staff);
    const editButton = await page.waitForSelector(StaffDetailSelectors.editStaffButton);
    await editButton.click();

    await cms.instruction(`Select parent location ${parentLocationName}`, async function () {
        selectLocationByName(cms, parentLocationName);
    });

    await cms.instruction('Save staff', async function () {
        await page.click(confirmDialogButtonSave);
        await cms.assertNotification('You have updated staff successfully');
    });
};
