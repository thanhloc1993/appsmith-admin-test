import { TeacherKeys } from '@common/teacher-keys';
import { buttonByAriaLabel, tableBaseRow } from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    aTeacherAlreadyLoginSuccessInTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';
import {
    getRandomNumber,
    randomString,
    arrayHasItem,
    retrieveLowestLocations,
    getRandomElementsWithLength,
    getRandomPhoneNumber,
    getRandomDate,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    numberOfUserGroupsAlias,
    staffProfileAlias,
    staffProfileAliasWithAccountRoleSuffix,
    userGroupIdsListAlias,
} from '@user-common/alias-keys/user';
import * as staffSelector from '@user-common/cms-selectors/staff';
import { radioGenderButton } from '@user-common/cms-selectors/students-page';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';
import { StaffInfo, WorkingStatusType } from '@user-common/types/staff';
import { GenderType } from '@user-common/types/student';
import { chooseAutocompleteOptionByExactText } from '@user-common/utils/autocomplete-actions';
import { chooseLocationsByName, chooseRandomUILocations } from '@user-common/utils/locations';
import { selectFullDate } from '@user-common/utils/pick-date-time';

import { Locator } from 'playwright';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface, TeacherInterface, AccountRoles } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { usermgmtStaffModifierService } from '@supports/services/usermgmt-staff-service';
import NsUsermgmtStaffModifierService from '@supports/services/usermgmt-staff-service/request-types';
import { usermgmtUserModifierService } from '@supports/services/usermgmt-student-service';
import { CreateStudentResponseEntity } from '@supports/services/usermgmt-student-service/entities/create-student-response';
import { CancelButtonTypes, LocationInfoGRPC } from '@supports/types/cms-types';
import { formatDate } from '@supports/utils/time/time';

import { createARandomStudentGRPC } from './user-create-student-definitions';
import { createAnUserGroupGRPC } from './user-create-user-group-definitions';
import {
    applyOrgForLocationSetting,
    clickOnSaveInDialog,
    userStaffManagementBackOfficeStaffPhoneticName,
} from './user-definition-utils';
import { getUserGroupsWithTeacherRole } from './user-query-user-groups-hasura';
import { strictEqual } from 'assert';
import { ByValueKey } from 'flutter-driver-x';
import { Country } from 'manabuf/common/v1/enums_pb';
import { Gender, UserGroup } from 'manabuf/usermgmt/v2/enums_pb';
import { StaffWorkingStatus } from 'manabuf/usermgmt/v2/users_pb';

export async function schoolAdminIsOnTheCreateStaffPage(cms: CMSInterface) {
    await cms.instruction(
        'Go to Staff page and Click Create Button',
        async function (this: CMSInterface) {
            await cms.schoolAdminIsOnThePage(Menu.STAFF, 'Staff Management');
            await cms.selectAButtonByAriaLabel('Create');
        }
    );
}
export type StaffRequiredFields = 'All' | 'Name' | 'Email';

