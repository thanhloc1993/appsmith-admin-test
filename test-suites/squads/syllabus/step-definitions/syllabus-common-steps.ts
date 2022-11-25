import { getRandomElement, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    aliasBookDetailsPage,
    aliasBookIds,
    aliasBookName,
    aliasCourseId,
    aliasDescCreatedStudentProfiles,
} from './alias-keys/syllabus';
import { schoolAdminIsOnBookDetailPageByUrl } from './book-definitions';
import { schoolAdminAddMultipleStudentToCourse } from './create-course-studyplan-definitions';
import { getBOBookDetailUrl } from './utils/book';
import { ByValueKey } from 'flutter-driver-x';
import { schoolAdminHasCreatedACourseByGrpc } from 'test-suites/common/step-definitions/course-definitions';
import { createARandomStudentGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';
import { addCoursesForStudent } from 'test-suites/squads/user-management/step-definitions/user-update-student-definitions';

Given(
    'school admin has created a new course with {string}',
    async function (studentRole: AccountRoles) {
        const context = this.scenario;

        await this.cms.instruction('Create a course by calling gRPC', async (cms) => {
            await schoolAdminHasCreatedACourseByGrpc(cms, context);
        });

        await this.cms.instruction(`Create a ${studentRole} by calling gRPC`, async (cms) => {
            const aliasStudentProfile = learnerProfileAliasWithAccountRoleSuffix(studentRole);

            const { student } = await createARandomStudentGRPC(cms, {
                parentLength: 0,
                studentPackageProfileLength: 0,
            });

            context.set(aliasStudentProfile, student);
            context.set(aliasDescCreatedStudentProfiles, [student]);
        });

        const courseId = context.get<string>(aliasCourseId);
        await this.cms.instruction(
            `Add a course ${courseId} to a ${studentRole} by calling gRPC`,
            async (cms) => {
                const studentProfile = context.get<UserProfileEntity>(
                    learnerProfileAliasWithAccountRoleSuffix(studentRole)
                );

                await schoolAdminAddMultipleStudentToCourse(cms, [studentProfile], courseId);
            }
        );
    }
);

Then('school admin has added {string} to course', async function (studentRole: AccountRoles) {
    const context = this.scenario;
    const courseId = context.get<string>(aliasCourseId);
    const descCreatedStudentProfileList =
        context.get<UserProfileEntity[]>(aliasDescCreatedStudentProfiles) || [];

    await this.cms.instruction(`Create a ${studentRole} by calling gRPC`, async (cms) => {
        const aliasStudentProfile = learnerProfileAliasWithAccountRoleSuffix(studentRole);

        const { student } = await createARandomStudentGRPC(cms, {
            parentLength: 0,
            studentPackageProfileLength: 0,
        });

        context.set(aliasStudentProfile, student);
        context.set(aliasDescCreatedStudentProfiles, [student, ...descCreatedStudentProfileList]);
    });

    await this.cms.instruction(
        `Add a course ${courseId} to a ${studentRole} by calling gRPC`,
        async (cms) => {
            const studentProfile = context.get<UserProfileEntity>(
                learnerProfileAliasWithAccountRoleSuffix(studentRole)
            );

            await schoolAdminAddMultipleStudentToCourse(cms, [studentProfile], courseId);
        }
    );
});

When('school admin adds student to course', async function () {
    const context = this.scenario;
    const courseId = context.get(aliasCourseId);

    const learnerProfile = getUserProfileFromContext(
        context,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );

    await this.cms.instruction('Add a course for student by calling gRPC', async function (cms) {
        const courseIdList = [courseId];
        const randomLocation = getRandomElement(learnerProfile.locations || []);

        await addCoursesForStudent(cms, {
            courseIds: courseIdList,
            studentId: learnerProfile.id,
            locationId: randomLocation.locationId,
        });
    });
});

Given('school admin goes to book detail page', async function () {
    const bookId = this.scenario.get<string[]>(aliasBookIds)[0];
    const bookName = this.scenario.get<string>(aliasBookName);

    if (!bookId) throw new Error(`The book id can not be ${bookId}`);

    const bookDetailURL = getBOBookDetailUrl(bookId);

    await this.cms.instruction(
        `school admin goes book ${bookName} detail page by url ${bookDetailURL}`,
        async () => {
            await schoolAdminIsOnBookDetailPageByUrl(this.cms, { id: bookId, name: bookName });
        }
    );

    this.scenario.set(aliasBookDetailsPage, bookDetailURL);
});

When('student taps on {string}', async function (buttonKey: string) {
    await this.learner.instruction(`student taps on ${buttonKey}`, async () => {
        await this.learner.flutterDriver!.tap(new ByValueKey(buttonKey));
    });
});
