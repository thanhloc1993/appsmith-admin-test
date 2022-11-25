import { LearnerKeys } from '@common/learner-key';
import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import {
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    fillUserNameAndPasswordLearnerWeb,
    loginOnLearnerApp,
} from '@legacy-step-definitions/learner-email-login-definitions';
import {
    getLearnerInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from '@legacy-step-definitions/utils';
import {
    courseListAliasWithAccountRoleSuffix,
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAlias,
    parentProfilesAliasWithAccountRoleSuffix,
    studentCoursePackageListAliasWithAccountRoleSuffix,
    studentCoursePackagesAlias,
    studentLocationsAlias,
    studentPackagesAlias,
    studentPackagesAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When, DataTable } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { CourseDuration } from '@supports/entities/course-duration';
import { CourseStatus } from '@supports/entities/course-status';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { CreateStudentResponseEntity } from '@supports/services/usermgmt-student-service/entities/create-student-response';
import { LocationInfoGRPC, LocationObjectGRPC } from '@supports/types/cms-types';

import { createRandomStudentThenSaveToContext } from './user-create-staff-definitions';
import {
    checkKidChartStatistic,
    clickOnSaveButtonInParentElement,
    createARandomStudentGRPC,
    findLearnerOnSwitchKidComponent,
    getLearnerInformationAfterCreateStudentSuccessfully,
    schoolAdminCreateNewStudentWithNewParent,
    schoolAdminCreateNewStudentWithCourse,
    schoolAdminCreateNewStudentWithExistingParent,
} from './user-create-student-definitions';
import {
    applyOrgForLocationSetting,
    clickOnSaveButtonInStudent,
    createRandomStudentData,
    goToAddStudentPageAndFillInStudentInformation,
} from './user-definition-utils';
import {
    CourseResult,
    cannotViewCourseOnLearnerApp,
    verifyNewlyLearnerOnTeacherApp,
    viewCourseOnLearnerApp,
} from './user-view-course-definitions';
import {
    tapOnSwitchButtonAndSelectKid,
    seeNewlyCreatedStudentOnCMS,
} from './user-view-student-details-definitions';

/// Start Given
Given(
    'school admin creates student with student info and parent info',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await cms.instruction('Create a student by calling API', async function () {
            const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms);

            const student = response.student;
            const parents = response.parents;

            scenarioContext.set(learnerProfileAlias, student);

            scenarioContext.set(parentProfilesAlias, parents);
        });
    }
);

Given('school admin has created a student with student info', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    await cms.instruction('Create a student by calling API', async function () {
        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
        const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {
            parentLength: 0,
            studentPackageProfileLength: 0,
            locations: [firstGrantedLocation],
        });

        const student = response.student;
        const parents = response.parents;

        scenarioContext.set(learnerProfileAlias, student);

        scenarioContext.set(parentProfilesAlias, parents);
    });
});

/// 'school admin has created a student "Student S2" with "x parents", "x visible courses"
Given(
    'school admin has created a student {string} with {string}, {string}',
    async function (
        this: IMasterWorld,
        accountRoles: AccountRoles,
        parents: string,
        studentPackages: string
    ) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const parentLength = parseInt(parents.split(' parents')[0], 0);
        const studentPackageProfileLength = parseInt(
            studentPackages.split(' visible courses')[0],
            0
        );

        await cms.instruction(
            `Create a student on driver ${accountRoles} by calling API`,
            async function () {
                const studentLocations =
                    scenarioContext.get<LocationInfoGRPC[]>(studentLocationsAlias);
                const firstGrantedLocation =
                    scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
                const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {
                    parentLength,
                    studentPackageProfileLength,
                    locations: studentLocations || [firstGrantedLocation],
                });

                const student = response.student;
                const parents = response.parents;
                const packages = response.packages;
                const courses = response.courses;
                const studentCoursePackages = response.studentCoursePackages;
                const locations = student.locations || [];

                scenarioContext.set(
                    learnerProfileAliasWithAccountRoleSuffix(accountRoles),
                    student
                );
                scenarioContext.set(
                    parentProfilesAliasWithAccountRoleSuffix(accountRoles),
                    parents
                );
                scenarioContext.set(
                    studentPackagesAliasWithAccountRoleSuffix(accountRoles),
                    packages
                );

                scenarioContext.set(courseListAliasWithAccountRoleSuffix(accountRoles), courses);

                scenarioContext.set(
                    studentCoursePackageListAliasWithAccountRoleSuffix(accountRoles),
                    studentCoursePackages
                );

                scenarioContext.set(studentLocationsAlias, locations);
            }
        );
    }
);

Given('school admin has created a student with parent info', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    await cms.instruction('Create a student with parent info by API', async function () {
        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
        const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {
            locations: [firstGrantedLocation],
        });

        const student = response.student;
        const parents = response.parents;

        scenarioContext.set(parentProfilesAlias, parents);
        scenarioContext.set(learnerProfileAlias, student);
    });
});

