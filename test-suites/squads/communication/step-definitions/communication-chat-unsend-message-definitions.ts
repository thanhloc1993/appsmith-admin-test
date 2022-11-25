import { isParentRole } from '@legacy-step-definitions/utils';

import { AccountRoles, LearnerInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { messageContentKey } from './alias-keys/communication';
import {
    moveLearnerToMessagePage,
    learnerSelectConversation,
    firstIndex,
    messageKeyForType,
    MessageType,
} from './communication-common-definitions';
import {
    interactiveMoreOptionButtonKey,
    unsendMessagePopupItemKey,
    unsendMessageConfirmButton,
    deletedMessageItemKey,
} from './learner-keys/communication-key';
import { FlutterDriver, ByValueKey } from 'flutter-driver-x';

export async function learnerAccessesChatGroup(
    learner: LearnerInterface,
    learnerRole: AccountRoles
): Promise<void> {
    const studentId = await learner.getUserId();
    const isParent = isParentRole(learnerRole);
    await moveLearnerToMessagePage(learner);
    await learnerSelectConversation(learner, isParent, studentId);
}

export async function userUnsendTheMessage(
    scenario: ScenarioContext,
    driver: FlutterDriver,
    messageType: MessageType
) {
    const content = scenario.get<string>(messageContentKey);

    const messageFinder = new ByValueKey(messageKeyForType(messageType, content));
    await driver.waitFor(messageFinder, 20000);

    const moreOptionButtonFinder = new ByValueKey(interactiveMoreOptionButtonKey(firstIndex));
    await driver.tap(moreOptionButtonFinder);

    const unsendMessagePopupItemFinder = new ByValueKey(unsendMessagePopupItemKey);
    await driver.tap(unsendMessagePopupItemFinder);

    const confirmButtonFinder = new ByValueKey(unsendMessageConfirmButton);
    await driver.tap(confirmButtonFinder);
}

export async function userSeesTheMessageChangesToDeleted(driver: FlutterDriver) {
    const deletedMessageItemFinder = new ByValueKey(deletedMessageItemKey(firstIndex));
    await driver.waitFor(deletedMessageItemFinder);
}
