import { retrieveLowestLocations } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { ActionOptions, LocationInfoGRPC } from '@supports/types/cms-types';

import {
    timesheetAutoDeleteTestLocationsListAlias,
    timesheetAutoDeleteTestTimesheetIdsAlias,
    todayTimesheetLessonHourIdsAlias,
} from 'test-suites/squads/timesheet/common/alias-keys';
import {
    staffTimesheetDateLink,
    staffTimesheetLocation,
    timesheetLocation,
} from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-list';
import { LocationIndex } from 'test-suites/squads/timesheet/common/types';
import { waitForEditTimesheetResponse } from 'test-suites/squads/timesheet/common/utils';
import {
    searchTimesheetByStaffName,
    selectTimesheetDateFilter,
} from 'test-suites/squads/timesheet/step-definitions/apply-status-filter-name-search-and-date-filter-definitions';
import {
    createOneSimpleLesson,
    deletesLessons,
    getTimesheetIdFromTimesheetDateLink,
    goToTimesheetDetail,
    userSeesLessonHoursInTodayTimesheet,
} from 'test-suites/squads/timesheet/step-definitions/auto-remove-lesson-hours-in-timesheet-definitions';
import {
    addOtherWorkingHours,
    saveTimesheet,
} from 'test-suites/squads/timesheet/step-definitions/create-timesheet-with-transportation-expense-definitions';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export async function get4GrantedLocations(
    cms: CMSInterface,
    scenario: ScenarioContext
): Promise<Array<LocationInfoGRPC>> {
    const locations = await retrieveLowestLocations(cms);
    const locationList = locations.slice(0, 4);
    scenario.set(timesheetAutoDeleteTestLocationsListAlias, locationList);

    return locationList;
}

export async function createStudentsForGrantedLocations(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const locationList = scenarioContext.get<Array<LocationInfoGRPC>>(
        timesheetAutoDeleteTestLocationsListAlias
    );
    for (const location of locationList) {
        await createARandomStudentGRPC(cms, {
            locations: [location],
            studentPackageProfileLength: 1,
        });
    }
}

export async function createAndPublishLessonsForGrantedLocation(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const locationList = scenarioContext.get<Array<LocationInfoGRPC>>(
        timesheetAutoDeleteTestLocationsListAlias
    );
    const staff = scenarioContext.get<UserProfileEntity>(
        staffProfileAliasWithAccountRoleSuffix('teacher')
    );
    const teacherName = staff.name;
    for (const location of locationList) {
        await createOneSimpleLesson(cms, {
            teacherName,
            locationName: location.name,
        });
    }
}

export async function requestorSeesTodayTimesheetsAutoCreated(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    await cms.instruction(`Requestor goes to timesheet management page`, async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
    });

    const today = new Date();
    const locationList = scenarioContext.get<Array<LocationInfoGRPC>>(
        timesheetAutoDeleteTestLocationsListAlias
    );
    await selectTimesheetDateFilter(cms, scenarioContext, today, today, 'teacher');
    await cms.waitForSkeletonLoading();
    await cms.instruction(`Requestor sees today's timesheets`, async function () {
        const timesheetDateRows = await cms.page!.$$(staffTimesheetDateLink);
        const timesheetLocationRows = await cms.page!.$$(staffTimesheetLocation);
        const locationNames = await Promise.all(
            timesheetLocationRows.map(async (item) => await item.textContent())
        );
        const timesheetIds = await Promise.all(
            locationList.map(async (location) => {
                // We need to find the right timesheet for current location
                const index = locationNames.findIndex((item) => item === location.name);
                const timesheetDetailLink = await timesheetDateRows[index].getAttribute('href');
                const timesheetId = getTimesheetIdFromTimesheetDateLink(timesheetDetailLink!);
                return timesheetId;
            })
        );
        await cms.instruction(
            `Has ${timesheetIds.length} timesheet(s): ${timesheetIds}`,
            async function () {
                scenarioContext.set(timesheetAutoDeleteTestTimesheetIdsAlias, timesheetIds);
            }
        );
    });
}

export async function addOtherWorkingHoursForTimesheet(cms: CMSInterface, timesheetId: string) {
    await goToTimesheetDetail(cms, timesheetId);
    await cms.instruction('Add other working hours', async function () {
        await openEditTimesheetPopup(cms);
        await cms.instruction('Fill other working hours', async () => {
            await addOtherWorkingHours(cms, [
                {
                    workingType: 'Office',
                    startTime: '10:00',
                    endTime: '11:30',
                },
            ]);
        });
        await cms.instruction('Click save button', async () => {
            await saveTimesheet(cms);
        });
        await waitForEditTimesheetResponse(cms);
    });
}

export async function deletesAllLessonsOfTimesheet(
    cms: CMSInterface,
    scenario: ScenarioContext,
    timesheetId: string
) {
    await goToTimesheetDetail(cms, timesheetId);
    await userSeesLessonHoursInTodayTimesheet(cms, scenario);
    const lessonIds = scenario.get<string[]>(todayTimesheetLessonHourIdsAlias);
    await deletesLessons(cms, lessonIds);
}

export async function changesAllLessonsOfTimesheetToDraft(
    cms: CMSInterface,
    scenario: ScenarioContext,
    timesheetId: string
) {
    await goToTimesheetDetail(cms, timesheetId);
    await userSeesLessonHoursInTodayTimesheet(cms, scenario);
    const lessonIds = scenario.get<string[]>(todayTimesheetLessonHourIdsAlias);
    await deletesLessons(cms, lessonIds);
}

export async function assertTodayTimesheetCountForOneLocation(
    cms: CMSInterface,
    scenario: ScenarioContext,
    role: AccountRoles,
    location: LocationInfoGRPC,
    expectedCount: number
) {
    await cms.page!.reload();
    await cms.waitingForProgressBar();
    await cms.instruction(`${role} goes to timesheet management page`, async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
    });

    const today = new Date();
    const locationName = location.name;
    if (role === 'school admin') {
        const staff = scenario.get<UserProfileEntity>(
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );
        await searchTimesheetByStaffName(cms, scenario, staff.name);
    }
    await selectTimesheetDateFilter(cms, scenario, today, today, role);
    await cms.waitForSkeletonLoading();

    await cms.instruction(
        `Assert location ${locationName} has ${expectedCount} timesheet for today`,
        async function () {
            const timesheetLocationRows = await cms.page!.$$(
                role === 'school admin' ? timesheetLocation : staffTimesheetLocation
            );
            const locationNames = await Promise.all(
                timesheetLocationRows.map(async (item) => await item.textContent())
            );
            const timesheetCount = locationNames.filter((item) => item === locationName).length;
            weExpect(timesheetCount).toBe(expectedCount);
        }
    );
}

export async function openEditTimesheetPopup(cms: CMSInterface) {
    await cms.selectActionButton(ActionOptions.EDIT, {
        target: 'actionPanelTrigger',
    });
}

export function mapLocationIndex(locationIndex: LocationIndex) {
    return ['A', 'B', 'C', 'D'].indexOf(locationIndex);
}
