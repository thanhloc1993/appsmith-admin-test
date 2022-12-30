import { aLearnerAlreadyLoginFailedInLearnerWeb } from '@legacy-step-definitions/learner-email-login-definitions';
import { aSchoolAdminOnCMSLoginPageAndSeeLoginForm } from '@legacy-step-definitions/school-admin-email-login-definitions';
import { aTeacherAlreadyLoginFailedInTeacherWeb } from '@legacy-step-definitions/teacher-email-login-definitions';
import { getRandomNumber } from '@legacy-step-definitions/utils';
import { learnerProfileAlias } from '@user-common/alias-keys/user';
import { staffProfileAlias } from '@user-common/alias-keys/user';
import { StaffInfo } from '@user-common/types/staff';

import { When, Then } from '@cucumber/cucumber';

import { IMasterWorld, Platform, TeacherInterface, LearnerInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    loginCMSByUserNameAndPassWord,
    loginTeacherAppByUserNameAndPassWord,
    loginLearnerAppAppByUserNameAndPassWord,
    getUserNameAndPassWordByInputType,
} from './user-login-fail-by-wrong-username-or-password-definitions';
import { getTenantSchoolAdminSequence } from './user-multi-tenant-authentication-definitions';

When(
    'user logins with wrong username on {string}',
    async function (this: IMasterWorld, platform: Platform) {
        switch (platform) {
            case 'CMS': {
                const { username, password } = getTenantSchoolAdminSequence();
                const wrongUsername = getRandomNumber() + username;

                await loginCMSByUserNameAndPassWord(this.cms, wrongUsername, password);
                break;
            }
            case 'Teacher App': {
                const { email, password = '' } = this.scenario.get<StaffInfo>(staffProfileAlias);

                const wrongUsername = getRandomNumber() + email;

                await loginTeacherAppByUserNameAndPassWord(this.teacher, wrongUsername, password);
                break;
            }
            case 'Learner App': {
                const { email, password } =
                    this.scenario.get<UserProfileEntity>(learnerProfileAlias);
                const wrongUsername = getRandomNumber() + email;

                await loginLearnerAppAppByUserNameAndPassWord(
                    this.learner,
                    wrongUsername,
                    password
                );
                break;
            }
        }
    }
);

When(
    'user logins with wrong password on {string}',
    async function (this: IMasterWorld, platform: Platform) {
        switch (platform) {
            case 'CMS': {
                const { username, password } = getTenantSchoolAdminSequence();
                const wrongPassword = getRandomNumber() + password;

                await loginCMSByUserNameAndPassWord(this.cms, username, wrongPassword);
                break;
            }
            case 'Teacher App': {
                const { email, password = '' } = this.scenario.get<StaffInfo>(staffProfileAlias);

                const wrongPassword = getRandomNumber() + password;
                await loginTeacherAppByUserNameAndPassWord(this.teacher, email, wrongPassword);
                break;
            }
            case 'Learner App': {
                const { email, password } =
                    this.scenario.get<UserProfileEntity>(learnerProfileAlias);
                const wrongPassword = getRandomNumber() + password;

                await loginLearnerAppAppByUserNameAndPassWord(this.learner, email, wrongPassword);
                break;
            }
        }
    }
);

When(
    'user logins with {string} username on {string}',
    async function (this: IMasterWorld, inputType: string, platform: Platform) {
        const { username, password } = getUserNameAndPassWordByInputType(inputType);

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

Then('user logins failed on {string}', async function (this: IMasterWorld, platform: Platform) {
    switch (platform) {
        case 'CMS': {
            await this.cms.instruction(
                'Logged in failed on CMS, does not see home screen',
                async function (cms) {
                    await aSchoolAdminOnCMSLoginPageAndSeeLoginForm(cms);
                }
            );
            break;
        }
        case 'Teacher App': {
            await this.teacher.instruction(
                'Logged in failed on Teacher App, does not see home screen',
                async function (teacher: TeacherInterface) {
                    await aTeacherAlreadyLoginFailedInTeacherWeb(teacher);
                }
            );
            break;
        }
        case 'Learner App': {
            await this.learner.instruction(
                'Logged in failed on Learner App, does not see home screen',
                async function (learner: LearnerInterface) {
                    await aLearnerAlreadyLoginFailedInLearnerWeb(learner);
                }
            );
            break;
        }
    }
});
