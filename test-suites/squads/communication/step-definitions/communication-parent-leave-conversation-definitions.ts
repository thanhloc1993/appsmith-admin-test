import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';
import { TeacherKeys } from '@legacy-step-definitions/teacher-keys/teacher-keys';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function parentConfirmConversationNoLongerAvailable(parent: LearnerInterface) {
    const driver = parent.flutterDriver!;

    const confirmButtonFinder = new ByValueKey(
        LearnerKeys.confirmConversationNoLongerAvailableButton
    );
    await driver.tap(confirmButtonFinder);
}

export async function parentVerifyParentChatGroupIsRemoved(
    parent: LearnerInterface,
    studentId: string
) {
    const driver = parent.flutterDriver!;

    const conversationFinder = new ByValueKey(TeacherKeys.parentConversationItem(studentId));
    await driver.waitForAbsent(conversationFinder);
}
