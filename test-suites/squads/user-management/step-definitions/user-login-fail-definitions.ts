import { profileButtonSelector, buttonLogout } from '@legacy-step-definitions/cms-selectors/appbar';
import { UserRole } from '@legacy-step-definitions/types/common';
import { learnerProfileAlias, parentProfilesAlias } from '@user-common/alias-keys/user';
import { staffProfileAlias } from '@user-common/alias-keys/user';
import { StaffInfo } from '@user-common/types/staff';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';

import { getTenantSchoolAdminSequence } from './user-multi-tenant-authentication-definitions';

export interface UserAccount {
    username: string;
    password: string;
}

export async function getUserNameAndPassWordByAccountRoles(
    scenario: ScenarioContext,
    role: UserRole
): Promise<UserAccount> {
    switch (role) {
        case 'Student': {
            const learnerProfile = scenario.get<UserProfileEntity>(learnerProfileAlias);
            return {
                username: learnerProfile.email,
                password: learnerProfile.password,
            };
        }
        case 'Parent': {
            const parentProfile = scenario.get<Array<UserProfileEntity>>(parentProfilesAlias)[0];
            return {
                username: parentProfile.email,
                password: parentProfile.password,
            };
        }
        case 'Teacher':
        case 'Teacher Lead':
        case 'Centre Manager':
        case 'Centre Staff':
        case 'Centre Lead':
        case 'HQ Staff': {
            const staffProfile = scenario.get<StaffInfo>(staffProfileAlias);
            return {
                username: staffProfile.email,
                password: staffProfile.password!,
            };
        }

        case 'School Admin': {
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
