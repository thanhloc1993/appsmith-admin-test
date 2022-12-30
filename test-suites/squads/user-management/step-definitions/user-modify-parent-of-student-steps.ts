import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import {
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    fillEmailAndPassword,
    fillUserNameAndPasswordLearnerWeb,
    loginLearnerAccountFailed,
    loginOnLearnerApp,
} from '@legacy-step-definitions/learner-email-login-definitions';
import { EditedParentInformation } from '@legacy-step-definitions/types/content';
import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
    editedParentProfilesAlias,
} from '@user-common/alias-keys/user';
import { parentInputPasswordSelector } from '@user-common/cms-selectors/student';
import { dialogStudentAccountInfoFooterButtonClose } from '@user-common/cms-selectors/students-page';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { CreateStudentResponseEntity } from '@supports/services/usermgmt-student-service/entities/create-student-response';
import { LocationObjectGRPC, StudentDetailTab } from '@supports/types/cms-types';

import {
    checkKidChartStatistic,
    clickOnAddParentAndFillInParentInformation,
    clickOnSaveButtonInParentElement,
    createARandomStudentGRPC,
    findLearnerOnSwitchKidComponent,
    searchAndSelectExistedParent,
    schoolAdminChooseTabInStudentDetail,
    schoolAdminCreateNewStudentWithExistingParent,
} from './user-create-student-definitions';
import {
    assertErrorMessageInEditPage,
    checkStudentDoesNotExistedInStatsPage,
    checkStudentExistedInStatsPage,
    EmailType,
    updateParentInfo,
    openDialogEditParentOnCMS,
    editParentEmail,
    removeParentFromStudent,
} from './user-modify-parent-of-student-definitions';
import {
    tapOnSwitchButtonAndSelectKid,
    seeNewlyCreatedStudentOnCMS,
    verifyRecordOfParentInStudent,
} from './user-view-student-details-definitions';

// Scenario: Add new parent when editing student
When(
    'school admin adds new {string} for {string}',
    async function (this: IMasterWorld, accountRole: AccountRoles, learner: AccountRoles) {
        const cms = this.cms;
        const page = cms.page!;
        const { context } = this.scenario;

        const student: UserProfileEntity = await context.get(
            learnerProfileAliasWithAccountRoleSuffix(learner)
        );

        const parentAccount = learner === 'student S2' ? 'parent P2' : 'parent P1';

        const parents: UserProfileEntity[] = await context.get(
            parentProfilesAliasWithAccountRoleSuffix(parentAccount)
        );

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile: student,
                parents,
                studentCoursePackages: [],
            },
            shouldSelectAllLocations: false,
        });

        await cms.instruction(`Go to Family Tab`, async function () {
            await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
        });

        await cms.instruction(`Add and fill new ${accountRole} info`, async () => {
            const parentInfo2 = await clickOnAddParentAndFillInParentInformation(
                cms,
                student.email
            );
            const passwordParent2 = await page.getAttribute(parentInputPasswordSelector, 'value');
            const parent1: UserProfileEntity[] = await context.get(
                parentProfilesAliasWithAccountRoleSuffix('parent P1')
            )[0];
            const parent2 = {
                email: parentInfo2.userName,
                password: passwordParent2,
                phoneNumber: parentInfo2.phoneNumber,
                name: parentInfo2.parentName,
            };

            context.set(parentProfilesAliasWithAccountRoleSuffix(learner), [parent1]);
            context.set(parentProfilesAliasWithAccountRoleSuffix('parent P2'), [parent2]);
            await page.click(dialogStudentAccountInfoFooterButtonClose);
        });
    }
);

// Scenario :Add existed parent when editing new created student
Given(
    'school admin has created a {string} with student info',
    async function (this: IMasterWorld, accountRole: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const page = cms.page!;

        await cms.instruction('Create a new student S2 by calling API', async () => {
            const firstGrantedLocation =
                scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
            const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {
                parentLength: 0,
                locations: [firstGrantedLocation],
            });
            const student = response.student;

            this.scenario.set(learnerProfileAliasWithAccountRoleSuffix(accountRole), student);
        });

        await page.reload();
    }
);

