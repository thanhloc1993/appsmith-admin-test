import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export const teacherGoesToCourseDetails = async (teacher: TeacherInterface, courseId: string) => {
    const websiteDomain = teacher.flutterDriver!.webDriver?.page.url().split('#')[0];
    const url = `${websiteDomain}#/courseDetail?course_id=${courseId}`;
    await teacher.flutterDriver?.webDriver?.page.goto(url);
};

export const teacherGoesToCourseStatistics = async (teacher: TeacherInterface) => {
    const courseStatisticsTab = new ByValueKey(SyllabusTeacherKeys.statisticsTab);
    await teacher.flutterDriver?.tap(courseStatisticsTab);
};

export async function teacherSeeCourseTopicStudyPlanItem(
    teacher: TeacherInterface,
    studyPlanItemName: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(
        new ByValueKey(SyllabusTeacherKeys.courseStatisticsStudyPlanItemName(studyPlanItemName)),
        10000
    );
}

export async function teacherSeeEmptyPageOnCourseStatistics(
    teacher: TeacherInterface
): Promise<void> {
    const driver = teacher.flutterDriver!;
    await driver.waitFor(new ByValueKey(SyllabusTeacherKeys.studyPlanTopicListEmpty), 10000);
}
