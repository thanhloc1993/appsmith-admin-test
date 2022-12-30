import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasTopicName } from './alias-keys/syllabus';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherSelectsAllStudyPlanItems(
    context: ScenarioContext,
    teacher: TeacherInterface
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const studyPlanListKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);
    const topicName = context.get(aliasTopicName);
    const topicId = topicName.split(' ')[1];
    const allsStudyPlanItemsCheckboxKey = new ByValueKey(
        SyllabusTeacherKeys.studentAllStudyPlanItemsCheckBox(topicId)
    );

    await driver.waitFor(allsStudyPlanItemsCheckboxKey);

    try {
        await driver.waitFor(studyPlanListKey);
        await driver.scrollUntilTap(
            studyPlanListKey,
            allsStudyPlanItemsCheckboxKey,
            0.0,
            -300,
            10000
        );
    } catch (error) {
        throw Error(`Can not select the checkbox of all study plan item ${topicName}`);
    }
}