When(
    'school admin adds existed {string} for {string}',
    async function (this: IMasterWorld, parent: AccountRoles, leaner: AccountRoles) {
        const cms = this.cms;
        const { context } = this.scenario;

        const newStudent = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(leaner)
        );

        const parentProfile: UserProfileEntity = await context.get(
            parentProfilesAliasWithAccountRoleSuffix(parent)
        )[0];

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile: newStudent,
                parents: [],
                studentCoursePackages: [],
            },
            shouldSelectAllLocations: false,
        });
        await searchAndSelectExistedParent(cms, parentProfile.email);

        context.set(parentProfilesAliasWithAccountRoleSuffix(leaner), [parentProfile]);
    }
);

Then(
    'school admin sees {string} parent on parent list of {string}',
    async function (this: IMasterWorld, parentLength: string, learner: AccountRoles) {
        const cms = this.cms;
        const { context } = this.scenario;

        const parents: UserProfileEntity[] = await context.get(
            parentProfilesAliasWithAccountRoleSuffix(learner)
        );
        const learnerProfile: UserProfileEntity = await context.get(
            learnerProfileAliasWithAccountRoleSuffix(learner)
        );

        await cms.instruction(`Back to student page`, async () => {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        });

        await cms.instruction(
            `Check info student ${learnerProfile.name} on detail page`,
            async () => {
                await seeNewlyCreatedStudentOnCMS({
                    cms,
                    data: {
                        learnerProfile,
                        parents,
                        studentCoursePackages: [],
                    },
                    shouldSelectAllLocations: false,
                });

                await verifyRecordOfParentInStudent(cms, parseInt(parentLength));
            }
        );
    }
);

Then(
    'user {string} logins Learner App successfully with his existed credentials',
    async function (this: IMasterWorld, parent1: AccountRoles) {
        const parent: UserProfileEntity = await this.scenario.context.get(
            parentProfilesAliasWithAccountRoleSuffix(parent1)
        )[0];

        await loginOnLearnerApp({
            learner: this.parent,
            email: parent.email,
            name: parent.name,
            password: parent.password,
        });
    }
);

// TODO: change the role into AccountRole so every role can find the driver.
Then(
    'user {string} logins Learner App successfully with credentials which school admin gives',
    async function (this: IMasterWorld, role: 'parent P2' | 'student S1') {
        const profileMapper = {
            'parent P2': {
                profile: this.scenario.get<UserProfileEntity[]>(
                    parentProfilesAliasWithAccountRoleSuffix('parent P2')
                ),
                interface: this.parent,
            },
            'student S1': {
                profile: this.scenario.get<UserProfileEntity>(
                    learnerProfileAliasWithAccountRoleSuffix('student S1')
                ),
                interface: this.learner,
            },
        };
        const { profile } = profileMapper[role];
        // profile[0] is new parent P2
        const convertProfile = Array.isArray(profile) ? profile[0] : profile;

        await loginOnLearnerApp({
            learner: profileMapper[role].interface,
            email: convertProfile.email,
            name: convertProfile.name,
            password: convertProfile.password,
        });
    }
);