export async function schoolAdminCreateAStaff({
    cms,
    context,
    staffName,
    staffFirstName,
    staffLastName,
    staffEmail,
    organization,
    staffAlias,
}: {
    cms: CMSInterface;
    context: ScenarioContext;
    staffName: string;
    staffLastName: string;
    staffFirstName: string;
    staffEmail: string;
    organization?: string;
    staffAlias?: string;
}) {
    const page = cms.page!;
    const staffPassword = '123456';
    const isEnabledStaffPhoneticName = await featureFlagsHelper.isEnabled(
        userStaffManagementBackOfficeStaffPhoneticName
    );

    if (isEnabledStaffPhoneticName) {
        await cms.instruction(
            `Fill data to create a staff last name = ${staffLastName}, staff first name = ${staffFirstName} and email = ${staffEmail}`,
            async function (this: CMSInterface) {
                await page.fill(staffSelector.staffFormLastNameInput, staffLastName);
                await page.fill(staffSelector.staffFormFirstNameInput, staffFirstName);
                await page.fill(staffSelector.staffFormEmailInput, staffEmail);
            }
        );
    } else {
        await cms.instruction(
            `Fill data to create a staff name = ${staffName} and email = ${staffEmail}`,
            async function (this: CMSInterface) {
                await page.fill(staffSelector.staffFormNameInput, staffName);
                await page.fill(staffSelector.staffFormEmailInput, staffEmail);
            }
        );
    }

    await cms.instruction('Initialize and select user group', async function (this: CMSInterface) {
        const userGroup = await createAnUserGroupGRPC(cms);
        const userGroupField = page.locator(staffSelector.staffFormUserGroupField);
        await userGroupField.click();
        const userGroupInput = userGroupField.locator(staffSelector.staffFormUserGroupInput);
        await userGroupInput.fill(userGroup.userGroupName);
        await chooseAutocompleteOptionByExactText(cms, userGroup.userGroupName);
    });

    const isEnableStaffLocation = await isEnabledFeatureFlag('STAFF_MANAGEMENT_STAFF_LOCATION');

    if (isEnableStaffLocation) {
        await cms.instruction('Fill random locations', async function () {
            const locationField = page.locator(staffSelector.staffFormLocationInput);
            await locationField.click();
            await chooseRandomUILocations(cms);
            await clickOnSaveInDialog(cms);
        });
    }

    context.set(staffAlias || staffProfileAlias, {
        name: staffName,
        email: staffEmail,
        password: staffPassword,
        organization,
    });

    await cms.instruction('Click Save button', async function (this: CMSInterface) {
        await cms.selectAButtonByAriaLabel('Save');
    });
}

