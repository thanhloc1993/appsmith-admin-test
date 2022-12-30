import { pick1stElement } from '@legacy-step-definitions/utils';

import { CMSInterface, LearnerRolesWithTenant, ParentRolesWithTenant } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    learnerProfileAliasWithTenant,
    parentProfilesAliasWithTenant,
} from './alias-keys/communication';
import { schoolAdminGetFirstGrantedLocation } from 'test-suites/squads/architecture/step-definitions/architecture-auto-select-first-granted-location-definitions';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export async function createStudentAndParentWithTenantRoleSuffix(
    cms: CMSInterface,
    context: ScenarioContext,
    learnerRole: LearnerRolesWithTenant,
    parentRole: ParentRolesWithTenant
) {
    const studentKey = learnerProfileAliasWithTenant(learnerRole);
    const parentKey = parentProfilesAliasWithTenant(parentRole);

    const firstGrantedLocation = await schoolAdminGetFirstGrantedLocation(cms, context);

    const { student, parents } = await createARandomStudentGRPC(cms, {
        locations: [firstGrantedLocation],
    });

    await cms.attach(
        `Create a student ${studentKey} and parent ${parentKey} by gRPC:
      \nStudent name: ${student.name}
      \nParent name: ${pick1stElement(parents)?.name}`
    );

    context.set(studentKey, student);
    context.set(parentKey, parents);
}
