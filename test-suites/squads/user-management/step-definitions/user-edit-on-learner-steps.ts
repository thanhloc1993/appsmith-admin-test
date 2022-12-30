import { LearnerKeys } from '@common/learner-key';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import {
    editedLearnerProfileAlias,
    learnerProfileAlias,
    oldLearnerProfileAlias,
    parentProfilesAlias,
    studentCoursePackagesAlias,
} from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, LearnerInterface } from '@supports/app-types';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    findAndSwitchToKidOnLearnerApp,
    searchStudentOnCMS,
    verifyAvatarOnScreen,
} from './user-definition-utils';
import {
    changeAvatarOnLearner,
    changeNameInEditProfileScreenLearnerApp,
    editNameInEditProfileScreen,
    EditProfileOnLearnerRole,
    goToEditAccountScreen,
    ProfileType,
    updateProfileOnLearner,
    verifyNameOnEditProfileScreen,
    verifyProfileTypeOnProfileDetailsScreen,
} from './user-edit-on-learner-definitions';
import { verifyNewlyLearnerOnTeacherApp } from './user-view-course-definitions';
import { seeNewlyCreatedStudentOnCMS } from './user-view-student-details-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { moveTeacherToMessagePage } from 'test-suites/squads/communication/step-definitions/communication-common-definitions';

When(
    '{string} edits {string} on Learner App',
    async function (
        this: IMasterWorld,
        editProfileOnLearnerRole: EditProfileOnLearnerRole,
        profileType: ProfileType
    ) {
        let driver: LearnerInterface;
        let profile: UserProfileEntity;

        if (editProfileOnLearnerRole === 'student') {
            driver = this.learner!;
            profile = this.scenario.get<UserProfileEntity>(learnerProfileAlias);
        } else if (editProfileOnLearnerRole === 'parent') {
            driver = this.parent!;
            profile = this.scenario.get<Array<UserProfileEntity>>(parentProfilesAlias)[0];
        }

        const newName = `Edited - ${profile!.name.replace('e2e', 'eibanam')}`;
        let newAvatarUrl = '';
        const oldName = profile!.name;
        const oldAvatar = profile!.avatar;

        await goToEditAccountScreen(driver!, profile!);

        if (profileType === 'name') {
            await editNameInEditProfileScreen(driver!, newName);

            profile!.name = newName;
        } else if (profileType === 'avatar') {
            await changeAvatarOnLearner(driver!);
            newAvatarUrl = await updateProfileOnLearner(driver!);

            await driver!.flutterDriver!.tap(new ByValueKey(LearnerKeys.backButton));

            profile!.avatar = newAvatarUrl;
        }

        /// Logic to set data to context
        if (editProfileOnLearnerRole === 'student') {
            this.scenario.set(editedLearnerProfileAlias, profile!);

            this.scenario.set(oldLearnerProfileAlias, {
                id: profile!.id,
                email: profile!.name,
                name: oldName,
                avatar: oldAvatar,
                phoneNumber: profile!.phoneNumber,
                givenName: profile!.givenName,
                password: profile!.password,
            });

            this.scenario.set(learnerProfileAlias, profile!);
        } else if (editProfileOnLearnerRole === 'parent') {
            const parents = this.scenario.get<Array<UserProfileEntity>>(parentProfilesAlias);

            const newParents = parents.map((parent) => {
                if (profileType === 'name') {
                    parent.name = newName;
                } else if (profileType === 'avatar') {
                    parent.avatar = newAvatarUrl;
                }

                return parent;
            });

            this.scenario.set(parentProfilesAlias, newParents!);
        }
    }
);

