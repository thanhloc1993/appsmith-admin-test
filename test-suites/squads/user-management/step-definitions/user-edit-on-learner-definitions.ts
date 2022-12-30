import { LearnerKeys } from '@common/learner-key';

import { LearnerInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import bobUserReaderService from '@supports/services/bob-user-reader/index';

import { openMenuPopupOnWeb, verifyAvatarOnScreen } from './user-definition-utils';
import { notStrictEqual } from 'assert';
import { ByValueKey } from 'flutter-driver-x';

// Examples:
// | profile |
// | name    |
// | avatar  |
export type ProfileType = 'name' | 'avatar';

// Examples:
// | role    |
// | student |
// | parent  |
export type EditProfileOnLearnerRole = 'student' | 'parent';

export async function goToEditAccountScreen(learner: LearnerInterface, profile: UserProfileEntity) {
    const driver = learner.flutterDriver!;

    if (driver.isApp()) {
        // TODO: Implement on Mobile app
    } else {
        await openMenuPopupOnWeb(learner);

        await tapOnEditAccountButton(learner);

        await verifyNameOnEditProfileScreen(learner, profile.name);
    }
}

export async function tapOnEditAccountButton(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    await learner.instruction(
        `Tap on Edit Account button`,
        async function (this: LearnerInterface) {
            const editAccountDrawerItemFinder = new ByValueKey(LearnerKeys.editAccountDrawerItem);
            await driver.tap(editAccountDrawerItemFinder);
        }
    );
}

export async function tapOnMyPageButton(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    await learner.instruction(`Tap on My Page button`, async function (this: LearnerInterface) {
        const myProfileDrawerItemFinder = new ByValueKey(LearnerKeys.myProfileDrawerItem);
        await driver.tap(myProfileDrawerItemFinder);
    });
}

export async function verifyNameOnEditProfileScreen(learner: LearnerInterface, name: string) {
    const driver = learner.flutterDriver!;

    await learner.instruction(
        `Verify the name: ${name} on the Edit Profile screen`,
        async function (this: LearnerInterface) {
            const nameTextInputFinder = new ByValueKey(LearnerKeys.nameTextInput);
            await driver.waitFor(nameTextInputFinder);
        }
    );
}

export async function verifyProfileTypeOnProfileDetailsScreen(
    learner: LearnerInterface,
    profile: string,
    profileType: ProfileType
) {
    const driver = learner.flutterDriver!;

    await openMenuPopupOnWeb(learner);

    await tapOnMyPageButton(learner);

    await learner.instruction(
        `Verify ${profileType}: ${profile} on the Profile Details screen`,
        async function (this: LearnerInterface) {
            if (profileType === 'name') {
                const nameFinder = new ByValueKey(LearnerKeys.user(profile));
                await driver.waitFor(nameFinder);
            } else if (profileType === 'avatar') {
                const avatarFinder = new ByValueKey(LearnerKeys.avatarWidget(profile));
                await driver.waitFor(avatarFinder);
            }
        }
    );
}

export async function changeNameInEditProfileScreenLearnerApp(
    learner: LearnerInterface,
    newName: string
) {
    const driver = learner.flutterDriver!;

    await learner.instruction(
        `Fill in new name: ${newName}`,
        async function (this: LearnerInterface) {
            const nameTextInputFinder = new ByValueKey(LearnerKeys.nameTextInput);
            await driver.tap(nameTextInputFinder);
            await driver.enterText(newName);
        }
    );
}

export async function editNameInEditProfileScreen(learner: LearnerInterface, newName: string) {
    const driver = learner.flutterDriver!;

    const saveButtonFinder = new ByValueKey(LearnerKeys.saveButton);

    await learner.instruction(
        `Try to press Save button before edit name, then nothing happens`,
        async function (this: LearnerInterface) {
            await driver.tap(saveButtonFinder);
        }
    );

    await learner.instruction(
        `Failed to fill in a new name`,
        async function (this: LearnerInterface) {
            try {
                const nameTextInputFinder = new ByValueKey(LearnerKeys.nameTextInput);
                await driver.tap(nameTextInputFinder);
                await driver.enterText(newName);
            } catch (error) {
                console.log(`Expected error when cannot fill in name`);
            }
        }
    );

    await learner.instruction(
        `Fill in new name: ${newName}`,
        async function (this: LearnerInterface) {
            const nameTextInputFinder = new ByValueKey(LearnerKeys.nameTextInput);
            await driver.tap(nameTextInputFinder);
            await driver.enterText(newName);
        }
    );

    await learner.instruction(`Press Save button`, async function (this: LearnerInterface) {
        await driver.tap(saveButtonFinder, 10000);
        const loadingDialog = new ByValueKey(LearnerKeys.loadingDialog);
        await driver.waitForAbsent(loadingDialog, 10000);
    });
}

export async function changeAvatarOnLearner(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    await learner.instruction(
        `Try to press Save button before edit name, then nothing happens`,
        async function (this: LearnerInterface) {
            const saveButtonFinder = new ByValueKey(LearnerKeys.saveButton);
            await driver.tap(saveButtonFinder);
        }
    );

    await learner.instruction(
        `Tap on avatar and upload new avatar`,
        async function (this: LearnerInterface) {
            const uploadAvatarButtonFinder = new ByValueKey(LearnerKeys.uploadAvatarButton);
            await driver.tap(uploadAvatarButtonFinder);

            const localAvatarWidgetFinder = new ByValueKey(LearnerKeys.avatarLocalFileWidget);
            await driver.waitFor(localAvatarWidgetFinder, 10000);
        }
    );
}

export async function updateProfileOnLearner(learner: LearnerInterface): Promise<string> {
    const driver = learner.flutterDriver!;
    const learnerProfile = await learner.getProfile();
    const oldAvatarUrl = learnerProfile.avatar;
    let avatarUrl = '';

    await learner.instruction(`Press Save button`, async function (this: LearnerInterface) {
        const saveButtonFinder = new ByValueKey(LearnerKeys.saveButton);
        await driver.tap(saveButtonFinder);

        const loadingDialogFinder = new ByValueKey(LearnerKeys.loadingDialog);
        await driver.waitForAbsent(loadingDialogFinder, 20000);
    });

    /// TODO: Check reason why we cannot wait for Snackbar
    // await learner.instruction(
    //     `See and close the Success Snackbar`,
    //     async function (this: LearnerInterface) {
    //         const closeSnackbarButtonFinder = new ByValueKey(LearnerKeys.close_snackbar_button);

    //         await driver.tap(closeSnackbarButtonFinder, 20000);
    //     }
    // );

    const token = await learner.getToken();
    const basicProfile = await bobUserReaderService.retrieveBasicProfile(token, learnerProfile.id);

    avatarUrl = basicProfile!.response!.profilesList[0]!.avatar!;

    notStrictEqual(
        oldAvatarUrl,
        avatarUrl,
        'The new avatar should be updated and the url should be difference from old avatar url'
    );

    await verifyAvatarOnScreen(learner, avatarUrl, 'Edit Profile Screen');

    return avatarUrl;
}