export async function schoolAdminFillsStaffForm(
    cms: CMSInterface,
    staff: StaffInfo,
    options?: {
        fillUserGroupOnEmpty: boolean;
        fillLocationOnEmpty: boolean;
        fillUserGroup: boolean;
    }
) {
    const page = cms.page!;
    let finalStaff: StaffInfo = { ...staff };
    const isEnableStaffLocation = await isEnabledFeatureFlag('STAFF_MANAGEMENT_STAFF_LOCATION');
    const isEnabledStaffPhoneticName = await featureFlagsHelper.isEnabled(
        userStaffManagementBackOfficeStaffPhoneticName
    );

    if (isEnabledStaffPhoneticName) {
        await cms.instruction(
            `School admin fills in last name (${staff.lastName})`,
            async function () {
                const nameField = page.locator(staffSelector.staffFormLastNameInput);
                await nameField.fill(staff.lastName);
            }
        );
        await cms.instruction(
            `School admin fills in first name (${staff.firstName})`,
            async function () {
                const nameField = page.locator(staffSelector.staffFormFirstNameInput);
                await nameField.fill(staff.firstName);
            }
        );
        await cms.instruction(
            `School admin fills in last name phonetic (${staff.lastNamePhonetic})`,
            async function () {
                const nameField = page.locator(staffSelector.staffFormLastNamePhoneticInput);
                await nameField.fill(staff.lastNamePhonetic);
            }
        );
        await cms.instruction(
            `School admin fills in first name phonetic (${staff.firstNamePhonetic})`,
            async function () {
                const nameField = page.locator(staffSelector.staffFormFirstNamePhoneticInput);
                await nameField.fill(staff.firstNamePhonetic);
            }
        );
    } else {
        await cms.instruction(`School admin fills in name (${staff.name})`, async function () {
            const nameField = page.locator(staffSelector.staffFormNameInput);
            await nameField.fill(staff.name);
        });
    }
    await cms.instruction(`School admin fills in email (${staff.name})`, async function () {
        const emailField = page.locator(staffSelector.staffFormEmailInput);
        await emailField.fill(staff.email);
    });
    await cms.instruction(
        `School admin fills in primary phone number (${staff.primaryPhoneNumber})`,
        async function () {
            const primaryPhoneNUmberField = page.locator(staffSelector.staffFormPrimaryPhoneInput);
            await primaryPhoneNUmberField.fill(staff.primaryPhoneNumber);
        }
    );
    await cms.instruction(
        `School admin fills in secondary phone number (${staff.secondaryPhoneNumber})`,
        async function () {
            const secondaryPhoneNUmberField = page.locator(
                staffSelector.staffFormSecondaryPhoneInput
            );
            await secondaryPhoneNUmberField.fill(staff.secondaryPhoneNumber);
        }
    );
    await cms.instruction(`School admin fills in birthday (${staff.birthday})`, async function () {
        await selectFullDate(cms, staff.birthday!, staffSelector.staffFormBirthDayInput);
    });
    await cms.instruction(`School admin fills in gender (${staff.gender})`, async function () {
        if (staff.gender !== 'NONE') {
            const genderField = page.locator(radioGenderButton(staff.gender));
            await genderField.click();
        }
    });
    if (isEnableStaffLocation) {
        await cms.instruction(`School admin chooses locations`, async function () {
            const locationField = page.locator(staffSelector.staffFormLocationInput);
            await locationField.hover();
            const clearIcon = locationField.locator(buttonByAriaLabel('Clear'));
            const isVisible = await clearIcon.isVisible();
            if (isVisible) await clearIcon.click();
            await locationField.click();
            if (staff.location.length) {
                await chooseLocationsByName(cms, staff.location);
            } else if (options?.fillLocationOnEmpty) {
                const locations = await chooseRandomUILocations(cms);
                finalStaff = { ...finalStaff, location: locations };
            }
            await clickOnSaveInDialog(cms);
        });
    }
    await cms.instruction(
        `School admin chooses working status (${staff.workingStatus})`,
        async function () {
            const workingStatusField = page.locator(staffSelector.staffFormWorkingStatusInput);
            await workingStatusField.click();
            await chooseAutocompleteOptionByExactText(cms, staff.workingStatus);
        }
    );
    await cms.instruction(`School admin fills start date (${staff.startDate})`, async function () {
        await selectFullDate(cms, staff.startDate!, staffSelector.staffFormStartDateInput);
    });
    await cms.instruction(`School admin fills in end date (${staff.endDate})`, async function () {
        await selectFullDate(cms, staff.endDate!, staffSelector.staffFormEndDateInput);
    });
    await cms.instruction(`School admin chooses in user group`, async function () {
        if (options?.fillUserGroup) {
            const userGroupField = page.locator(staffSelector.staffFormUserGroupField);
            await userGroupField.hover();
            const clearIcon = userGroupField.locator(buttonByAriaLabel('Clear'));
            const isVisible = await clearIcon.isVisible();
            if (isVisible) await clearIcon.click();
            if (staff.userGroup.length) {
                await userGroupField.click();
                for (const userGroup of staff.userGroup) {
                    await chooseAutocompleteOptionByExactText(cms, userGroup);
                }
            } else if (options?.fillUserGroupOnEmpty) {
                const userGroup = await chooseRandomUIUserGroup(cms);
                finalStaff = { ...finalStaff, userGroup };
            }
        }
    });
    await cms.instruction(`School admin fills in remarks (${staff.remarks})`, async function () {
        const remarksField = page.locator(staffSelector.staffFormRemarksInput);
        await remarksField.fill(staff.remarks);
    });

    await cms.instruction('School admin clicks Save button', async function (this: CMSInterface) {
        await cms.selectAButtonByAriaLabel('Save');
    });
    return finalStaff;
}

