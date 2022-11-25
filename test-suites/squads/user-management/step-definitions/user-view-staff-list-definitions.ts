import { staffListAlias } from '@user-common/alias-keys/user';
import { UserHasuraQueryNames } from '@user-common/constants/hasura-query-name';
import { StaffListHasuraResponseType } from '@user-common/types/staff';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { createAnUserGRPC } from './user-create-staff-definitions';
import { UserGroup } from 'manabuf/usermgmt/v2/enums_pb';

export interface StaffTypes {
    user_id: string;
    name: string;
    email: string;
    userGroupIdsList?: string[];
    resource_path?: string;
    locationIdsList?: string[];
}
export interface StaffRespTypes {
    staff_id: string;
    user: {
        name: string;
        email: string;
        resource_path?: string;
    };
}
export async function shoolAdminSeesStaffListHasManyRecords(cms: CMSInterface) {
    const manyRecords = 5;
    for (let i = 0; i < manyRecords; i++) {
        await createAnUserGRPC(cms, UserGroup.USER_GROUP_TEACHER);
    }
}
export async function schoolAdminWaitForGetAllDataStaffList(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    await cms.page!.reload();

    //TODO: We should use the data on UI instead of hasura response for improvement
    const resultStaffList = await cms.waitForHasuraResponse(UserHasuraQueryNames.STAFF_LIST_QUERY);
    const staffList: StaffTypes[] = resultStaffList.resp.data.users.map(
        (item: StaffListHasuraResponseType) => ({
            user_id: item.staff.staff_id,
            name: item.name,
            email: item.email,
            resource_path: item.resource_path,
        })
    );
    scenarioContext.set(staffListAlias, staffList);
}
