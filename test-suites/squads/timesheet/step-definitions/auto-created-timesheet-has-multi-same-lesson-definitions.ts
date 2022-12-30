import { tableBaseRow } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import { searchTimesheetByStaffName } from './apply-status-filter-name-search-and-date-filter-definitions';
import {
    createDraftLesson,
    goToTimesheetManagementPage,
} from './flag-off-to-on-auto-create-timesheet-definition';
import moment from 'moment';

const today = moment().tz('Asia/Tokyo').toDate();
const nearestStartTime = moment(today).add(10, 'minutes');
const nearestEndTime = moment(today).add(20, 'minutes');

export const getLessonKeyByIndex = (key: AccountRoles, index: number) =>
    `${key.replace(' ', '-')}-${index}`;

export const create2DraftLessonsWithSameDate = async (
    cms: CMSInterface,
    role: AccountRoles,
    context: ScenarioContext
) => {
    for (let i = 0; i < 2; i++) {
        const lessonKey = getLessonKeyByIndex(role, i);
        await cms.instruction(
            `${role} creates 2 draft lessons with same date and time`,
            async () => {
                await createDraftLesson({
                    cms,
                    context,
                    lessonKey,
                    lessonData: {
                        startTime: nearestStartTime.format('HH:mm'),
                        endTime: nearestEndTime.format('HH:mm'),
                        date: today,
                    },
                });
            }
        );
    }
};

export const assertStaffHasOneAutoCreatedTimesheet = async (
    cms: CMSInterface,
    context: ScenarioContext,
    role: AccountRoles
) => {
    const page = cms.page!;
    const staff = context.get<UserProfileEntity>(staffProfileAliasWithAccountRoleSuffix('teacher'));

    await goToTimesheetManagementPage(cms);

    if (role === 'school admin') {
        await cms.instruction('Search staff on timesheet management', async () => {
            await searchTimesheetByStaffName(cms, context, staff.name);
            await cms.waitForSkeletonLoading();
        });
    }

    await cms.waitForSkeletonLoading();
    await page.waitForSelector(tableBaseRow);

    const rowCount = await page.locator(tableBaseRow).count();

    weExpect(rowCount).toBe(1);
};
