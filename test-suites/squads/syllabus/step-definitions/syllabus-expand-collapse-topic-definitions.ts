import { delay } from '@legacy-step-definitions/utils';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByText, ByValueKey } from 'flutter-driver-x';

export async function teacherTapsOnTopic(
    teacher: TeacherInterface,
    topicName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const topicKey = new ByText(topicName);

    await driver.tap(topicKey);
}

export async function teacherScrollIntoTopic(
    teacher: TeacherInterface,
    topicName: string,
    topicPosition?: number
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const listKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemListInATopic(topicName));

    const topicNameKey =
        topicPosition == null
            ? new ByText(topicName)
            : new ByValueKey(
                  SyllabusTeacherKeys.studentStudyPlanTopicWithPosition(topicName, topicPosition)
              );
    await driver.waitFor(listKey, 15000);

    await delay(1000);
    await driver.scrollIntoView(topicNameKey, 0.0);
}

export async function teacherScrollIntoTopicAvatar(
    teacher: TeacherInterface,
    topicName: string,
    topicIconUrl: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const listKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemListInATopic(topicName));

    const topicAvatar = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanTopicAvatar(topicIconUrl)
    );
    await driver.waitFor(listKey, 15000);

    await delay(1000);
    await driver.scrollIntoView(topicAvatar, 0.0);
}

export async function teacherDoesNotSeeTopicStudyPlanItems(
    teacher: TeacherInterface,
    studyPlanItems: string[]
): Promise<void> {
    const driver = teacher.flutterDriver!;
    for (const studyPlanItemName of studyPlanItems) {
        await driver.waitForAbsent(
            new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemRow(studyPlanItemName))
        );
    }
}

export async function teacherSeeTopicStudyPlanItems(
    teacher: TeacherInterface,
    studyPlanItems: string[]
): Promise<void> {
    for (const studyPlanItemName of studyPlanItems) {
        await teacherSeeTopicStudyPlanItem(teacher, studyPlanItemName);
    }
}

export async function teacherSeeTopicStudyPlanItem(
    teacher: TeacherInterface,
    studyPlanItemName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(
        new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemRow(studyPlanItemName)),
        10000
    );
}

export async function teacherSeesTopicProgress(
    teacher: TeacherInterface,
    topicName: string,
    completed: number,
    total: number
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const studyPlanProgressKey = new ByValueKey(
        SyllabusTeacherKeys.studyPlanTopicProgress(topicName, completed, total)
    );
    await driver.waitFor(studyPlanProgressKey);
}

export async function teacherSeesTopic(
    teacher: TeacherInterface,
    topicName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const topicKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTopicRow(topicName));

    await driver.waitFor(topicKey);
}
