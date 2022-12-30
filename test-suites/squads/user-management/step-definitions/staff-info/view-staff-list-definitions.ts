import {
    getTotalRecordsOfDataTable,
    changeRowsPerPage as changeRowsPerPageUtils,
} from '@legacy-step-definitions/utils';
import { staffListAlias, totalStaffAlias } from '@user-common/alias-keys/staff';
import * as dataTableSelectors from '@user-common/cms-selectors/data-table';
import * as staffSelectors from '@user-common/cms-selectors/staff';
import { PageActionsLabel, PageActionTypes } from '@user-common/constants/enum';
import { UserHasuraQueryNames } from '@user-common/constants/hasura-query-name';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';
import { AccessTypes } from '@user-common/types/bdd';
import { StaffListItemInformation, StaffWorkingStatusText } from '@user-common/types/staff';
import { goToStaffListByMenu, goToStaffListByURL } from '@user-common/utils/goto-page';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { parseStaffListData } from './helper/staff-list-parser';
import { strictEqual } from 'assert';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

export async function goesToStaffManagementAndSaveDataToContext(
    cms: CMSInterface,
    context: ScenarioContext,
    option: AccessTypes = 'Menu'
) {
    const actionFn = () => (option === 'Menu' ? goToStaffListByMenu(cms) : goToStaffListByURL(cms));

    await cms.instruction(`school admin goes to Staff Management page by ${option}`, async () => {
        const [
            staffListResponse,
            countStaffListResponse,
            staffLocationsResponse,
            staffUserGroupResponse,
        ] = await Promise.all([
            cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_QUERY),
            cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_COUNT_QUERY),
            cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_LOCATIONS_QUERY),
            cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_USER_GROUPS_QUERY),
            actionFn(),
            cms.waitingForLoadingIcon(),
            cms.waitForSkeletonLoading(),
        ]);

        const staffListResponseData = staffListResponse.resp.data.staff;
        const staffLocationsResponseData = staffLocationsResponse.resp.data.user_access_paths;
        const staffUserGroupResponseData = staffUserGroupResponse.resp.data.user_group_member;

        const staffList = parseStaffListData(
            staffListResponseData,
            staffLocationsResponseData,
            staffUserGroupResponseData
        );

        context.set(staffListAlias, staffList);
        context.set(
            totalStaffAlias,
            countStaffListResponse.resp.data.staff_aggregate.aggregate.count || 0
        );
    });
}

export async function changeRowsPerPage(
    cms: CMSInterface,
    context: ScenarioContext,
    rowsPerPage: number
) {
    await cms.instruction(
        `School admin change the rows per page into ${rowsPerPage}`,
        async function () {
            const [staffListResponse, staffLocationsResponse, staffUserGroupResponse] =
                await Promise.all([
                    cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_QUERY),
                    cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_LOCATIONS_QUERY),
                    cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_USER_GROUPS_QUERY),
                    changeRowsPerPageUtils(cms, rowsPerPage),
                    cms.waitingForLoadingIcon(),
                ]);

            const staffListResponseData = staffListResponse.resp.data.staff;
            const staffLocationsResponseData = staffLocationsResponse.resp.data.user_access_paths;
            const staffUserGroupResponseData = staffUserGroupResponse.resp.data.user_group_member;

            const staffList = parseStaffListData(
                staffListResponseData,
                staffLocationsResponseData,
                staffUserGroupResponseData
            );

            context.set(staffListAlias, staffList);
        }
    );
}

