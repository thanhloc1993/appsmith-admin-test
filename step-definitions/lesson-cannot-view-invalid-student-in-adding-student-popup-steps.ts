import { StatusTypes } from '@legacy-step-definitions/types/common';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    createStudentWithStatusLessonManagement,
    searchStudentNameOnStudentPopUp,
    studentInvisibleInDialogAddStudentSubscription,
} from './lesson-cannot-view-invalid-student-in-adding-student-popup-definitions';
import { getCMSInterfaceByRole, getUserProfileFromContext } from './utils';
import { openDialogAddStudentSubscription } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

Given(
    'school admin has created a student {string} with {string} status, {string}',
    async function (role: AccountRoles, status: StatusTypes, studentPackages: string) {
        const cms = this.cms!;
        const scenarioContext = this.scenario;
        const studentPackageProfileLength = parseInt(
            studentPackages.split(' visible courses')[0],
            0
        );
        await cms.instruction(
            `school admin has created a student ${role} with ${status} status, ${studentPackages}`,
            async function () {
                await createStudentWithStatusLessonManagement(
                    cms,
                    scenarioContext,
                    status,
                    role,
                    studentPackageProfileLength
                );
            }
        );
    }
);

When('{string} opens adding student popup', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} opens adding student popup`, async function () {
        await openDialogAddStudentSubscription(cms);
    });
});

When(
    '{string} searches for the student name in student popup',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(`${role} opens adding student popup`, async function () {
            await searchStudentNameOnStudentPopUp(cms, learnerProfile.name);
        });
    }
);

Then('{string} does not see any result', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} does not see any result`, async function () {
        await studentInvisibleInDialogAddStudentSubscription(cms);
    });
});