export async function assertStaffOnStaffList(
    cms: CMSInterface,
    staffLocator: Locator,
    staffInfo: StaffInfo
) {
    const isEnableStaffLocation = await isEnabledFeatureFlag('STAFF_MANAGEMENT_STAFF_LOCATION');
    await cms.instruction(
        `School admins sees name (${staffInfo.name}) on staff list`,
        async function () {
            const nameField = staffLocator.locator(staffSelector.staffListStaffName);
            const nameContent = await nameField.textContent();
            strictEqual(nameContent, staffInfo.name, 'Staff name should match with UI');
        }
    );
    await cms.instruction(
        `School admins sees email (${staffInfo.email}) on staff list`,
        async function () {
            const emailField = staffLocator.locator(staffSelector.staffListStaffEmail);
            const emailContent = await emailField.textContent();
            strictEqual(emailContent, staffInfo.email, 'Staff email should match with UI');
        }
    );

    await cms.instruction(`School admins sees userGroup on staff list`, async function () {
        const userGroupField = staffLocator.locator(staffSelector.staffListStaffUserGroup);
        const userGroupContent = await userGroupField.textContent();
        await assertStaffUserGroupAndLocation(userGroupContent!, staffInfo.userGroup, 'user group');
    });

    if (isEnableStaffLocation) {
        await cms.instruction(`School admins sees location on staff list`, async function () {
            const locationField = staffLocator.locator(staffSelector.staffListStaffLocation);
            const locationContent = await locationField.textContent();
            await assertStaffUserGroupAndLocation(locationContent!, staffInfo.location, 'location');
        });
    }
}

export async function assertStaffOnStaffDetail(cms: CMSInterface, staffInfo: StaffInfo) {
    const page = cms.page!;
    const isEnableStaffLocation = await isEnabledFeatureFlag('STAFF_MANAGEMENT_STAFF_LOCATION');
    const convertedStaffInfo = {
        ...staffInfo,
        primaryPhoneNumber: staffInfo.primaryPhoneNumber ? staffInfo.primaryPhoneNumber : '--',
        secondaryPhoneNumber: staffInfo.secondaryPhoneNumber
            ? staffInfo.secondaryPhoneNumber
            : '--',
        birthday: staffInfo.birthday ? formatDate(staffInfo.birthday, 'YYYY/MM/DD') : '--',
        gender: staffInfo.gender !== 'NONE' ? staffInfo.gender : '--',
        startDate: staffInfo.startDate ? formatDate(staffInfo.startDate, 'YYYY/MM/DD') : '--',
        endDate: staffInfo.endDate ? formatDate(staffInfo.endDate, 'YYYY/MM/DD') : '--',
        remarks: staffInfo.remarks ? staffInfo.remarks : '--',
    };

    const nameField = page.locator(staffSelector.staffDetailStaffName);
    const nameContent = await nameField.textContent();
    strictEqual(nameContent, convertedStaffInfo.name, 'Staff name should match with UI');

    const emailField = page.locator(staffSelector.staffDetailStaffEmail);
    const emailContent = await emailField.textContent();
    strictEqual(emailContent, convertedStaffInfo.email, 'Staff email should match with UI');

    const primaryPhoneNumberField = page.locator(staffSelector.staffDetailStaffPrimaryPhoneNumber);
    const primaryPhoneNumberContent = await primaryPhoneNumberField.textContent();
    strictEqual(
        primaryPhoneNumberContent,
        convertedStaffInfo.primaryPhoneNumber,
        'Staff primary phone number should match with UI'
    );

    const secondaryPhoneNumberField = page.locator(
        staffSelector.staffDetailStaffSecondaryPhoneNumber
    );
    const secondaryPhoneNumberContent = await secondaryPhoneNumberField.textContent();
    strictEqual(
        secondaryPhoneNumberContent,
        convertedStaffInfo.secondaryPhoneNumber,
        'Staff secondary phone number should match with UI'
    );

    const birthdayField = page.locator(staffSelector.staffDetailStaffBirthday);
    const birthdayContent = await birthdayField.textContent();

    strictEqual(
        birthdayContent,
        convertedStaffInfo.birthday,
        `Staff birthday should match with UI`
    );

    const genderField = page.locator(staffSelector.staffDetailStaffGender);
    const genderContent = await genderField.textContent();
    strictEqual(
        genderContent?.toUpperCase(),
        convertedStaffInfo.gender,
        `Staff gender should match with UI`
    );

    const userGroupField = page.locator(staffSelector.staffDetailStaffUserGroup);
    const userGroupContent = await userGroupField.textContent();
    await assertStaffUserGroupAndLocation(
        userGroupContent!,
        convertedStaffInfo.userGroup,
        'user group'
    );

    const workingStatusField = page.locator(staffSelector.staffDetailStaffStatus);
    const workingStatusContent = await workingStatusField.textContent();
    strictEqual(
        workingStatusContent,
        convertedStaffInfo.workingStatus,
        `Staff working status should match with UI`
    );

    const startDateField = page.locator(staffSelector.staffDetailStaffStartDate);
    const startDateContent = await startDateField.textContent();
    strictEqual(
        startDateContent,
        convertedStaffInfo.startDate,
        `Staff start date should match with UI`
    );

    const endDateField = page.locator(staffSelector.staffDetailStaffEndDate);
    const endDateContent = await endDateField.textContent();
    strictEqual(endDateContent, convertedStaffInfo.endDate, `Staff end date should match with UI`);

    const remarksField = page.locator(staffSelector.staffDetailStaffRemarks);
    const remarksContent = await remarksField.textContent();
    strictEqual(remarksContent, convertedStaffInfo.remarks, `Staff remarks should match with UI`);

    if (isEnableStaffLocation) {
        const locationField = page.locator(staffSelector.staffDetailStaffLocation);
        const locationContent = await locationField.textContent();
        await assertStaffUserGroupAndLocation(locationContent!, staffInfo.location, 'location');
    }
}

