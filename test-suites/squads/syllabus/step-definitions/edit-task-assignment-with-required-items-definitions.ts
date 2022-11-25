import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';
import { emojiList } from '@supports/constants';

import { ByValueKey } from 'flutter-driver-x';

export async function learnerDoesNotSeeTaskAssignmentRequiredField(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const correctFinder = new ByValueKey(SyllabusLearnerKeys.taskAssignmentCorrectTextFormField);
    const totalFinder = new ByValueKey(SyllabusLearnerKeys.taskAssignmentTotalTextFormField);
    const durationFinder = new ByValueKey(SyllabusLearnerKeys.taskAssignmentDurationTextFormField);
    const stopWatchFinder = new ByValueKey(SyllabusLearnerKeys.taskAssignmentStopWatch);
    const understandingLevelFinder = new ByValueKey(emojiList[0]);
    const assignmentNoteFinder = new ByValueKey(SyllabusLearnerKeys.assignment_note_field);
    const attachmentFinder = new ByValueKey(SyllabusLearnerKeys.attach_attachment_button);

    await driver.waitForAbsent(correctFinder);
    await driver.waitForAbsent(totalFinder);
    await driver.waitForAbsent(durationFinder);
    await driver.waitForAbsent(stopWatchFinder);
    await driver.waitForAbsent(understandingLevelFinder);
    await driver.waitForAbsent(assignmentNoteFinder);
    await driver.waitForAbsent(attachmentFinder);
}

export async function teacherDoesNotSeeTaskAssignmentRequiredField(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const assignmentNoteFinder = new ByValueKey(
        SyllabusTeacherKeys.taskAssignmentTextNoteTextFormField
    );
    const understandingLevelFinder = new ByValueKey(emojiList[0]);
    const attachmentFinder = new ByValueKey(SyllabusTeacherKeys.attachYourMaterials);

    await driver.waitForAbsent(understandingLevelFinder);
    await driver.waitForAbsent(assignmentNoteFinder);
    await driver.waitForAbsent(attachmentFinder);
}
