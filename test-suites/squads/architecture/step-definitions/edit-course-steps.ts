import { learnerProfileAlias, studentCoursePackagesAlias } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    editCourseAvatarInCourseSettingsPage,
    editCourseAvatarInEditCoursePage,
    editCourseNameOnCMS,
    goToCourseDetailsOnCMS,
    goToSettingTabInCourseDetailsOnCMS,
    verifyCourseAvatarInCourseList,
    verifyCourseAvatarInEditCoursePage,
    verifyCourseAvatarInSettingTab,
    verifyCourseNameInSettingTab,
} from './edit-course-definitions';
import { studentRefreshHomeScreen } from 'test-suites/common/step-definitions/student-screen-definitions';
import {
    EditCourseButtonPosition,
    UploadContentType,
    gotoEditPageOnCMS,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import {
    verifyNewlyLearnerOnTeacherApp,
    viewCourseOnLearnerApp,
} from 'test-suites/squads/user-management/step-definitions/user-view-course-definitions';

When(
    'school admin edits course {string} after clicking Edit button in the {string}',
    async function (
        this: IMasterWorld,
        uploadContentType: UploadContentType,
        editCourseButtonPosition: EditCourseButtonPosition
    ) {
        const cms = this.cms!;

        const studentCoursePackage = this.scenario.get<Array<StudentCoursePackageEntity>>(
            studentCoursePackagesAlias
        )[0];

        if (editCourseButtonPosition === 'Course details') {
            await goToCourseDetailsOnCMS(cms, studentCoursePackage.courseName);

            await gotoEditPageOnCMS(cms, 'Course');
        } else if (editCourseButtonPosition === 'Course Settings page') {
            await goToCourseDetailsOnCMS(cms, studentCoursePackage.courseName);
        }

        const newStudentCoursePackages: Array<StudentCoursePackageEntity> = [];
        if (uploadContentType === 'name') {
            const newName = `Edited - ${studentCoursePackage.courseName}`;

            await editCourseNameOnCMS(cms, newName);

            newStudentCoursePackages.push({
                courseId: studentCoursePackage.courseId,
                courseName: newName,
                studentPackageId: studentCoursePackage.studentPackageId,
                startDate: studentCoursePackage.startDate,
                endDate: studentCoursePackage.endDate,
            });
        } else if (uploadContentType === 'avatar') {
            if (editCourseButtonPosition === 'Course Settings page') {
                await editCourseAvatarInCourseSettingsPage(cms);
            } else if (editCourseButtonPosition === 'Course details') {
                await editCourseAvatarInEditCoursePage(cms);
            }

            newStudentCoursePackages.push({
                courseId: studentCoursePackage.courseId,
                courseName: studentCoursePackage.courseName,
                studentPackageId: studentCoursePackage.studentPackageId,
                startDate: studentCoursePackage.startDate,
                endDate: studentCoursePackage.endDate,
            });
        }

        this.scenario.set(studentCoursePackagesAlias, newStudentCoursePackages);
    }
);

Then(
    'school admin sees the edited course {string} on CMS',
    async function (this: IMasterWorld, uploadContentType: UploadContentType) {
        const cms = this.cms!;

        const studentCoursePackage = this.scenario.get<Array<StudentCoursePackageEntity>>(
            studentCoursePackagesAlias
        )[0];

        await goToCourseDetailsOnCMS(cms, studentCoursePackage.courseName);

        if (uploadContentType === 'name') {
            await goToSettingTabInCourseDetailsOnCMS(cms);

            await verifyCourseNameInSettingTab(cms, studentCoursePackage.courseName);
        } else if (uploadContentType === 'avatar') {
            const courseAvatar = await verifyCourseAvatarInEditCoursePage(cms);

            await goToSettingTabInCourseDetailsOnCMS(cms);

            await verifyCourseAvatarInSettingTab(cms, courseAvatar);

            await verifyCourseAvatarInCourseList(
                cms,
                studentCoursePackage.courseName,
                courseAvatar
            );

            const newStudentCoursePackages: Array<StudentCoursePackageEntity> = [];
            newStudentCoursePackages.push({
                courseId: studentCoursePackage.courseId,
                courseName: studentCoursePackage.courseName,
                studentPackageId: studentCoursePackage.studentPackageId,
                startDate: studentCoursePackage.startDate,
                endDate: studentCoursePackage.endDate,
                courseAvatar: courseAvatar,
            });

            this.scenario.set(studentCoursePackagesAlias, newStudentCoursePackages);
        }
    }
);

Then(
    'teacher sees the edited course {string} on Teacher App',
    async function (this: IMasterWorld, uploadContentType: UploadContentType) {
        const teacher = this.teacher!;

        const studentCoursePackage = this.scenario.get<Array<StudentCoursePackageEntity>>(
            studentCoursePackagesAlias
        )[0];
        const learnerProfile = this.scenario.get<UserProfileEntity>(learnerProfileAlias);

        if (uploadContentType === 'name') {
            await verifyNewlyLearnerOnTeacherApp(
                teacher,
                learnerProfile,
                studentCoursePackage.courseId,
                studentCoursePackage.courseName
            );
        } else if (uploadContentType === 'avatar') {
            await verifyNewlyLearnerOnTeacherApp(
                teacher,
                learnerProfile,
                studentCoursePackage.courseId,
                studentCoursePackage.courseName,
                studentCoursePackage.courseAvatar
            );
        }
    }
);

Then(
    'student sees the edited course {string} on Learner App',
    async function (this: IMasterWorld, uploadContentType: UploadContentType) {
        const learner = this.learner!;

        const studentCoursePackage = this.scenario.get<Array<StudentCoursePackageEntity>>(
            studentCoursePackagesAlias
        )[0];

        if (uploadContentType === 'name') {
            await learner.instruction(`Pull to refresh Home Screen`, async function () {
                await studentRefreshHomeScreen(learner);
            });

            await viewCourseOnLearnerApp(learner, studentCoursePackage.courseName);
        } else if (uploadContentType === 'avatar') {
            await learner.instruction(`Pull to refresh Home Screen`, async function () {
                await studentRefreshHomeScreen(learner);
            });

            await viewCourseOnLearnerApp(
                learner,
                studentCoursePackage.courseName,
                undefined,
                studentCoursePackage.courseAvatar
            );
        }
    }
);