Given(
    'school admin has created a student with parent info and {string} course',
    async function (this: IMasterWorld, courseStatus: CourseStatus) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await cms.instruction(
            `Create a student with parent info and ${courseStatus} course by API`,
            async function () {
                const firstGrantedLocation =
                    scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
                const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {
                    courseStatus,
                    parentLength: 1,
                    studentPackageProfileLength: 1,
                    locations: [firstGrantedLocation],
                });

                const student = response.student;
                const parents = response.parents;
                const studentCoursePackages = response.studentCoursePackages;

                scenarioContext.set(parentProfilesAlias, parents);
                scenarioContext.set(learnerProfileAlias, student);
                scenarioContext.set(studentCoursePackagesAlias, studentCoursePackages);

                await cms.page!.reload();
            }
        );
    }
);

Given(
    '{string} has been created before',
    async function (this: IMasterWorld, accountRoles: string) {
        const roles = splitRolesStringToAccountRoles(accountRoles);
        const cms = this.cms;
        const scenarioContext = this.scenario;
        await cms.instruction('Create a student by calling API', async function (cms) {
            for (const role of roles) {
                const studentRole = role as AccountRoles;
                await createRandomStudentThenSaveToContext(cms, studentRole, scenarioContext);
            }
        });
    }
);
/// End Scenario: Create student with new parent

Given(
    'school admin has created a {string} with parent info',
    async function (this: IMasterWorld, accountRoles: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await cms.instruction(`Create a student with parent info by API`, async function () {
            const firstGrantedLocation =
                scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

            const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {
                locations: [firstGrantedLocation],
            });

            const student = response.student;
            const parents = response.parents;

            scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(accountRoles), student);
            scenarioContext.set(parentProfilesAlias, parents);
        });
    }
);
/// End Given

/// Start When

When('school admin creates a new student with student info', async function (this: IMasterWorld) {
    const scenarioContext = this.scenario;
    const cms = this.cms;

    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

    const randomStudentData = await createRandomStudentData(cms, {
        locations: [firstGrantedLocation],
    });

    /// Have instructions inside
    await goToAddStudentPageAndFillInStudentInformation(cms, scenarioContext, randomStudentData);

    await cms.instruction(`Click on save button after fill in student`, async function () {
        await clickOnSaveButtonInParentElement(cms);
        await cms.waitingForLoadingIcon();
    });

    await cms.instruction(
        `Get learner new credentials after create account successfully`,
        async function () {
            await getLearnerInformationAfterCreateStudentSuccessfully(
                cms,
                scenarioContext,
                randomStudentData
            );
        }
    );
});

/// Scenario: Create student with new parent
When('school admin creates a new student with parent info', async function (this: IMasterWorld) {
    const scenarioContext = this.scenario;
    const cms = this.cms;
    await schoolAdminCreateNewStudentWithNewParent(cms, scenarioContext);
});

/// When school admin creates a new student "student S2" with existed parent info
/// TODO: Add random: grade, relationship, enrollmentStatus.
When(
    'school admin creates a new {string} with existed parent info',
    async function (this: IMasterWorld, accountRole: AccountRoles) {
        const scenarioContext = this.scenario;
        const cms = this.cms;

        /// Get existed parent info
        const parentProfiles = scenarioContext.get<UserProfileEntity[]>(parentProfilesAlias);

        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

        await schoolAdminCreateNewStudentWithExistingParent(
            cms,
            scenarioContext,
            accountRole,
            parentProfiles,
            0,
            [firstGrantedLocation]
        );
    }
);

When(
    'school admin creates a new student with course which has {string}',
    async function (this: IMasterWorld, courseDuration: CourseDuration) {
        const scenarioContext = this.scenario;
        const cms = this.cms;
        await schoolAdminCreateNewStudentWithCourse(cms, scenarioContext, courseDuration);
    }
);

When('school admin selects all locations on location setting', async function (this: IMasterWorld) {
    const cms = this.cms;

    await cms.instruction(`Go to student management page`, async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
    });

    await cms.instruction(
        'school admin selects org location on location setting',
        async function () {
            await applyOrgForLocationSetting(cms);
        }
    );
});

/// End When

Then(
    'student {string} logins Learner App successfully with credentials which school admin gives',
    async function (this: IMasterWorld, role: AccountRoles): Promise<void> {
        const driver = getLearnerInterfaceFromRole(this, role);
        const learnerProfile = this.scenario.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(role)
        );
        const email = learnerProfile!.email;
        const password = learnerProfile!.password;

        /// Have instructions inside
        await loginOnLearnerApp({
            learner: driver,
            email,
            name: learnerProfile.name,
            password,
        });
    }
);

