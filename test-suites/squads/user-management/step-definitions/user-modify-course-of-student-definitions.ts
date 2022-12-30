import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { CourseStatus } from '@supports/entities/course-status';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { LocationInfoGRPC } from '@supports/types/cms-types';
import { formatDate } from '@supports/utils/time/time';

import {
    selectCourseDuration,
    randomUnavailableCourseDuration,
    randomAvailableCourseDuration,
    selectCourseLocation,
} from './user-definition-utils';
import {
    clickAddCourseButton,
    selectCourseWithName,
} from './user-student-course-common-definitions';

export async function tapOnEditCourseDurationButton(
    cms: CMSInterface,
    courseId: string,
    courseName: string
) {
    const cmsPage = cms.page!;

    await cms.instruction(
        `Tap on the edit course duration button: ${courseName}`,
        async function () {
            const table = await cmsPage.waitForSelector(studentPageSelectors.formTableCourseTable);
            const studentPackageRow = await table.waitForSelector(
                studentPageSelectors.tableBaseRowWithId(courseId)
            );

            await studentPackageRow.scrollIntoViewIfNeeded();

            const editButton = await studentPackageRow.waitForSelector(
                studentPageSelectors.buttonEditCourseTable
            );

            await editButton.click();
        }
    );
}

export async function changeCourseDuration(
    cms: CMSInterface,
    oldStatus: CourseStatus,
    newStatus: CourseStatus,
    studentCoursePackage: StudentCoursePackageEntity
): Promise<{
    startDate: Date | null;
    endDate: Date | null;
}> {
    let startAndEndDate: { startDate: Date; endDate: Date };

    const startDate = formatDate(studentCoursePackage?.startDate, 'YYYY/MM/DD');
    const endDate = formatDate(studentCoursePackage?.endDate, 'YYYY/MM/DD');
    const today = formatDate(new Date(), 'YYYY/MM/DD');

    const courseDurationValue =
        newStatus === 'available'
            ? randomAvailableCourseDuration()
            : randomUnavailableCourseDuration();

    await cms.instruction(
        `Change course duration from: ${oldStatus} (start ${startDate} - end ${endDate}) to ${newStatus} (${courseDurationValue}), current date is ${today}`,
        async function () {
            startAndEndDate = await selectCourseDuration(cms, courseDurationValue);
        }
    );

    await cms.selectElementWithinWrapper(
        studentPageSelectors.dialogWithHeaderFooterWrapper,
        studentPageSelectors.footerDialogConfirmButtonSave
    );

    return {
        startDate: startAndEndDate!.startDate,
        endDate: startAndEndDate!.endDate,
    };
}

export async function addCourseWhenEditStudent(
    cms: CMSInterface,
    courseStatus: CourseStatus,
    courseName: string,
    location?: LocationInfoGRPC,
    skipSave?: boolean
): Promise<{
    startDate: Date | null;
    endDate: Date | null;
    locationIds: string[];
}> {
    let startAndEndDate: { startDate: Date; endDate: Date };
    const today = new Date();

    await clickAddCourseButton(cms);

    await selectCourseWithName(cms, courseName);

    await selectCourseLocation(cms, location);

    const courseDurationValue =
        courseStatus === 'available'
            ? randomAvailableCourseDuration()
            : randomUnavailableCourseDuration();

    await cms.instruction(
        `Add ${courseStatus} (${courseDurationValue}) course ${courseName} into student, current day is ${formatDate(
            today,
            'YYYY/MM/DD'
        )}`,
        async function () {
            startAndEndDate = await selectCourseDuration(cms, courseDurationValue);
        }
    );

    if (!skipSave) {
        await cms.selectElementWithinWrapper(
            studentPageSelectors.dialogWithHeaderFooterWrapper,
            studentPageSelectors.footerDialogConfirmButtonSave
        );
    }

    return {
        startDate: startAndEndDate!.startDate,
        endDate: startAndEndDate!.endDate,
        locationIds: location?.locationId ? [location.locationId] : [],
    };
}

export async function createNewStudentPackages(
    cms: CMSInterface,
    courseStatus: CourseStatus,
    courseId: string,
    courseName: string,
    location?: LocationInfoGRPC
): Promise<StudentCoursePackageEntity> {
    const courseCreatedData = await addCourseWhenEditStudent(
        cms,
        courseStatus,
        courseName,
        location,
        true
    );

    const newStudentCoursePackage = {
        courseId: courseId,
        courseName: courseName,
        /// No need studentPackageId when create with API
        studentPackageId: '',
        startDate: courseCreatedData.startDate!,
        endDate: courseCreatedData.endDate!,
        locationIds: courseCreatedData.locationIds,
    };

    return newStudentCoursePackage;
}
