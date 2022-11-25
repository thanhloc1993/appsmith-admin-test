import {
    learnerProfileAlias,
    newStudentPackageAlias,
    studentCoursePackagesAlias,
} from '@user-common/alias-keys/user';

import { Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { isCourseAvailable, schoolAdminGoesToStudentDetailPage } from './user-definition-utils';
import {
    cannotViewCourseOnLearnerApp,
    verifyNewlyLearnerOnTeacherApp,
    viewCourseOnLearnerApp,
} from './user-view-course-definitions';
import { verifyStudentPackagesListInStudentDetails } from './user-view-student-details-definitions';

Then(
    'school admin sees updated course list on student detail page',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;

        const student = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        const studentCoursePackages = scenarioContext.get<Array<StudentCoursePackageEntity>>(
            studentCoursePackagesAlias
        );

        await schoolAdminGoesToStudentDetailPage(cms, student);

        await verifyStudentPackagesListInStudentDetails(cms, studentCoursePackages);
    }
);

Then('teacher sees this course on Teacher App', async function (this: IMasterWorld) {
    const teacher = this.teacher;
    const scenarioContext = this.scenario;

    const studentCoursePackage =
        scenarioContext.get<StudentCoursePackageEntity>(newStudentPackageAlias);

    const learnerProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    /// Has instructions inside
    await verifyNewlyLearnerOnTeacherApp(
        teacher,
        learnerProfile,
        studentCoursePackage.courseId,
        studentCoursePackage.courseName
    );
});

Then('student sees only available courses on Learner App', async function (this: IMasterWorld) {
    const learner = this.learner!;
    const scenarioContext = this.scenario;

    const studentCoursePackages = scenarioContext.get<Array<StudentCoursePackageEntity>>(
        studentCoursePackagesAlias
    );

    for (let i = 0; i < studentCoursePackages.length; i++) {
        const studentCoursePackage = studentCoursePackages[i];
        /// Has instructions inside
        if (
            isCourseAvailable(
                new Date(studentCoursePackage.startDate),
                new Date(studentCoursePackage.endDate)
            )
        ) {
            await viewCourseOnLearnerApp(learner, studentCoursePackage.courseName);
        } else {
            await cannotViewCourseOnLearnerApp(learner, studentCoursePackage.courseName);
        }
    }
});
