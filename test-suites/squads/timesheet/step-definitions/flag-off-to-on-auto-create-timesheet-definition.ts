import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import {
    getTestId,
    tableBaseRow,
    tableEmptyMessage,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import {
    searchTimesheetByStaffName,
    selectTimesheetDateFilter,
} from './apply-status-filter-name-search-and-date-filter-definitions';
import {
    changeTimeLesson,
    goToLessonManagement,
    openCreateLessonDialog,
    searchTeacher,
} from './auto-remove-lesson-hours-in-timesheet-definitions';
import {
    getLessonContextKey,
    parseCreateLessonResponse,
} from './switch-state-without-reverse-definitions';
import { closeTimesheetFilterAdvanced } from './view-timesheet-list-with-default-timesheet-filter-definitions';
import moment from 'moment';
import {
    triggerSubmitLesson,
    waitCreateLesson,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { selectCenterByNameV3, selectTeacher } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { lessonDetailEditButton } from 'test-suites/squads/timesheet/common/cms-selectors/lesson-detail';
import {
    lessonManagementLessonSaveAsDraftButton,
    lessonManagementUpsertChipStatus,
} from 'test-suites/squads/timesheet/common/cms-selectors/lesson-upsert';
import { lessonHoursTable } from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-detail';
import {
    staffTimesheetDateLink,
    timesheetDateLink,
} from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-list';
import { changeLessonDate } from 'test-suites/squads/timesheet/step-definitions/auto-create-not-created-by-draft-lessons-definition';

type LessonData = {
    date: Date;
    startTime: string;
    endTime: string;
    staffName?: string;
    location?: string;
};

type CreateDraftLessonProps = {
    cms: CMSInterface;
    context: ScenarioContext;
    lessonData: LessonData;
    lessonKey?: string;
};

type AssertTimesheetsForLessonsAutoCreatedProps = {
    cms: CMSInterface;
    context: ScenarioContext;
    lessonKeys: string[];
    role?: AccountRoles;
};

export type LessonContextData = LessonData & {
    staffName: string;
    location: string;
    id: string;
};

export const getLessonTimeRangeSelectorByLessonId = (id: string) =>
    `${getTestId('LessonHoursTable__table')} a[href="/lesson/lesson_management/${id}/show"]`;

export const goToTimesheetManagementPage = async (cms: CMSInterface) => {
    await cms.instruction('Go to timesheet management page', async () => {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.TIMESHEET_MANAGEMENT);
        await cms.waitForSkeletonLoading();
    });
};

export const createDraftLesson = async ({
    cms,
    context,
    lessonData: { startTime, endTime, date, staffName, location },
    lessonKey,
}: CreateDraftLessonProps) => {
    const firstGrantedLocation = context.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
    const staff = context.get<UserProfileEntity>(staffProfileAliasWithAccountRoleSuffix('teacher'));
    const teacherName = !staffName ? staff.name : staffName;
    const locationName = !location ? firstGrantedLocation.name : location;

    await cms.instruction('Create draft lesson', async () => {
        await goToLessonManagement(cms);
        await openCreateLessonDialog(cms);
        await changeTimeLesson(cms, startTime, endTime);
        await selectCenterByNameV3(cms, locationName);
        await searchTeacher(cms, teacherName);
        await selectTeacher(cms, teacherName);
        await changeLessonDate(cms, date);

        await cms.instruction(`School admin saves lesson as draft`, async function () {
            const [createLessonResponse] = await Promise.all([
                waitCreateLesson(cms),
                triggerSaveDraftLesson(cms),
            ]);

            if (lessonKey) {
                const lessonId = await parseCreateLessonResponse(createLessonResponse);
                context.set(getLessonContextKey(lessonKey), {
                    staffName: teacherName,
                    id: lessonId,
                    location: locationName,
                    startTime,
                    endTime,
                    date,
                } as LessonContextData);
            }
        });
    });
};

export const triggerSaveDraftLesson = async (cms: CMSInterface) => {
    await cms.page!.click(lessonManagementLessonSaveAsDraftButton);
};

export const publishLesson = async (cms: CMSInterface, lessonId: string) => {
    const page = cms.page!;
    const lessonURL = `/lesson/lesson_management/${lessonId}/show`;
    await cms.instruction(`Go to ${lessonURL} and press publish button`, async () => {
        await page.waitForTimeout(5000);
        await page.goto(lessonURL);
        await page.waitForSelector(lessonDetailEditButton);
        await page.click(lessonDetailEditButton);
        await triggerSubmitLesson(cms);

        await cms.waitForSelectorHasText(lessonManagementUpsertChipStatus, 'Published');
    });
};

export const assertLessonHoursTableEmpty = async (
    cms: CMSInterface,
    timesheetId: string,
    customPage?: CMSInterface['page']
) => {
    const page = customPage ? customPage : cms.page!;

    const timesheetURL = `/timesheet/timesheet_management/${timesheetId}/show`;
    const lessonHoursTableEmptyMessageSelector = `${lessonHoursTable} ${tableEmptyMessage}`;
    await cms.instruction(`Go to ${timesheetURL} and assert lesson hours is empty`, async () => {
        await page.goto(timesheetURL);
        await cms.waitForSkeletonLoading();
        // for some reason assertElementExists doesn't work here that's why we use waitForSelector
        await page.waitForSelector(lessonHoursTableEmptyMessageSelector);
    });
};

export const assertLessonHoursTableContainsLessons = async (
    cms: CMSInterface,
    lessonIds: string[],
    customPage?: CMSInterface['page']
) => {
    const page = customPage ? customPage : cms.page!;

    await cms.instruction(`Assert lesson hours table contains lessons`, async () => {
        await cms.waitForSkeletonLoading();

        for (let i = 0; i < lessonIds.length; i++) {
            const lessonId = lessonIds[i];

            await page.waitForSelector(getLessonTimeRangeSelectorByLessonId(lessonId));
        }
    });
};

export const assertTimesheetsForLessonsAutoCreated = async ({
    cms,
    context,
    lessonKeys,
    role = 'teacher',
}: AssertTimesheetsForLessonsAutoCreatedProps) => {
    const page = cms.page!;
    const staff = context.get<UserProfileEntity>(staffProfileAliasWithAccountRoleSuffix('teacher'));
    let hasRanOnce = false;

    for (const lessonKey of lessonKeys) {
        const lessonData = context.get<LessonContextData>(getLessonContextKey(lessonKey));
        // A temporary workaround on the timezone issue.
        // Subtract an arbitrary number of hours to the lesson date (in this case 15) to correctly assert the auto created timesheet date
        // This is to correct instances where a lesson is registered today (e.x 10/27) but the auto created timesheet for it will be dated at (10/26)
        const expectedDateText = moment(lessonData.date).subtract(15, 'hours').format('YYYY/MM/DD');
        const dateLabelElement = page.locator(
            `${
                role === 'school admin' ? timesheetDateLink : staffTimesheetDateLink
            }:text-is("${expectedDateText}")`
        );

        if (role === 'teacher' || (role === 'school admin' && !hasRanOnce)) {
            await goToTimesheetManagementPage(cms);
        }

        if (role === 'school admin') {
            await cms.instruction('Search staff on timesheet management', async () => {
                await searchTimesheetByStaffName(cms, context, staff.name);
            });
        }

        if ((role === 'school admin' && !hasRanOnce) || role === 'teacher') {
            await selectTimesheetDateFilter(
                cms,
                context,
                moment().subtract(1, 'month').date(1).toDate(),
                moment().add(1, 'months').endOf('month').toDate(),
                role
            );
            if (role === 'school admin') {
                await closeTimesheetFilterAdvanced(cms);
            }
        }
        await cms.waitForSkeletonLoading();
        await page.waitForSelector(tableBaseRow);

        await cms.instruction(
            `Assert timesheet date matches lesson date ${expectedDateText}`,
            async () => {
                const dateLabelElementCount = await dateLabelElement.count();
                weExpect(dateLabelElementCount).toBe(1);
            }
        );

        await cms.instruction(`Assert timesheet contains correct lesson`, async () => {
            let timesheetPage = page;

            if (role === 'school admin') {
                const [adminTimesheetPage] = await Promise.all([
                    page.context()!.waitForEvent('page'),
                    dateLabelElement.click(),
                ]);

                timesheetPage = adminTimesheetPage;
                await timesheetPage.waitForLoadState();
                await timesheetPage.bringToFront();
            } else {
                await dateLabelElement.click();
            }

            await assertLessonHoursTableContainsLessons(cms, [lessonData.id], timesheetPage);

            await timesheetPage.waitForTimeout(5000);

            if (role === 'school admin') {
                await timesheetPage.close();
                await page.bringToFront();
            }
        });

        if (!hasRanOnce) hasRanOnce = true;
    }
};
