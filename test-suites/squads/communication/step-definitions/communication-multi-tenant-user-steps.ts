import { loginOnLearnerApp } from '@legacy-step-definitions/learner-email-login-definitions';
import {
    getLearnerTenantInterfaceFromRole,
    getParentTenantInterfaceFromRole,
    pick1stElement,
} from '@legacy-step-definitions/utils';

import { Given } from '@cucumber/cucumber';

import {
    IMasterWorld,
    LearnerRolesWithTenant,
    ParentRolesWithTenant,
    Tenant,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    learnerProfileAliasWithTenant,
    parentProfilesAliasWithTenant,
} from './alias-keys/communication';
import { tenantIdentifiers } from 'test-suites/squads/user-management/step-definitions/user-multi-tenant-authentication-definitions';

Given(
    '{string} and {string} has logged in with {string} on Learner Web',
    async function (
        this: IMasterWorld,
        learnerRole: LearnerRolesWithTenant,
        parentRole: ParentRolesWithTenant,
        tenant: Tenant
    ) {
        const scenarioContext = this.scenario;
        const learner = getLearnerTenantInterfaceFromRole(this, learnerRole);
        const parent = getParentTenantInterfaceFromRole(this, parentRole);

        const studentProfile = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithTenant(learnerRole)
        );

        const parentProfiles = scenarioContext.get<UserProfileEntity[]>(
            parentProfilesAliasWithTenant(parentRole)
        );
        const parentProfile = pick1stElement(parentProfiles);

        await learner.instruction(`${studentProfile.name} has logged in Learner Web`, async () => {
            await loginOnLearnerApp({
                learner: learner,
                email: studentProfile.email,
                name: studentProfile.name,
                password: studentProfile.password,
                organization: tenantIdentifiers[tenant],
            });
        });

        if (parentProfile) {
            await parent.instruction(
                `${parentProfile.name} has logged in Learner Web`,
                async () => {
                    await loginOnLearnerApp({
                        learner: parent,
                        email: parentProfile.email,
                        name: parentProfile.name,
                        password: parentProfile.password,
                        organization: tenantIdentifiers[tenant],
                    });
                }
            );
        } else await parent.attach(`Do not have parent for student ${studentProfile.name}`);
    }
);
