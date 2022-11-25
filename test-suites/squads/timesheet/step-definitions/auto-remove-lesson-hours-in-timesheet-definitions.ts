import { schoolAdminApplyFilterAdvanced } from '@legacy-step-definitions/cms-common-definitions';
import {
    applyFilterAdvancedButton,
    openFilterAdvancedPopupButton,
    snackbarContent,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    checkBoxOfTableRowStudentSubscriptionsV2,
    DialogAddStudentInfo,
    openUpsertLessonDialog,
    tableAddStudentSubscriptionAddButtonV2,
} from '@legacy-step-definitions/cms-selectors/lesson-management';
import { deleteLessonOfLessonManagement } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { ActionOptions, LocationInfoGRPC } from '@supports/types/cms-types';

import {
    endTimeInputV3,
    lessonAutocompleteLowestLevelLocations,
    lessonUpsertStudentAttendanceStatusInput,
    locationsLowestLevelAutocomplete,
    startTimeInputV3,
    teacherAutocompleteInputV3,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { openEditingLessonPage } from 'test-suites/squads/lesson/step-definitions/lesson-can-edit-teaching-medium-of-one-time-group-lesson-definitions';
import { openDialogAddStudentSubscriptionV2 } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import { triggerSubmitLesson } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { selectCenterByNameV3, selectTeacher } from 'test-suites/squads/lesson/utils/lesson-upsert';
import {
    aliasLocationName,
    deletedLessonIdsAlias,
    todayTimesheetIdAlias,
    todayTimesheetLessonHourIdsAlias,
} from 'test-suites/squads/timesheet/common/alias-keys';
import {
    confirmDialogButtonSave,
    radioDisableInput,
    radioEnableInput,
    tabLayout,
    withNth,
} from 'test-suites/squads/timesheet/common/cms-selectors/common';
import { buttonSaveLessonAsDraft } from 'test-suites/squads/timesheet/common/cms-selectors/others';
import {
    lessonHoursTimeRange,
    numberOfLessons,
    staffNumberOfLessons,
    staffTimesheetDateLink,
    staffTimesheetLocation,
    timesheetLocation,
} from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-list';
import { waitingAutocompleteLoadingWithRetry } from 'test-suites/squads/timesheet/common/step-definitions/timesheet-common-definitions';
import {
    searchTimesheetByStaffName,
    selectTimesheetDateFilter,
} from 'test-suites/squads/timesheet/step-definitions/apply-status-filter-name-search-and-date-filter-definitions';
import { submitTimesheet } from 'test-suites/squads/timesheet/step-definitions/approver-views-timesheet-list-definitions';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export async function goToLessonManagement(cms: CMSInterface) {
    await cms.instruction('Go to lesson management page', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    });
    await cms.waitForSkeletonLoading();
}

export async function enableAutoCreateForStaff(cms: CMSInterface, staff: UserProfileEntity) {
    await cms.instruction('School admin enables auto create for staff', async function () {
        await goToAutoCreateSettingTabForStaff(cms, staff);
        await selectRadioButton(cms, true);
    });
    await cms.waitForSkeletonLoading();
}

export async function disableAutoCreateForStaff(cms: CMSInterface, staff: UserProfileEntity) {
    await cms.instruction('School admin disables auto create for staff', async function () {
        await goToAutoCreateSettingTabForStaff(cms, staff);
        await selectRadioButton(cms, false);
    });
    await cms.waitForSkeletonLoading();
}

async function selectRadioButton(cms: CMSInterface, enable: boolean) {
    const page = cms.page!;
    const selector = enable ? radioEnableInput : radioDisableInput;
    const input = await page.waitForSelector(selector);
    const checked = await input.isChecked();
    if (!checked) {
        await cms.instruction(
            `School admin click the ${enable ? 'enable' : 'disable'} radio button`,
            async function () {
                await input.click();
                await page.click(confirmDialogButtonSave);
            }
        );
    }
}

export async function goToAutoCreateSettingTabForStaff(
    cms: CMSInterface,
    staff: UserProfileEntity
) {
    await cms.instruction(
        `School admin goes to the Auto-create setting tab for staff ${staff.name}`,
        async function () {
            await cms.page?.goto(`/user/staff/${staff.id}/show`);
            await cms.selectTabButtonByText(tabLayout, 'Timesheet Settings');
        }
    );
}