Then(
    "{string} sees {string} student's stats on Learner App",
    async function (this: IMasterWorld, _accountRole: AccountRoles, studentType: number | 'all') {
        const parent = this.parent!;

        await parent.openHomeDrawer();

        await parent.instruction(`Click on Stats tab`, async function () {
            await parent.clickOnTab(SyllabusLearnerKeys.stats_tab, SyllabusLearnerKeys.stats_page);
        });

        const kids = await parent.getKidsOfParent();
        const lengthOfKids = studentType === 'all' ? kids.kidsOfParent.length : studentType;
        const kidsProfile: UserProfileEntity[] = [];

        for (let index = 1; index <= lengthOfKids; index++) {
            const profile = this.scenario.get<UserProfileEntity>(
                learnerProfileAliasWithAccountRoleSuffix(`student S${index}` as AccountRoles)
            );
            kidsProfile.push(profile);
        }

        await kidsProfile.reduce((currentPromise, kid, index) => {
            return currentPromise.then(async () => {
                await parent.instruction(
                    `Find student S${index + 1}: ${
                        kid.name
                    } and re-tap the kid to see nothing happen`,
                    async () => await tapOnSwitchButtonAndSelectKid(parent, kid)
                );
                // Check text student
                await parent.instruction(
                    `Find student S${index + 1}: ${kid.name}`,
                    async () => await findLearnerOnSwitchKidComponent(parent, kid)
                );
                await parent.instruction(
                    `Check student S${index + 1} chart statistic: ${kid.name}`,
                    async () => await checkKidChartStatistic(parent)
                );
            });
        }, Promise.resolve());
    }
);

When(
    'school admin edits {string} info of {string}',
    async function (this: IMasterWorld, parent: AccountRoles, student: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const parentProfiles = scenarioContext.get<CreateStudentResponseEntity['parents']>(
            parentProfilesAliasWithAccountRoleSuffix(parent)
        );
        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(student)
        );

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile,
                parents: parentProfiles,
                studentCoursePackages: [],
            },
            shouldSelectAllLocations: false,
        });
        await cms.instruction(`Go to Family Tab`, async function () {
            await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
        });

        await openDialogEditParentOnCMS(cms, parentProfiles[0]);

        await cms.instruction(`Edit information of parent`, async () => {
            await updateParentInfo(cms, scenarioContext, parentProfiles[0]);
        });

        await cms.instruction(`Click on save button`, async function () {
            await clickOnSaveButtonInParentElement(cms);
            await cms.waitingForLoadingIcon();
        });
    }
);

Then(
    'school admin sees updated parent list on {string} detail page',
    async function (this: IMasterWorld, learner: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const parentAccount = learner === 'student S2' ? 'parent P2' : 'parent P1';

        const parentProfiles = scenarioContext.get<CreateStudentResponseEntity['parents']>(
            parentProfilesAliasWithAccountRoleSuffix(parentAccount)
        );
        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(learner)
        );

        const editedParentInformation =
            scenarioContext.get<EditedParentInformation>(editedParentProfilesAlias);

        await cms.instruction(`Back to student page`, async () => {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        });

        await cms.instruction(
            `Check parent list of student ${learnerProfile.name} on detail page`,
            async () => {
                let parents = [...parentProfiles];

                parents = parents.map((item) =>
                    item.id === editedParentInformation.id
                        ? {
                              ...item,
                              email: editedParentInformation.email,
                          }
                        : item
                );

                await seeNewlyCreatedStudentOnCMS({
                    cms,
                    data: {
                        learnerProfile,
                        parents,
                        studentCoursePackages: [],
                    },
                    shouldSelectAllLocations: false,
                });

                await cms.waitingForLoadingIcon();
            }
        );
    }
);

Then(
    '{string} cannot login Learner App with his old email and old password',
    async function (this: IMasterWorld, parentAccount: AccountRoles) {
        const parent = this.parent;
        const scenarioContext = this.scenario;

        const parentProfiles = scenarioContext.get<CreateStudentResponseEntity['parents']>(
            parentProfilesAliasWithAccountRoleSuffix(parentAccount)
        );

        const editedParentInformation = await scenarioContext.get<EditedParentInformation>(
            editedParentProfilesAlias
        );

        await parent.instruction(
            `${parentAccount} cannot logins parent app with old email and old password`,
            async function () {
                await loginLearnerAccountFailed({
                    learner: parent,
                    email: parentProfiles[0].email,
                    password: parentProfiles[0].password,
                });
            }
        );

        parentProfiles[0].email = editedParentInformation.email;
    }
);

