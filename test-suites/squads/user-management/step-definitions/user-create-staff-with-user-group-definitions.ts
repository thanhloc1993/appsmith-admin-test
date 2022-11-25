import { buttonLogout, profileButtonSelector } from '@legacy-step-definitions/cms-selectors/appbar';
import {
    autoCompleteBaseInput,
    inputByValue,
    saveButton,
    tableBaseRow,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import { menuItemLinkRoot } from '@legacy-step-definitions/cms-selectors/common';
import { aSchoolAdminOnCMSLoginPageAndSeeLoginForm } from '@legacy-step-definitions/school-admin-email-login-definitions';
import {
    aTeacherAlreadyLoginFailedInTeacherWeb,
    aTeacherAlreadyLoginSuccessInTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';
import { UserRole } from '@legacy-step-definitions/types/common';
import {
    getRandomElementsWithLength,
    retrieveLowestLocations,
} from '@legacy-step-definitions/utils';
import {
    staffProfileAlias,
    userGroupGrantedRoleList,
    userGroupProfileAlias,
    userGroupsDataAlias,
    userGroupsListAlias,
} from '@user-common/alias-keys/user';
import {
    remainUserGroupChip,
    staffFormEmailInput,
    staffFormNameInput,
    userGroupChip,
    userGroupsAutocompleteLoading,
    userGroupsAutocompleteOption,
} from '@user-common/cms-selectors/staff';
import * as staffSelector from '@user-common/cms-selectors/staff';
import { rowOption, rowsPerPage } from '@user-common/cms-selectors/student';
import {
    userGroupUpsertTableLocation,
    userGroupUpsertTableRole,
} from '@user-common/cms-selectors/user-group';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';
import { chooseAutocompleteOptionByExactText } from '@user-common/utils/autocomplete-actions';
import { chooseLocationsByName, chooseRandomUILocations } from '@user-common/utils/locations';

import { Page, Response } from 'playwright';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface, IMasterWorld, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import { forgotPasswordStaff } from './user-create-staff-definitions';
import {
    clickMultipleTimes,
    lastRowGrantedPermissionTableSelector,
    UserGroupTypeAlias,
    UserGroupTypes,
} from './user-create-user-group-definitions';
import {
    chooseLocations,
    clickOnSaveInDialog,
    extractNumberFromString,
    userAuthenticationMultiTenant,
} from './user-definition-utils';
import { LocationAction, schoolAdminGoesToEditPage } from './user-edit-user-group-definitions';
import {
    adminGoBackToLoginScreen,
    adminLoginWithNewPassword,
    adminResetPwdByForgotPwdFeature,
} from './user-forgot-password-definitions';
import { loginCMSByUserNameAndPassWord } from './user-login-fail-by-wrong-username-or-password-definitions';
import { CreateStaffResponse } from 'manabuf/usermgmt/v2/users_pb';

export interface StaffFormData {
    name: string;
    email: string;
    numberOfUserGroups: number;
    userGroupNames?: string[];
}
const maxChipsAllowed = 10;

export async function schoolAdminCreateAStaffWithUserGroups(
    cms: CMSInterface,
    context: ScenarioContext,
    staffFormData: StaffFormData
) {
    const page = cms.page!;
    const { name, email, numberOfUserGroups = 1, userGroupNames } = staffFormData;
    const staffPassword = 'Manabie@2022';
    await cms.instruction(
        `Fill data to create a staff with name = ${name}, email = ${email}, and ${numberOfUserGroups} user groups`,
        async function () {
            const cmsPage = cms.page!;
            await cmsPage.fill(staffFormNameInput, name);
            await cmsPage.fill(staffFormEmailInput, email);
            const userGroupsListField = cmsPage.getByLabel('User Group');
            const isEnableStaffLocation = await isEnabledFeatureFlag(
                'STAFF_MANAGEMENT_STAFF_LOCATION'
            );

            await userGroupsListField.click();

            await assertNewestUserGroupsOnDropdownList(cms, context);

            const userGroups = context.get<UserGroupTypes[]>(userGroupsListAlias);

            if (userGroupNames?.length) {
                for (const userGroupName of userGroupNames) {
                    await userGroupsListField.fill(userGroupName);
                    await chooseAutocompleteOptionByExactText(cms, userGroupName);
                }
            } else {
                for (let i = 0; i < numberOfUserGroups; i++) {
                    await userGroupsListField.fill(userGroups[i].name);
                    await chooseAutocompleteOptionByExactText(cms, userGroups[i].name);
                }
            }

            // Lose the autocomplete focus.
            // To get the remaining chip tag when the selected user group is more than ten.
            await cms.selectElementByDataTestId(staffFormEmailInput);

            await assertMaxUserGroupChipsDisplay(cms);
            if (numberOfUserGroups > maxChipsAllowed) {
                await assertRemainUserGroupsChipDisplay(cms, numberOfUserGroups);
            }

            let locations: string[] = [];

            if (isEnableStaffLocation) {
                const grantedPermissionsLocations =
                    userGroups?.[0].grantedPermissions?.[0].locations;
                const locationField = page.locator(staffSelector.staffFormLocationInput);
                await locationField.click();

                if (grantedPermissionsLocations) {
                    locations = grantedPermissionsLocations.map((item) => item.name);
                    await chooseLocationsByName(cms, locations);
                } else {
                    locations = await chooseRandomUILocations(cms);
                }
                await clickOnSaveInDialog(cms);
            }

            context.set(userGroupsListAlias, []);
            context.set(staffProfileAlias, {
                name: name,
                email: email,
                password: staffPassword,
                organization: 'e2e',
                locations,
            });
        }
    );

    await cms.instruction('Click Save button multiple times', async function () {
        await clickMultipleTimes(cms, saveButton);
    });
}
export async function assertNewestUserGroupsOnDropdownList(
    cms: CMSInterface,
    context: ScenarioContext
) {
    await cms.waitingAutocompleteLoading(userGroupsAutocompleteLoading);
    await cms.instruction(
        'School admin sees first 13 newest user groups display on the dropdown list',
        async function () {
            const newestUserGroups = context.get<UserGroupTypes[]>(userGroupsListAlias);
            const userGroupOptions = await cms.getTextContentMultipleElements(
                userGroupsAutocompleteOption
            );
            userGroupOptions.forEach((userGroupName, index) => {
                weExpect(userGroupName).toBe(newestUserGroups[index].name);
            });
        }
    );
}

export async function assertMaxUserGroupChipsDisplay(cms: CMSInterface) {
    await cms.instruction(
        'School admin sees a maximum of 10 user group chips display on user group field',
        async function () {
            const userGroupChips = await cms.getTextContentMultipleElements(userGroupChip);
            weExpect(userGroupChips.length).toBeLessThanOrEqual(maxChipsAllowed);
        }
    );
}

export async function assertRemainUserGroupsChipDisplay(
    cms: CMSInterface,
    numberOfUserGroups: number
) {
    const expectNumOfRemainUserGroupsChip = numberOfUserGroups - maxChipsAllowed;
    await cms.instruction(
        `School admin sees ${expectNumOfRemainUserGroupsChip} remaining user group display in number chip`,
        async function () {
            const remainUserGroupsChipText =
                (await cms.getTextContentElement(remainUserGroupChip)) ?? '';
            const remainUserGroupsChip = extractNumberFromString(remainUserGroupsChipText);

            weExpect(remainUserGroupsChip).toBe(expectNumOfRemainUserGroupsChip);
        }
    );
}

export async function staffWithAdminRoleForgotPassword(
    cms: CMSInterface,
    context: ScenarioContext,
    isEnabledMultiTenantLogin: boolean
) {
    await adminResetPwdByForgotPwdFeature(cms, context);

    await cms.instruction('Go back to log in screen', async function () {
        await adminGoBackToLoginScreen(cms, isEnabledMultiTenantLogin);
    });
}

export function assertAllowedSidebarMenu(actualMenuItems: string[] | undefined, role: UserRole) {
    const allowedMenuItems: Menu[] = [];
    switch (role) {
        case UserRole.TEACHER:
            allowedMenuItems.push(
                Menu.LESSON_MANAGEMENT,
                Menu.TIMESHEET_MANAGEMENT,
                Menu.NOTIFICATION
            );
            break;
        case UserRole.SCHOOL_ADMIN:
            allowedMenuItems.push(...Object.values(Menu));
            break;
    }

    weExpect(
        actualMenuItems,
        'actual menu items have the same length with expected menu items'
    ).toHaveLength(allowedMenuItems.length);

    const isValidMenuItems = allowedMenuItems.reduce(
        (isValid, item) => isValid && actualMenuItems!.includes(item),
        true
    );

    weExpect(isValidMenuItems, 'actual menu have the same items with expected menu').toBe(true);
}

export function getUserGroupFromContext(
    context: ScenarioContext,
    role: UserGroupTypeAlias['grantedRole']
) {
    const userGroupGrantedRoles = context.get<UserGroupTypeAlias[]>(userGroupGrantedRoleList);
    return userGroupGrantedRoles.find((userGroup) => userGroup.grantedRole === role);
}

export async function assignStaffIdAndPasswordToStaffProfile(
    context: ScenarioContext,
    createStaffGRPCResp: Response
) {
    const decoder = createGrpcMessageDecoder(CreateStaffResponse);
    const encodedResponseText = await createStaffGRPCResp?.text();
    const staffDecodedResp = decoder.decodeMessage(encodedResponseText);
    const staffId = staffDecodedResp?.getStaff()?.getStaffId();
    const staffProfile = context.get<UserProfileEntity>(staffProfileAlias);
    staffProfile.id = staffId!;
    // To avoid the password property undefined when a user has the School Admin role.
    staffProfile.password = '123456';
}

export async function staffLogoutCurrentAccount(page: Page) {
    const buttonProfile = page?.locator(profileButtonSelector);
    await buttonProfile?.click();
    await page?.click(buttonLogout);
}

export async function staffLoginsAfterForgotPassword(context: ScenarioContext, cms: CMSInterface) {
    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );
    const { email, password } = context.get<UserProfileEntity>(staffProfileAlias);
    await adminLoginWithNewPassword(cms, email, password, isEnabledMultiTenantLogin ? 'e2e' : '');
}

export function getUserGroupProfileFromContext(
    context: ScenarioContext,
    role: UserGroupTypeAlias['grantedRole']
) {
    const userGroupsData = context.get<UserGroupTypes[]>(userGroupsDataAlias);

    const findUserGroupCallBack =
        role === 'Both roles'
            ? (userGroup: UserGroupTypes) => userGroup.grantedPermissions.length === 2
            : (userGroup: UserGroupTypes) =>
                  userGroup.grantedPermissions.some(
                      (grantedPermission) => grantedPermission.role === role
                  );

    const userGroupProfile = userGroupsData.find(findUserGroupCallBack);

    if (userGroupProfile) {
        return userGroupProfile;
    }

    throw Error('Cannot get user group profile. getUserGroupProfileFromContext');
}

export async function schoolAdminChangeStaffRole(
    cms: CMSInterface,
    context: ScenarioContext,
    newRole: UserRole
) {
    const endRowTable = await lastRowGrantedPermissionTableSelector(cms);
    const roleField = endRowTable?.locator(userGroupUpsertTableRole);
    await roleField?.click();
    await cms.chooseOptionInAutoCompleteBoxByText(newRole);

    if (newRole === UserRole.TEACHER) {
        // This step included the click save button action
        await schoolAdminEditGrantedLocationForTeacherRole(cms, context, {
            action: 'adds',
            role: newRole,
        });
    } else {
        await cms.instruction(
            'Click Save button multiple times',
            async function (this: CMSInterface) {
                await clickMultipleTimes(cms, saveButton);
                await cms.waitingForLoadingIcon();
            }
        );
    }
}

export async function staffSeesScreensRelateOnCMS(
    iMasterWorld: IMasterWorld,
    grantedRole: UserRole
) {
    const cms = iMasterWorld.cms;
    const cms2 = iMasterWorld.cms2;
    const cms2Page = cms2.page;
    const context = iMasterWorld.scenario;

    // School Admin can not reissue password for another admin
    if (grantedRole === UserRole.TEACHER) {
        await cms.instruction(
            `Forget password for staff account with ${grantedRole} role`,
            async function () {
                await forgotPasswordStaff(cms, context);
            }
        );

        await cms2.instruction(
            'New staff logins CMS2 successfully with new password',
            async function () {
                await staffLoginsAfterForgotPassword(context, cms2);
            }
        );

        await cms2.instruction(
            `Staff can see screens related with user group ${grantedRole}`,
            async function () {
                const menuItems = cms2Page?.locator(menuItemLinkRoot);
                const menuItemsText = await menuItems?.allTextContents();

                assertAllowedSidebarMenu(menuItemsText, grantedRole);
            }
        );
    } else {
        await cms2.instruction('New staff logins CMS2 failed', async function () {
            const { email, password } = context.get<UserProfileEntity>(staffProfileAlias);
            await loginCMSByUserNameAndPassWord(cms2, email, password);
            await aSchoolAdminOnCMSLoginPageAndSeeLoginForm(cms2);
        });
    }
}

export async function staffSeesScreensRelateOnTeacherWeb(
    teacher: TeacherInterface,
    context: ScenarioContext,
    grantedRole: UserRole
) {
    await teacher.instruction(
        'Staff logins teacher web',
        async function (teacher: TeacherInterface) {
            const { email, password } = context.get<UserProfileEntity>(staffProfileAlias);
            await teacherEnterAccountInformation({
                teacher,
                username: email,
                password: password,
            });
        }
    );

    if (grantedRole === UserRole.TEACHER) {
        await teacher.instruction(
            'Teacher already login success in Teacher Web',
            async function (teacher: TeacherInterface) {
                await aTeacherAlreadyLoginSuccessInTeacherWeb(teacher);
            }
        );
    } else {
        await teacher.instruction(
            `${grantedRole} already login failed in Teacher Web`,
            async function (teacher: TeacherInterface) {
                await aTeacherAlreadyLoginFailedInTeacherWeb(teacher);
            }
        );
    }
}

export async function schoolAdminChangeUserRoleInUserGroup(
    iMasterWorld: IMasterWorld,
    oldRole: UserRole,
    newRole: UserRole
) {
    const cms = iMasterWorld.cms;
    const context = iMasterWorld.scenario;

    await schoolAdminGoesToEditUserGroupPage(cms, context, oldRole);

    await cms.instruction(
        `school admin changes granted role from ${oldRole} to ${newRole}`,
        async function () {
            await schoolAdminChangeStaffRole(cms, context, newRole);
        }
    );
}

export async function schoolAdminGoesToEditUserGroupPage(
    cms: CMSInterface,
    context: ScenarioContext,
    role: UserGroupTypeAlias['grantedRole']
) {
    await cms.instruction('School admin goes to the user group page', async function () {
        await cms.schoolAdminIsOnThePage(Menu.USER_GROUP, 'User Group');
    });

    await cms.instruction('School admin changes rows per page to 100', async function () {
        const page = cms.page!;
        await page.click(rowsPerPage);
        await page.click(rowOption('100'));
        await cms.waitForSkeletonLoading();
    });

    await cms.instruction('School admin goes to edit user group page', async function () {
        const userGroupProfile = getUserGroupProfileFromContext(context, role);
        await schoolAdminGoesToEditPage(cms, userGroupProfile!);
    });
}

export async function schoolAdminEditGrantedLocationForTeacherRole(
    cms: CMSInterface,
    context: ScenarioContext,
    data: {
        action: LocationAction;
        role: string;
    }
) {
    const page = cms.page!;
    const { role, action } = data;
    const userGroupProfile = context.get<UserGroupTypes>(userGroupProfileAlias);
    let editLocations: LocationInfoGRPC[] = [];
    const newGrantedPermissions = [...userGroupProfile.grantedPermissions];

    if (action === 'adds') {
        const locationList = await retrieveLowestLocations(cms);
        editLocations = locationList.slice(5, 10);
        newGrantedPermissions.forEach((grantedPermission) => {
            if (grantedPermission.role === role)
                grantedPermission.locations = grantedPermission.locations.concat(editLocations);
        });
    } else {
        const teacherRoleLocations = userGroupProfile.grantedPermissions.find(
            (grantedPermission) => grantedPermission.role === role
        )?.locations;
        editLocations = getRandomElementsWithLength(teacherRoleLocations!, 1);
        const newLocations = teacherRoleLocations!.filter(
            (location) => location.locationId !== editLocations[0].locationId
        );
        newGrantedPermissions.forEach((grantedPermission) => {
            if (grantedPermission.role === role) grantedPermission.locations = newLocations;
        });
    }

    context.set(userGroupProfileAlias, {
        ...userGroupProfile,
        grantedPermissions: newGrantedPermissions,
    });

    const teacherRoleRow = page.locator(tableBaseRow, {
        has: page.locator(inputByValue(role)),
    });
    const locationField = teacherRoleRow?.locator(userGroupUpsertTableLocation);

    await cms.instruction('School admin clicks location field', async function () {
        await locationField?.locator(autoCompleteBaseInput)?.click();
        await cms.waitingForLoadingIcon();
    });

    await cms.instruction(`School admin ${action} some locations`, async function () {
        await chooseLocations(cms, editLocations);
        await clickOnSaveInDialog(cms);
    });

    await cms.instruction('Click Save button', async function () {
        await clickMultipleTimes(cms, saveButton, 1);
        await cms.waitingForLoadingIcon();
    });
}
