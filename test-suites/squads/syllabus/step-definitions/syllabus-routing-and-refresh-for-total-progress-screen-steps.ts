import { randomString } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { studentGoesToStatsPageFromHomeScreen } from './syllabus-routing-and-refresh-for-total-progress-screen-steps-definitions';
import { ByValueKey } from 'flutter-driver-x';

When(
    'student goes to Total Progress Screen by using browser address',
    async function (this: IMasterWorld) {
        const learner = this.learner;
        const domainUrl = learner.page!.url().split('#')[0] + '#/';
        const path = 'tab?tab_name=stats/totalProgress?user_id=';
        const userId = await this.learner.getUserId();

        await learner.instruction(
            `student enters ${domainUrl}${path}${userId} on browser address`,
            async function () {
                await learner.page!.goto(`${domainUrl}${path}${userId}`);
            }
        );
    }
);

Given('student goes to Total Progress Screen', async function () {
    await this.learner.instruction(
        'student goes to Stats Page from Home Screen',
        async function (learner) {
            await studentGoesToStatsPageFromHomeScreen(learner);
        }
    );

    await this.learner.instruction('student clicks Total Progress', async function (learner) {
        const totalProgressButtonKey = SyllabusLearnerKeys.total_progress_button;
        const totalProgressButtonFinder = new ByValueKey(totalProgressButtonKey);
        await learner.flutterDriver!.tap(totalProgressButtonFinder);
    });

    await this.learner.instruction('student is on Total Progress Page', async function (learner) {
        const totalProgressScreenKey = SyllabusLearnerKeys.total_progress_screen;
        const totalProgressScreenFinder = new ByValueKey(totalProgressScreenKey);
        await learner.flutterDriver!.waitFor(totalProgressScreenFinder);
    });
});

Given('student goes to Total Progress Screen accessed by wrong param', async function () {
    const learner = this.learner;
    const domainUrl = learner.page!.url().split('#')[0] + '#/';
    const path = 'tab?tab_name=stats/totalProgress?user_id=';
    const randomText = randomString(5);

    await this.learner.instruction(
        'student goes to Stats Page from Home Screen',
        async function (learner) {
            await studentGoesToStatsPageFromHomeScreen(learner);
        }
    );

    await this.learner.instruction(
        `student enters ${domainUrl}${path}${randomText} on browser address`,
        async function () {
            await learner.page!.goto(`${domainUrl}${path}${randomText}`);
        }
    );
});

Given('student sees error dialog', async function () {
    const learner = this.learner;
    await this.learner.instruction(`student sees error dialog`, async function () {
        const errorDialogFinder = new ByValueKey(
            SyllabusLearnerKeys.getTotalLearningProgressFailedDialog
        );
        await learner.flutterDriver!.waitFor(errorDialogFinder);
    });
});

Given('student confirms the error dialog', async function () {
    const learner = this.learner;
    await this.learner.instruction(`student confirms the error dialog`, async function () {
        const confirmButtonFinder = new ByValueKey(SyllabusLearnerKeys.confirm_button);
        await learner.flutterDriver!.tap(confirmButtonFinder);
    });
});
