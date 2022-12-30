import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByText, ByValueKey } from 'flutter-driver-x';

const returnSuccessMessage = 'You have returned assignment successfully!';
const saveSuccessMessage = 'You have saved assignment successfully!';

export async function teacherEntersAssignmentTextFeedbacks(
    teacher: TeacherInterface,
    textFeedbacks: string
) {
    const driver = teacher.flutterDriver!;
    const textField = new ByValueKey(SyllabusTeacherKeys.assignmentTextFeedbacksTextField);
    await driver.scrollIntoView(textField, 0.0);
    await driver.tap(textField);
    await driver.enterText(textFeedbacks);
}

export async function teacherReturnsAndSavesChanges(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const statusDropDownButton = new ByValueKey(SyllabusTeacherKeys.statusDropDown);
    await driver.scrollIntoView(statusDropDownButton, 0.0);
    await driver.tap(statusDropDownButton);

    const returnedDropDownButton = new ByValueKey(SyllabusTeacherKeys.returnedDropDown);
    await driver.tap(returnedDropDownButton);

    const saveChangesButton = new ByValueKey(SyllabusTeacherKeys.saveChangesButton);
    await driver.scrollIntoView(saveChangesButton, 0.0);
    await driver.tap(saveChangesButton);

    const confirmButton = new ByValueKey(SyllabusTeacherKeys.saveAndReturnButton);
    await driver.tap(confirmButton);
}

export async function teacherSetToNotMarkedAndSavesChanges(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const statusDropDownButton = new ByValueKey(SyllabusTeacherKeys.statusDropDown);
    await driver.scrollIntoView(statusDropDownButton, 0.0);
    await driver.tap(statusDropDownButton);

    const notMarkedDropDownButton = new ByValueKey(SyllabusTeacherKeys.notMarkedDropDown);
    await driver.tap(notMarkedDropDownButton);

    const saveChangesButton = new ByValueKey(SyllabusTeacherKeys.saveChangesButton);
    await driver.scrollIntoView(saveChangesButton, 0.0);
    await driver.tap(saveChangesButton);
}

export async function teacherSeesSuccessMessage(teacher: TeacherInterface, isReturned: boolean) {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(new ByText(isReturned ? returnSuccessMessage : saveSuccessMessage));
}

export async function studentSeesTeacherTextFeedbacks(
    learner: LearnerInterface,
    textFeedbacks: string
) {
    const driver = learner.flutterDriver!;
    const textFeedback = new ByValueKey(SyllabusLearnerKeys.assignmentTextFeedbacks(textFeedbacks));
    await driver.scrollIntoView(textFeedback, 0.0);
    await driver.waitFor(textFeedback);
}

export async function studentDoesNotSeeTeacherTextFeedbacks(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const textFeedback = new ByValueKey(SyllabusLearnerKeys.assignmentTextFeedbacks(''));
    await driver.waitForAbsent(textFeedback);
}

export async function studentRefreshAssignmentScreen(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const listKey = new ByValueKey(SyllabusLearnerKeys.assignmentScrollview);
    await driver.waitFor(listKey);
    await driver.scroll(listKey, 0.0, 4000, 1000, 50); // Scroll to the top
    await driver.scroll(listKey, 0.0, 4000, 1000, 50);
}

export async function teacherSeesTextFeedbacks(teacher: TeacherInterface, feedback: string) {
    const driver = teacher.flutterDriver!;
    const textField = new ByValueKey(SyllabusTeacherKeys.assignmentTextFeedbacksTextField);
    await driver.scrollIntoView(textField, 0.0, 20000);
    const content = await driver.getText(textField);
    weExpect(content).toEqual(feedback);
}
