import NsUsermgmtUserGroupModifierService from './request-types';
import {
    CreateUserGroupRequest,
    RoleWithLocations,
    UpdateUserGroupRequest,
} from 'manabuf/usermgmt/v2/user_groups_pb';

export function createUserGroupReq(data: NsUsermgmtUserGroupModifierService.createUserGroupReq) {
    const userGroupReq = new CreateUserGroupRequest();

    const { userGroupName, roleWithLocationsList } = data;
    const grantedPermissionPackage: RoleWithLocations[] = [];

    roleWithLocationsList.forEach((data) => {
        const grantedRole = new RoleWithLocations();
        grantedRole.setRoleId(data.roleId);
        grantedRole.setLocationIdsList(data.locationIdsList);
        grantedPermissionPackage.push(grantedRole);
    });

    userGroupReq.setUserGroupName(userGroupName);
    userGroupReq.setRoleWithLocationsList(grantedPermissionPackage);

    return userGroupReq;
}

export function updateUserGroupReq(data: NsUsermgmtUserGroupModifierService.updateUserGroupReq) {
    const userGroupReq = new UpdateUserGroupRequest();

    const { userGroupId, userGroupName, roleWithLocationsList } = data;
    const grantedPermissionPackage: RoleWithLocations[] = [];

    roleWithLocationsList.forEach((data) => {
        const grantedRole = new RoleWithLocations();
        grantedRole.setRoleId(data.roleId);
        grantedRole.setLocationIdsList(data.locationIdsList);
        grantedPermissionPackage.push(grantedRole);
    });

    userGroupReq.setUserGroupId(userGroupId);
    userGroupReq.setUserGroupName(userGroupName);
    userGroupReq.setRoleWithLocationsList(grantedPermissionPackage);

    return userGroupReq;
}
