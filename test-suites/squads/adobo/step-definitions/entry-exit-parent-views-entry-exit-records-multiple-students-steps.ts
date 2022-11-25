import {
    getLearnerInterfaceFromRole,
    getUserProfileFromContext,
    splitRolesStringToAccountRoles,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { StatusTypes } from './entry-exit-add-entry-exit-record-definitions';
import { schoolAdminCreateNewStudentWithExistingParentAndStatus } from './entry-exit-parent-views-entry-exit-records-multiple-students-definitions';
import {
    accountSeesEntryExitRecord,
    tapOnMyEntryExitRecords,
} from './entry-exit-record-entry-exit-time-learner-app-definitions';
import { createExistingRecordForStudent } from './entry-exit-records-list-definitions';
import { checkIfWithExitTime, getCorrectDateForEntryExit } from './entry-exit-utils';
import {
    goBack,
    openMenuPopupOnWeb,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { tapOnSwitchButtonAndSelectKid } from 'test-suites/squads/user-management/step-definitions/user-view-student-details-definitions';

Given(
    'school admin has created {string} with {string} status and parent of {string}',
    async function (
        this: IMasterWorld,
        newStudentRole: AccountRoles,
        status: StatusTypes,
        studentRole: AccountRoles
    ) {
        const cms = this.cms;
        const { context } = this.scenario;

        const parentProfiles: UserProfileEntity[] = context.get(
            parentProfilesAliasWithAccountRoleSuffix(studentRole)
        );

        await schoolAdminCreateNewStudentWithExistingParentAndStatus(
            cms,
            this.scenario,
            newStudentRole,
            parentProfiles,
            status
        );
    }
);

Given(
    '{string} has at least 1 entry & exit record',
    async function (this: IMasterWorld, roles: AccountRoles) {
        const cms = this.cms;
        const scenario = this.scenario;
        const studentRoles = splitRolesStringToAccountRoles(roles);

        const currentDate = new Date();
        const correctDate = getCorrectDateForEntryExit(currentDate);

        for (const studentRole of studentRoles) {
            await cms.instruction(
                `School admin creates a record for ${studentRole}`,
                async function () {
                    const learnerProfile = getUserProfileFromContext(
                        scenario,
                        learnerProfileAliasWithAccountRoleSuffix(studentRole)
                    );
                    await createExistingRecordForStudent(
                        cms,
                        learnerProfile,
                        correctDate,
                        checkIfWithExitTime(correctDate)
                    );
                }
            );
        }
    }
);

When(
    '{string} sees entry & exit record of {string}',
    async function (this: IMasterWorld, parentRole: AccountRoles, studentRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, parentRole);
        const parent = this.parent!;

        const { records } = await learner.getEntryExitRecords();

        await parent.instruction(
            `${parentRole} of ${studentRole} sees entry & exit record`,
            async function () {
                await accountSeesEntryExitRecord(learner, records[0], 'Entry', studentRole);
                await accountSeesEntryExitRecord(learner, records[0], 'Exit', studentRole);
            }
        );
    }
);

Then(
    '{string} sees entry & exit record of the other student {string}',
    async function (this: IMasterWorld, parentRole: AccountRoles, studentRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, parentRole);
        const parent = this.parent!;

        const { records } = await learner.getEntryExitRecords();

        await parent.instruction(
            `${parentRole} of ${studentRole} sees entry & exit record`,
            async function () {
                await accountSeesEntryExitRecord(learner, records[0], 'Entry', studentRole);
                await accountSeesEntryExitRecord(learner, records[0], 'Exit', studentRole);
            }
        );
    }
);

When(
    '{string} switches to {string} to view entry & exit record',
    async function (this: IMasterWorld, parentRole: AccountRoles, studentRole: AccountRoles) {
        const parent = this.parent!;
        const scenario = this.scenario;

        const learnerProfile = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await goBack(parent);

        await parent.instruction(`${parentRole} switches to ${studentRole}`, async function () {
            await tapOnSwitchButtonAndSelectKid(parent, learnerProfile);
        });

        await parent.instruction('Student goes to Entry & Exit records screen', async function () {
            await openMenuPopupOnWeb(parent);
            await tapOnMyEntryExitRecords(parent);
        });
    }
);
