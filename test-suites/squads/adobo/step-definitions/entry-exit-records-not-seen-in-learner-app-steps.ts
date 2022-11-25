import { getAccountProfileAliasOfStudent } from '@legacy-step-definitions/credential-account-definitions';
import {
    getLearnerInterfaceFromRole,
    getUserProfileFromContext,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { StudentDetailTab } from '@supports/types/cms-types';

import { cmsGoToStudentEntryExitTab } from './entry-exit-add-entry-exit-record-definitions';
import { tapOnMyEntryExitRecords } from './entry-exit-record-entry-exit-time-learner-app-definitions';
import { accountSeesEmptyEntryExitRecords } from './entry-exit-records-not-seen-in-learner-app-definitions';
import { schoolAdminChooseTabInStudentDetail } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';
import { openMenuPopupOnWeb } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { removeParentFromStudent } from 'test-suites/squads/user-management/step-definitions/user-modify-parent-of-student-definitions';
import { seeNewlyCreatedStudentOnCMS } from 'test-suites/squads/user-management/step-definitions/user-view-student-details-definitions';

When(
    '{string} and {string} view entry & exit information',
    async function (this: IMasterWorld, studentRole: AccountRoles, parentRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, 'student');
        const parent = this.parent!;

        await learner.instruction(
            `${studentRole} goes to Entry & Exit records screen`,
            async function () {
                await openMenuPopupOnWeb(learner);

                await tapOnMyEntryExitRecords(learner);
            }
        );

        await parent.instruction(
            `${parentRole} of student goes to Entry & Exit records screen`,
            async function () {
                await openMenuPopupOnWeb(parent);

                await tapOnMyEntryExitRecords(parent);
            }
        );
    }
);

When(
    '{string} views entry & exit record of {string}',
    async function (this: IMasterWorld, studentRole: AccountRoles, parentRole: AccountRoles) {
        const parent = this.parent!;

        await parent.instruction(
            `${parentRole} of ${studentRole} goes to Entry & Exit records screen`,
            async function () {
                await openMenuPopupOnWeb(parent);

                await tapOnMyEntryExitRecords(parent);
            }
        );
    }
);

When(
    'school admin removes relationship between {string} and {string}',
    async function (this: IMasterWorld, parentRole: AccountRoles, studentRole: AccountRoles) {
        const cms = this.cms;
        const { context } = this.scenario;
        const studentProfile = getAccountProfileAliasOfStudent(this, studentRole, studentRole)!;
        const parentProfile = getAccountProfileAliasOfStudent(this, parentRole, studentRole)!;
        const parents: UserProfileEntity[] = context.get(
            parentProfilesAliasWithAccountRoleSuffix(studentRole)
        );

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile: studentProfile,
                parents: parents,
                studentCoursePackages: [],
            },
            verifyStudentCoursePackages: false,
        });

        await cms.instruction(`Go to Family Tab`, async function () {
            await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
        });

        await cms.instruction('School admin removes parent from student', async function () {
            await removeParentFromStudent(cms, parentProfile);
        });

        await cms.instruction(`Assert success message`, async () => {
            await this.cms.assertNotification('You have removed the parent successfully!');
        });
    }
);

When(
    '{string} views entry & exit information of {string}',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles, studentRole: AccountRoles) {
        const cms = this.cms;

        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await cms.instruction(
            `${schoolAdminRole} goes to Entry & Exit tab in Student Detail page of ${studentRole}`,
            async function () {
                await cmsGoToStudentEntryExitTab(cms, learnerProfile);
            }
        );
    }
);

Then(
    '{string} and {string} see that there are no entry and exit records',
    async function (this: IMasterWorld, studentRole: AccountRoles, parentRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, studentRole);
        const parent = this.parent!;

        await accountSeesEmptyEntryExitRecords(learner, studentRole);
        await accountSeesEmptyEntryExitRecords(parent, parentRole);
    }
);

Then(
    '{string} does not see entry & exit record of {string}',
    async function (this: IMasterWorld, role: AccountRoles, parentRole: AccountRoles) {
        const parent = this.parent!;

        await parent.instruction(`${parentRole} checks entry & exit screen`, async function () {
            await openMenuPopupOnWeb(parent);
            await tapOnMyEntryExitRecords(parent);
            await accountSeesEmptyEntryExitRecords(parent, role);
        });
    }
);
