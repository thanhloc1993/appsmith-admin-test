import { getRandomElementsWithLength } from '@legacy-step-definitions/utils';
import {
    learnerProfileAlias,
    newStudentPackageAlias,
    parentProfilesAlias,
    studentCoursePackagesAlias,
} from '@user-common/alias-keys/user';
import { tabLayoutStudent } from '@user-common/cms-selectors/students-page';

import { When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { CourseStatus } from '@supports/entities/course-status';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { clickOnSaveCourseDuration } from './user-create-student-definitions';
import {
    createRandomCoursesWithLocations,
    createStudentCourse,
    gotoEditStudentCourse,
    schoolAdminGoesToStudentDetailPage,
} from './user-definition-utils';
import { changeCourseDuration } from './user-modify-course-of-student-definitions';
import { seeNewlyCreatedStudentOnCMS } from './user-view-student-details-definitions';

/// Start When
When(
    "school admin edits course's duration {string} to {string}",
    async function (this: IMasterWorld, oldStatus: CourseStatus, newStatus: CourseStatus) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const parents = scenarioContext.get<Array<UserProfileEntity>>(parentProfilesAlias);
        const student = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        const studentCoursePackages = scenarioContext.get<Array<StudentCoursePackageEntity>>(
            studentCoursePackagesAlias
        );

        const oldStudentCoursePackage = studentCoursePackages[0];

        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile: student,
                parents,
                studentCoursePackages,
            },
        });
        await schoolAdminGoesToStudentDetailPage(cms, student);

        await cms.selectTabButtonByText(tabLayoutStudent, 'Course');

        await cms.waitForSkeletonLoading();

        await cms.selectAButtonByAriaLabel('Edit');

        const startAndEndDate = await changeCourseDuration(
            cms,
            oldStatus,
            newStatus,
            oldStudentCoursePackage
        );

        const newStudentCoursePackages: Array<StudentCoursePackageEntity> = [];
        const newCoursePackage = {
            courseId: oldStudentCoursePackage.courseId,
            courseName: oldStudentCoursePackage.courseName,
            studentPackageId: oldStudentCoursePackage.studentPackageId,
            startDate: startAndEndDate.startDate!,
            endDate: startAndEndDate.endDate!,
            locationIds: oldStudentCoursePackage.locationIds,
        };
        newStudentCoursePackages.push(newCoursePackage);

        scenarioContext.set(studentCoursePackagesAlias, newStudentCoursePackages);

        scenarioContext.set(newStudentPackageAlias, newCoursePackage);
    }
);

When(
    'school admin adds a new {string} course',
    async function (this: IMasterWorld, courseStatus: CourseStatus) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const student = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

        const newCourse = (await createRandomCoursesWithLocations(cms)).request[0];

        await gotoEditStudentCourse(cms, student);

        const studentCourseLocations = student.locations?.filter((_) =>
            newCourse.locationIdsList?.includes(_.locationId)
        );
        const randomLocation = getRandomElementsWithLength(studentCourseLocations || [], 1)[0];

        await createStudentCourse(cms, scenarioContext, {
            courseStatus,
            courseId: newCourse.id,
            courseName: newCourse.name,
            location: randomLocation,
        });

        await cms.instruction(
            `Click on Save button in Edit course duration dialog`,
            async function () {
                await clickOnSaveCourseDuration(cms);
            }
        );
    }
);