When(
    'school admin edits only email of {string} to {string}',
    async function (this: IMasterWorld, parent: AccountRoles, emailType: EmailType) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const parentProfiles = scenarioContext.get<CreateStudentResponseEntity['parents']>(
            parentProfilesAliasWithAccountRoleSuffix(parent)
        );
        const parentP2Profiles = scenarioContext.get<CreateStudentResponseEntity['parents']>(
            parentProfilesAliasWithAccountRoleSuffix('parent P2')
        );
        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student S1')
        );

        const parentEmailExisted =
            parentP2Profiles && parentP2Profiles.length ? parentP2Profiles[0].email : '';

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile,
                parents: parentProfiles,
                studentCoursePackages: [],
            },
            shouldSelectAllLocations: false,
        });
        await cms.instruction(`Go to Family Tab`, async function () {
            await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
        });

        await cms.instruction(`Edit email of ${parent}`, async () => {
            await editParentEmail(
                cms,
                emailType,
                learnerProfile,
                parentProfiles,
                parentEmailExisted
            );
        });
    }
);

Then(
    'school admin sees the error message with {string}',
    async function (this: IMasterWorld, emailType: EmailType) {
        const cms = this.cms;

        await cms.instruction('See correct error message', async function () {
            await assertErrorMessageInEditPage(cms, emailType);
        });
    }
);

Given(
    'school admin has created a {string} with existed {string} info',
    async function (this: IMasterWorld, leaner: AccountRoles, parent: AccountRoles) {
        const scenarioContext = this.scenario;
        const cms = this.cms;

        /// Get existed parent info
        const parentProfiles = scenarioContext.get<CreateStudentResponseEntity['parents']>(
            parentProfilesAliasWithAccountRoleSuffix(parent)
        );

        await schoolAdminCreateNewStudentWithExistingParent(
            cms,
            scenarioContext,
            leaner,
            parentProfiles
        );
    }
);

When(
    'school admin removes {string} from {string}',
    async function (this: IMasterWorld, parent: AccountRoles, student: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const parentProfiles = scenarioContext.get<CreateStudentResponseEntity['parents']>(
            parentProfilesAliasWithAccountRoleSuffix(parent)
        );
        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(student)
        );

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile,
                parents: parentProfiles,
                studentCoursePackages: [],
            },
            shouldSelectAllLocations: false,
        });

        await cms.instruction(`Go to Family Tab`, async function () {
            await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
        });

        await cms.instruction('Removes parent from student', async function () {
            await removeParentFromStudent(cms, parentProfiles[0]);
        });
    }
);

Then(
    'school admin sees updated parent list on student detail page',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student S1')
        );

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile,
                parents: [],
                studentCoursePackages: [],
            },
            shouldSelectAllLocations: false,
        });
    }
);

Then(
    'parent does not see {string} stats on Learner App',
    async function (this: IMasterWorld, student: AccountRoles) {
        const parent = this.parent;
        const scenarioContext = this.scenario;

        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(student)
        );

        await parent.openHomeDrawer();

        await parent.instruction(`Click on Stats tab`, async function () {
            await parent.clickOnTab(SyllabusLearnerKeys.stats_tab, SyllabusLearnerKeys.stats_page);
        });

        await parent.instruction("Does not see this student's stats", async function () {
            await checkStudentDoesNotExistedInStatsPage(parent, learnerProfile);
        });
    }
);

When(
    'school admin cancels the edits info of {string}',
    async function (this: IMasterWorld, parent: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const parentProfiles = scenarioContext.get<CreateStudentResponseEntity['parents']>(
            parentProfilesAliasWithAccountRoleSuffix(parent)
        );
        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student S1')
        );

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile,
                parents: parentProfiles,
                studentCoursePackages: [],
            },
            shouldSelectAllLocations: false,
        });

        await cms.instruction(`Go to Family Tab`, async function () {
            await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
        });

        await openDialogEditParentOnCMS(cms, parentProfiles[0]);

        await cms.instruction(`Edit information of parent`, async () => {
            await updateParentInfo(cms, scenarioContext, parentProfiles[0]);
        });

        await cms.instruction(`Click on cancel button`, async function () {
            await cms.cancelDialogAction();
        });
    }
);

