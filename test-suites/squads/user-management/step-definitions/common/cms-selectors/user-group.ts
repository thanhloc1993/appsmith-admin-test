//User group list
export const userGroupListName = '[data-testid="UserGroupList__userGroupName"]';

//User group detail
export const userGroupDetailTable = '[data-testid="UserGroupTable"]';
export const userGroupDetailName = '[data-testid="GeneralUserGroupDetail__generalNameValue"]';
export const userGroupDetailTableRole = '[data-testid="UserGroupGrantedPermissionTable__roleName"]';
export const userGroupDetailTableLocations =
    '[data-testid="UserGroupGrantedPermissionTable__location"]';

//User group upsert
export const userGroupUpsertTable = '[data-testid="GrantedPermissionUpsertTable"]';
export const userGroupUpsertName = '[data-testid="FormUserGroupInfo__inputUserGroupName"]';
export const userGroupUpsertTableRole = '[data-testid="UserGroupUpsertTable__grantedRole"]';
export const userGroupUpsertTableLocation = '[data-testid="LocationSelectInputHF"]';
export const userGroupUpsertTableLocationChips = '[data-testid="LocationSelectInputHF__tagBox"]';
export const autoCompleteBaseInput = '[data-testid="AutocompleteBase__input"]';
export const addNewGrantedPermissionButton =
    '[data-testid="UserGroupGrantedPermissionUpsert__addButton"]';
export const locationPopupItem = '[data-testid="ItemLocation__container"]';
export const userGroupUpsertDeleteButton =
    '[data-testid="UserGroupGrantedPermissionUpsert__deleteAction"]';
export const grantedRoleOption = (role: string) => `role=option[name="${role}"]`;
