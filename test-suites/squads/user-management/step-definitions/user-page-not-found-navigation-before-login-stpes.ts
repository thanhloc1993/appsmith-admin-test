import { LearnerKeys } from '@common/learner-key';
import {
    aLearnerAtAuthLoginScreenLearnerWeb,
    aLearnerAtAuthMultiScreenLearnerWeb,
} from '@legacy-step-definitions/learner-email-login-definitions';
import { randomString } from '@legacy-step-definitions/utils';

import { Given, When } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { IMasterWorld } from '@supports/app-types';

import { userAuthenticationLearnerRememberedAccount } from './user-definition-utils';
import { ByValueKey } from 'flutter-driver-x';

Given('student has not logged in yet', async function (this: IMasterWorld) {
    const learner = this.learner;
    const userId = (await learner.getUserId()) ?? '';
    weExpect(userId, `student has not logged in yet, so userId is ${userId} empty`).toEqual('');

    const isEnabledRemoveRememberedAccount = await featureFlagsHelper.isEnabled(
        userAuthenticationLearnerRememberedAccount
    );

    if (isEnabledRemoveRememberedAccount) {
        await aLearnerAtAuthLoginScreenLearnerWeb(learner);
    } else {
        await aLearnerAtAuthMultiScreenLearnerWeb(learner);
    }
});

When('student enters a random path on browser address', async function (this: IMasterWorld) {
    const learner = this.learner;
    const domainUrl = learner.page!.url().split('#')[0] + '#/';
    const randomText = randomString(5);
    await learner.instruction(
        `student enters ${domainUrl}${randomText} on browser address`,
        async function () {
            await learner.page!.goto(`${domainUrl}${randomText}`);
        }
    );
});

Given('student goes to Page Not Found Screen', async function (this: IMasterWorld) {
    const learner = this.learner;
    const domainUrl = learner.page!.url().split('#')[0] + '#/';
    const randomText = randomString(5);
    await learner.instruction(
        `student enters ${domainUrl}${randomText} on browser address`,
        async function () {
            await learner.page!.goto(`${domainUrl}${randomText}`);
        }
    );
    const pageNotFoundScreenFinder = new ByValueKey(LearnerKeys.pageNotFoundScreen);
    await learner.instruction(`student is on Page Not Found Screen`, async function () {
        await learner.flutterDriver!.waitFor(pageNotFoundScreenFinder);
    });
});