Then(
    'school admin sees old data of {string}',
    async function (this: IMasterWorld, learner: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const parentProfiles = scenarioContext.get<CreateStudentResponseEntity['parents']>(
            parentProfilesAliasWithAccountRoleSuffix('parent P1')
        );
        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(learner)
        );

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile,
                parents: parentProfiles,
                studentCoursePackages: [],
            },
            shouldSelectAllLocations: false,
        });
    }
);

When(
    'school admin edits email of {string}',
    async function (this: IMasterWorld, parent: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const parentProfiles = scenarioContext.get<CreateStudentResponseEntity['parents']>(
            parentProfilesAliasWithAccountRoleSuffix(parent)
        );
        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student S1')
        );

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile,
                parents: parentProfiles,
                studentCoursePackages: [],
            },
            shouldSelectAllLocations: false,
        });
        await cms.instruction(`Go to Family Tab`, async function () {
            await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
        });

        await openDialogEditParentOnCMS(cms, parentProfiles[0]);

        await cms.instruction(`Edit information of parent`, async () => {
            await updateParentInfo(cms, scenarioContext, parentProfiles[0]);
        });

        await cms.instruction(`Click on save button`, async function () {
            await clickOnSaveButtonInParentElement(cms);
            await cms.waitingForLoadingIcon();
        });
    }
);

When(
    'school admin adds a new parent for {string}',
    async function (this: IMasterWorld, learner: AccountRoles) {
        const cms = this.cms;
        const page = cms.page!;
        const scenarioContext = this.scenario;

        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(learner)
        );

        const parentInfo2 = await clickOnAddParentAndFillInParentInformation(
            cms,
            learnerProfile.email
        );

        const passwordParent2 = await page.getAttribute(parentInputPasswordSelector, 'value');
        const parent1 = await scenarioContext.get<UserProfileEntity[]>(
            parentProfilesAliasWithAccountRoleSuffix('parent P1')
        )[0];

        const parent2 = {
            email: parentInfo2.userName,
            password: passwordParent2,
            phoneNumber: parentInfo2.phoneNumber,
            name: parentInfo2.userName,
        };

        scenarioContext.context.set(parentProfilesAliasWithAccountRoleSuffix(learner), [
            parent1,
            parent2,
        ]);
        await page.click(dialogStudentAccountInfoFooterButtonClose);
    }
);

Then(
    '{string} logins Learner App successfully with his new email and old password',
    async function (this: IMasterWorld, parentAccount: AccountRoles) {
        const parent = this.parent;
        const scenarioContext = this.scenario;

        const parents = await scenarioContext.get<UserProfileEntity[]>(
            parentProfilesAliasWithAccountRoleSuffix(parentAccount)
        );
        const editedParentInformation = await scenarioContext.get<EditedParentInformation>(
            editedParentProfilesAlias
        );

        await parent.instruction(
            `Parent ${parents[0].name} logins Learner App with his existed credentials`,
            async function () {
                await loginOnLearnerApp({
                    learner: parent,
                    email: editedParentInformation.email,
                    name: parents[0].name,
                    password: parents[0].password,
                });
            }
        );

        await parent.instruction('Parent logout learner App', async function () {
            await parent.logout();
        });
    }
);

Then(
    '{string} logins successfully with his new email and old password',
    async function (this: IMasterWorld, parentAccount: AccountRoles) {
        const parent = this.parent;
        const scenarioContext = this.scenario;

        const parentProfile = scenarioContext.get<UserProfileEntity[]>(
            parentProfilesAliasWithAccountRoleSuffix(parentAccount)
        )[0];

        await parent.instruction(`${parentProfile.name} login with credentials`, async function () {
            await fillEmailAndPassword(parent, parentProfile.email, parentProfile.password);
        });

        await parent.instruction(
            `Verify ${parentProfile.name} is at HomeScreen after login successfully`,
            async function () {
                await aLearnerAlreadyLoginSuccessInLearnerWeb(parent);
            }
        );

        await parent.instruction(
            `Verify name: ${parentProfile.name} on Learner App`,
            async function () {
                await parent.checkUserName(parentProfile.name);
            }
        );
    }
);

