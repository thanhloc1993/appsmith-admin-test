import { TeacherKeys } from '@common/teacher-keys';
import {
    changeRowsPerPage,
    getRandomNumber,
    getUserProfileFromContext,
    makeRandomTextMessage,
    arrayHasItem,
    retrieveLowestLocations,
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
    staffListStaffEmail,
    staffListStaffName,
} from '@user-common/cms-selectors/staff';
import { rowOption, rowsPerPage } from '@user-common/cms-selectors/student';

import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { InvalidEmailTypes, LocationInfoGRPC } from '@supports/types/cms-types';

import { createARandomStaffFromGRPC } from './user-create-staff-definitions';
import { goToStaffDetailsPage } from './user-definition-utils';
import { updateAnUserGRPC } from './user-definition-utils';
import { StaffTypes } from './user-view-staff-list-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { Gender, UserGroup } from 'manabuf/usermgmt/v2/enums_pb';
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
    const newStaffName = `e2e-staff-edited-${getRandomNumber()}`;
    scenarioContext.set(staffProfileAlias, {
        ...staff,
        name: newStaffName,
    });

    await cms.instruction(
        `Fill data to edit a staff name = ${newStaffName}`,
        async function (this: CMSInterface) {
            await this.page?.fill(staffFormNameInput, newStaffName);
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
    const { name, email } = staff;
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
            const staffNameInputValue = await cms.getValueOfInput(staffFormNameInput);
            const staffEmailInputValue = await cms.getValueOfInput(staffFormEmailInput);
            weExpect(staffNameInputValue, 'UI should contain data name value').toContain(name);
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
    const newEmail = `e2e-${UserGroup.USER_GROUP_TEACHER}.${getRandomNumber()}.${randomString(
        10
    )}@manabie.com`;
    await cms.instruction(
        `Fill new valid email to email field`,
        async function (cms: CMSInterface) {
            await cms.page?.fill(staffFormEmailInput, newEmail);
        }
    );
    context.set(staffProfileAlias, {
        ...staffProfile,
        email: newEmail,
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
