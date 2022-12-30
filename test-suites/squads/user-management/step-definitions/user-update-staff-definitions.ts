import { TeacherKeys } from '@common/teacher-keys';
import {
    changeRowsPerPage,
    getUserProfileFromContext,
    makeRandomTextMessage,
    arrayHasItem,
    retrieveLowestLocations,
    getRandomNumber,
} from '@legacy-step-definitions/utils';
import { randomString } from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
    staffProfileAlias,
} from '@user-common/alias-keys/user';
import {
    staffDetailStaffEmail,
    staffDetailStaffName,
    staffFormEmailInput,
    staffFormNameInput,
    staffFormLastNameInput,
    staffFormFirstNameInput,
    staffListStaffEmail,
    staffListStaffName,
} from '@user-common/cms-selectors/staff';
import { rowOption, rowsPerPage } from '@user-common/cms-selectors/student';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { InvalidEmailTypes, LocationInfoGRPC } from '@supports/types/cms-types';

import { createARandomStaffFromGRPC } from './user-create-staff-definitions';
import {
    goToStaffDetailsPage,
    userStaffManagementBackOfficeStaffPhoneticName,
} from './user-definition-utils';
import { updateAnUserGRPC } from './user-definition-utils';
import { StaffTypes } from './user-view-staff-list-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { Gender } from 'manabuf/usermgmt/v2/enums_pb';
import {
    teacherSelectStudentChatGroup,
    teacherSelectParentGroupChat,
} from 'test-suites/squads/communication/step-definitions/communication-join-chat-group-definitions';
import {
    teacherEnterTextMessage,
    teacherSendTextMessage,
} from 'test-suites/squads/communication/step-definitions/communication-send-message-definitions';

export async function goToEditStaffPage(cms: CMSInterface, scenarioContext: ScenarioContext) {
    const staff = getUserProfileFromContext(
        scenarioContext,
        staffProfileAliasWithAccountRoleSuffix('teacher')
    );

    await cms.instruction('Go to staff page', async function (this: CMSInterface) {
        await cms.schoolAdminIsOnThePage(Menu.STAFF, 'Staff Management');
        await cms.waitForSkeletonLoading();
    });

    await cms.instruction('School admin changes rows per page to 100', async function () {
        const page = cms.page!;
        await page.click(rowsPerPage);
        await page.click(rowOption('100'));
        await cms.waitForSkeletonLoading();
    });

    await goToStaffDetailsPage(cms, staff.name);

    await cms.instruction('Go to edit staff page', async function (this: CMSInterface) {
        await cms.selectAButtonByAriaLabel('Edit');
    });
}

export async function editStaffName(cms: CMSInterface, scenarioContext: ScenarioContext) {
    const staff = getUserProfileFromContext(
        scenarioContext,
        staffProfileAliasWithAccountRoleSuffix('teacher')
    );
    const firstName = `${staff.firstName}-edited`;
    const lastName = `${staff.lastName}-edited`;
    const name = `${lastName} ${firstName}`;
    scenarioContext.set(staffProfileAlias, {
        ...staff,
        firstName,
        lastName,
        name,
    });

    const isEnabledStaffPhoneticName = await featureFlagsHelper.isEnabled(
        userStaffManagementBackOfficeStaffPhoneticName
    );

    await cms.instruction(
        `Fill data to edit a staff name = ${name}`,
        async function (this: CMSInterface) {
            if (isEnabledStaffPhoneticName) {
                await this.page?.fill(staffFormFirstNameInput, firstName);
                await this.page?.fill(staffFormLastNameInput, lastName);
            } else {
                await this.page?.fill(staffFormNameInput, name);
            }
        }
    );

    await cms.instruction('Click Save button', async function (this: CMSInterface) {
        await this.selectAButtonByAriaLabel('Save');
    });
}

export async function teacherSendMessage(teacher: TeacherInterface) {
    const messageText = makeRandomTextMessage();
    await teacherEnterTextMessage(teacher, messageText);
    await teacherSendTextMessage(teacher);
}

