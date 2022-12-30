import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { saveButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Response } from 'playwright';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import {
    addStudentFromOneLocationToLesson,
    openCreateLessonDialog,
    searchTeacher,
} from './auto-remove-lesson-hours-in-timesheet-definitions';
import { CreateLessonResponse } from 'manabuf/bob/v1/lessons_pb';
import {
    triggerSubmitLesson,
    waitCreateLesson,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { changeTimeLesson } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import { selectCenterByNameV3, selectTeacher } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { actionPanelTriggerButton } from 'test-suites/squads/timesheet/common/cms-selectors/common';
import * as LessonDetailSelectors from 'test-suites/squads/timesheet/common/cms-selectors/lesson-detail';
import * as TimesheetDetailSelectors from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-detail';
import { changeLessonDate } from 'test-suites/squads/timesheet/step-definitions/auto-create-not-created-by-draft-lessons-definition';
import { closeTimesheetActionsPanel } from 'test-suites/squads/timesheet/step-definitions/switch-and-reverse-states-sequentially-definitions';
import { clickTimesheetActionPanel } from 'test-suites/squads/timesheet/step-definitions/view-locations-list-with-updated-confirmation-status-definitions';

type LessonData = {
    date: Date;
    startTime: string;
    endTime: string;
    location?: string;
};

type CreatePublishedLessonProps = {
    cms: CMSInterface;
    context: ScenarioContext;
    lessonKey: string;
    lessonData: LessonData;
};

export const getTimesheetContextKey = (timesheetKey: string) => `timesheet-${timesheetKey}`;
export const getLessonContextKey = (lessonKey: string) => `lesson-${lessonKey}`;

export const getTimesheetIdFromURL = (cms: CMSInterface) => {
    const url = new URL(cms.page!.url());
    return url.pathname.split('/')[3];
};

export const cancelSubmissionTimesheet = async (cms: CMSInterface) => {
    const page = cms.page!;
    await clickTimesheetActionPanel(cms);
    await cms.instruction('click Cancel submission button', async () => {
        const cancelSubmissionButton = page.locator(
            TimesheetDetailSelectors.cancelSubmissionTimesheetButton
        );

        await cancelSubmissionButton.click();
        await cms.waitForSelectorHasText(TimesheetDetailSelectors.timesheetStatusChip, 'Draft');
    });
    await cms.waitForSkeletonLoading();
};

export const cancelApprovalTimesheet = async (cms: CMSInterface) => {
    const page = cms.page!;
    await clickTimesheetActionPanel(cms);
    await cms.instruction('click Cancel Approval button', async () => {
        const cancelApprovalButton = page.locator(
            TimesheetDetailSelectors.cancelApprovalTimesheetButton
        );

        await cancelApprovalButton.click();
        await cms.waitForSelectorHasText(TimesheetDetailSelectors.timesheetStatusChip, 'Submitted');
    });
    await cms.waitForSkeletonLoading();
};

export const assertTimesheetStateChangedCorrectly = async (
    cms: CMSInterface,
    timesheetStatus: string
) => {
    const page = cms.page!;

    const statusChip = await (
        await page.waitForSelector(TimesheetDetailSelectors.timesheetStatusChip)
    ).textContent();

    weExpect(statusChip, 'Expect Timesheet State Changed Correctly').toEqual(timesheetStatus);
};

export async function goToLessonManagement(cms: CMSInterface) {
    await cms.instruction('Go to lesson management page', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    });
    await cms.waitForSkeletonLoading();
}

export const createPublishedLesson = async ({
    cms,
    context,
    lessonKey,
    lessonData: { startTime, endTime, date, location },
}: CreatePublishedLessonProps) => {
    const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
    const locationName = location ? location : firstGrantedLocation.name;
    const staff = context.get<UserProfileEntity>(staffProfileAliasWithAccountRoleSuffix('teacher'));
    const teacherName = staff.name;

    await cms.instruction('Create publishes lesson', async () => {
        await goToLessonManagement(cms);
        await openCreateLessonDialog(cms);
        await changeTimeLesson(cms, startTime, endTime);
        await selectCenterByNameV3(cms, locationName);
        await searchTeacher(cms, teacherName);
        await selectTeacher(cms, teacherName);
        await addStudentFromOneLocationToLesson(cms, locationName);
        await changeLessonDate(cms, date);

        await cms.instruction(
            `School admin publishes lesson of lesson management`,
            async function () {
                const [createLessonResponse] = await Promise.all([
                    waitCreateLesson(cms),
                    await triggerSubmitLesson(cms),
                ]);

                const lessonId = await parseCreateLessonResponse(createLessonResponse);
                context.set(getLessonContextKey(lessonKey), lessonId);
            }
        );
    });
};

