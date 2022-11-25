import { LearnerKeys } from '@common/learner-key';
import { dialogFullScreen } from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    fillUserNameAndPasswordLearnerWeb,
    loginOnLearnerApp,
} from '@legacy-step-definitions/learner-email-login-definitions';
import { getRandomNumber } from '@legacy-step-definitions/utils';
import {
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAlias,
    studentCoursePackagesAlias,
} from '@user-common/alias-keys/user';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import { dialogWithHeaderFooterWrapper } from '@user-common/cms-selectors/students-page';

import { DataTable, Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, CMSInterface, IMasterWorld, LearnerInterface } from '@supports/app-types';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { formatDate } from '@supports/utils/time/time';

import {
    clickOnSaveButtonInStudent,
    createRandomStudentData,
    fillStudentNotRequiredField,
    schoolAdminGoesToStudentDetailAndEdit,
} from './user-definition-utils';
import {
    discardStudentUpsertForm,
    schoolAdminHasAddCourseToStudentByGRPC,
    schoolAdminSeesEditedStudentOnCMS,
    updateStudentName,
} from './user-update-student-definitions';
import { verifyNewlyLearnerOnTeacherApp } from './user-view-course-definitions';
import { tapOnSwitchButtonAndSelectKid } from './user-view-student-details-definitions';

Given('school admin has added the new course for student', schoolAdminHasAddCourseToStudentByGRPC);

When('school admin edits student name', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile, true);

    await cms.instruction('Update name of student', async () => {
        await updateStudentName(this, learnerProfile);
    });
});

Then('school admin sees the edited name on CMS', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    await cms.instruction('Verify the edited student name', async () => {
        const student = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        await schoolAdminSeesEditedStudentOnCMS(cms, student, {
            hasLoggedInTag: false,
            shouldVerifyNeverLoggedInTag: false,
        });
    });
});

Then(
    'parent logins Learner App successfully with credentials which school admin gives',
    async function (this: IMasterWorld) {
        const parent = this.parent!;
        const parentProfile: UserProfileEntity[] = await this.scenario.get(parentProfilesAlias);

        await parent.instruction(
            'Fill username, password and press login button',
            async function (this: LearnerInterface) {
                await fillUserNameAndPasswordLearnerWeb({
                    learner: this,
                    username: parentProfile[0].email,
                    password: parentProfile[0].password,
                });
            }
        );

        await parent.instruction(
            'Logged in, see home screen',
            async function (this: LearnerInterface) {
                await aLearnerAlreadyLoginSuccessInLearnerWeb(this);
            }
        );
    }
);

Then('parent sees the edited student name on Learner App', async function (this: IMasterWorld) {
    const parent = this.parent!;
    const scenarioContext = this.scenario;

    await parent.openHomeDrawer();

    await parent.instruction(`Click on Stats tab`, async function () {
        await parent.clickOnTab(LearnerKeys.stats_tab, LearnerKeys.stats_page);
    });

    await parent.instruction(`Find current kid name on switch kid component`, async function () {
        const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        await tapOnSwitchButtonAndSelectKid(parent, learnerProfile);
    });
});

Then('student sees the edited name on Learner App', async function (this: IMasterWorld) {
    const learner = this.learner;
    const { context } = this.scenario;
    const learnerProfile: UserProfileEntity = await context.get(learnerProfileAlias);

    await learner.instruction(`Learner logs out the app`, async function () {
        await learner.logout();
    });

    await learner.instruction(
        `Learner logs in the app again & sees edited name`,
        async function () {
            await loginOnLearnerApp({
                learner,
                email: learnerProfile.email,
                name: learnerProfile.name,
                password: learnerProfile.password,
            });
        }
    );
});

Then('teacher sees the edited student name on Teacher App', async function (this: IMasterWorld) {
    const teacher = this.teacher;
    const { context } = this.scenario;
    const courses: StudentCoursePackageEntity[] = await context.get(studentCoursePackagesAlias);
    const student: UserProfileEntity = await context.get(learnerProfileAlias);

    await verifyNewlyLearnerOnTeacherApp(
        teacher,
        student,
        courses[0].courseId,
        courses[0].courseName
    );
});

When(
    'school admin edits student with not required fields into {string}',
    async function (
        this: IMasterWorld,
        typeValue: 'blank' | 'normal',
        unusedFieldsDataTable: DataTable
    ) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        const unusedFields = typeValue === 'blank' ? unusedFieldsDataTable : undefined;

        const {
            studentExternalId,
            studentNote,
            birthday,
            gender,
            firstNamePhonetic,
            lastNamePhonetic,
        } = await createRandomStudentData(cms, {
            unusedFields,
        });
        await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile, true);

        await fillStudentNotRequiredField(
            cms,
            `Fill in student information with fields not required into ${typeValue}`,
            {
                studentExternalId,
                studentNote,
                birthday,
                gender,
                firstNamePhonetic,
                lastNamePhonetic,
            }
        );

        learnerProfile.studentExternalId = studentExternalId;
        learnerProfile.studentNote = studentNote;
        learnerProfile.birthday = birthday ? formatDate(birthday, 'YYYY/MM/DD') : '';
        learnerProfile.gender = gender;
        learnerProfile.firstNamePhonetic = firstNamePhonetic;
        learnerProfile.lastNamePhonetic = lastNamePhonetic;
        learnerProfile.fullNamePhonetic = `${lastNamePhonetic} ${firstNamePhonetic}`.trim();

        await clickOnSaveButtonInStudent(cms);
    }
);

