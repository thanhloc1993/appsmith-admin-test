import { getButtonSelectorByAction } from '@legacy-step-definitions/cms-selectors/cms-keys';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ActionOptions, StudentDetailTab } from '@supports/types/cms-types';

import { StatusTypes } from './entry-exit-add-entry-exit-record-definitions';
import { createExistingRecordForStudent } from './entry-exit-records-list-definitions';
import {
    changeTimePicker,
    checkIfWithExitTime,
    getCorrectDateForEntryExit,
    getHourForTimePicker,
    getMeridiemForTimePicker,
} from './entry-exit-utils';
import { schoolAdminChooseTabInStudentDetail } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';
import { findNewlyCreatedLearnerOnCMSStudentsPage } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { clickOnStudentOnStudentsTab } from 'test-suites/squads/user-management/step-definitions/user-view-student-details-definitions';

export async function editEntryExitRecordWithExitTimeEarlierThanEntryTime(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction(
        `Click edit in action panel trigger to open edit dialog box`,
        async function () {
            const entryExitTable = await page.waitForSelector(
                studentPageSelectors.entryExitRecordsTable,
                {
                    timeout: 5000,
                }
            );
            const entryExitRecordMenuTrigger = await entryExitTable.waitForSelector(
                studentPageSelectors.entryExitRecordActionPanelTrigger,
                {
                    timeout: 5000,
                }
            );

            await entryExitRecordMenuTrigger!.click();

            await cms.selectAButtonByAriaLabel('Edit');
        }
    );

    const currentDate = new Date();
    const correctDate = new Date(getCorrectDateForEntryExit(currentDate));

    const currentHour = correctDate.getHours();
    const entryHour = getHourForTimePicker(currentHour);
    const entryMeridiem = getMeridiemForTimePicker(entryHour);

    await cms.instruction(
        `Edit out with invalid data -- entry time ${entryHour}:05, and exit time ${entryHour}:00, and attempt to save the record`,
        async function (this: CMSInterface) {
            await changeTimePicker({
                cms,
                timePickerSelector: studentPageSelectors.entryTimePicker,
                meridiem: entryMeridiem,
                hour: entryHour <= 12 ? `${entryHour}` : `${entryHour - 12}`,
                minute: '05',
            });

            await changeTimePicker({
                cms,
                timePickerSelector: studentPageSelectors.exitTimePicker,
                meridiem: entryMeridiem,
                hour: entryHour <= 12 ? `${entryHour}` : `${entryHour - 12}`,
                minute: '00',
            });

            await page?.click(studentPageSelectors.notifyParentsCheckbox);

            await cms.selectAButtonByAriaLabel('Save');
        }
    );
}

export async function attemptEditOrDeleteEntryExitRecord(cms: CMSInterface) {
    const page = cms.page!;

    await cms.instruction(`Click action panel trigger to open actions`, async function () {
        const entryExitTable = await page.waitForSelector(
            studentPageSelectors.entryExitRecordsTable
        );
        const entryExitRecordMenuTrigger = await entryExitTable.waitForSelector(
            studentPageSelectors.entryExitRecordActionPanelTrigger,
            {
                timeout: 5000,
            }
        );
        await entryExitRecordMenuTrigger!.click();
    });
}

export async function editStudentEnrollmentStatusOnCMS(cms: CMSInterface, status: string) {
    const page = cms.page!;

    await cms.instruction(`Open dialog box`, async function () {
        const editStudentButton = await page.waitForSelector(
            studentPageSelectors.editStudentButton
        );
        await editStudentButton.click();
    });

    await cms.instruction(`Type and select ${status} in dropdown`, async function () {
        const enrollmentStatusDropdown = await page.waitForSelector(
            studentPageSelectors.muiComponentSelectEnrollmentStatus
        );
        await enrollmentStatusDropdown.click();
        await page.fill(studentPageSelectors.muiComponentSelectEnrollmentStatus, status);
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
    });

    await cms.selectAButtonByAriaLabel('Save');
}

export async function createExistingRecordForQuitStudent(
    cms: CMSInterface,
    learnerProfile: UserProfileEntity,
    origEnrollmentStatus: StatusTypes
) {
    await cms.instruction(`Go to student management page`, async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    });

    await cms.waitForSkeletonLoading();

    await cms.instruction(`Find student ${learnerProfile.name} on student list`, async function () {
        await findNewlyCreatedLearnerOnCMSStudentsPage(cms, learnerProfile);
    });

    // Go to Student Detail
    await cms.instruction(
        `Click student ${learnerProfile.name} on student list`,
        async function () {
            await clickOnStudentOnStudentsTab(cms, learnerProfile);
        }
    );

    await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.DETAIL);

    const currentDate = new Date();
    const correctDate = getCorrectDateForEntryExit(currentDate);

    await cms.instruction(`School admin creates a record`, async function () {
        await createExistingRecordForStudent(
            cms,
            learnerProfile,
            correctDate,
            checkIfWithExitTime(correctDate)
        );
    });

    await cms.instruction(
        `Revert to student enrollment status to ${origEnrollmentStatus}`,
        async function () {
            await editStudentEnrollmentStatusOnCMS(cms, origEnrollmentStatus);
            await cms.waitingForLoadingIcon();
        }
    );
}

export async function schoolAdminSeesDisabledEditEntryExitRecord(cms: CMSInterface) {
    const cmsPage = cms.page!;
    const editButtonSelector = getButtonSelectorByAction(ActionOptions.EDIT);
    const isDisabled = await cmsPage.getAttribute(editButtonSelector, 'aria-disabled');
    weExpect(isDisabled).toEqual('true');
}