export async function createStudentForLocation(cms: CMSInterface, location: LocationInfoGRPC) {
    const result = await createARandomStudentGRPC(cms, {
        locations: [location],
        studentPackageProfileLength: 1,
    });

    await cms.attach(`Created student for location ${location.name}: `, JSON.stringify(result));
}

export async function createAndPublish3LessonsForToday(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const staff = scenarioContext.get<UserProfileEntity>(
        staffProfileAliasWithAccountRoleSuffix('teacher')
    );
    const locationName = scenarioContext.get(aliasLocationName);
    const teacherName = staff.name;
    for (let i = 0; i < 3; i++) {
        await createOneSimpleLesson(cms, {
            teacherName,
            locationName,
        });
    }
}

export async function createOneSimpleLesson(
    cms: CMSInterface,
    params: {
        teacherName: string;
        locationName: string;
    }
) {
    await goToLessonManagement(cms);
    await cms.instruction(
        `Create a lesson for teacher ${params.teacherName} in location ${params.locationName}`,
        async function () {
            await openCreateLessonDialog(cms);
            await changeTimeLesson(cms, '23:58', '23:59');
            await selectCenterByNameV3(cms, params.locationName);
            await searchTeacher(cms, params.teacherName);
            await selectTeacher(cms, params.teacherName);
            await addStudentFromOneLocationToLesson(cms, params.locationName);

            await cms.instruction(
                `School admin publishes lesson of lesson management`,
                async function () {
                    await triggerSubmitLesson(cms);
                }
            );
        }
    );
}

export async function searchTeacher(cms: CMSInterface, teacherName: string) {
    const page = cms.page!;
    const teacherInput = await page.waitForSelector(teacherAutocompleteInputV3);

    await cms.instruction(`Search teacher ${teacherName}`, async function () {
        await teacherInput.click();
        await teacherInput.fill(teacherName);
        await waitingAutocompleteLoadingWithRetry(cms, teacherAutocompleteInputV3);
    });
}

export async function requestorSeesTodayTimesheetDetailPage(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    await cms.instruction(`Requestor goes to timesheet management page`, async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
    });

    const today = new Date();
    const locationName = scenarioContext.get(aliasLocationName);
    await selectTimesheetDateFilter(cms, scenarioContext, today, today, 'teacher');
    await cms.waitForSkeletonLoading();
    await cms.instruction(`Requestor see today's timesheet`, async function () {
        const timesheetDateRows = await cms.page!.$$(staffTimesheetDateLink);
        const timesheetLocationRows = await cms.page!.$$(staffTimesheetLocation);
        const locationNames = await Promise.all(
            timesheetLocationRows.map(async (item) => await item.textContent())
        );
        // We need to find the right timesheet for current location
        const index = locationNames.findIndex((item) => item === locationName);
        const timesheetDetailLink = await timesheetDateRows[index].getAttribute('href');
        const timesheetId = getTimesheetIdFromTimesheetDateLink(timesheetDetailLink!);
        scenarioContext.set(todayTimesheetIdAlias, timesheetId);
    });
}

export async function openCreateLessonDialog(cms: CMSInterface) {
    await cms.selectElementByDataTestId(openUpsertLessonDialog);
}

export function getTimesheetIdFromTimesheetDateLink(href: string) {
    const hrefSplit = href?.split('/');
    return hrefSplit[hrefSplit.length - 2];
}

function getLessonIdFromLessonHourLink(href: string) {
    const hrefSplit = href?.split('/');
    return hrefSplit[hrefSplit.length - 2];
}

export async function changeTimeLesson(cms: CMSInterface, startTime: string, endTime: string) {
    await changeStartTimeLesson(cms, startTime);
    await changeEndTimeLesson(cms, endTime);
}

export async function changeStartTimeLesson(cms: CMSInterface, startTime: string) {
    const page = cms.page!;
    await page.click(startTimeInputV3);
    await cms.page?.fill(startTimeInputV3, startTime);
    await cms.waitingAutocompleteLoading();
    await cms.chooseOptionInAutoCompleteBoxByText(startTime);
}