export async function schoolAdminSeesNewUpdatedStaff(cms: CMSInterface, staff: UserProfileEntity) {
    const { name, email, lastName, firstName } = staff;
    await cms.instruction('Go to staff page', async function (this: CMSInterface) {
        await cms.schoolAdminIsOnThePage(Menu.STAFF, 'Staff Management');
        await cms.waitForSkeletonLoading();
    });

    await cms.instruction(
        `school admin has chosen 100 rows per page in the first result page`,
        async function () {
            await changeRowsPerPage(cms, 100);
            await cms.waitForSkeletonLoading();
        }
    );

    await cms.instruction(
        `See the newly staff name and email on staff list`,
        async function (this: CMSInterface) {
            await cms.waitForSelectorHasText(staffListStaffName, name);
            await cms.waitForSelectorHasText(staffListStaffEmail, email);
        }
    );

    await goToStaffDetailsPage(cms, staff.name);

    await cms.instruction(
        `See the newly staff name and email on staff detail`,
        async function (this: CMSInterface) {
            const staffNameText = await cms.getTextContentElement(staffDetailStaffName);
            const staffEmailText = await cms.getTextContentElement(staffDetailStaffEmail);
            weExpect(staffNameText, 'UI should contain data name value').toContain(name);
            weExpect(staffEmailText, 'UI should contain data name value').toContain(email);
        }
    );

    await cms.instruction('Go to edit staff page', async function (this: CMSInterface) {
        await cms.selectAButtonByAriaLabel('Edit');
    });

    await cms.instruction(
        `See the newly staff name and email on staff upsert`,
        async function (this: CMSInterface) {
            const isEnabledStaffPhoneticName = await featureFlagsHelper.isEnabled(
                userStaffManagementBackOfficeStaffPhoneticName
            );

            if (isEnabledStaffPhoneticName) {
                const staffLastNameInputValue = await cms.getValueOfInput(staffFormLastNameInput);
                weExpect(
                    staffLastNameInputValue,
                    'UI should contain data last name value'
                ).toContain(lastName);
                const staffFirstNameInputValue = await cms.getValueOfInput(staffFormFirstNameInput);
                weExpect(
                    staffFirstNameInputValue,
                    'UI should contain data first name value'
                ).toContain(firstName);
            } else {
                const staffNameInputValue = await cms.getValueOfInput(staffFormNameInput);
                weExpect(staffNameInputValue, 'UI should contain data name value').toContain(name);
            }
            const staffEmailInputValue = await cms.getValueOfInput(staffFormEmailInput);
            weExpect(staffEmailInputValue, 'UI should contain data name value').toContain(email);
        }
    );
}

export async function staffSeesNewUpdatedStaffNameInAppBar(
    teacher: TeacherInterface,
    staffName: string
) {
    const appBarName = new ByValueKey(TeacherKeys.appBarName(staffName));
    await teacher.flutterDriver?.waitFor(appBarName, 30000);
}

export async function teacherSelectConversation(
    teacher: TeacherInterface,
    scenarioContext: ScenarioContext,
    type: 'parent' | 'student'
) {
    const student = getUserProfileFromContext(
        scenarioContext,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    if (type === 'student') {
        await teacherSelectStudentChatGroup(teacher, student.id);
    } else {
        await teacherSelectParentGroupChat(teacher, student.id);
    }
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

export async function fillEmailWithValidData(cms: CMSInterface, context: ScenarioContext) {
    const staffProfile = getUserProfileFromContext(
        context,
        staffProfileAliasWithAccountRoleSuffix('teacher')
    );
    const firstName = `${randomString(8)}@manabie.com`;
    const lastName = `e2e-staff.${getRandomNumber()}-edited`;
    const name = `${lastName} ${firstName}`;
    const email = `${lastName}.${firstName}`;

    await cms.instruction(
        `Fill new valid email to email field`,
        async function (cms: CMSInterface) {
            const isEnabledStaffPhoneticName = await featureFlagsHelper.isEnabled(
                userStaffManagementBackOfficeStaffPhoneticName
            );

            await cms.page?.fill(staffFormEmailInput, email);
            if (isEnabledStaffPhoneticName) {
                await cms.page?.fill(staffFormFirstNameInput, firstName);
                await cms.page?.fill(staffFormLastNameInput, lastName);
            } else {
                await cms.page?.fill(staffFormNameInput, name);
            }
        }
    );
    context.set(staffProfileAlias, {
        ...staffProfile,
        name,
        firstName,
        lastName,
        email,
    });
}

export async function fillEmailWithInvalidData(cms: CMSInterface, data: InvalidEmailTypes) {
    let newEmail = '';
    switch (data) {
        case 'invalid email format':
            newEmail = randomString(10);
            break;
        case 'existed email':
            {
                const newStaff = await createARandomStaffFromGRPC(cms);
                newEmail = newStaff.email;
            }
            break;
    }

    await cms.page?.fill(staffFormEmailInput, newEmail);

    await cms.instruction(`school admin clicks on Save button`, async function () {
        await cms.selectAButtonByAriaLabel('Save');
    });
}

export async function updateStaffByGRPC(cms: CMSInterface, staff: StaffTypes) {
    const locations: LocationInfoGRPC[] = [];
    const locationsListFromAPI = await retrieveLowestLocations(cms);

    if (arrayHasItem(locationsListFromAPI)) {
        locations.push(locationsListFromAPI[0]);
    } else {
        throw Error('There are no locations from API');
    }

    const locationsIdList = [locations[0].locationId];

    await cms.instruction(
        `School admin edits staff name=${staff.name} and staff email=${staff.email}`,
        async function () {
            await updateAnUserGRPC(cms, {
                staffId: staff.user_id,
                name: staff.name,
                email: staff.email,
                userGroupIdsList: staff.userGroupIdsList || [],
                locationIdsList: staff.locationIdsList || locationsIdList,
                gender: Gender.MALE,
                staffPhoneNumberList: [],
                workingStatus: 0,
                remarks: '',
            });
        }
    );
}

export async function goToStaffPageAndChangeRowsPerPage(cms: CMSInterface, numberOfRows = '100') {
    await cms.instruction('Go to staff page', async function (this: CMSInterface) {
        await cms.schoolAdminIsOnThePage(Menu.STAFF, 'Staff Management');
        await cms.waitForSkeletonLoading();
    });

    await cms.instruction('School admin changes rows per page to 50', async function () {
        const page = cms.page!;
        await page.click(rowsPerPage);
        await page.click(rowOption(numberOfRows));
        await cms.waitForSkeletonLoading();
    });
}
