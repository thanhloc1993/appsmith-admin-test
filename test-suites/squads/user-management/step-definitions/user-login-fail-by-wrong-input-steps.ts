import { learnerProfileAlias } from '@user-common/alias-keys/user';
import { staffProfileAlias } from '@user-common/alias-keys/user';
import { StaffInfo } from '@user-common/types/staff';

import { When } from '@cucumber/cucumber';

import { IMasterWorld, Platform } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { getStringRandomByWithoutType, WithoutType } from './user-definition-utils';
import {
    loginCMSByUserNameAndPassWord,
    loginTeacherAppByUserNameAndPassWord,
    loginLearnerAppAppByUserNameAndPassWord,
} from './user-login-fail-by-wrong-username-or-password-definitions';
import { getTenantSchoolAdminSequence } from './user-multi-tenant-authentication-definitions';

When(
    'user logins {string} username on {string}',
    async function (this: IMasterWorld, withoutType: WithoutType, platform: Platform) {
        const username = getStringRandomByWithoutType(withoutType);

        switch (platform) {
            case 'CMS': {
                const { password } = getTenantSchoolAdminSequence();

                await loginCMSByUserNameAndPassWord(this.cms, username, password);
                break;
            }
            case 'Teacher App': {
                const { password = '' } = this.scenario.get<StaffInfo>(staffProfileAlias);

                await loginTeacherAppByUserNameAndPassWord(this.teacher, username, password);
                break;
            }
            case 'Learner App': {
                const { password } = this.scenario.get<UserProfileEntity>(learnerProfileAlias);

                await loginLearnerAppAppByUserNameAndPassWord(this.learner, username, password);
                break;
            }
        }
    }
);

When(
    'user logins {string} password on {string}',
    async function (this: IMasterWorld, withoutType: WithoutType, platform: Platform) {
        const password = getStringRandomByWithoutType(withoutType);

        switch (platform) {
            case 'CMS': {
                const { username } = getTenantSchoolAdminSequence();

                await loginCMSByUserNameAndPassWord(this.cms, username, password);
                break;
            }
            case 'Teacher App': {
                const { email } = this.scenario.get<StaffInfo>(staffProfileAlias);

                await loginTeacherAppByUserNameAndPassWord(this.teacher, email, password);
                break;
            }
            case 'Learner App': {
                const { email } = this.scenario.get<UserProfileEntity>(learnerProfileAlias);

                await loginLearnerAppAppByUserNameAndPassWord(this.learner, email, password);
                break;
            }
        }
    }
);

When(
    'user logins {string} username and password on {string}',
    async function (this: IMasterWorld, withoutType: WithoutType, platform: Platform) {
        const username = getStringRandomByWithoutType(withoutType);
        const password = getStringRandomByWithoutType(withoutType);
        switch (platform) {
            case 'CMS': {
                await loginCMSByUserNameAndPassWord(this.cms, username, password);
                break;
            }
            case 'Teacher App': {
                await loginTeacherAppByUserNameAndPassWord(this.teacher, username, password);
                break;
            }
            case 'Learner App': {
                await loginLearnerAppAppByUserNameAndPassWord(this.learner, username, password);
                break;
            }
        }
    }
);