Then('school admin sees newly created student on CMS', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
    const parents = scenarioContext.get<Array<UserProfileEntity>>(parentProfilesAlias) ?? [];
    const studentCoursePackages =
        this.scenario.get<Array<StudentCoursePackageEntity>>(studentPackagesAlias) ?? [];

    /// Have instructions inside
    await seeNewlyCreatedStudentOnCMS({
        cms,
        data: { learnerProfile, parents, studentCoursePackages },
        shouldSelectAllLocations: false,
    });
});

Then(
    'new parent logins Learner App successfully with credentials which school admin gives',
    async function (this: IMasterWorld) {
        const parent = this.parent!;
        const parentProfiles = this.scenario.get<Array<UserProfileEntity>>(parentProfilesAlias);

        const parentProfile = parentProfiles[0];

        /// Have instructions inside
        await loginOnLearnerApp({
            learner: parent,
            email: parentProfile.email,
            name: parentProfile.name,
            password: parentProfile.password,
        });
    }
);

Then("parent sees 1 student's stats on Learner App", async function (this: IMasterWorld) {
    const parent = this.parent!;
    const scenarioContext = this.scenario;
    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    await parent.openHomeDrawer();

    await parent.instruction(`Click on Stats tab`, async function () {
        await parent.clickOnTab(LearnerKeys.stats_tab, LearnerKeys.stats_page);
    });

    await parent.instruction(`Find first kid: ${learnerProfile.name}`, async function () {
        await findLearnerOnSwitchKidComponent(parent, learnerProfile);
    });

    // TODO: Need to check details chart later
    await parent.instruction(
        `Check first kid chart statistic: ${learnerProfile.name}`,
        async function () {
            await checkKidChartStatistic(parent);
        }
    );
});

Then(
    'parent logins Learner App successfully with his existed credentials',
    async function (this: IMasterWorld) {
        const parent = this.parent!;
        const parentProfiles = this.scenario.get<Array<UserProfileEntity>>(parentProfilesAlias);

        const parentProfile = parentProfiles[0];

        /// This function already had instruction inside
        await fillUserNameAndPasswordLearnerWeb({
            learner: parent,
            username: parentProfile.name,
            password: parentProfile.password,
        });

        await parent.instruction(
            `Verify Parent is at HomeScreen after login successfully`,
            async function () {
                await aLearnerAlreadyLoginSuccessInLearnerWeb(parent);
            }
        );

        await parent.instruction(`Check parent name on Learner App`, async function () {
            await parent.checkUserName(parentProfile.name);
        });
    }
);

Then(
    'existed parent logins Learner App successfully with his existed credentials',
    async function (this: IMasterWorld) {
        const parent = this.parent!;
        const parentProfiles = this.scenario.get<Array<UserProfileEntity>>(parentProfilesAlias);

        const parentProfile = parentProfiles[0];

        /// Have instructions inside
        await loginOnLearnerApp({
            learner: parent,
            email: parentProfile.email,
            name: parentProfile.name,
            password: parentProfile.password,
        });
    }
);

Then(
    'school admin sees newly created {string} on CMS',
    async function (this: IMasterWorld, accountRole: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(accountRole)
        );

        const parents =
            scenarioContext.get<Array<UserProfileEntity>>(
                parentProfilesAliasWithAccountRoleSuffix(accountRole)
            ) ?? [];

        /// Have instructions inside
        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile,
                parents,
                studentCoursePackages: [],
            },
            shouldSelectAllLocations: false,
        });
    }
);
/// End Scenario: Create student with new parent

Then("parent sees 2 student's stats on Learner App", async function (this: IMasterWorld) {
    const parent = this.parent!;
    const scenarioContext = this.scenario;

    const learnerProfile1 = scenarioContext.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student S1')
    );

    const learnerProfile2 = scenarioContext.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix('student S2')
    );

    await parent.openHomeDrawer();

    await parent.instruction(`Tap on Stats tab`, async function () {
        await parent.clickOnTab(LearnerKeys.stats_tab, LearnerKeys.stats_page);
    });

    await parent.instruction(`Find first kid: ${learnerProfile1.name}`, async function () {
        await findLearnerOnSwitchKidComponent(parent, learnerProfile1);
    });

    // TODO: Need to check details chart later
    await parent.instruction(
        `Check first kid chart statistic: ${learnerProfile1.name}`,
        async function () {
            await checkKidChartStatistic(parent);
        }
    );

    await parent.instruction(`Switch to second kid: ${learnerProfile2.name}`, async function () {
        await tapOnSwitchButtonAndSelectKid(parent, learnerProfile2);
    });

    await parent.instruction(`Find second kid: ${learnerProfile2.name}`, async function () {
        await findLearnerOnSwitchKidComponent(parent, learnerProfile2);
    });

    await parent.instruction(
        `Find second kid: ${learnerProfile2.name} and re-tap the kid to see nothing happen`,
        async function () {
            await tapOnSwitchButtonAndSelectKid(parent, learnerProfile2);
        }
    );

    await parent.instruction(
        `Check second kid chart statistic: ${learnerProfile2.name}`,
        async function () {
            await checkKidChartStatistic(parent);
        }
    );
});

