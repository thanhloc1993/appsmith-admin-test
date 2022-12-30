import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { getLearnerToDoKeys, LearnerToDoTab } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherSelectAllStudyPlanItemsInTopic(
    teacher: TeacherInterface,
    topicName: string
) {
    const driver = teacher.flutterDriver!;
    const topicCheckBoxKey = new ByValueKey(
        SyllabusTeacherKeys.studentAllStudyPlanItemsCheckBox(topicName)
    );
    await driver.tap(topicCheckBoxKey);
}

export async function teacherConfirmEditStudyPlanAction(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const confirmButtonKey = new ByValueKey(SyllabusTeacherKeys.okEditStudyPlanItemTimeButton);
    await driver.tap(confirmButtonKey);
}

export async function studentDoesNotSeeStudyPlanItemInTodoTab(
    learner: LearnerInterface,
    studyPlanItemName: string,
    toDoTabPage: LearnerToDoTab
) {
    const driver = learner.flutterDriver!;
    const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItemName));
    const { pageKey } = getLearnerToDoKeys(toDoTabPage);
    await driver.waitFor(new ByValueKey(pageKey));
    await driver.waitForAbsent(itemKey);
}

export async function studentSeeStudyPlanItemInTodoTab(
    learner: LearnerInterface,
    studyPlanItemName: string,
    toDoTabPage: LearnerToDoTab
) {
    const driver = learner.flutterDriver!;
    const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItemName));
    const { pageKey } = getLearnerToDoKeys(toDoTabPage);
    const scrollable = new ByValueKey(pageKey);
    await driver.waitFor(new ByValueKey(pageKey));
    try {
        await driver.waitFor(itemKey, 1000);
    } catch (e) {
        await driver.scrollUntilVisible(scrollable, itemKey, 0.0, 0.0, -100, 20000);
    }
}

export async function studentDoesNotSeeEmptyTopicInCourseDetail(
    learner: LearnerInterface,
    topicName: string
) {
    const driver = learner.flutterDriver!;
    await driver.waitForAbsent(new ByValueKey(SyllabusLearnerKeys.topic(topicName)));
}

export async function studentSeeStudyPlanItemInCourseDetail(
    learner: LearnerInterface,
    topicName: string,
    studyPlanItemName: string
) {
    const driver = learner.flutterDriver!;
    const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItemName));
    const loListScreenKey = new ByValueKey(SyllabusLearnerKeys.lo_list_screen(topicName));
    await driver.waitFor(loListScreenKey);
    await driver.scrollIntoView(itemKey, 0.0);
}
export async function studentDoesNotSeeStudyPlanItemInCourseDetail(
    learner: LearnerInterface,
    topicName: string,
    studyPlanItemName: string
) {
    const driver = learner.flutterDriver!;
    const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItemName));
    const loListScreenKey = new ByValueKey(SyllabusLearnerKeys.lo_list_screen(topicName));
    await driver.waitFor(loListScreenKey);
    await driver.waitForAbsent(itemKey);
}
export async function studentGoesToTopicDetail(learner: LearnerInterface, topicName: string) {
    const driver = learner.flutterDriver!;
    const listKey = new ByValueKey(SyllabusLearnerKeys.chapter_with_topic_list);
    const itemKey = new ByValueKey(SyllabusLearnerKeys.topic(topicName));
    await driver.waitFor(listKey);
    await driver.scrollIntoView(itemKey, 0.0);
    await driver.tap(itemKey);
}
