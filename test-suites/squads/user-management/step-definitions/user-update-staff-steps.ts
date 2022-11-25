import { buttonLogout, profileButtonSelector } from '@legacy-step-definitions/cms-selectors/appbar';
import { saveButton, submitButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { aSchoolAdminAlreadyLoginSuccessInCMS } from '@legacy-step-definitions/school-admin-email-login-definitions';
import {
    aTeacherAlreadyLoginSuccessInTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';
import { getRandomNumber, randomString } from '@legacy-step-definitions/utils';
import {
    currentTypeErrorAlias,
    staffProfileAlias,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import {
    dialogFullScreenContent,
    staffFormNameInput,
    staffListStaffName,
    textFieldEmailRoot,
} from '@user-common/cms-selectors/staff';
import { StaffInfo, UpsertStaffConditionType } from '@user-common/types/staff';

import { Then, When, Given } from '@cucumber/cucumber';

import {
    CMSInterface,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { CancelButtonTypes, ClickingTypes, InvalidEmailTypes } from '@supports/types/cms-types';

import {
    assertStaffOnStaffDetail,
    assertStaffOnStaffList,
    createARandomStaffFromGRPC,
    discardStaffUpsertForm,
    getStaffOnStaffList,
    schoolAdminFillsStaffForm,
    schoolAdminSeesNewStaffInCMS,
} from './user-create-staff-definitions';
import { createRandomStaffData } from './user-definition-utils';
import { ErrorsEmailMessage } from './user-edit-student-email-steps';
import { fillTestAccountMultiTenantLoginInCMS } from './user-multi-tenant-authentication-definitions';
import { searchStaffOnCMS } from './user-search-for-staff-definitions';
import {
    staffSeesNewUpdatedStaffNameInAppBar,
    goToEditStaffPage,
    editStaffName,
    schoolAdminSeesNewUpdatedStaff,
    fillEmailWithValidData,
    updateStaffByGRPC,
    fillEmailWithInvalidData,
} from './user-update-staff-definitions';
import { UserGroup } from 'manabuf/usermgmt/v2/enums_pb';
import {
    moveTeacherToMessagePage,
    moveLearnerToMessagePage,
    teacherSelectedUnJoinedTab,
} from 'test-suites/squads/communication/step-definitions/communication-common-definitions';

When('school admin edits staff name', async function (this: IMasterWorld) {
    const scenario = this.scenario;

    await this.cms.instruction(
        'school admin goes to edit staff page',
        async function (this: CMSInterface) {
            await goToEditStaffPage(this, scenario);
        }
    );

    await this.cms.instruction(
        'school admin edits staff name',
        async function (this: CMSInterface) {
            await editStaffName(this, scenario);
        }
    );
});

Then('school admin sees the edited staff name on CMS', async function (this: IMasterWorld) {
    const scenario = this.scenario;
    await this.cms.instruction(
        'school admin sees new updated staff',
        async function (this: CMSInterface) {
            const staff = scenario.get<UserProfileEntity>(staffProfileAlias);

            await schoolAdminSeesNewUpdatedStaff(this, staff);
        }
    );
});

Then('staff sees the edited staff name on Teacher App', async function (this: IMasterWorld) {
    const scenarioContext = this.scenario;
    const staffProfile = scenarioContext.get<UserProfileEntity>(staffProfileAlias);

    await this.teacher.instruction(
        'staff logs out this account',
        async function (this: TeacherInterface) {
            await this.logout();
        }
    );

    await this.teacher.instruction(
        'staff logins page again',
        async function (teacher: TeacherInterface) {
            await teacherEnterAccountInformation({
                teacher,
                username: staffProfile.email,
                password: staffProfile.password,
            });
        }
    );

    await this.teacher.instruction(
        'staff sees the edited staff name',
        async function (teacher: TeacherInterface) {
            await staffSeesNewUpdatedStaffNameInAppBar(teacher, staffProfile.name);
        }
    );
});

//TODO: Rearrange the steps and wait the lesson is done to check on the lesson
Then('student sees the edited staff name on Learner App', async function (this: IMasterWorld) {
    await this.teacher.instruction(
        'staff opens conversation page',
        async function (this: TeacherInterface) {
            await moveTeacherToMessagePage(this);
        }
    );

    await this.learner.instruction(
        'Student opens conversation page',
        async function (this: LearnerInterface) {
            await moveLearnerToMessagePage(this);
        }
    );

    await this.teacher.instruction(
        'staff selects unjoined tab',
        async function (this: TeacherInterface) {
            await teacherSelectedUnJoinedTab(this);
        }
    );

    /// Comment until this issue is resolved: https://manabie.atlassian.net/browse/LT-6295
    //    await this.teacher.instruction(
    //         'Teacher selects student conversation',
    //         async function (this: TeacherInterface) {
    //             await teacherSelectConversation(this, scenario, 'student');
    //         }
    //     );

    //     await this.teacher.instruction(
    //         'Teacher joins chat group',
    //         async function (this: TeacherInterface) {
    //             await teacherTapJoinChatGroupButton(this);
    //         }
    //     );

    //     await this.teacher.instruction(
    //         'Teacher sends message to student',
    //         async function (this: TeacherInterface) {
    //             await teacherSendMessage(this);
    //         }
    //     );

    //TODO: wait for feature get teacher name in conversation

    // await this.learner.instruction(
    //     'Student see teacher name',
    //     async function (this: LearnerInterface) {

    //     }
    // );
});

//TODO: Rearrange the steps and wait the lesson is done to check on the lesson
Then('parent sees the edited staff name on Learner App', async function (this: IMasterWorld) {
    await this.teacher.instruction(
        'staff selects unjoined tab',
        async function (this: TeacherInterface) {
            await teacherSelectedUnJoinedTab(this);
        }
    );

    /// Comment until this issue is resolved: https://manabie.atlassian.net/browse/LT-6295
    // await this.teacher.instruction(
    //     'Teacher selects parent conversation',
    //     async function (this: TeacherInterface) {
    //         await teacherSelectConversation(this, scenario, 'parent');
    //     }
    // );

    // await this.teacher.instruction(
    //     'Teacher joins chat group',
    //     async function (this: TeacherInterface) {
    //         await teacherTapJoinChatGroupButton(this);
    //     }
    // );

    // await this.teacher.instruction(
    //     'Teacher sends message to parent',
    //     async function (this: TeacherInterface) {
    //         await teacherSendMessage(this);
    //     }
    // );

    //TODO: wait for feature get teacher name in conversation

    // await this.learner.instruction(
    //     'Parent see teacher name',
    //     async function (this: LearnerInterface) {

    //     }
    // );
});

When('school admin edits staff with draft information', async function (this: IMasterWorld) {
    const scenario = this.scenario;

    await this.cms.instruction(
        'school admin goes to edit staff page',
        async function (cms: CMSInterface) {
            await goToEditStaffPage(cms, scenario);
        }
    );

    await this.cms.instruction(
        'school admin edits staff with draft information',
        async function (cms: CMSInterface) {
            const staffName = `e2e-staff-edited-${getRandomNumber()}`;
            await cms.page?.fill(staffFormNameInput, staffName);
        }
    );
});

When(
    'school admin cancels the updating staff using {string}',
    async function (this: IMasterWorld, button: CancelButtonTypes) {
        await this.cms.instruction(
            `school admin cancels the updating staff using ${button}`,
            async function (cms: CMSInterface) {
                await discardStaffUpsertForm(cms, button);
            }
        );

        await this.cms.instruction(
            'school admin confirm cancel edit dialog',
            async function (cms: CMSInterface) {
                await cms.selectAButtonByAriaLabel('Leave');
            }
        );
    }
);

Then('school admin sees the staff with new data is not saved', async function (this: IMasterWorld) {
    const cms = this.cms;
    await cms.instruction(
        'school admin sees the staff with new data is not saved',
        async function (this: CMSInterface) {
            const upsertDialog = cms.page!.locator(dialogFullScreenContent);
            await upsertDialog.waitFor({ state: 'visible' });
        }
    );
});

When('school admin edits staff name as empty', async function (this: IMasterWorld) {
    const scenario = this.scenario;

    await this.cms.instruction(
        'school admin goes to edit staff page',
        async function (cms: CMSInterface) {
            await goToEditStaffPage(cms, scenario);
        }
    );

    await this.cms.instruction(
        `Fill empty to create a staff name`,
        async function (cms: CMSInterface) {
            await cms.page?.fill(staffFormNameInput, '');
        }
    );
});

When('school admin clicks on Save button', async function (this: IMasterWorld) {
    await this.cms.instruction(
        'school admin clicks on Save button',
        async function (cms: CMSInterface) {
            await cms.selectAButtonByAriaLabel('Save');
        }
    );
});

Then('school admin sees required error message', async function (this: IMasterWorld) {
    await this.cms.instruction(`school admin sees required error message`, async () => {
        await this.cms.assertTypographyWithTooltip('p', 'This field is required');
    });
});

When('school admin edits staff email with valid data', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenario = this.scenario;

    await cms.instruction(
        'school admin goes to edit staff page',
        async function (cms: CMSInterface) {
            await goToEditStaffPage(cms, scenario);
        }
    );
    await cms.instruction('school admin edits email with valid data', async function () {
        await fillEmailWithValidData(cms, scenario);
    });
});

When(
    'school admin clicks on Save button {string}',
    async function (this: IMasterWorld, times: ClickingTypes) {
        const cms = this.cms;
        await cms.instruction(`school admin clicks on Save button`, async function () {
            const saveBtn = cms.page!.locator(saveButton);
            switch (times) {
                case 'continuously':
                    await saveBtn.click({ clickCount: 5, force: true });
                    break;
                default:
                    await saveBtn.click();
                    break;
            }
        });
    }
);

Then('school admin sees the staff email is updated on CMS', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenario = this.scenario;
    await cms.instruction(
        'Go to the list staff page and see new staff',
        async function (this: CMSInterface) {
            await schoolAdminSeesNewStaffInCMS(cms, scenario);
        }
    );
});

Then('staff logins Teacher App with new email successfully', async function (this: IMasterWorld) {
    const teacher = this.teacher;
    const scenario = this.scenario;
    await teacher.instruction(
        'staff logs out current account',
        async function (this: TeacherInterface) {
            await this.logout();
        }
    );
    const { email, password } = await scenario.get<UserProfileEntity>(staffProfileAlias);
    await teacher.instruction(
        'staff logins again with new email',
        async function (teacher: TeacherInterface) {
            await teacherEnterAccountInformation({
                teacher,
                username: email,
                password,
            });
        }
    );
    await teacher.instruction(
        'Login successfully on Teacher App',
        async function (this: TeacherInterface) {
            await aTeacherAlreadyLoginSuccessInTeacherWeb(this);
        }
    );
});

Then('staff logins CMS with new email successfully', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenario = this.scenario;
    const page = cms.page!;
    await cms.instruction('staff logs out current account', async function (this: CMSInterface) {
        await this.selectElementByDataTestId(profileButtonSelector);

        await page?.click(buttonLogout);
    });
    const { email, password } = await scenario.get<UserProfileEntity>(staffProfileAlias);

    await cms.instruction('staff logins again with new email', async function (this: CMSInterface) {
        await fillTestAccountMultiTenantLoginInCMS(this, {
            organization: 'e2e',
            username: email,
            password: password,
        });
    });

    await page.click(submitButton);

    await cms.instruction('Logged in, see home page', async function (cms: CMSInterface) {
        await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
    });
});

Given('school admin has edited a staff email', async function (this: IMasterWorld) {
    const cms = this.cms;
    const context = this.scenario;
    const staff = context.get<UserProfileEntity>(staffProfileAliasWithAccountRoleSuffix('teacher'));
    const newStaffEmail = `e2e-${UserGroup.USER_GROUP_TEACHER}.${getRandomNumber()}.${randomString(
        10
    ).toLowerCase()}@manabie.com`;

    await cms.instruction(`school admin edits staff email to ${newStaffEmail}`, async function () {
        await updateStaffByGRPC(cms, {
            user_id: staff.id,
            name: staff.name,
            userGroupIdsList: staff.userGroupIdsList,
            email: newStaffEmail,
        });
    });

    context.set(staffProfileAlias, { ...staff, email: newStaffEmail });
});

When(
    'school admin edits staff with {string}',
    async function (this: IMasterWorld, condition: UpsertStaffConditionType) {
        const cms = this.cms;
        const context = this.scenario;
        const createdStaff = context.get<StaffInfo>(staffProfileAlias);
        let newStaff: StaffInfo = {
            ...createdStaff,
            birthday: new Date(createdStaff.birthday!),
            startDate: new Date(createdStaff.startDate!),
            endDate: new Date(createdStaff.endDate!),
        };
        const editStaffOptions = {
            fillLocationOnEmpty: true,
            fillUserGroupOnEmpty: true,
        };
        switch (condition) {
            case 'only mandatory inputs': {
                const randomName = `e2e-staff.${getRandomNumber()}.${randomString(10)}`;
                newStaff = {
                    ...newStaff,
                    name: randomName,
                    email: `${randomName}@manabie.com`,
                    location: [],
                };
                break;
            }
            case 'all valid inputs':
                newStaff = createRandomStaffData();
                break;
            case 'empty name':
                newStaff.name = '';
                break;
            case 'empty email':
                newStaff.email = '';
                break;
            case 'empty location':
                newStaff.location = [];
                editStaffOptions.fillLocationOnEmpty = false;
                break;
            case 'invalid email format':
                newStaff.email = newStaff.name;
                break;
            case 'invalid phone number format':
                newStaff.primaryPhoneNumber = '123456';
                newStaff.secondaryPhoneNumber = '123456';
                break;
            case 'duplicate phone number':
                newStaff.secondaryPhoneNumber = newStaff.primaryPhoneNumber;
                break;
            case 'existed email': {
                const existedStaff = await createARandomStaffFromGRPC(cms);
                newStaff.email = existedStaff.email;
                break;
            }
        }

        await cms.instruction('Shool admin goes to edit page', async function () {
            await cms.schoolAdminIsOnThePage(Menu.STAFF, 'Staff Management');
            await searchStaffOnCMS(cms, createdStaff.name);

            const staffLocator = await getStaffOnStaffList(cms, createdStaff.name);
            const staffName = staffLocator.locator(staffListStaffName);
            await staffName.click();
            await cms.selectAButtonByAriaLabel('Edit');
        });
        await cms.instruction(`School admin edits staff with ${condition}`, async function () {
            const editedStaff = await schoolAdminFillsStaffForm(cms, newStaff, editStaffOptions);
            context.set(staffProfileAlias, editedStaff);
        });
    }
);

Then(
    'school admin sees the edited staff data is updated on CMS',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const cms = this.cms;
        const staffInfo = context.get<StaffInfo>(staffProfileAlias);
        await cms.instruction('School admin goes to staff page', async function () {
            await cms.schoolAdminIsOnThePage(Menu.STAFF, 'Staff Management');
        });
        await searchStaffOnCMS(cms, staffInfo.name);

        const staffLocator = await getStaffOnStaffList(cms, staffInfo.name);

        await cms.instruction(
            'School admin sees created staff is displayed correctly on staff list',
            async function () {
                await assertStaffOnStaffList(cms, staffLocator, staffInfo);
            }
        );

        await cms.instruction('School admin goes to staff detail', async function () {
            const staffName = staffLocator.locator(staffListStaffName);
            await staffName.click();
        });

        await cms.instruction(
            'School admin sees created staff is displayed correctly on staff detail',
            async function () {
                await assertStaffOnStaffDetail(cms, staffInfo);
            }
        );
    }
);
When(
    'school admin edits staff email to {string}',
    async function (this: IMasterWorld, value: InvalidEmailTypes) {
        const cms = this.cms;
        const context = this.scenario;

        await cms.instruction(
            'school admin goes to edit staff page',
            async function (cms: CMSInterface) {
                await goToEditStaffPage(cms, context);
            }
        );

        await cms.instruction(`school admin edits email with ${value}`, async function () {
            await fillEmailWithInvalidData(cms, value);
        });

        context.set(currentTypeErrorAlias, value);
    }
);

Then('school admin sees a related error message', async function (this: IMasterWorld) {
    const cms = this.cms;
    const context = this.scenario;
    const error = context.get<InvalidEmailTypes>(currentTypeErrorAlias);

    await cms.instruction(
        `School admin sees an error for ${error} message email`,
        async function (cms) {
            const rootEmail = await cms.page?.waitForSelector(textFieldEmailRoot);
            const elementError = await rootEmail?.waitForSelector('p');
            const textContentError = await elementError?.textContent();
            switch (error) {
                case 'blank field ':
                    weExpect(textContentError).toBe(ErrorsEmailMessage.REQUIRED);
                    break;
                case 'invalid email format':
                    weExpect(textContentError).toBe(ErrorsEmailMessage.INVALID);
                    break;
                case 'existed email':
                    weExpect(textContentError).toBe(ErrorsEmailMessage.EXISTS_ON_SYSTEM);
                    break;
            }
        }
    );
});