Then('teacher sees newly created student on Teacher App', async function (this: IMasterWorld) {
    const teacher = this.teacher!;
    const scenarioContext = this.scenario;

    const studentCoursePackage =
        scenarioContext.get<Array<StudentCoursePackageEntity>>(studentPackagesAlias)[0];

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    /// Has instructions inside
    await verifyNewlyLearnerOnTeacherApp(
        teacher,
        learnerProfile,
        studentCoursePackage.courseId,
        studentCoursePackage.courseName
    );
});

Then(
    'student {string} the course on Learner App when {string}',
    async function (
        this: IMasterWorld,
        courseResult: CourseResult,
        courseDuration: CourseDuration
    ) {
        const learner = this.learner!;
        const scenarioContext = this.scenario;

        const studentCoursePackage =
            scenarioContext.get<Array<StudentCoursePackageEntity>>(studentPackagesAlias)[0];

        /// Has instructions inside
        if (courseResult === 'sees') {
            await viewCourseOnLearnerApp(learner, studentCoursePackage.courseName, courseDuration);
        } else if (courseResult === 'does not see') {
            await cannotViewCourseOnLearnerApp(learner, studentCoursePackage.courseName);
        } else {
            throw Error('unexpected course status');
        }
    }
);
/// End Then

Given(
    'school admin has created a {string} with {string} info',
    async function (this: IMasterWorld, leaner: AccountRoles, parent: AccountRoles) {
        const scenarioContext = this.scenario;
        const page = this.cms.page!;
        const cms = this.cms;

        await cms.instruction(
            `Create a student on driver ${leaner} with ${parent} info by calling API`,
            async function () {
                const firstGrantedLocation =
                    scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
                const response = await createARandomStudentGRPC(cms, {
                    locations: [firstGrantedLocation],
                });

                const student = response.student;
                const parents = response.parents;

                scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(leaner), student);
                scenarioContext.set(parentProfilesAliasWithAccountRoleSuffix(parent), parents);
            }
        );

        // Reload to get new data on UI
        await page.reload();
    }
);

When(
    'school admin creates a new student without not required fields',
    async function (this: IMasterWorld, dataTableNotRequiredFields: DataTable) {
        const scenarioContext = this.scenario;
        const cms = this.cms;
        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

        const randomStudentData = await createRandomStudentData(cms, {
            unusedFields: dataTableNotRequiredFields,
            locations: [firstGrantedLocation],
        });

        /// Have instructions inside
        await goToAddStudentPageAndFillInStudentInformation(
            cms,
            scenarioContext,
            randomStudentData
        );

        await clickOnSaveButtonInStudent(cms);

        await getLearnerInformationAfterCreateStudentSuccessfully(
            cms,
            scenarioContext,
            randomStudentData
        );
    }
);

When(
    'school admin creates a new student with external student ID which duplicated with {string}',
    async function (this: IMasterWorld, studentAccount: AccountRoles) {
        const scenarioContext = this.scenario;
        const cms = this.cms;
        const page = this.cms.page!;
        const firstGrantedLocation =
            scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

        const randomStudentData = await createRandomStudentData(cms, {
            locations: [firstGrantedLocation],
        });

        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(studentAccount)
        );

        // Reload to get new data on UI
        await page.reload();

        await cms.instruction('Go to student S1 detail page', async () => {
            await seeNewlyCreatedStudentOnCMS({
                cms,
                data: {
                    learnerProfile,
                    parents: [],
                    studentCoursePackages: [],
                },
            });
        });

        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);

        /// Have instructions inside
        await goToAddStudentPageAndFillInStudentInformation(cms, scenarioContext, {
            ...randomStudentData,
            studentExternalId: learnerProfile.studentExternalId || '',
        });

        await clickOnSaveButtonInStudent(cms);

        await getLearnerInformationAfterCreateStudentSuccessfully(cms, scenarioContext, {
            ...randomStudentData,
            studentExternalId: learnerProfile.studentExternalId || '',
        });
    }
);

Given(
    'school admin has created a {string} with student information',
    async function (this: IMasterWorld, accountRoles: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        await cms.instruction(`Create a student with student info by API`, async function () {
            const firstGrantedLocation =
                scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);

            const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {
                parentLength: 0,
                studentPackageProfileLength: 0,
                locations: [firstGrantedLocation],
            });

            const student = response.student;

            scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(accountRoles), student);
        });
    }
);
