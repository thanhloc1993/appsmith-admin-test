import {
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { searchAndSelectExistedParent } from './user-create-student-definitions';
import {
    schoolAdminGoesToStudentDetailAndEdit,
    schoolAdminSeesDetailStudentCorrectly,
} from './user-definition-utils';
import {
    assertSiblingInfosOfStudent,
    createParentWithProfile,
    editStudentSiblingInfo,
} from './user-view-sibling-section-after-updating-student-info-definitions';
import { createStudentWithProfile } from './user-view-siblings-info-with-multiple-parents-definitions';

Given(
    'school admin has created {string} and {string} with same parent',
    async function (this: IMasterWorld, learnerS1: AccountRoles, learnerS2: AccountRoles) {
        const scenarioContext = this.scenario;
        const cms = this.cms;
        await createStudentWithProfile(cms, scenarioContext);
        const studentS1Profile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(learnerS1), studentS1Profile);

        const parentProfile = await createParentWithProfile(cms, studentS1Profile);
        await createStudentWithProfile(cms, scenarioContext);

        const studentS2Profile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(learnerS2), studentS2Profile);

        await searchAndSelectExistedParent(cms, parentProfile.name);
    }
);

When(
    'school admin updates {string} info',
    async function (this: IMasterWorld, learner: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(learner)
        );

        await schoolAdminGoesToStudentDetailAndEdit(cms, learnerProfile, true);
        const { newName, newEnrollmentStatus, newGrade, newLocations } =
            await editStudentSiblingInfo(cms, learnerProfile);

        learnerProfile.gradeMaster!.name = newGrade;
        scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(learner), {
            ...learnerProfile,
            name: newName,
            enrollmentStatus: newEnrollmentStatus,
            locations: newLocations,
        });
    }
);

Then(
    'school admin sees {string} info is updated correctly',
    async function (this: IMasterWorld, learner: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const learnerProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(learner)
        );
        await cms.waitingForLoadingIcon();
        await schoolAdminSeesDetailStudentCorrectly(cms, learnerProfile);
    }
);

Then(
    'school admin sees {string} info in sibling section of {string} is updated correctly',
    async function (this: IMasterWorld, learnerS2: AccountRoles, learnerS1: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const sibling = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(learnerS2)
        );
        const student = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(learnerS1)
        );
        await assertSiblingInfosOfStudent(cms, student, [sibling]);
    }
);

Then(
    'school admin does not see any change of {string} info in sibling section of {string}',
    async function (this: IMasterWorld, learnerS1: AccountRoles, learnerS2: AccountRoles) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const sibling = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(learnerS2)
        );
        const student = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(learnerS1)
        );
        await assertSiblingInfosOfStudent(cms, student, [sibling]);
    }
);
