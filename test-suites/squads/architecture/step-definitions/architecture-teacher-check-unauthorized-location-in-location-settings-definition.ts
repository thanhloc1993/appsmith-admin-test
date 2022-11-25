import { parentLocationNames } from '@legacy-step-definitions/lesson-select-and-view-location-in-location-setting-popup-navbar-definitions';
import { TeacherKeys } from '@legacy-step-definitions/teacher-keys/teacher-keys';
import {
    getRandomNumber,
    randomString,
    retrieveLowestLocations,
} from '@legacy-step-definitions/utils';
import { treeLocationsAlias, userGroupIdsListAlias } from '@user-common/alias-keys/user';

import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { LocationItemCheckBoxStatus } from '@supports/enum';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';
import { TreeLocationProps } from '@supports/types/cms-types';

import { ByValueKey } from 'flutter-driver-x';
import { CreateUserGroupResponse } from 'manabuf/usermgmt/v2/user_groups_pb';
import {
    GrantedPermission,
    schoolAdminCreateUserGroup,
    UserGroupTypes,
} from 'test-suites/squads/user-management/step-definitions/user-create-user-group-definitions';

export async function getBrandLocation(treeLocation: TreeLocationProps) {
    const locations = treeLocation.children?.filter(
        (location) => location.name === parentLocationNames[0]
    );
    return locations;
}

export async function createUserGroupDataWithLocation(
    cms: CMSInterface,
    context: ScenarioContext,
    location: string,
    role: string
) {
    const treeLocations = context.get<TreeLocationProps>(treeLocationsAlias);

    let locations: any;

    if (location === 'brand') {
        locations = await getBrandLocation(treeLocations);
    } else {
        locations = await retrieveLowestLocations(cms);
    }

    const userGroupName = `e2e-userGroup.${getRandomNumber()}.${randomString(10)}`;
    const grantedPermissions: GrantedPermission[] = [];

    const grantedPermission: GrantedPermission = {
        role: role,
        locations: location === 'brand' ? [locations[0]] : locations.slice(0, 5),
    };
    grantedPermissions.push(grantedPermission);

    const userGroupData: UserGroupTypes = { name: userGroupName, grantedPermissions };

    return userGroupData;
}

export async function teacherSeesUnAuthorizedLocations(
    teacher: TeacherInterface,
    location: string
) {
    const driver = teacher.flutterDriver!;
    const unauthorizedId = 'unauthorized_id_1';

    const itemKey = new ByValueKey(
        TeacherKeys.locationCheckStatus(unauthorizedId, LocationItemCheckBoxStatus.disabled)
    );
    await driver.waitFor(itemKey);

    let isTapped = null;

    //we are putting this in a try catch since driver doesn't have a method to check _
    //if item is not tappable
    try {
        await driver.tap(itemKey);
        isTapped = true;
    } catch (error) {
        isTapped = false;
    }

    if (location === 'org and brand') {
        const unauthorizedId2 = 'unauthorized_id_2';
        const itemKey = new ByValueKey(
            TeacherKeys.locationCheckStatus(unauthorizedId2, LocationItemCheckBoxStatus.disabled)
        );

        await driver.waitFor(itemKey);
        try {
            await driver.tap(itemKey);
            isTapped = true;
        } catch (error) {
            isTapped = false;
        }
    }

    //unAuthorized location should not be tappable
    weExpect(isTapped).toEqual(false);
}

export async function createUserGroup(
    cms: CMSInterface,
    scenario: ScenarioContext,
    location: string,
    role: string
) {
    const userGroupIdsList: string[] = [];

    const userGroup: UserGroupTypes = await createUserGroupDataWithLocation(
        cms,
        scenario,
        location,
        role
    );
    const [createUserGroupGRPCResp] = await Promise.all([
        cms.waitForGRPCResponse('usermgmt.v2.UserGroupMgmtService/CreateUserGroup'),
        schoolAdminCreateUserGroup(cms, scenario, userGroup),
    ]);

    const decoder = createGrpcMessageDecoder(CreateUserGroupResponse);
    const encodedResponseText = await createUserGroupGRPCResp?.text();
    const userGroupDecodedResp = decoder.decodeMessage(encodedResponseText);
    const userGroupId = userGroupDecodedResp?.getUserGroupId();

    if (userGroupId) {
        userGroupIdsList.unshift(userGroupId);
    }

    scenario.set(userGroupIdsListAlias, userGroupIdsList);
}
