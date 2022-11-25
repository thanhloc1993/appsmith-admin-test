import { getAccountProfileAliasOfStudent } from '@legacy-step-definitions/credential-account-definitions';
import {
    getStudentIdFromContextWithAccountRole,
    getTeacherInterfaceFromRole,
    getUserIdFromContextWithAccountRole,
    getUserProfileFromContext,
    isParentRole,
    splitRolesStringToAccountRoles,
} from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { StudentDetailTab } from '@supports/types/cms-types';

import { teacherSelectConversation } from './communication-common-definitions';
import {
    teacherMoveToParticipantList,
    teacherSelectsViewInfoOptionInParticipantList,
    teacherVerifyLearnerInParticipantList,
    teacherVerifyStudentInformation,
    teacherVerifyTeacherInParticipantList,
} from './communication-view-participant-list-in-chat-group-definitions';
import {
    schoolAdminChooseTabInStudentDetail,
    schoolAdminFindStudentAndGoesToStudentDetail,
    searchAndSelectExistedParent,
} from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';
import { removeParentFromStudent } from 'test-suites/squads/user-management/step-definitions/user-modify-parent-of-student-definitions';

When(
    '{string} goes to participant list of {string} conversation on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles, accountRole: AccountRoles) {
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, accountRole);
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const isParent = isParentRole(accountRole);

        await teacher.instruction(`${teacher} accesses the chat group`, async () => {
            await teacherSelectConversation(teacher, isParent, studentId);
        });

        await teacher.instruction(`${teacher} move to the participant list dialog`, async () => {
            await teacherMoveToParticipantList(teacher);
        });
    }
);

Then(
    '{string} sees {string} in participant list',
    async function (this: IMasterWorld, teacherRole: AccountRoles, teacherRolesString: string) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const teacherRoles = splitRolesStringToAccountRoles(teacherRolesString);

        await teacher.instruction(
            `${teacher} sees ${teacherRolesString} display in the participant list`,
            async () => {
                for (const teacherRole of teacherRoles) {
                    await teacherVerifyTeacherInParticipantList(this, teacher, teacherRole);
                }
            }
        );
    }
);

Then(
    '{string} does not see {string} in participant list',
    async function (this: IMasterWorld, teacherRole: AccountRoles, teacherRolesString: string) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const teacherRoles = splitRolesStringToAccountRoles(teacherRolesString);

        await teacher.instruction(
            `${teacher} sees ${teacherRolesString} display in the participant list`,
            async () => {
                for (const teacherRole of teacherRoles) {
                    await teacherVerifyTeacherInParticipantList(this, teacher, teacherRole, false);
                }
            }
        );
    }
);

Then(
    '{string} sees {string} of {string} in participant list',
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        accountRolesString: string,
        studentRole: AccountRoles
    ): Promise<void> {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const accountRoles = splitRolesStringToAccountRoles(accountRolesString);

        await teacher.instruction(
            `${teacher} sees ${accountRolesString} display in participant list`,
            async () => {
                for (const accountRole of accountRoles) {
                    await teacherVerifyLearnerInParticipantList(
                        this,
                        teacher,
                        accountRole,
                        studentRole
                    );
                }
            }
        );
    }
);

Then(
    '{string} does not see {string} of {string} in participant list',
    async function (
        this: IMasterWorld,
        teacherRole: AccountRoles,
        accountRolesString: string,
        studentRole: AccountRoles
    ): Promise<void> {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const accountRoles = splitRolesStringToAccountRoles(accountRolesString);

        await teacher.instruction(
            `${teacher} sees ${accountRolesString} display in participant list`,
            async () => {
                for (const accountRole of accountRoles) {
                    await teacherVerifyLearnerInParticipantList(
                        this,
                        teacher,
                        accountRole,
                        studentRole,
                        false
                    );
                }
            }
        );
    }
);

When(
    '{string} selects to view information of {string} in participant list',
    async function (this: IMasterWorld, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const userId = getUserIdFromContextWithAccountRole(this.scenario, learnerRole);

        await teacher.instruction(
            `${teacher} selects view info option of ${learnerRole} in the participant list`,
            async () => {
                await teacherSelectsViewInfoOptionInParticipantList(teacher, userId);
            }
        );
    }
);

Then(
    '{string} sees {string} information on Teacher App',
    async function (this: IMasterWorld, teacherRole: AccountRoles, studentRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const studentProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await teacher.instruction(
            `${teacher} sees ${studentRole} information on Teacher App`,
            async () => {
                await teacherVerifyStudentInformation(teacher, studentProfile);
            }
        );
    }
);

When(
    'school admin remove relationship between {string} and {string}',
    async function (this: IMasterWorld, parentRole: AccountRoles, studentRole: AccountRoles) {
        const cms = this.cms;
        const studentProfile = getAccountProfileAliasOfStudent(this, studentRole, studentRole)!;
        const parentProfile = getAccountProfileAliasOfStudent(this, parentRole, studentRole)!;

        await cms.instruction(`Go to student management page`, async function () {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        });

        await schoolAdminFindStudentAndGoesToStudentDetail(cms, studentProfile);

        await cms.instruction(`Go to Family Tab`, async function () {
            await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
        });

        await cms.instruction('School admin removes parent from student', async function () {
            await removeParentFromStudent(cms, parentProfile);
        });
    }
);

When(
    'school admin adds {string} for {string}',
    async function (this: IMasterWorld, parentRole: AccountRoles, studentRole: AccountRoles) {
        const cms = this.cms;
        const parentProfile = getAccountProfileAliasOfStudent(this, parentRole, studentRole)!;

        await cms.instruction('School admin adds parent for student', async () => {
            await searchAndSelectExistedParent(cms, parentProfile.email);
            await cms.waitingForLoadingIcon();
        });
    }
);
