import { getAccountProfileAliasOfStudent } from '@legacy-step-definitions/credential-account-definitions';
import {
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    getUserProfileFromContext,
    isTeacherRole,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { aliasUserAvatarUpdated, aliasUserNameUpdated } from './alias-keys/communication';
import {
    cmsUpdateTeacherName,
    cmsGoToEditStaffPage,
    cmsUpdateParentName,
    cmsUpdateStudentName,
    learnerUpdatesAvatar,
    teacherVerifyAvatarOfParticipantList,
    teacherVerifyNameOfParticipantList,
    teacherVerifyUserAvatarInParticipantList,
    teacherVerifyUserNameInParticipantList,
    cmsGoToEditStudentPage,
} from './communication-view-information-in-participant-list-definitions';
import { goToEditStudentDetailPage } from 'test-suites/squads/user-management/step-definitions/user-update-student-definitions';

When(
    'school admin updates {string} name',
    async function (this: IMasterWorld, accountRole: AccountRoles) {
        const cms = this.cms;
        const { context } = this.scenario;
        const isTeacher = isTeacherRole(accountRole);
        const accountProfile = getUserProfileFromContext(
            this.scenario,
            isTeacher
                ? staffProfileAliasWithAccountRoleSuffix(accountRole)
                : learnerProfileAliasWithAccountRoleSuffix(accountRole)
        );

        if (isTeacher) {
            await cms.instruction(`School admin go to edit the staff page`, async () => {
                await cmsGoToEditStaffPage(cms, accountProfile);
            });
        } else {
            await cms.instruction(`School admin go to edit the student page`, async () => {
                await cmsGoToEditStudentPage(cms, accountProfile);
            });
        }

        await cms.instruction(`School admin update name of ${accountRole}`, async () => {
            const newName = isTeacher
                ? await cmsUpdateTeacherName(cms, accountProfile)
                : await cmsUpdateStudentName(cms, accountProfile);
            context.set(aliasUserNameUpdated, newName);
        });
    }
);

When(
    'school admin updates {string} name of {string}',
    async function (this: IMasterWorld, parentRole: AccountRoles, learnerRole: AccountRoles) {
        const cms = this.cms;
        const { context } = this.scenario;
        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(learnerRole)
        );
        const parentProfiles: UserProfileEntity[] =
            context.get(parentProfilesAliasWithAccountRoleSuffix(learnerRole)) ?? [];

        await cms.instruction('School admin go to edit the student page', async () => {
            await goToEditStudentDetailPage(this, learnerProfile, parentProfiles, []);
        });

        await cms.instruction(
            `School admin update ${parentRole} name of ${learnerRole}`,
            async () => {
                const newName = await cmsUpdateParentName(cms, parentProfiles[0]);
                context.set(aliasUserNameUpdated, newName);
            }
        );
    }
);

When(
    '{string} updates avatar on Learner App',
    async function (this: IMasterWorld, learnerRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        const { context } = this.scenario;

        await learner.instruction(`${learnerRole} updates avatar on the learner app`, async () => {
            const newAvatarUrl = await learnerUpdatesAvatar(learner);
            context.set(aliasUserAvatarUpdated, newAvatarUrl);
        });
    }
);

Then(
    '{string} sees name of participant list is updated',
    async function (this: IMasterWorld, teacherRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const { context } = this.scenario;
        const updatedName = context.get(aliasUserNameUpdated);

        await teacher.instruction(
            `${teacherRole} sees name of participant list is updated`,
            async () => {
                await teacherVerifyNameOfParticipantList(teacher, updatedName);
            }
        );
    }
);

Then(
    '{string} sees avatar of participant list is updated',
    async function (this: IMasterWorld, teacherRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const { context } = this.scenario;
        const updatedAvatarUrl = context.get(aliasUserAvatarUpdated);

        await teacher.instruction(
            `${teacherRole} sees avatar of participant list is updated`,
            async () => {
                await teacherVerifyAvatarOfParticipantList(teacher, updatedAvatarUrl);
            }
        );
    }
);

Then(
    '{string} sees name of {string} in participant list is updated',
    async function (this: IMasterWorld, teacherRole: AccountRoles, accountRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const { context } = this.scenario;
        const isTeacher = isTeacherRole(accountRole);
        const accountProfile = getUserProfileFromContext(
            this.scenario,
            isTeacher
                ? staffProfileAliasWithAccountRoleSuffix(accountRole)
                : learnerProfileAliasWithAccountRoleSuffix(accountRole)
        );

        const updatedName: string = context.get(aliasUserNameUpdated);

        await teacher.instruction(
            `${teacherRole} sees name of ${accountRole} in participant list is updated`,
            async () => {
                await teacherVerifyUserNameInParticipantList(
                    teacher,
                    updatedName,
                    accountProfile.id
                );
            }
        );
    }
);

Then(
    '{string} sees avatar of {string} in participant list is updated',
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const { context } = this.scenario;
        const accountProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(learnerRole)
        );

        const updatedAvatarUrl: string = context.get(aliasUserAvatarUpdated);

        await teacher.instruction(
            `${teacherRole} sees name of ${learnerRole} in participant list is updated`,
            async () => {
                await teacherVerifyUserAvatarInParticipantList(
                    teacher,
                    updatedAvatarUrl,
                    accountProfile.id
                );
            }
        );
    }
);

Then(
    '{string} sees {string} avatar of {string} in participant list is updated',
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        parentRole: AccountRoles,
        learnerRole: AccountRoles
    ) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const { context } = this.scenario;
        const parentProfile = getAccountProfileAliasOfStudent(this, parentRole, learnerRole)!;
        const avatarUrl: string = context.get(aliasUserAvatarUpdated);

        await teacher.instruction(
            `${teacherRole} sees avatar of ${parentRole} in participant list is updated`,
            async () => {
                await teacherVerifyUserAvatarInParticipantList(
                    teacher,
                    avatarUrl,
                    parentProfile.id
                );
            }
        );
    }
);