export async function assertStaffUserGroupAndLocation(
    content: string,
    data: string[],
    field: 'user group' | 'location'
) {
    if (data.length) {
        const data = content?.split(', ');
        strictEqual(data?.length, data.length, `Staff ${field} should match with UI`);
        for (const itemContent of data) {
            const hasData = data.findIndex((item) => item === itemContent);
            weExpect(hasData, `Staff ${field} should match with UI`).toBeGreaterThanOrEqual(0);
        }
    } else {
        strictEqual(content, '--', `Staff ${field} should match with UI`);
    }
}

export async function chooseRandomUIUserGroup(cms: CMSInterface, amount = 1) {
    const page = cms.page!;
    const userGroupList = [];
    const userGroupField = page.locator(staffSelector.staffFormUserGroupField);
    await userGroupField.click();
    const userGroupOptions = page.locator(staffSelector.autocompleteBaseOption);
    const userGroupOptionsCount = await userGroupOptions.count();
    const length = userGroupOptionsCount <= amount ? userGroupOptionsCount : amount;

    const userGroupOptionElements = await userGroupOptions.elementHandles();
    const randomUserGroups = getRandomElementsWithLength(userGroupOptionElements, length);
    for (const userGroup of randomUserGroups) {
        await userGroup.scrollIntoViewIfNeeded();
        await userGroup.click();
        const content = await userGroup.textContent();
        if (content) userGroupList.push(content);
    }
    return userGroupList;
}

export async function getStaffOnStaffList(cms: CMSInterface, name: string) {
    const page = cms.page!;
    const staffLocator = page.locator(`${tableBaseRow}:has-text("${name}")`);
    return staffLocator;
}