When(
    '{string} changes {string} on Learner App',
    async function (
        this: IMasterWorld,
        editProfileOnLearnerRole: EditProfileOnLearnerRole,
        profileType: ProfileType
    ) {
        let driver: LearnerInterface;
        let profile: UserProfileEntity;

        if (editProfileOnLearnerRole === 'student') {
            driver = this.learner!;
            profile = this.scenario.get<UserProfileEntity>(learnerProfileAlias);
        } else if (editProfileOnLearnerRole === 'parent') {
            driver = this.parent!;
            profile = this.scenario.get<Array<UserProfileEntity>>(parentProfilesAlias)[0];
        }

        const newName = `Edited - ${profile!.name.replace('e2e', 'eibanam')}`;
        const newAvatarUrl = '';
        const oldName = profile!.name;
        const oldAvatar = profile!.avatar;

        await goToEditAccountScreen(driver!, profile!);

        if (profileType === 'name') {
            await changeNameInEditProfileScreenLearnerApp(driver!, newName);

            profile!.name = newName;
        } else if (profileType === 'avatar') {
            await changeAvatarOnLearner(driver!);

            profile!.avatar = newAvatarUrl;
        }

        /// Logic to set data to context
        if (editProfileOnLearnerRole === 'student') {
            this.scenario.set(editedLearnerProfileAlias, profile!);

            this.scenario.set(oldLearnerProfileAlias, {
                id: profile!.id,
                email: profile!.name,
                name: oldName,
                avatar: oldAvatar,
                phoneNumber: profile!.phoneNumber,
                givenName: profile!.givenName,
                password: profile!.password,
            });

            this.scenario.set(learnerProfileAlias, profile!);
        } else if (editProfileOnLearnerRole === 'parent') {
            const parents = this.scenario.get<Array<UserProfileEntity>>(parentProfilesAlias);

            const newParents = parents.map((parent) => {
                if (profileType === 'name') {
                    parent.name = newName;
                } else if (profileType === 'avatar') {
                    parent.avatar = newAvatarUrl;
                }

                return parent;
            });

            this.scenario.set(parentProfilesAlias, newParents!);
        }
    }
);

When(
    '{string} cancels the changes',
    async function (this: IMasterWorld, editProfileOnLearnerRole: EditProfileOnLearnerRole) {
        let driver: LearnerInterface;

        if (editProfileOnLearnerRole === 'student') {
            driver = this.learner!;
        } else if (editProfileOnLearnerRole === 'parent') {
            driver = this.parent!;
        }

        await driver!.instruction('Press Back button to cancel the changes', async function () {
            const backButtonFinder = new ByValueKey(LearnerKeys.backButton);
            await driver.flutterDriver!.tap(backButtonFinder);
        });
    }
);

Then(
    '{string} sees the old {string} on Learner App',
    async function (
        this: IMasterWorld,
        editProfileOnLearnerRole: EditProfileOnLearnerRole,
        profileType: ProfileType
    ) {
        let driver: LearnerInterface;
        let profile: UserProfileEntity;

        if (editProfileOnLearnerRole === 'student') {
            driver = this.learner!;
            profile = this.scenario.get<UserProfileEntity>(oldLearnerProfileAlias);
        } else if (editProfileOnLearnerRole === 'parent') {
            driver = this.parent!;
            profile = this.scenario.get<Array<UserProfileEntity>>(parentProfilesAlias)[0];
        }

        if (profileType === 'name') {
            await driver!.instruction(
                `Verify old ${editProfileOnLearnerRole} name: ${profile!.name} on AppBar`,
                async function () {
                    await driver!.checkUserName(profile!.name);
                }
            );

            await goToEditAccountScreen(driver!, profile!);

            await verifyNameOnEditProfileScreen(driver!, profile!.name);

            const backButtonFinder = new ByValueKey(LearnerKeys.backButton);
            await driver!.flutterDriver!.tap(backButtonFinder);

            await verifyProfileTypeOnProfileDetailsScreen(driver!, profile!.name, profileType);
        } else if (profileType === 'avatar') {
            const avatarUrl = profile!.avatar;

            await driver!.verifyAvatarInHomeScreen(avatarUrl);

            await goToEditAccountScreen(driver!, profile!);

            await verifyAvatarOnScreen(driver!, avatarUrl, 'Edit Profile Screen');

            const backButtonFinder = new ByValueKey(LearnerKeys.backButton);
            await driver!.flutterDriver!.tap(backButtonFinder);

            await verifyProfileTypeOnProfileDetailsScreen(driver!, avatarUrl, profileType);
        }
    }
);

