import {
    gradeAlias,
    learnerProfileAlias,
    parentProfilesAlias,
    studentCoursePackagesAlias,
    neverLoggedInTagPositionOnCMSAlias,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';

import { filterStudent, verifyFilterResultInStudentList } from './user-definition-utils';
import {
    verifyNeverLoggedInTagOnTeacherWeb,
    NeverLoggedInTagPositionOnCMS,
    convertFromNeverLoggedInTagPositionIntoStudentListPosition,
} from './user-never-logged-in-tag-definitions';
import {
    goToStudentInformationFromCourseDetails,
    verifyNewlyLearnerOnTeacherApp,
} from './user-view-course-definitions';
import { seeNewlyCreatedStudentOnCMS } from './user-view-student-details-definitions';

export type NeverLoggedInTagResult = 'sees' | 'does not see';

Given(
    'school admin is on {string} page',
    async function (
        this: IMasterWorld,
        neverLoggedInTagPositionOnCMS: NeverLoggedInTagPositionOnCMS
    ) {
        const cms = this.cms;
        this.scenario.set(neverLoggedInTagPositionOnCMSAlias, neverLoggedInTagPositionOnCMS);

        if (neverLoggedInTagPositionOnCMS === 'Student List') {
            await cms.selectMenuItemInSidebarByAriaLabel(Menu.STUDENTS);
        } else {
            throw 'Not supported CMS page';
        }
    }
);

When('school admin filters never logged in student', async function (this: IMasterWorld) {
    const cms = this.cms;
    const neverLoggedInTagPositionOnCMS = this.scenario.get<NeverLoggedInTagPositionOnCMS>(
        neverLoggedInTagPositionOnCMSAlias
    );

    await filterStudent(
        cms,
        true,
        undefined,
        undefined,
        convertFromNeverLoggedInTagPositionIntoStudentListPosition(neverLoggedInTagPositionOnCMS)
    );
});

When('school admin filters student by other parameters', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;
    const studentCoursePackage = scenarioContext.get<Array<StudentCoursePackageEntity>>(
        studentCoursePackagesAlias
    )[0];
    const studentProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);

    const neverLoggedInTagPositionOnCMS = this.scenario.get<NeverLoggedInTagPositionOnCMS>(
        neverLoggedInTagPositionOnCMSAlias
    );

    const grade = studentProfile.gradeMaster?.name || '';

    scenarioContext.set(gradeAlias, grade);
    await filterStudent(
        cms,
        true,
        studentCoursePackage.courseName,
        grade,
        convertFromNeverLoggedInTagPositionIntoStudentListPosition(neverLoggedInTagPositionOnCMS)
    );
});

Then(
    `school admin sees list of never logged in students who matches above filter`,
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const studentCoursePackage = scenarioContext.get<Array<StudentCoursePackageEntity>>(
            studentCoursePackagesAlias
        )[0];

        const grade = scenarioContext.get<string>(gradeAlias);
        const neverLoggedInTagPositionOnCMS = this.scenario.get<NeverLoggedInTagPositionOnCMS>(
            neverLoggedInTagPositionOnCMSAlias
        );

        /// Data test id of result list is differences in Student List (Student Management)
        /// and Student List (Add Lesson & Edit Lesson)
        await verifyFilterResultInStudentList(
            cms,
            true,
            studentCoursePackage.courseName,
            grade,
            convertFromNeverLoggedInTagPositionIntoStudentListPosition(
                neverLoggedInTagPositionOnCMS
            )
        );
    }
);

Then(
    'teacher {string} Never logged in tag on Teacher Web',
    async function (this: IMasterWorld, neverLoggedInTagResult: NeverLoggedInTagResult) {
        const teacher = this.teacher;
        const scenarioContext = this.scenario;
        const studentProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        const studentCoursePackage = scenarioContext.get<Array<StudentCoursePackageEntity>>(
            studentCoursePackagesAlias
        )[0];

        await verifyNewlyLearnerOnTeacherApp(
            teacher,
            studentProfile,
            studentCoursePackage.courseId,
            studentCoursePackage.courseName,
            undefined,
            {
                shouldVerifyNeverLoggedInTag: true,
                hasLoggedInTag: neverLoggedInTagResult === 'sees',
            }
        );

        await goToStudentInformationFromCourseDetails(teacher, studentProfile.name);

        await verifyNeverLoggedInTagOnTeacherWeb(
            teacher,
            studentProfile.name,
            'Student Information',
            neverLoggedInTagResult === 'sees'
        );
    }
);

Then(
    'school admin {string} Never logged in tag on Back Office',
    async function (this: IMasterWorld, neverLoggedInTagResult: NeverLoggedInTagResult) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        const studentProfile = scenarioContext.get<UserProfileEntity>(learnerProfileAlias);
        const parentProfiles = scenarioContext.get<Array<UserProfileEntity>>(parentProfilesAlias);
        const studentCoursePackages = scenarioContext.get<Array<StudentCoursePackageEntity>>(
            studentCoursePackagesAlias
        );

        await cms.page!.reload();
        await seeNewlyCreatedStudentOnCMS({
            cms,
            data: {
                learnerProfile: studentProfile,
                parents: parentProfiles,
                studentCoursePackages,
                neverLoggedInTagCondition: {
                    shouldVerifyNeverLoggedInTag: true,
                    hasLoggedInTag: neverLoggedInTagResult === 'sees',
                },
            },
        });
    }
);
