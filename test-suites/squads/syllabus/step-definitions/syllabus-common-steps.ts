import { getRandomElement, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, LOType } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    aliasBookDetailsPage,
    aliasBookIds,
    aliasBookName,
    aliasCourseId,
    aliasCourseName,
    aliasDescCreatedStudentProfiles,
    aliasTopicName,
} from './alias-keys/syllabus';
import { schoolAdminIsOnBookDetailPageByUrl } from './book-definitions';
import {
    schoolAdminAddMultipleStudentToCourse,
    teacherGoToCourseStudentDetail,
    teacherWaitingForStudyPlanListVisible,
} from './create-course-studyplan-definitions';
import { studentWaitingSelectChapterWithBookScreenLoaded } from './syllabus-add-book-to-course-definitions';
import {
    studentGoesToLODetailsPage,
    teacherGoesToStudyPlanItemDetails,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    getConvertedStringType,
    mappedLOTypeWithAliasStringName,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    teacherWaitingStudentStudyPlanPage,
    waitForLoadingAbsent,
} from './syllabus-utils';
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

Then('teacher goes to {string} detail screen from home page', async function (loTypeCase: LOType) {
    const loType = getConvertedStringType<LOType>(loTypeCase);
    const profile = await this.learner.getProfile();
    const courseId = this.scenario.get<string>(aliasCourseId);
    const courseName = this.scenario.get<string>(aliasCourseName);
    const studyPlanItemName = this.scenario.get<string>(mappedLOTypeWithAliasStringName[loType]);

    await this.teacher.instruction(
        `Teacher goes to student's study plan screen by url:
        \n- Course name: ${courseName}
        \n- Student name: ${profile.name}
        \n- URL search: ?course_id=${courseId}/studentStudyPlan?student_id=${profile.id}`,
        async () => {
            await teacherGoToCourseStudentDetail(this.teacher, courseId, profile.id);
            await teacherWaitingForStudyPlanListVisible(this.teacher);
        }
    );

    await this.teacher.instruction(
        `Teacher goes to the study plan item detail page:
        \n- Name: ${studyPlanItemName} 
        \n- Type: ${loTypeCase}`,
        async () => {
            await teacherGoesToStudyPlanItemDetails(this.teacher, studyPlanItemName);
            await waitForLoadingAbsent(this.learner.flutterDriver!);
        }
    );
});

When(`teacher goes to {string} marking page from home page`, async function (loType: LOType) {
    const courseName = this.scenario.get<string>(aliasCourseName);
    const courseId = this.scenario.get<string>(aliasCourseId);
    const profile = await this.learner.getProfile();
    const studyPlanItemName = this.scenario.get<string>(mappedLOTypeWithAliasStringName[loType]);

    await this.teacher.instruction(`Teacher reloads the current page`, async () => {
        await this.teacher.flutterDriver!.reload();
        await waitForLoadingAbsent(this.teacher.flutterDriver!);
    });

    await this.teacher.instruction(
        `Teacher goes to student's study plan screen by url:
        \n- Course name: ${courseName}
        \n- Student name: ${profile.name}
        \n- URL search: ?course_id=${courseId}/studentStudyPlan?student_id=${profile.id}`,
        async () => {
            await teacherGoToCourseStudentDetail(this.teacher, courseId, profile.id);
            await teacherWaitingStudentStudyPlanPage(this.teacher);
        }
    );

    await this.teacher.instruction(
        `Teacher goes to the LM marking page:
        \n- Name: ${studyPlanItemName} 
        \n- Type: ${loType}`,
        async () => {
            await teacherGoesToStudyPlanItemDetails(this.teacher, studyPlanItemName);
            await waitForLoadingAbsent(this.learner.flutterDriver!);
        }
    );
});

When(
    'student goes to {string} detail screen from topic detail screen',
    async function (loType: LOType) {
        const topicName = this.scenario.get<string>(aliasTopicName);
        const studyPlanItemName = this.scenario.get<string>(
            mappedLOTypeWithAliasStringName[loType]
        );

        await this.teacher.instruction(
            `Student goes to LM detail screen:
            \n- Name: ${studyPlanItemName}
            \n- Type: ${loType}`,
            async () => {
                await studentGoesToLODetailsPage(this.learner, topicName, studyPlanItemName);
                await waitForLoadingAbsent(this.learner.flutterDriver!);
            }
        );
    }
);

When('student goes to {string} detail screen from home screen', async function (loType: LOType) {
    const courseName = this.scenario.get<string>(aliasCourseName);
    const topicName = this.scenario.get<string>(aliasTopicName);
    const studyPlanItemName = this.scenario.get<string>(mappedLOTypeWithAliasStringName[loType]);

    await this.learner.instruction('Student refreshes home screen', async () => {
        await studentRefreshHomeScreen(this.learner);
    });

    await this.learner.instruction(
        `Student goes to course ${courseName} detail screen`,
        async () => {
            await studentGoToCourseDetail(this.learner, courseName);
            await studentWaitingSelectChapterWithBookScreenLoaded(this.learner);
        }
    );

    await this.learner.instruction(`Student goes to topic ${topicName} detail screen`, async () => {
        await studentGoToTopicDetail(this.learner, topicName);
    });

    await this.learner.instruction(
        `Student goes to LM detail screen:
        \n- Name: ${studyPlanItemName}
        \n- Type: ${loType}`,
        async () => {
            await studentGoesToLODetailsPage(this.learner, topicName, studyPlanItemName);

            await waitForLoadingAbsent(this.learner.flutterDriver!);
        }
    );
});