export async function schoolAdminSeesNewStaffInCMS(
    cms: CMSInterface,
    context: ScenarioContext,
    staffAlias?: string
) {
    const staffProfile = context.get<UserProfileEntity>(staffAlias || staffProfileAlias);
    const page = cms.page!;
    const isEnableStaffLocation = await isEnabledFeatureFlag('STAFF_MANAGEMENT_STAFF_LOCATION');

    await cms.instruction('Go to staff page', async function (this: CMSInterface) {
        await cms.schoolAdminIsOnThePage(Menu.STAFF, 'Staff Management');
        await cms!.waitForSkeletonLoading();
    });

    if (isEnableStaffLocation) {
        await cms.instruction(
            'School admin selects org location on location setting',
            async function () {
                await applyOrgForLocationSetting(cms);
            }
        );
    }

    await cms.instruction(
        'See the staff name & email on staff list',
        async function (this: CMSInterface) {
            await cms.waitForSelectorWithText(staffSelector.staffListStaffName, staffProfile.name);
            await cms.waitForSelectorWithText(
                staffSelector.staffListStaffEmail,
                staffProfile.email
            );
        }
    );

    await cms.instruction('Click newly created staff name', async function (this: CMSInterface) {
        const createdStaffName = await cms.waitForSelectorWithText(
            staffSelector.staffListStaffName,
            staffProfile.name
        );
        await createdStaffName?.click();
        await cms.waitForSkeletonLoading();
    });

    await cms.instruction(
        'See the staff name & email on staff detail',
        async function (this: CMSInterface) {
            const staffDetailName = await cms.getTextContentElement(
                staffSelector.staffDetailStaffName
            );
            const staffDetailEmail = await cms.getTextContentElement(
                staffSelector.staffDetailStaffEmail
            );
            weExpect(staffDetailName, 'UI should contain data name value').toContain(
                staffProfile.name
            );
            weExpect(staffDetailEmail, 'UI should contain data email value').toContain(
                staffProfile.email
            );
        }
    );
    const regexMatchUrlStaffDetailPage = /[\w-.:\\/]+(\/staff\/)|(\/show)/g;
    const url = page.url();
    const staffId = url.replace(regexMatchUrlStaffDetailPage, '');
    context.set(staffAlias || staffProfileAlias, {
        ...staffProfile,
        id: staffId,
    });
}

export async function forgotPasswordStaff(
    cms: CMSInterface,
    context: ScenarioContext,
    staffAlias?: string
) {
    const staff = context.get<UserProfileEntity>(staffAlias || staffProfileAlias);
    const newPassword = randomString(6);
    context.set(staffAlias || staffProfileAlias, { ...staff, password: newPassword });
    await getNewPassword(cms, staff.id, newPassword);
}

export async function staffLoginAccountFromTeacherWorld({
    teacher,
    context,
    staffAlias,
    organization,
}: {
    teacher: TeacherInterface;
    context: ScenarioContext;
    staffAlias?: string;
    organization?: string;
}) {
    const { email, password } = context.get<UserProfileEntity>(staffAlias || staffProfileAlias);

    await teacher.instruction(
        'Login by the staff username and password on Teacher App',
        async function (this: TeacherInterface) {
            await teacherEnterAccountInformation({
                teacher: this,
                username: email,
                password,
                defaultOrganization: organization,
            });
        }
    );

    await teacher.instruction(
        'Login successfully on Teacher App',
        async function (this: TeacherInterface) {
            await aTeacherAlreadyLoginSuccessInTeacherWeb(this);
        }
    );
}

export async function getNewPassword(cms: CMSInterface, userId: string, newPassword: string) {
    const token = await cms.getToken();

    await usermgmtUserModifierService.reissuePassword(token, { userId, newPassword });
}

export async function staffSeesTheirInfo(
    teacher: TeacherInterface,
    context: ScenarioContext,
    staffAlias?: string
) {
    const { name } = context.get<UserProfileEntity>(staffAlias || staffProfileAlias);

    const joinLessonButton = new ByValueKey(TeacherKeys.appBarName(name));
    await teacher.flutterDriver?.waitFor(joinLessonButton);
}

export async function schoolAdminClicksOnCancelButton(cms: CMSInterface) {
    await cms.instruction(
        'school admin clicks on cancel button',
        async function (this: CMSInterface) {
            await this.selectAButtonByAriaLabel('Cancel');
        }
    );
}

export async function schoolAdminClicksOnCloseButton(cms: CMSInterface) {
    await cms.instruction(
        'school admin clicks on cancel button',
        async function (this: CMSInterface) {
            await this.selectAButtonByAriaLabel('close');
        }
    );
}

