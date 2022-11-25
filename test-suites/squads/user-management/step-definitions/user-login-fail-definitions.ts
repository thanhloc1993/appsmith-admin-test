import { profileButtonSelector, buttonLogout } from '@legacy-step-definitions/cms-selectors/appbar';
import {
    learnerProfileAlias,
    parentProfilesAlias,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import { getTenantSchoolAdminSequence } from './user-multi-tenant-authentication-definitions';

export interface UserAccount {
    username: string;
    password: string;
}

export async function getUserNameAndPassWordByAccountRoles(
    scenario: ScenarioContext,
    role: AccountRoles
): Promise<UserAccount> {
    switch (role) {
        case 'student': {
            const learnerProfile = scenario.get<UserProfileEntity>(learnerProfileAlias);
            return {
                username: learnerProfile.email,
                password: learnerProfile.password,
            };
        }
        case 'parent P1': {
            const parentProfile = scenario.get<Array<UserProfileEntity>>(parentProfilesAlias)[0];
            return {
                username: parentProfile.email,
                password: parentProfile.password,
            };
        }
        case 'teacher': {
            const teacherProfile = scenario.get<UserProfileEntity>(
                staffProfileAliasWithAccountRoleSuffix('teacher')
            );
            return {
                username: teacherProfile.email,
                password: teacherProfile.password,
            };
        }
        case 'school admin': {
            return getTenantSchoolAdminSequence();
        }
        default:
            return { username: '', password: '' };
    }
}

export async function aSchoolAdminClickOnProfileButton(cms: CMSInterface) {
    await cms.instruction(`Click on profile button`, async function () {
        const page = cms.page!;

        const buttonProfile = await page.waitForSelector(profileButtonSelector);
        await buttonProfile.click();
    });
}

export async function aSchoolAdminClickLogoutButton(cms: CMSInterface) {
    await cms.instruction(`Click on logout button`, async function () {
        const page = cms.page!;
        await page.click(buttonLogout);
    });
}
