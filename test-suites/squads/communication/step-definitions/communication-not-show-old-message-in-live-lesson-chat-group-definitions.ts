import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { emptyConversationListKey } from './teacher-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

export async function verifyLessonConversationIsEmpty(
    client: LearnerInterface | TeacherInterface
): Promise<void> {
    const driver = client.flutterDriver!;

    const emptyConversationDetailFinder = new ByValueKey(emptyConversationListKey);
    await driver.waitFor(emptyConversationDetailFinder);
}
