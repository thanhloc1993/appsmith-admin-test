import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { createSampleStudentWithPackage } from 'test-suites/squads/lesson/services/student-service/student-service';
import {
    getGroupLessonDataOnLessonDetailPage,
    selectCourseByNameV3GroupLesson,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

export async function assertUpdatedLocationCourseClassAndStudent(
    cms: CMSInterface,
    courseName: string,
    className: string,
    locationName: string,
    studentName: string
) {
    const lessonInfo = await getGroupLessonDataOnLessonDetailPage(cms);

    weExpect(lessonInfo.studentNames, `List student should contain ${studentName}`).toContain(
        studentName
    );
    weExpect(
        lessonInfo.location,
        'Location name in details equal to location updated in the edit page'
    ).toEqual(locationName);
    weExpect(
        lessonInfo.courseName,
        'Course name in details equal to Course updated in the edit page'
    ).toEqual(courseName);
    weExpect(
        lessonInfo.className,
        'Class name in details equal to Class updated in the edit page'
    ).toEqual(className);
}

export async function assertUpdatedCourseAndClass(
    cms: CMSInterface,
    courseName: string,
    className: string
) {
    const lessonInfo = await getGroupLessonDataOnLessonDetailPage(cms);

    weExpect(
        lessonInfo.courseName,
        'Course name in details equal to Course updated in the edit page'
    ).toEqual(courseName);
    weExpect(
        lessonInfo.className,
        'Class name in details equal to Class updated in the edit page'
    ).toEqual(className);
}

export async function assertUpdatedClass(cms: CMSInterface, className: string) {
    const lessonInfo = await getGroupLessonDataOnLessonDetailPage(cms);

    weExpect(
        lessonInfo.className,
        'Class name in details equal to Class updated in the edit page'
    ).toEqual(className);
}

export async function updateCourseInGroupLesson(cms: CMSInterface, context: ScenarioContext) {
    const data = await createSampleStudentWithPackage({
        cms,
        scenarioContext: context,
        studentRole: 'student S2',
    });

    await selectCourseByNameV3GroupLesson(cms, data.course.name);
}
