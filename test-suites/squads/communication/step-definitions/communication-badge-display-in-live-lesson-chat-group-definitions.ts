import { TeacherKeys } from '@legacy-step-definitions/teacher-keys/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function verifyUnreadBadgeDisplayInLiveLesson(
    client: TeacherInterface | LearnerInterface
): Promise<void> {
    const driver = client.flutterDriver!;
    const unreadBadgeFinder = new ByValueKey(TeacherKeys.liveLessonConversationUnreadBadge);
    await driver.waitFor(unreadBadgeFinder);
}

export async function verifyUnreadBadgeNotDisplayInLiveLesson(
    client: TeacherInterface | LearnerInterface
): Promise<void> {
    const driver = client.flutterDriver!;
    const unreadBadgeFinder = new ByValueKey(TeacherKeys.liveLessonConversationUnreadBadge);
    await driver.waitForAbsent(unreadBadgeFinder);
}
