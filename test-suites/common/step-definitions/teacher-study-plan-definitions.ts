import { delay } from '@legacy-step-definitions/utils';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export const teacherSeeStudyPlan = async (teacher: TeacherInterface, studyPlanName: string) => {
    const studyPlanDropdown = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanDropDown);

    await teacher.flutterDriver?.tap(studyPlanDropdown);
    await teacher.flutterDriver?.tap(
        new ByValueKey(SyllabusTeacherKeys.studentStudyPlanName(studyPlanName))
    );
};

export async function teacherSeeStudyPlanItem(
    teacher: TeacherInterface,
    studyPlanItemName: string,
    index?: number
) {
    const studyPlanKey =
        typeof index !== 'undefined'
            ? SyllabusTeacherKeys.studentStudyPlanItemRowVsPosition(index, studyPlanItemName)
            : SyllabusTeacherKeys.studentStudyPlanItemRow(studyPlanItemName);

    const studyPlanItemKey = new ByValueKey(studyPlanKey);
    const studyPlanTabKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTab);
    const studyPlanTableKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemList);
    const studyPlanListKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);

    const driver = teacher.flutterDriver!;

    try {
        await driver.waitFor(studyPlanTabKey, 10000);
        await driver.waitFor(studyPlanTableKey, 10000);
        await driver.waitFor(studyPlanListKey, 10000);
    } catch (error) {
        await driver.reload();
        await driver.waitFor(studyPlanTabKey, 10000);
        await driver.waitFor(studyPlanTableKey, 10000);
        await driver.waitFor(studyPlanListKey, 10000);
    }
    //Waiting for studyplan item on list
    await delay(3000);

    await teacher.instruction(`Display study plan item ${studyPlanItemName}`, async function () {
        try {
            await driver.waitFor(studyPlanItemKey, 20000);
        } catch (error) {
            throw Error(`Expect study plan item ${studyPlanItemName} is displayed`);
        }
    });
}

export const teacherGoesToStudyPlanDetails = async (
    teacher: TeacherInterface,
    courseId: string,
    studentId: string
) => {
    const websiteDomain = teacher.flutterDriver!.webDriver?.page.url().split('#')[0];
    const url = `${websiteDomain}#/courseDetail?course_id=${courseId}/studentStudyPlan?student_id=${studentId}`;
    await teacher.flutterDriver?.webDriver?.page.goto(url);
};

export async function teacherGoesToStudyPlanItemDetails(
    teacher: TeacherInterface,
    studyPlanItemName: string
) {
    const driver = teacher.flutterDriver!;
    const loListScreenKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);
    const itemKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemRow(studyPlanItemName));
    try {
        await driver.waitFor(loListScreenKey, 20000);
        try {
            await driver.scrollUntilTap(loListScreenKey, itemKey, 0.0, -20, 20000);
        } catch (error) {
            throw Error(`Expect study plan item ${studyPlanItemName} is displayed`);
        }
    } catch (e) {
        await driver.tap(itemKey, 20000);
    }
}