Then(
    "{string} sees student's stats",
    async function (this: IMasterWorld, parentAccount: AccountRoles) {
        const parent = this.parent;
        const scenarioContext = this.scenario;

        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student S1')
        );

        await parent.openHomeDrawer();

        await parent.instruction(`Click on Stats tab`, async function () {
            await parent.clickOnTab(SyllabusLearnerKeys.stats_tab, SyllabusLearnerKeys.stats_page);
        });

        await parent.instruction(`${parentAccount} see this student's stats`, async function () {
            await checkStudentExistedInStatsPage(parent, learnerProfile);
        });
    }
);

Then(
    'new parent logins Learner App successfully with his existed credentials',
    async function (this: IMasterWorld) {
        const parent = this.parent;
        const scenarioContext = this.scenario;

        const parents = scenarioContext.get<UserProfileEntity[]>(
            parentProfilesAliasWithAccountRoleSuffix('student S1')
        );

        await parent.instruction(
            `Parent ${parents[1].name} logins Learner App with his existed credentials`,
            async function () {
                await loginOnLearnerApp({
                    learner: parent,
                    email: parents[1].email,
                    name: parents[1].name,
                    password: parents[1].password,
                });
            }
        );
    }
);

When(
    'school admin adds and edits {string} info of {string}',
    async function (this: IMasterWorld, parent: AccountRoles, student: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const parentsProfileP1 = scenarioContext.get<UserProfileEntity[]>(
            parentProfilesAliasWithAccountRoleSuffix('parent P1')
        );
        const learnerProfileS1 = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(student)
        );

        const parentsProfileP2 = scenarioContext.get<UserProfileEntity[]>(
            parentProfilesAliasWithAccountRoleSuffix(parent)
        );

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile: learnerProfileS1,
                parents: parentsProfileP1,
                studentCoursePackages: [],
            },
            shouldSelectAllLocations: false,
        });
        await searchAndSelectExistedParent(cms, parentsProfileP2[0].name);

        await openDialogEditParentOnCMS(cms, parentsProfileP2[0]);

        await cms.instruction(`Edit information of parent`, async () => {
            await updateParentInfo(cms, scenarioContext, parentsProfileP2[0]);
        });

        await cms.instruction(`Click on save button`, async function () {
            await clickOnSaveButtonInParentElement(cms);
            await cms.waitingForLoadingIcon();
        });

        scenarioContext.context.set(parentProfilesAliasWithAccountRoleSuffix('parent P1'), [
            ...parentsProfileP1,
            ...parentsProfileP2,
        ]);
    }
);

Then('school admin can not update the parent', async function (this: IMasterWorld) {
    const parent = this.parent;
    const scenarioContext = this.scenario;

    const parentProfile = scenarioContext.get<UserProfileEntity[]>(
        parentProfilesAliasWithAccountRoleSuffix('parent P1')
    )[0];

    await parent.instruction(`${parentProfile.name} login with credentials`, async function () {
        await fillUserNameAndPasswordLearnerWeb({
            learner: parent,
            username: parentProfile.email,
            password: parentProfile.password,
        });
    });

    await parent.instruction(
        `Verify ${parentProfile.name} is at HomeScreen after login successfully`,
        async function () {
            await aLearnerAlreadyLoginSuccessInLearnerWeb(parent);
        }
    );

    await parent.instruction(
        `Verify name: ${parentProfile.name} on Learner App`,
        async function () {
            await parent.checkUserName(parentProfile.name);
        }
    );
});
