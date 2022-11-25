import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';
import { emojiList } from '@supports/constants';

import { TaskAssignmentSettingInfo } from './syllabus-create-task-assignment-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerSeesTaskAssignmentRequiredField(
    learner: LearnerInterface,
    taskAssignmentField: TaskAssignmentSettingInfo
) {
    const driver = learner.flutterDriver!;
    const assignmentNoteFinder = new ByValueKey(SyllabusLearnerKeys.assignment_note_field);
    const stopWatchFinder = new ByValueKey(SyllabusLearnerKeys.taskAssignmentStopWatch);
    const correctFinder = new ByValueKey(SyllabusLearnerKeys.taskAssignmentCorrectTextFormField);
    const totalFinder = new ByValueKey(SyllabusLearnerKeys.taskAssignmentTotalTextFormField);
    const understandingLevelFinder = new ByValueKey(emojiList[0]);
    const durationFinder = new ByValueKey(SyllabusLearnerKeys.taskAssignmentDurationTextFormField);
    const attachmentFinder = new ByValueKey(SyllabusLearnerKeys.attach_attachment_button);

    const assignmentScrollview = new ByValueKey(SyllabusLearnerKeys.assignment_scrollview);

    switch (taskAssignmentField) {
        case 'Correctness':
            try {
                await learner.flutterDriver!.scrollUntilVisible(
                    assignmentScrollview,
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
                await learner.flutterDriver!.scrollUntilVisible(
                    assignmentScrollview,
                    durationFinder,
                    0.0,
                    0.0,
                    -100,
                    20000
                );
            } catch {
                await driver.waitFor(durationFinder);
            }
            await driver.waitFor(stopWatchFinder);
            break;
        case 'Understanding level':
            try {
                await learner.flutterDriver!.scrollUntilVisible(
                    assignmentScrollview,
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
                await learner.flutterDriver!.scrollUntilVisible(
                    assignmentScrollview,
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

export async function learnerSeesTaskAssignmentCompleteDate(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const completeDateFinder = new ByValueKey(
        SyllabusLearnerKeys.taskAssignmentCompleteDateTextFormField
    );
    await driver.waitFor(completeDateFinder, 10000);
}
