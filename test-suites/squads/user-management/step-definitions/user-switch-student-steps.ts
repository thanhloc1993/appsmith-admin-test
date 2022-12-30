import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import {
    kidProfilesOfParentAlias,
    learnerProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { openMenuPopupOnWeb } from './user-definition-utils';
import {
    checkStudentAvatarOnAppBar,
    createStudentsWithSameParent,
    parentSeesKidAtIndex,
    parentSeesKidWithCorrectAvatar,
    removeParentOfStudent,
    tapOnSwitchStudent,
    userSeesNoStudentAssociated,
    tapToSwitchStudent,
} from './user-switch-student-definitions';
import { ByValueKey } from 'flutter-driver-x';

Given(
    '{string} has created {string} students with the same parent',
    async function (this: IMasterWorld, role: AccountRoles, numOfStudents: string) {
        const cms = this.cms;
        const scenario = this.scenario;
        const parsedNumOfStudents = parseInt(numOfStudents);

        await cms.instruction(
            `school admin has created ${numOfStudents} students with same parent`,
            async function () {
                await createStudentsWithSameParent(cms, scenario, parsedNumOfStudents, role);
            }
        );
    }
);

When(
    '{string} goes to switch student page',
    async function (this: IMasterWorld, parentRole: AccountRoles) {
        const parent = this.parent!;

        await parent.instruction(`${parentRole} goes to switch student screen`, async function () {
            await openMenuPopupOnWeb(parent);

            await tapOnSwitchStudent(parent);
        });
    }
);

Then(
    '{string} sees all kids are displayed in ascending order',
    async function (this: IMasterWorld, parentRole: AccountRoles) {
        const parent = this.parent!;
        const context = this.scenario.context;

        await parent.instruction(
            `${parentRole} sees all kids in ascending order`,
            async function () {
                const entity = await parent.getKidsOfParent();
                const kids = entity.kidsOfParent;
                context.set(kidProfilesOfParentAlias, kids);

                for (let i = 0; i < kids.length; i++) {
                    const kid = kids[i];
                    await parentSeesKidAtIndex(parent, kid, parentRole, i);
                }
            }
        );
    }
);
Then(
    '{string} sees all kids are having correct avatars',
    async function (this: IMasterWorld, parentRole: AccountRoles) {
        const parent = this.parent!;
        const context = this.scenario.context;

        await parent.instruction(
            `${parentRole} sees all kids are having correct avatars`,
            async function () {
                const kids: UserProfileEntity[] = context.get(kidProfilesOfParentAlias);

                for (const kid of kids) {
                    await parentSeesKidWithCorrectAvatar(parent, kid, parentRole);
                }
            }
        );
    }
);

When(
    '{string} switches to {string}',
    async function (this: IMasterWorld, parentRole: AccountRoles, studentRole: AccountRoles) {
        const parent = this.parent!;
        const scenario = this.scenario;

        await parent.instruction(
            `${parentRole} taps on ${studentRole} to switch selected kid`,
            async function () {
                const student = scenario.get<UserProfileEntity>(
                    learnerProfileAliasWithAccountRoleSuffix(studentRole)
                );

                await tapToSwitchStudent(parent, student.id, scenario);
            }
        );
    }
);

Then(
    '{string} sees correct avatar of {string} on app bar',
    async function (this: IMasterWorld, parentRole: AccountRoles, studentRole: AccountRoles) {
        const parent = this.parent;
        const scenario = this.scenario;

        await parent.instruction(
            `${parentRole} sees avatar of ${studentRole} on app bar`,
            async function () {
                const student = scenario.get<UserProfileEntity>(
                    learnerProfileAliasWithAccountRoleSuffix(studentRole)
                );
                await checkStudentAvatarOnAppBar(parent, student);
            }
        );
    }
);

Then(
    '{string} is redirected to stat page',
    async function (this: IMasterWorld, parentRole: AccountRoles) {
        const parent = this.parent;
        const driver = parent.flutterDriver!;

        await parent.instruction(`${parentRole} is on stat page`, async function () {
            await driver.runUnsynchronized(async () => {
                await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.stats_page));
            });
        });
    }
);

Given(
    '{string} removes parent of {string}',
    async function (this: IMasterWorld, adminRole: AccountRoles, studentRole: AccountRoles) {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction(`${adminRole} removes parent of ${studentRole}`, async function () {
            await removeParentOfStudent(cms, scenario, studentRole);
        });
    }
);

Then(
    '{string} sees no associated students displayed',
    async function (this: IMasterWorld, parentRole: AccountRoles) {
        const parent = this.parent;
        await parent.instruction(
            `${parentRole} sees no associated student displayed`,
            async function () {
                await userSeesNoStudentAssociated(parent);
            }
        );
    }
);
