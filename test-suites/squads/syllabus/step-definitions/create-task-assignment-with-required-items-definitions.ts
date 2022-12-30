import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';
import { emojiList } from '@supports/constants';

import { TaskAssignmentSettingInfo } from './syllabus-create-task-assignment-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherSeesTaskAssignmentRequiredField(
    teacher: TeacherInterface,
    taskAssignmentField: TaskAssignmentSettingInfo
) {
    const driver = teacher.flutterDriver!;
    const assignmentNoteFinder = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentTextNoteTextFormField
    );
    const correctFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentCorrectTextFormField);
    const totalFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentTotalTextFormField);
    const understandingLevelFinder = new ByValueKey(emojiList[0]);
    const durationFinder = new ByValueKey(SyllabusTeacherKeys.taskAssignmentDurationTextFormField);
    const attachmentFinder = new ByValueKey(SyllabusTeacherKeys.attachYourMaterials);

    const taskAssignmentScrollBodyView = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentScrollBodyView
    );

    switch (taskAssignmentField) {
        case 'Correctness':
            try {
                await driver.scrollUntilVisible(
                    taskAssignmentScrollBodyView,
                    correctFinder,
                    0.0,
                    0.0,
                    -100,
                    20000
                );
            } catch {
                await driver.waitFor(correctFinder);
                await driver.waitFor(totalFinder);
            }
            break;
        case 'Duration':
            try {
                await driver.scrollUntilVisible(
                    taskAssignmentScrollBodyView,
                    durationFinder,
                    0.0,
                    0.0,
                    -100,
                    20000
                );
            } catch {
                await driver.waitFor(durationFinder);
            }
            break;
        case 'Understanding level':
            try {
                await driver.scrollUntilVisible(
                    taskAssignmentScrollBodyView,
                    understandingLevelFinder,
                    0.0,
                    0.0,
                    -100,
                    20000
                );
            } catch {
                await driver.waitFor(understandingLevelFinder);
            }
            break;
        case 'Text note':
            try {
                await driver.scrollUntilVisible(
                    taskAssignmentScrollBodyView,
                    assignmentNoteFinder,
                    0.0,
                    0.0,
                    100,
                    20000
                );
            } catch {
                await driver.waitFor(assignmentNoteFinder);
            }
            break;
        case 'File attachment':
            await driver.waitFor(attachmentFinder);
            break;
    }
}

export async function teacherSeesTaskAssignmentCompleteDate(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const completeDateFinder = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentCompleteDateTextFormField
    );
    await driver.waitFor(completeDateFinder, 10000);
}
