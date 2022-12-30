import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';

import { strictEqual } from 'assert';

export async function verifyStudentCourseTable(
    cms: CMSInterface,
    courseId: string,
    courseName: string,
    locationName: string,
    classCourseName: string
) {
    const page = cms.page!;

    const courseRow = await page.waitForSelector(
        studentPageSelectors.studentCourseRowWithId(courseId)
    );

    const actualCourseName = await (
        await courseRow.waitForSelector(studentPageSelectors.studentCourseTableName)
    ).textContent();

    const actualLocationName = await (
        await courseRow.waitForSelector(studentPageSelectors.studentCourseTableLocation)
    ).textContent();

    const actualClassName = await (
        await courseRow.waitForSelector(studentPageSelectors.studentCourseTableClass)
    ).textContent();

    strictEqual(actualCourseName, courseName, `The Course name should be equal: ${courseName}`);

    strictEqual(
        actualLocationName,
        locationName,
        `The Location name should be equal: ${locationName}`
    );

    strictEqual(
        actualClassName,
        classCourseName || '--',
        `The Class name should be equal: ${classCourseName}`
    );
}