export async function schoolAdminGoesToActionPagesInStaffTable(
    cms: CMSInterface,
    context: ScenarioContext,
    action: PageActionTypes
) {
    const labelButton =
        action === PageActionTypes.PERVIOUS ? PageActionsLabel.PREVIOUS : PageActionsLabel.NEXT;
    const actionFn = () => cms.selectAButtonByAriaLabel(labelButton);

    await cms.instruction(`school admin click button: ${labelButton}`, async () => {
        const [staffListResponse, staffLocationsResponse, staffUserGroupResponse] =
            await Promise.all([
                cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_QUERY),
                cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_LOCATIONS_QUERY),
                cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_USER_GROUPS_QUERY),
                actionFn(),
                cms.waitingForLoadingIcon(),
            ]);

        const staffListResponseData = staffListResponse.resp.data.staff;
        const staffLocationsResponseData = staffLocationsResponse.resp.data.user_access_paths;
        const staffUserGroupResponseData = staffUserGroupResponse.resp.data.user_group_member;

        const staffList = parseStaffListData(
            staffListResponseData,
            staffLocationsResponseData,
            staffUserGroupResponseData
        );

        context.set(staffListAlias, staffList);
    });
}

export async function schoolAdminSeesStaffTableDisplayCorrectly(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const staffList = context.get<StaffListItemInformation[]>(staffListAlias);
    const staffTotal = context.get<number>(totalStaffAlias);

    await assertStaffNameColumn(cms, staffList);
    await assertStaffEmailColumn(cms, staffList);
    await assertStaffLocationColumn(cms, staffList);
    await assertStaffStatusColumn(cms, staffList);
    await assertStaffUserGroupColumn(cms, staffList);

    await assertStaffPagination(cms, staffTotal);
}

async function assertStaffPagination(cms: CMSInterface, staffTotal: number) {
    await cms.instruction('assert the total staff should be matched with the UI', async () => {
        const totalRecords = await getTotalRecordsOfDataTable(cms);

        strictEqual(totalRecords, staffTotal.toString(), 'Total staff matches with the UI');
    });
}

async function getStaffTableInfo(cms: CMSInterface) {
    const page = cms.page!;
    const staffTable = page.locator(staffSelectors.staffTable);
    const staffTableColumns = await staffTable
        .locator(dataTableSelectors.tableCellHeader)
        .elementHandles();
    const staffColumnTitles = await Promise.all(
        staffTableColumns.map((column) => column.textContent())
    );

    return {
        staffTableColumns,
        staffColumnTitles,
    };
}

async function getStaffRowDataById(
    cms: CMSInterface,
    staffId: StaffListItemInformation['staff_id']
) {
    const page = cms.page!;
    const staffRow = page.locator(dataTableSelectors.tableBaseRowWithId(staffId));
    await staffRow.scrollIntoViewIfNeeded();

    const staffNameValue = await staffRow.locator(staffSelectors.staffNameCell).textContent();
    const staffEmailValue = await staffRow.locator(staffSelectors.staffEmailCell).textContent();
    const staffLocationValue = await staffRow
        .locator(staffSelectors.staffLocationCell)
        .textContent();
    const staffStatusValue = await staffRow.locator(staffSelectors.staffStatusCell).textContent();
    const staffUserGroupValue = await staffRow
        .locator(staffSelectors.staffUserGroupCell)
        .textContent();

    return {
        staffNameValue,
        staffEmailValue,
        staffLocationValue,
        staffStatusValue,
        staffUserGroupValue,
    };
}

async function assertStaffLocationColumn(cms: CMSInterface, staffList: StaffListItemInformation[]) {
    const isShowStaffLocation = isEnabledFeatureFlag('STAFF_MANAGEMENT_STAFF_LOCATION');
    if (!isShowStaffLocation) return;

    await cms.instruction('assert the Location column displayed in the Staff table', async () => {
        const { staffColumnTitles } = await getStaffTableInfo(cms);

        const isExisted =
            staffColumnTitles.findIndex((columnTitle) => columnTitle === 'Location') >= 0;

        strictEqual(isExisted, true, 'Location column should be displayed in the Staff table');
    });

    await cms.instruction('assert the Location data displayed correctly', async () => {
        for (const staff of staffList) {
            const { staffLocationValue } = await getStaffRowDataById(cms, staff.staff_id);

            if (isEmpty(staff.locations)) {
                strictEqual(staffLocationValue, '--', 'Staff Location should be display --');
                return;
            }

            const locationListInUI = staffLocationValue?.split(', ');

            const locationListFromQuery = staff.locations?.map(({ name }) => name);

            const isMatched = isEqual(locationListInUI, locationListFromQuery);

            strictEqual(isMatched, true, 'Staff location should be displayed correctly');
        }
    });
}