export async function discardStaffUpsertForm(cms: CMSInterface, button: CancelButtonTypes) {
    await cms.instruction(`school admin clicks on ${button} button`, async function () {
        switch (button) {
            case 'cancel':
                await schoolAdminClicksOnCancelButton(cms);
                break;
            case 'escape':
                await cms.page!.keyboard.press('Escape');
                break;
            default:
                await schoolAdminClicksOnCloseButton(cms);
                break;
        }
    });
}

export async function createAStaffGRPCAndSetProfileToScenarioContext(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const userGroupIdsListToAssign = getUserGroupIdsFromContext(context);

    const staff = await createARandomStaffFromGRPC(cms, userGroupIdsListToAssign);

    context.set(staffProfileAliasWithAccountRoleSuffix('teacher'), staff);
    context.set(staffProfileAlias, staff);
}

export function formatStaffWorkingStatus(
    status: keyof typeof StaffWorkingStatus
): WorkingStatusType {
    if (status === 'AVAILABLE') return 'Available';
    else if (status === 'RESIGNED') return 'Resigned';
    else return 'On Leave';
}

/// Test gRPC call function
export async function createRandomStaffByGRPC(
    cms: CMSInterface,
    staff?: Partial<NsUsermgmtStaffModifierService.createStaffReq>
): Promise<StaffInfo> {
    const token = await cms.getToken();
    const cmsProfile = await cms.getProfile();
    const firstName = `${randomString(8)}@manabie.com`;
    const lastName = `e2e-staff.${getRandomNumber()}`;
    const name = `${lastName} ${firstName}`;
    const email = `${lastName}.${firstName}`;
    const locationsList = await retrieveLowestLocations(cms);
    const userGroupList = await getUserGroupsWithTeacherRole(cms);
    const staffReq: NsUsermgmtStaffModifierService.createStaffReq = {
        name,
        email,
        country: Country.COUNTRY_JP,
        gender: Gender.MALE,
        phoneNumber: '',
        avatar: '',
        organizationId: String(cmsProfile.schoolId),
        userGroup: UserGroup.USER_GROUP_TEACHER,
        userGroupIdsList: [userGroupList[0].user_group_id],
        locationIdsList: [locationsList[0].locationId],
        primaryPhoneNumber: getRandomPhoneNumber(),
        secondaryPhoneNumber: getRandomPhoneNumber() + 1,
        birthday: getRandomDate(),
        workingStatus: StaffWorkingStatus.AVAILABLE,
        remarks: randomString(20),
        startDate: new Date(),
        endDate: new Date(),
        ...staff,
    };

    const { response } = await usermgmtStaffModifierService.createStaff(token, staffReq);
    const staffId = response?.staff?.staffId;
    await cms.attach(`staffId: ${staffId}, staffReq:${JSON.stringify(staffReq)}`);

    return {
        staffId,
        name: staffReq.name,
        email: staffReq.email,
        // TODO: @dvbtrung2302 update when integrate update staff with phonetic
        firstName,
        lastName,
        lastNamePhonetic: '',
        firstNamePhonetic: '',
        fullNamePhonetic: '',
        gender: Object.keys(Gender)[staffReq.gender] as GenderType,
        birthday: staffReq.birthday,
        primaryPhoneNumber: staffReq.primaryPhoneNumber,
        secondaryPhoneNumber: staffReq.secondaryPhoneNumber,
        workingStatus: formatStaffWorkingStatus(
            Object.keys(StaffWorkingStatus)[
                staffReq.workingStatus
            ] as keyof typeof StaffWorkingStatus
        ),
        userGroup: userGroupList
            .filter((userGroup) => staffReq.userGroupIdsList.includes(userGroup.user_group_id))
            .map((userGroup) => userGroup.user_group_name),
        userGroupIdsList: [userGroupList[0].user_group_id],
        startDate: staffReq.startDate,
        endDate: staffReq.endDate,
        location: locationsList
            .filter((location) => staffReq.locationIdsList.includes(location.locationId))
            .map((location) => location.name),
        remarks: staffReq.remarks,
    };
}

