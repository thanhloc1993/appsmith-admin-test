import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function learnerClickOnProfileOnMobile(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver;

    const appBarProfileFinder = new ByValueKey(LearnerKeys.homeScreenDrawerButton);
    await driver?.waitFor(appBarProfileFinder);
    await driver?.tap(appBarProfileFinder);
}

export async function learnerClickOnProfileOnWeb(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver;

    const appBarProfileFinder = new ByValueKey(LearnerKeys.app_bar_profile);
    await driver?.waitFor(appBarProfileFinder);
    await driver?.tap(appBarProfileFinder);
}

export async function learnerClickLogoutButton(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver;

    const appBarProfileFinder = new ByValueKey(LearnerKeys.logoutButton);
    await driver?.waitFor(appBarProfileFinder);
    await driver?.tap(appBarProfileFinder);
}

export async function learnerConfirmLogout(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver;

    const appBarProfileFinder = new ByValueKey(LearnerKeys.confirmedLogoutDialogYesButton);
    await driver?.waitFor(appBarProfileFinder);
    await driver?.tap(appBarProfileFinder);
}