export async function changeEndTimeLesson(cms: CMSInterface, endTime: string) {
    const page = cms.page!;
    await page.click(endTimeInputV3);
    await cms.page?.fill(endTimeInputV3, endTime);
    await cms.waitingAutocompleteLoading();
    await cms.chooseOptionInAutoCompleteBoxByText(endTime);
}

export async function schoolAdminDeletes2Of3CreatedLessons(
    cms: CMSInterface,
    scenario: ScenarioContext
) {
    const timesheetId = scenario.get(todayTimesheetIdAlias);
    await goToTimesheetDetail(cms, timesheetId);
    await userSeesLessonHoursInTodayTimesheet(cms, scenario);
    const lessonIds = scenario.get<string[]>(todayTimesheetLessonHourIdsAlias);
    const lessonIdsToBeDeleted = lessonIds.slice(0, 2);
    await deletesLessons(cms, lessonIdsToBeDeleted);
    scenario.set(deletedLessonIdsAlias, lessonIdsToBeDeleted);
}

export async function schoolAdminChangeAllLessonStatusToCompleted(
    cms: CMSInterface,
    scenario: ScenarioContext
) {
    const timesheetId = scenario.get(todayTimesheetIdAlias);
    await changeAllLessonStatusOfTimesheetToCompleted(cms, scenario, timesheetId);
}

export async function changeAllLessonStatusOfTimesheetToCompleted(
    cms: CMSInterface,
    scenario: ScenarioContext,
    timesheetId: string
) {
    await goToTimesheetDetail(cms, timesheetId);
    await userSeesLessonHoursInTodayTimesheet(cms, scenario);
    const lessonIds = scenario.get<string[]>(todayTimesheetLessonHourIdsAlias);
    await completeLessons(cms, lessonIds);
}

export async function goToTimesheetDetail(cms: CMSInterface, timesheetId: string) {
    cms.instruction('Go to Timesheet detail page', async function () {
        await cms.page?.goto(`/timesheet/timesheet_management/${timesheetId}/show`);
        await cms.waitingForProgressBar();
        await cms.waitForSkeletonLoading();
    });
}

export async function submitTodayTimesheet(cms: CMSInterface, scenario: ScenarioContext) {
    const timesheetId = scenario.get(todayTimesheetIdAlias);
    await goToTimesheetDetail(cms, timesheetId);
    await submitTimesheet(cms);
}

export async function goToLessonDetail(cms: CMSInterface, lessonId: string) {
    cms.instruction('Go to Lesson detail page', async function () {
        await cms.page?.goto(`/lesson/lesson_management/${lessonId}/show`);
        await cms.waitForSkeletonLoading();
    });
}

export async function deletesLessons(cms: CMSInterface, lessonIds: string[]) {
    await cms.instruction(`Delete Lessons ${lessonIds}`, async function () {
        for (const id of lessonIds) {
            await goToLessonDetail(cms, id);
            await deleteLessonOfLessonManagement(cms, 'confirm');
            await cms.page?.waitForSelector(snackbarContent);
        }
    });
}

export async function changeLessonsToDraft(cms: CMSInterface, lessonIds: string[]) {
    await cms.instruction(`Delete Lessons ${lessonIds}`, async function () {
        for (const id of lessonIds) {
            await goToLessonDetail(cms, id);
            await changeLessonToDraft(cms);
            await cms.page?.waitForSelector(snackbarContent);
        }
    });
}

export async function changeLessonToDraft(cms: CMSInterface) {
    await openEditingLessonPage(cms);
    await cms.page!.click(buttonSaveLessonAsDraft);
}

export async function completeLessons(cms: CMSInterface, lessonIds: string[]) {
    for (const id of lessonIds) {
        await goToLessonDetail(cms, id);
        await cms.instruction('Complete a lesson', async function () {
            await cms.selectActionButton(ActionOptions.COMPLETE_LESSON, {
                target: 'actionPanelTrigger',
            });

            await cms.confirmDialogAction();
        });
        await cms.page?.waitForSelector(snackbarContent);
    }
}

