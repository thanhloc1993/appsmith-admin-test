import {
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { AccountRoles, IMasterWorld, LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { UserProfileEntity } from 'test-suites/squads/lesson/common/lesson-profile-entity';

export function getStaffNameFromContext(
    scenarioContext: ScenarioContext,
    staffAlias: AccountRoles
) {
    return scenarioContext.get<UserProfileEntity>(
        staffProfileAliasWithAccountRoleSuffix(staffAlias)
    ).name;
}

export function getStudentNameFromContext(
    scenarioContext: ScenarioContext,
    studentAlias: AccountRoles
) {
    return scenarioContext.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix(studentAlias)
    ).name;
}

export function getUserProfileFromContext(scenarioContext: ScenarioContext, alias: string) {
    return scenarioContext.get<UserProfileEntity>(alias);
}

export function getUserIdFromRole(scenarioContext: ScenarioContext, role: AccountRoles) {
    if (role.includes('student')) {
        const learner = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix(role)
        );
        return learner.id;
    } else {
        const teacher = getUserProfileFromContext(
            scenarioContext,
            staffProfileAliasWithAccountRoleSuffix(role)
        );
        return teacher.id;
    }
}

export function getUsersFromContextByRegexKeys(
    scenarioContext: ScenarioContext,
    prefixAlias: string
): UserProfileEntity[] {
    return scenarioContext.getByRegexKeys(prefixAlias);
}

export function splitRolesStringToAccountRoles(roles: string): AccountRoles[] {
    return roles.split(', ') as AccountRoles[];
}

export function getLearnerInterfaceFromRole(
    master: IMasterWorld,
    role: AccountRoles
): LearnerInterface {
    switch (role) {
        case 'parent P1': {
            return master.parent;
        }
        case 'parent P2': {
            return master.parent2;
        }
        case 'student S2': {
            return master.learner2;
        }
        case 'student S3': {
            return master.learner3;
        }
        default: {
            return master.learner;
        }
    }
}
