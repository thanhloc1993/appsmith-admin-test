import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';
import { TeacherKeys } from '@legacy-step-definitions/teacher-keys/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { conversationDetail } from './teacher-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherSelectLessonChatGroup(teacher: TeacherInterface): Promise<void> {
    const driver = teacher.flutterDriver!;
    const messageButtonFinder = new ByValueKey(TeacherKeys.messageLessonButton);

    await driver.tap(messageButtonFinder, 20000);
}

export async function learnerSelectLessonChatGroup(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;
    const messageButtonFinder = new ByValueKey(LearnerKeys.messageLessonButton);

    await driver.tap(messageButtonFinder, 20000);
}

export async function assertLessonConversationDetail(
    client: LearnerInterface | TeacherInterface
): Promise<void> {
    const driver = client.flutterDriver!;

    const conversationDetailFinder = new ByValueKey(conversationDetail);
    await driver.waitFor(conversationDetailFinder);
}