When(
    'school admin cancels the edits student with not required fields is {string}',
    async function (
        this: IMasterWorld,
        typeValue: 'blank' | 'normal',
        unusedFieldsDataTable: DataTable
    ) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        const unusedFields = typeValue === 'blank' ? unusedFieldsDataTable : undefined;
        const {
            studentExternalId,
            studentNote,
            birthday,
            gender,
            firstNamePhonetic,
            lastNamePhonetic,
        } = await createRandomStudentData(cms, {
            unusedFields,
        });
        await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile, true);

        await fillStudentNotRequiredField(
            cms,
            `Fill in student information with fields not required into ${typeValue}`,
            {
                studentExternalId,
                studentNote,
                birthday,
                gender,
                firstNamePhonetic,
                lastNamePhonetic,
            }
        );

        await cms.instruction(`Click on cancel button`, async function () {
            await cms.cancelDialogAction();
            await cms.page?.waitForSelector(dialogWithHeaderFooterWrapper);
        });

        await cms.selectAButtonByAriaLabel('Leave');
        await cms.waitingForLoadingIcon();

        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    }
);

Then('school admin sees old data of student', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    await schoolAdminSeesEditedStudentOnCMS(cms, learnerProfile, {
        hasLoggedInTag: false,
        shouldVerifyNeverLoggedInTag: false,
    });
});

Then('school admin sees the edited student data on CMS', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    await schoolAdminSeesEditedStudentOnCMS(cms, learnerProfile, {
        hasLoggedInTag: false,
        shouldVerifyNeverLoggedInTag: false,
    });
});

When(
    'school admin edits student with external student ID which duplicated with {string}',
    async function (this: IMasterWorld, studentAccount: AccountRoles) {
        const cms = this.cms;
        const page = this.cms.page!;
        const scenarioContext = this.scenario;

        const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        const studentS1Profile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(studentAccount)
        );

        // Reload to get new data on UI
        await page.reload();
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        await schoolAdminSeesEditedStudentOnCMS(cms, studentS1Profile, {
            hasLoggedInTag: false,
            shouldVerifyNeverLoggedInTag: false,
        });
        await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile, true);

        await fillStudentNotRequiredField(
            cms,
            `Fill in student information with duplicate external student ID`,
            {
                studentExternalId: studentS1Profile.studentExternalId,
                studentNote: learnerProfile.studentNote,
            }
        );

        learnerProfile.studentExternalId = studentS1Profile.studentExternalId;

        await clickOnSaveButtonInStudent(cms);

        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    }
);

When('school admin edits a student with draft information', async function (this: IMasterWorld) {
    const cms = this.cms;

    const scenarioContext = this.scenario;

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    await cms.instruction(
        'school admin goes to edit student page',
        async function (cms: CMSInterface) {
            await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile, true);
        }
    );

    await cms.instruction(
        'school admin edits student with draft information',
        async function (cms: CMSInterface) {
            await cms.page?.fill(
                studentPageSelectors.textareaStudentNote,
                `note-edited-${getRandomNumber()}`
            );
        }
    );
});

When(
    'school admin cancels the updating student using {string}',
    async function (this: IMasterWorld, button: string) {
        await this.cms.instruction(
            `school admin cancels the updating student using ${button}`,
            async function (cms: CMSInterface) {
                await discardStudentUpsertForm(cms, button);
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

Then('school admin sees edit student full-screen dialog closed', async function () {
    const cms = this.cms;
    const cmsPage = cms.page!;

    await cms.instruction('Assert the dialog is closed', async function () {
        const editStudentDialog = await cmsPage.$(dialogFullScreen);

        weExpect(editStudentDialog).toBeNull();
    });
});

Then(
    'school admin sees the student with new data is not saved',
    async function (this: IMasterWorld) {
        const cms = this.cms;

        const scenario = this.scenario;

        await cms.instruction(
            'school admin sees the student with new data is not saved',
            async () => {
                const learnerProfile = scenario.get<UserProfileEntity>(learnerProfileAlias);

                await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
                await schoolAdminSeesEditedStudentOnCMS(cms, learnerProfile, {
                    hasLoggedInTag: false,
                    shouldVerifyNeverLoggedInTag: false,
                });
            }
        );
    }
);