export async function userSeesLessonHoursInTodayTimesheet(
    cms: CMSInterface,
    scenario: ScenarioContext
) {
    await cms.instruction(`User sees Lesson Hours in today's timesheet`, async function () {
        await cms.page?.waitForSelector(lessonHoursTimeRange);
        const lessonHoursTimeRangeRows = await cms.page!.$$(lessonHoursTimeRange);
        const lessonLinks = await Promise.all(
            lessonHoursTimeRangeRows.map(async (item) => await item.getAttribute('href'))
        );
        const lessonIds = lessonLinks.map((item) => getLessonIdFromLessonHourLink(item!));
        scenario.set(todayTimesheetLessonHourIdsAlias, lessonIds);
    });
}

export async function assertTodayTimesheetHasOnly1LessonOnDetailPage(
    cms: CMSInterface,
    scenario: ScenarioContext
) {
    const timesheetId = scenario.get(todayTimesheetIdAlias);
    await goToTimesheetDetail(cms, timesheetId);
    await cms.instruction(
        `Assert today's timesheet has only 1 lesson on the Timesheet detail page`,
        async function () {
            await cms.page!.waitForSelector(lessonHoursTimeRange);
            const lessonHoursTimeRangeRows = await cms.page!.$$(lessonHoursTimeRange);
            weExpect(lessonHoursTimeRangeRows.length).toBe(1);
        }
    );
}

export async function assertTodayTimesheetHasOnly1LessonOnTimesheetManagementPage(
    cms: CMSInterface,
    scenario: ScenarioContext,
    role: AccountRoles
) {
    await cms.page!.reload();
    await cms.waitingForProgressBar();
    await cms.instruction(`${role} goes to timesheet management page`, async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
    });

    const today = new Date();
    const locationName = scenario.get(aliasLocationName);
    if (role === 'school admin') {
        const staff = scenario.get<UserProfileEntity>(
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );
        await searchTimesheetByStaffName(cms, scenario, staff.name);
    }
    await selectTimesheetDateFilter(cms, scenario, today, today, role);
    await cms.waitForSkeletonLoading();

    await cms.instruction(
        `Assert today timesheet has only 1 lesson on Timesheet management page`,
        async function () {
            const numberOfLessonRows = await cms.page!.$$(
                role === 'school admin' ? numberOfLessons : staffNumberOfLessons
            );
            const timesheetLocationRows = await cms.page!.$$(
                role === 'school admin' ? timesheetLocation : staffTimesheetLocation
            );
            const locationNames = await Promise.all(
                timesheetLocationRows.map(async (item) => await item.textContent())
            );
            // We need to find the right timesheet for current location
            const index = locationNames.findIndex((item) => item === locationName);
            const numberOfLesson = await numberOfLessonRows[index].textContent();
            weExpect(numberOfLesson).toBe('1');
        }
    );
}

export async function addStudentFromOneLocationToLesson(cms: CMSInterface, locationName: string) {
    const page = cms.page!;
    await openDialogAddStudentSubscriptionV2(cms);
    await page.click(withNth(openFilterAdvancedPopupButton, 1));
    await cms.instruction(`Filter center with ${locationName}`, async function () {
        await page.waitForSelector(DialogAddStudentInfo);
        await page.click(locationsLowestLevelAutocomplete);
        await page.fill(withNth(lessonAutocompleteLowestLevelLocations, 1), locationName);
    });
    await cms.instruction(`Choose student with ${locationName}`, async function () {
        await cms.waitingAutocompleteLoading();
        await cms.chooseOptionInAutoCompleteBoxByOrder(1);
    });
    await page.keyboard.press('Escape');
    await page.waitForSelector(applyFilterAdvancedButton);
    await schoolAdminApplyFilterAdvanced(cms);
    await cms.waitForSkeletonLoading();
    await page.keyboard.press('Escape');
    await cms.instruction('Select student subscription', async function () {
        await page.click(checkBoxOfTableRowStudentSubscriptionsV2, { timeout: 5000 });
    });

    await cms.instruction('Add student subscription', async function () {
        await page.click(tableAddStudentSubscriptionAddButtonV2);
    });

    await cms.instruction(`Choose attendance status`, async function () {
        await page.click(lessonUpsertStudentAttendanceStatusInput);
        await cms.chooseOptionInAutoCompleteBoxByText('Attend');
    });
}
