import {
    learnerProfileAliasWithAccountRoleSuffix,
    parentProfilesAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import {
    StatusTypes,
    createStudentWithStatus,
} from './entry-exit-add-entry-exit-record-definitions';
import { searchAndSelectExistedParent } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';
import { findNewlyCreatedLearnerOnCMSStudentsPage } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { clickOnStudentOnStudentsTab } from 'test-suites/squads/user-management/step-definitions/user-view-student-details-definitions';

export async function schoolAdminCreateNewStudentWithExistingParentAndStatus(
    cms: CMSInterface,
    context: ScenarioContext,
    accountRole: AccountRoles,
    parentProfiles: UserProfileEntity[],
    status: StatusTypes
) {
    const studentData = await createStudentWithStatus(cms, context, status);

    context.set(learnerProfileAliasWithAccountRoleSuffix(accountRole), studentData);

    const firstParent = parentProfiles[0];
    const parentUsername = firstParent.name;

    context.set(parentProfilesAliasWithAccountRoleSuffix(accountRole), parentProfiles);

    await cms.instruction(`Find student ${studentData.name} on student list`, async function () {
        await findNewlyCreatedLearnerOnCMSStudentsPage(cms, studentData);
    });

    // Go to Student Detail
    await cms.instruction(`Click student ${studentData.name} on student list`, async function () {
        await clickOnStudentOnStudentsTab(cms, studentData);
    });

    /// Have instructions inside
    await searchAndSelectExistedParent(cms, parentUsername);
}