Then(
    '{string} sees the edited {string} on Learner App',
    async function (
        this: IMasterWorld,
        editProfileOnLearnerRole: EditProfileOnLearnerRole,
        profileType: ProfileType
    ) {
        let driver: LearnerInterface;
        let profile: UserProfileEntity;

        if (editProfileOnLearnerRole === 'student') {
            driver = this.learner!;
            profile = this.scenario.get<UserProfileEntity>(learnerProfileAlias);
        } else if (editProfileOnLearnerRole === 'parent') {
            driver = this.parent!;
            profile = this.scenario.get<Array<UserProfileEntity>>(parentProfilesAlias)[0];
        }

        if (profileType === 'name') {
            await driver!.instruction(
                `Verify ${editProfileOnLearnerRole} name: ${profile!.name} on AppBar`,
                async function () {
                    await driver!.checkUserName(profile!.name);
                }
            );

            await verifyProfileTypeOnProfileDetailsScreen(driver!, profile!.name, profileType);
        } else if (profileType === 'avatar') {
            const newAvatarUrl = profile!.avatar;

            await driver!.verifyAvatarInHomeScreen(newAvatarUrl);

            await verifyProfileTypeOnProfileDetailsScreen(driver!, newAvatarUrl, profileType);
        }
    }
);

Then(
    'school admin sees the edited {string} {string} on CMS',
    async function (
        this: IMasterWorld,
        _editProfileOnLearnerRole: EditProfileOnLearnerRole,
        profileType: ProfileType
    ) {
        const cms = this.cms!;
        const learnerProfile = this.scenario.get<UserProfileEntity>(learnerProfileAlias);
        const parents = this.scenario.get<Array<UserProfileEntity>>(parentProfilesAlias);
        const studentCoursePackages = this.scenario.get<Array<StudentCoursePackageEntity>>(
            studentCoursePackagesAlias
        );

        if (profileType === 'name') {
            await searchStudentOnCMS(cms, learnerProfile.name);

            await seeNewlyCreatedStudentOnCMS({
                cms,
                data: {
                    learnerProfile,
                    parents,
                    studentCoursePackages,
                },
            });
        } else if (profileType === 'avatar') {
            await searchStudentOnCMS(cms, learnerProfile.name);

            await seeNewlyCreatedStudentOnCMS({
                cms,
                data: {
                    learnerProfile,
                    parents,
                    studentCoursePackages,
                },
            });

            // await cms.instruction(
            //     "Back Office doesn't support see avatar of Student or Parent",
            //     async function (cms) {}
            // );
        }
    }
);

Then(
    'teacher sees the edited {string} {string} on Teacher App',
    { timeout: 90 * 1000 },
    async function (
        this: IMasterWorld,
        editProfileOnLearnerRole: EditProfileOnLearnerRole,
        profileType: ProfileType
    ) {
        const teacher = this.teacher!;
        const learnerProfile = this.scenario.get<UserProfileEntity>(learnerProfileAlias);
        const studentCoursePackages = this.scenario.get<Array<StudentCoursePackageEntity>>(
            studentCoursePackagesAlias
        );

        if (editProfileOnLearnerRole === 'student') {
            if (profileType === 'name' || profileType === 'avatar') {
                await verifyNewlyLearnerOnTeacherApp(
                    teacher,
                    learnerProfile,
                    studentCoursePackages[0].courseId,
                    studentCoursePackages[0].courseName
                );
            }
        } else if (editProfileOnLearnerRole === 'parent') {
            /// Comment until this issue is resolved: https://manabie.atlassian.net/browse/LT-6295
            await teacher.instruction('Teacher selects message button', async function (teacher) {
                await moveTeacherToMessagePage(teacher);
            });

            // await teacher.instruction('Teacher joins student chat group', async function () {
            //     await teacherJoinLearnerConversation(
            //         teacher,
            //         learnerProfile.id,
            //         studentCode,
            //         false
            //     );
            // });
            // await teacher.instruction('Teacher joins parent chat group', async function () {
            //     await teacherJoinLearnerConversation(teacher, learnerProfile.id, studentCode, true);
            // });
            /// TODO: Implement verify name after communication team has the code
        }
    }
);

Then(
    'parent sees the edited {string} on Learner App',
    async function (this: IMasterWorld, profileType: ProfileType) {
        const parent = this.parent!;
        const learnerProfile = this.scenario.get<UserProfileEntity>(learnerProfileAlias);

        await parent.openHomeDrawer();

        await parent.instruction(`Click on Stats tab`, async function () {
            await parent.clickOnTab(SyllabusLearnerKeys.stats_tab, SyllabusLearnerKeys.stats_page);
        });

        if (profileType === 'name') {
            await findAndSwitchToKidOnLearnerApp(parent, learnerProfile, learnerProfile);
        } else if (profileType === 'avatar') {
            await findAndSwitchToKidOnLearnerApp(parent, learnerProfile, learnerProfile);
        }
    }
);
