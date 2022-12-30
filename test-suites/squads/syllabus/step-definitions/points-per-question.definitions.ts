import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function studentSeePointsPerQuestion(learner: LearnerInterface, point: number) {
    const driver = learner.flutterDriver!;

    const pointKey = new ByValueKey(SyllabusLearnerKeys.pointsPerQuestion(point));
    await driver.waitFor(pointKey);
}

export async function teacherSeePointsPerQuestion(teacher: TeacherInterface, point: number) {
    const driver = teacher.flutterDriver!;

    const pointKey = new ByValueKey(SyllabusTeacherKeys.pointsPerQuestion(point));
    await driver.waitFor(pointKey);
}

export async function teacherSeesPointsPerQuestionInMarkingPage(
    teacher: TeacherInterface,
    questionPoint: number
) {
    const pointPerQuestionKey = new ByValueKey(
        SyllabusTeacherKeys.markingPageQuestionGradingInfoBoxPointPerQuestion
    );

    const pointPerQuestionText = await teacher.flutterDriver!.getText(pointPerQuestionKey);

    weExpect(
        pointPerQuestionText,
        `Points per question in marking page is /${questionPoint}`
    ).toEqual(`/${questionPoint}`);
}