export const parseCreateLessonResponse = async (response: Response) => {
    const decoder = createGrpcMessageDecoder(CreateLessonResponse);
    const encodedResponseText = await response.text();
    const decodedResponse = decoder.decodeMessage(encodedResponseText);

    const { id: lessonId } = decodedResponse?.toObject() || { id: '' };
    return lessonId;
};

export const completeLesson = async (cms: CMSInterface) => {
    const page = cms.page!;
    await clickLessonActionPanel(cms);
    await page.waitForTimeout(500);
    await cms.instruction('click Complete lesson button', async () => {
        const completeLessonButton = page.locator(LessonDetailSelectors.completeLessonButton);
        await completeLessonButton.click();
        await page.waitForTimeout(500);
        await page.click(saveButton);
        await page.waitForTimeout(500);
        await cms.waitForSelectorHasText(LessonDetailSelectors.lessonStatusChip, 'Completed');
    });
};

export async function assertNotSeeTimesheetDetailActions(cms: CMSInterface, actionsBtn: string) {
    await clickTimesheetActionPanel(cms);
    await cms.page?.waitForTimeout(500);
    const isApproveBtnVisible = await cms.page
        ?.locator(TimesheetDetailSelectors.approveTimesheetButton)
        .count();
    const isCancelApproveBtnVisible = await cms.page
        ?.locator(TimesheetDetailSelectors.cancelApprovalTimesheetButton)
        .count();

    await cms.instruction(`does not see the ${actionsBtn} button`, async () => {
        switch (actionsBtn) {
            case 'Approve':
                weExpect(isApproveBtnVisible).toEqual(0);
                break;

            case 'Cancel Approval':
                weExpect(isCancelApproveBtnVisible).toEqual(0);
                break;
        }
    });
    await closeTimesheetActionsPanel(cms);
}

export const assertActionsButtonTimesheetIsEnabled = async (
    cms: CMSInterface,
    actionsBtn: string
) => {
    const page = cms.page!;
    await clickTimesheetActionPanel(cms);
    await cms.page?.waitForTimeout(500);
    const isDeleteButtonEnabled = await (
        await page.waitForSelector(TimesheetDetailSelectors.deleteTimesheetButton)
    ).isEnabled();

    await cms.instruction(`sees ${actionsBtn} button is enabled`, async () => {
        switch (actionsBtn) {
            case 'Delete':
                weExpect(isDeleteButtonEnabled).toEqual(true);
                break;
        }
    });
    await closeTimesheetActionsPanel(cms);
};

export const assertActionsButtonTimesheetIsDisabled = async (
    cms: CMSInterface,
    actionsBtn: string
) => {
    const page = cms.page!;
    await clickTimesheetActionPanel(cms);
    await cms.page?.waitForTimeout(500);
    const isDeleteButtonEnabled = await (
        await page.waitForSelector(TimesheetDetailSelectors.deleteTimesheetButton)
    ).isEnabled();
    const isEditButtonEnabled = await (
        await page.waitForSelector(TimesheetDetailSelectors.editTimesheetButton)
    ).isEnabled();

    await cms.instruction(`sees ${actionsBtn} button is disabled`, async () => {
        switch (actionsBtn) {
            case 'Edit':
                weExpect(isEditButtonEnabled).toEqual(false);
                break;
            case 'Delete':
                weExpect(isDeleteButtonEnabled).toEqual(false);
                break;
        }
    });
    await closeTimesheetActionsPanel(cms);
};

export const clickLessonActionPanel = async (cms: CMSInterface) => {
    const page = cms.page!;

    const actionPanelTrigger = page.locator(actionPanelTriggerButton);
    await actionPanelTrigger.click();
};