export async function createRandomStaffByGRPCAndReissuePassword(
    cms: CMSInterface,
    staff?: Partial<NsUsermgmtStaffModifierService.createStaffReq>
): Promise<StaffInfo> {
    const token = await cms.getToken();
    const newPassword = '123456789';
    const createdStaff = await createRandomStaffByGRPC(cms, staff);
    await usermgmtUserModifierService.reissuePassword(token, {
        userId: createdStaff.staffId!,
        newPassword,
    });
    return {
        ...createdStaff,
        password: newPassword,
    };
}

export async function createARandomStaffFromGRPC(
    cms: CMSInterface,
    userGroupIdsList: string[] = []
): Promise<UserProfileEntity> {
    const staff: UserProfileEntity = await createAnUserGRPC(
        cms,
        UserGroup.USER_GROUP_TEACHER,
        userGroupIdsList
    );

    return staff;
}

export async function createAnUserGRPC(
    cms: CMSInterface,
    userGroup: UserGroup,
    userGroupIdsList: string[] = []
): Promise<UserProfileEntity> {
    const token = await cms.getToken();
    const newPassword = '123456789';
    const phoneNumber = getRandomNumber();
    const firstName = `${randomString(8)}@manabie.com`;
    const lastName = `e2e-${userGroup}-staff.${getRandomNumber()}`;
    const staffName = `${lastName} ${firstName}`;
    const email = `${lastName}.${firstName}`;
    const cmsProfile = await cms.getProfile();

    const locations: LocationInfoGRPC[] = [];
    const locationsListFromAPI = await retrieveLowestLocations(cms);

    if (arrayHasItem(locationsListFromAPI)) {
        locations.push(locationsListFromAPI[0]);
    } else {
        throw Error('There are no locations from API');
    }

    const locationsIdList = [locations[0].locationId];

    if (!userGroupIdsList.length) {
        const teacherGroups = await getUserGroupsWithTeacherRole(cms);

        const defaultUserGroupId = teacherGroups[0].user_group_id;
        userGroupIdsList.push(defaultUserGroupId);
    }

    const response = await usermgmtStaffModifierService.createStaff(token, {
        name: staffName,
        email,
        country: Country.COUNTRY_JP,
        phoneNumber: String(phoneNumber),
        avatar: '',
        organizationId: String(cmsProfile.schoolId),
        userGroup,
        userGroupIdsList,
        locationIdsList: locationsIdList,
        gender: Gender.MALE,
        primaryPhoneNumber: '',
        secondaryPhoneNumber: '',
        workingStatus: 0,
        remarks: '',
    });

    const { staffId, name, avatar } = response.response!.staff!;

    await usermgmtUserModifierService.reissuePassword(token, { userId: staffId, newPassword });

    return {
        id: staffId,
        email,
        name: name,
        lastName,
        firstName,
        avatar: avatar,
        phoneNumber: String(phoneNumber),
        givenName: '',
        password: newPassword,
        userGroupIdsList,
    };
}

export async function createRandomStudentThenSaveToContext(
    cms: CMSInterface,
    role: AccountRoles,
    context: ScenarioContext
) {
    const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {});
    const student = response.student;
    context.set(learnerProfileAliasWithAccountRoleSuffix(role), student);
}

export function getUserGroupIdsFromContext(context: ScenarioContext, numOfUserGroups = 1) {
    const numberOfUserGroups =
        context.get<number | undefined>(numberOfUserGroupsAlias) ?? numOfUserGroups;

    const userGroupsListFromBackGroundStep = context.get<string[] | undefined>(
        userGroupIdsListAlias
    );

    return userGroupsListFromBackGroundStep && userGroupsListFromBackGroundStep.length
        ? userGroupsListFromBackGroundStep.slice(0, numberOfUserGroups)
        : [];
}

export async function assertNotificationLoginResult(cms: CMSInterface, option: string) {
    if (option === 'without user group') {
        await cms.assertNotification("Sorry, this account don't have permission to login");
    } else {
        await cms.assertNotification(
            "You don't have permission. Your current role is not in allowed roles"
        );
    }
}
