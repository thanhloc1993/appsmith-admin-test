import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import { staffListAlias, staffProfileAlias } from '@user-common/alias-keys/user';
import { staffListStaffName } from '@user-common/cms-selectors/staff';
import { rowOption, rowsPerPage } from '@user-common/cms-selectors/student';
import {
    buttonNextPageTable,
    tableBaseFooterSelect,
} from '@user-common/cms-selectors/students-page';
import { UserHasuraQueryNames } from '@user-common/constants/hasura-query-name';
import { StaffListHasuraResponseType } from '@user-common/types/staff';

import { CMSInterface, ScenarioContextInterface } from '@supports/app-types';

import { createAnUserGRPC } from './user-create-staff-definitions';
import { StaffTypes } from './user-view-staff-list-definitions';
import { strictEqual } from 'assert';
import { UserGroup } from 'manabuf/usermgmt/v2/enums_pb';

export async function filterStaffByOption(
    cms: CMSInterface,
    context: ScenarioContextInterface,
    staffList: StaffTypes[],
    option: string
) {
    let searchKeyword = '';
    switch (option) {
        case 'partial name':
            {
                searchKeyword = `e2e-${UserGroup.USER_GROUP_TEACHER}`;
            }
            break;
        case 'full name':
            {
                searchKeyword = staffList[0].name;
            }
            break;
        case 'keyword with single capital letter':
            {
                searchKeyword = `E2e-${UserGroup.USER_GROUP_TEACHER}`;
            }
            break;
        case 'keyword with all capital letter':
            {
                searchKeyword = `e2e-${UserGroup.USER_GROUP_TEACHER}`.toUpperCase();
            }
            break;
        default:
            throw new Error('Invalid option');
    }

    const newStaffList = staffList.filter((t) =>
        t.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    context.set(staffListAlias, newStaffList);
    await searchStaffOnCMS(cms, searchKeyword);

    await cms.instruction('School admin changes rows per page to 50', async function () {
        const page = cms.page!;
        await page.click(rowsPerPage);
        await page.click(rowOption('50'));
        await cms.waitForSkeletonLoading();
    });
}

export async function searchStaffOnCMS(cms: CMSInterface, name: string) {
    const page = cms.page!;

    await cms.instruction(`School admin searches ${name} on search bar`, async function () {
        await page.fill(CMSKeys.formFilterAdvancedTextFieldSearchStaffInput, name);
        await page.keyboard.press('Enter');
    });
    await cms.waitForSkeletonLoading();
}

export async function assertStaffListWithKeyword(cms: CMSInterface, staffList: StaffTypes[]) {
    if (staffList.length === 0) throw new Error('No staff to assert!');
    for (const staff of staffList) {
        await findNewlyCreatedStaff(cms, staff);
    }
}

export async function findNewlyCreatedStaff(cms: CMSInterface, staff: StaffTypes) {
    const newlyCreatedStaffItem = await cms.waitForSelectorHasText(staffListStaffName, staff.name);
    await newlyCreatedStaffItem?.scrollIntoViewIfNeeded();

    const newlyCreatedStaffName = await newlyCreatedStaffItem?.innerText();
    strictEqual(newlyCreatedStaffName, staff.name, 'The new staff name should match with the UI');

    return newlyCreatedStaffItem;
}

export async function goToNextPageOfStaffList(
    cms: CMSInterface,
    context: ScenarioContextInterface,
    staffList: StaffTypes[]
) {
    const page = cms.page!;
    const nextButton = await page.waitForSelector(buttonNextPageTable);
    const isEnabled = await nextButton.isEnabled();

    if (!isEnabled) {
        const totalStaffPerPageElement = await page.waitForSelector(tableBaseFooterSelect);
        const totalStaffPerPage = await totalStaffPerPageElement?.textContent();
        const totalStaffToCreate = parseInt(totalStaffPerPage || '10') - staffList.length;
        for (let i = 0; i < totalStaffToCreate + 5; i++) {
            await createAnUserGRPC(cms, UserGroup.USER_GROUP_TEACHER);
        }
        await page.reload();
    }
    await nextButton.click();
    const resultStaffList = await cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_QUERY);

    const staffListNextPage: StaffTypes[] = resultStaffList.resp.data.users.map(
        (item: StaffListHasuraResponseType) => ({
            user_id: item.staff.staff_id,
            name: item.name,
            email: item.email,
            resource_path: item.resource_path,
        })
    );
    context.set(staffProfileAlias, staffListNextPage[0]);
}
