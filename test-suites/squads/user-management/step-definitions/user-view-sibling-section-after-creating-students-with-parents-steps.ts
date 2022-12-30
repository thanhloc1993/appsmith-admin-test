import {
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import { ConditionStatusTypes, WithConditionTypes } from '@user-common/types/bdd';

import { DataTable, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { searchAndSelectExistedParent } from './user-create-student-definitions';
import { schoolAdminDoesNotSeeAnySiblingInSiblingSection } from './user-view-sibling-section-after-creating-students-with-parents-definitions';
import {
    assertSiblingInfosOfStudent,
    createParentWithProfile,
} from './user-view-sibling-section-after-updating-student-info-definitions';
import { createStudentWithProfile } from './user-view-siblings-info-with-multiple-parents-definitions';

When(
    'school admin creates {string} and {string} {string} same parent',
    async function (
        this: IMasterWorld,
        learnerS1: AccountRoles,
        learnerS2: AccountRoles,
        conditions: WithConditionTypes
    ) {
        const scenarioContext = this.scenario;
        const cms = this.cms;

        await createStudentWithProfile(cms, scenarioContext);
        const studentS1Profile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(learnerS1), studentS1Profile);

        const parentProfile = await createParentWithProfile(cms, studentS1Profile);

        await createStudentWithProfile(cms, scenarioContext);
        const studentS2Profile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(learnerS2), studentS2Profile);

        if (conditions === 'with') {
            await searchAndSelectExistedParent(cms, parentProfile.name);
        } else {
            await createParentWithProfile(cms, studentS2Profile);
        }
    }
);

Then(
    `school admin {string} sibling info in sibling section of student`,
    async function (
        this: IMasterWorld,
        expectedConditions: ConditionStatusTypes,
        dataTable: DataTable
    ) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const studentSibling = dataTable.hashes();
        for (const student of studentSibling) {
            const siblingProfile = scenarioContext.get<UserProfileEntity>(
                learnerProfileAliasWithAccountRoleSuffix(student.sibling)
            );
            const studentProfile = scenarioContext.get<UserProfileEntity>(
                learnerProfileAliasWithAccountRoleSuffix(student.student)
            );
            if (expectedConditions === 'sees') {
                await assertSiblingInfosOfStudent(cms, studentProfile, [siblingProfile]);
            } else {
                await schoolAdminDoesNotSeeAnySiblingInSiblingSection(cms, studentProfile);
            }
        }
    }
);