async function assertStaffNameColumn(cms: CMSInterface, staffList: StaffListItemInformation[]) {
    await cms.instruction('assert the Staff Name column displayed in the Staff table', async () => {
        const { staffColumnTitles } = await getStaffTableInfo(cms);

        const isExisted =
            staffColumnTitles.findIndex((columnTitle) => columnTitle === 'Staff Name') >= 0;

        strictEqual(isExisted, true, 'Staff Name column should be displayed in the Staff table');
    });

    await cms.instruction('assert the Staff Name data displayed correctly', async () => {
        for (const staff of staffList) {
            const { staffNameValue } = await getStaffRowDataById(cms, staff.staff_id);

            strictEqual(staffNameValue, staff.name, 'Staff Name should be displayed correctly');
        }
    });
}

async function assertStaffEmailColumn(cms: CMSInterface, staffList: StaffListItemInformation[]) {
    await cms.instruction(
        'assert the Staff Email column displayed in the Staff table',
        async () => {
            const { staffColumnTitles } = await getStaffTableInfo(cms);

            const isExisted =
                staffColumnTitles.findIndex((columnTitle) => columnTitle === 'Email') >= 0;

            strictEqual(
                isExisted,
                true,
                'Staff Email column should be displayed in the Staff table'
            );
        }
    );

    await cms.instruction('assert the Staff Email data displayed correctly', async () => {
        for (const staff of staffList) {
            const { staffEmailValue } = await getStaffRowDataById(cms, staff.staff_id);

            strictEqual(staffEmailValue, staff.email, 'Staff Email should be displayed correctly');
        }
    });
}

async function assertStaffStatusColumn(cms: CMSInterface, staffList: StaffListItemInformation[]) {
    const isShowStaffStatus = isEnabledFeatureFlag('STAFF_MANAGEMENT_STAFF_STATUS');
    if (!isShowStaffStatus) return;

    await cms.instruction(
        'assert the Staff Status column displayed in the Staff table',
        async () => {
            const { staffColumnTitles } = await getStaffTableInfo(cms);

            const isExisted =
                staffColumnTitles.findIndex((columnTitle) => columnTitle === 'Status') >= 0;

            strictEqual(
                isExisted,
                true,
                'Staff Status column should be displayed in the Staff table'
            );
        }
    );

    await cms.instruction('assert the Staff Status data displayed correctly', async () => {
        for (const staff of staffList) {
            const { staffStatusValue } = await getStaffRowDataById(cms, staff.staff_id);
            strictEqual(
                staffStatusValue,
                StaffWorkingStatusText[staff.working_status],
                'Staff Status should be displayed correctly'
            );
        }
    });
}

async function assertStaffUserGroupColumn(
    cms: CMSInterface,
    staffList: StaffListItemInformation[]
) {
    await cms.instruction(
        'assert the Staff User Group column displayed in the Staff table',
        async () => {
            const { staffColumnTitles } = await getStaffTableInfo(cms);

            const isExisted =
                staffColumnTitles.findIndex((columnTitle) => columnTitle === 'User Group') >= 0;

            strictEqual(
                isExisted,
                true,
                'Staff User Group column should be displayed in the Staff table'
            );
        }
    );

    await cms.instruction('assert the Staff User Group data displayed correctly', async () => {
        for (const staff of staffList) {
            const { staffUserGroupValue } = await getStaffRowDataById(cms, staff.staff_id);

            if (isEmpty(staff.user_groups)) {
                strictEqual(staffUserGroupValue, '--', 'Staff User Group should be display --');
                return;
            }

            const userGroupListInUI = staffUserGroupValue?.split(', ');

            const userGroupListFromQuery = staff.user_groups?.map(
                ({ user_group_name }) => user_group_name
            );

            const isMatched = isEqual(userGroupListInUI, userGroupListFromQuery);

            strictEqual(isMatched, true, 'Staff User Group should be displayed correctly');
        }
    });
}
