import { getRandomElement, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import {
    courseAliasWithSuffix,
    learnerProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { Books, Courses, IMasterWorld, StudyPlans, TeacherInterface } from '@supports/app-types';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasCurrentLearnerToDoTab,
    aliasDeletedTopics,
    aliasRandomAssignments,
    aliasRandomBookB1,
    aliasRandomBooks,
    aliasRandomChapters,
    aliasRandomContentBookB1,
    aliasRandomLearningObjectives,
    aliasRandomStudyPlanItems,
    aliasRandomStudyPlanItemsBookB1,
    aliasRandomStudyPlanItemsBookB3,
    aliasRandomTopics,
    aliasStudyPlanId,
    aliasStudyPlanItemAvailableFrom,
    aliasStudyPlanItems,
    aliasStudyPlanName,
    aliasStudyPlanNames,
    aliasTrackSchoolProgress,
} from './alias-keys/syllabus';
import {
    schoolAdminGotoCourseDetail,
    teacherGoToCourseStudentDetail,
} from './create-course-studyplan-definitions';
import { StudyPlanTestCase } from './syllabus-book-csv';
import { schoolAdminHasCreatedStudyPlanV2 } from './syllabus-study-plan-common-definitions';
import { mapStudyPlanItemWithInfo } from './syllabus-study-plan-item-common-definitions';
import {
    studentSeeRandomStudyPlanItems,
    teacherDoesNotSeesDeletedTopics,
} from './syllabus-study-plan-upsert-definitions';
import {
    studentGoToCourseDetail,
    studentNotSeeBookNameInCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import { createRandomCourses } from 'test-suites/common/step-definitions/course-definitions';
import {
    AssertRandomStudyPlanItemsData,
    Assignment,
    Book,
    Chapter,
    ContentBookProps,
    CreatedContentBookReturn,
    LearningObjective,
    StudyPlanItem,
    StudyPlanItemStructure,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { addCoursesForStudent } from 'test-suites/squads/user-management/step-definitions/user-update-student-definitions';

Then(
    'student still sees current studyplan items on Learner App',
    { timeout: 150000 },
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const studyPlanItemsData: AssertRandomStudyPlanItemsData = {
            chapterList: context.get<Chapter[]>(aliasRandomChapters),
            topicList: context.get<Topic[]>(aliasRandomTopics),
            learningObjectiveList: context.get<LearningObjective[]>(aliasRandomLearningObjectives),
            assignmentList: context.get<Assignment[]>(aliasRandomAssignments),
        };

        await this.learner.instruction(
            `Student goes to course ${courseName} detail`,
            async function (learner) {
                await studentRefreshHomeScreen(learner);
                await studentGoToCourseDetail(learner, courseName);
            }
        );

        await this.learner.instruction(
            `Student still sees current study plan items in ${courseName}`,
            async function (learner) {
                await studentSeeRandomStudyPlanItems(learner, studyPlanItemsData);
            }
        );
    }
);

Then(
    'student still sees current studyplan items of book B1 in Course screen on Learner App',
    { timeout: 100000 },
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const contentBookB1 = context.get<ContentBookProps>(aliasRandomContentBookB1);
        const studyPlanItemsData: AssertRandomStudyPlanItemsData = {
            chapterList: contentBookB1.chapterList,
            topicList: contentBookB1.topicList,
            learningObjectiveList: contentBookB1.loList,
            assignmentList: contentBookB1.assignmentList,
        };

        await this.learner.instruction(
            `Student goes to course ${courseName} detail`,
            async function (learner) {
                await studentRefreshHomeScreen(learner);
                await studentGoToCourseDetail(learner, courseName);
            }
        );

        await this.learner.instruction(
            `Student still sees current study plan items in ${courseName}`,
            async function (learner) {
                await studentSeeRandomStudyPlanItems(learner, studyPlanItemsData);
            }
        );
    }
);

Then(
    'student does not see current studyplan items of book B1 in Course screen on Learner App',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const bookB1 = context.get<Book>(aliasRandomBookB1);

        await this.learner.instruction(
            `Student goes to ${courseName} detail`,
            async function (learner) {
                await studentRefreshHomeScreen(learner);
                await studentGoToCourseDetail(learner, courseName);
            }
        );

        await this.learner.instruction(
            `Student does not see current study plan items in ${courseName}`,
            async function (learner) {
                await studentNotSeeBookNameInCourseDetail(learner, bookB1.name);
            }
        );
    }
);

export async function teacherDoesNotSeesDeletedTopicsOnTeacherApp(
    this: IMasterWorld
): Promise<void> {
    const context = this.scenario;
    const studyPlanName = context.get<string>(aliasStudyPlanName);
    const deletedTopicList = context.get<Topic[]>(aliasDeletedTopics);
    const deletedTopicNames = deletedTopicList.map((topic) => topic.name);
    const courseId = context.get(aliasCourseId);
    const studentProfile = await this.learner.getProfile();

    await this.teacher.instruction(
        `Teacher goes to studyplan detail of the student`,
        async function (this: TeacherInterface) {
            await teacherGoToCourseStudentDetail(this, courseId, studentProfile.id);
        }
    );

    await this.teacher.instruction(
        `Teacher doesn't see deleted topics on Teacher App`,
        async function (this: TeacherInterface) {
            await teacherDoesNotSeesDeletedTopics(this, studyPlanName, deletedTopicNames);
        }
    );
}

// TODO: check and remove if not is in use
Given(
    'school admin has created a studyplan exact match with the book content for student',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const bookList = context.get<Book[]>(aliasRandomBooks);
        const studentProfile = getUserProfileFromContext(
            context,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await this.cms.instruction('Create a course by calling gRPC', async function (cms) {
            const { request } = await createRandomCourses(cms);

            context.set(aliasCourseId, request[0].id);
            context.set(aliasCourseName, request[0].name);
        });

        const courseId = context.get<string>(aliasCourseId);
        await this.cms.instruction(
            'Add a course for student by calling gRPC',
            async function (cms) {
                const courseIdList = [courseId];
                const randomLocation = getRandomElement(studentProfile.locations || []);

                await addCoursesForStudent(cms, {
                    courseIds: courseIdList,
                    studentId: studentProfile.id,
                    locationId: randomLocation.locationId,
                });
            }
        );

        await schoolAdminHasCreatedStudyPlanV2(this.cms, courseId, bookList);
    }
);

Given(
    'school admin has created a matched studyplan for student with {string} study plan items',
    {
        timeout: 100000,
    },
    async function (this: IMasterWorld, studyplanTestCase: StudyPlanTestCase) {
        const context = this.scenario;
        const bookList = context.get<Book[]>(aliasRandomBooks);
        const studyPlanItemList =
            this.scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItems) || [];

        const studentProfile = getUserProfileFromContext(
            context,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        await this.cms.instruction('Create a course by calling gRPC', async function (cms) {
            const { request } = await createRandomCourses(cms);

            context.set(aliasCourseId, request[0].id);
            context.set(aliasCourseName, request[0].name);
        });

        const courseId = context.get<string>(aliasCourseId);
        await this.cms.instruction(
            'Add a course for student by calling gRPC',
            async function (cms) {
                const courseIdList = [courseId];
                const randomLocation = getRandomElement(studentProfile.locations || []);

                await addCoursesForStudent(cms, {
                    courseIds: courseIdList,
                    studentId: studentProfile.id,
                    locationId: randomLocation.locationId,
                });
            }
        );

        await this.cms.instruction(`User go to the course: ${courseId} detail`, async () => {
            await schoolAdminGotoCourseDetail(this.cms, courseId);
        });

        const { studyPlanName } = await schoolAdminHasCreatedStudyPlanV2(
            this.cms,
            courseId,
            bookList,
            {
                studyPlanItems: studyPlanItemList,
                studyplanTestCase: studyplanTestCase,
            }
        );

        if (studyplanTestCase == 'active' || studyplanTestCase == 'overdue') {
            context.set(aliasCurrentLearnerToDoTab, studyplanTestCase);
        }

        this.scenario.set(aliasStudyPlanName, studyPlanName);
    }
);

Given(
    'school admin has created a matched studyplan for student',
    { timeout: 100000 },
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const bookList = context.get<Book[]>(aliasRandomBooks);
        const studentProfile = getUserProfileFromContext(
            context,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const studyPlanItemRandoms =
            this.scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItems) || [];

        await this.cms.instruction('Create a course by calling gRPC', async function (cms) {
            const { request } = await createRandomCourses(cms);

            context.set(aliasCourseId, request[0].id);
            context.set(aliasCourseName, request[0].name);
        });

        const courseId = this.scenario.get(aliasCourseId);

        await this.cms.instruction(
            'Add a course for student by calling gRPC',
            async function (cms) {
                const courseIdList = [courseId];
                const randomLocation = getRandomElement(studentProfile.locations || []);

                await addCoursesForStudent(cms, {
                    courseIds: courseIdList,
                    studentId: studentProfile.id,
                    locationId: randomLocation.locationId,
                });
            }
        );

        const { studyPlanId, studyPlanItemRaws, studyPlanName } =
            await schoolAdminHasCreatedStudyPlanV2(this.cms, courseId, bookList, {
                studyPlanItems: studyPlanItemRandoms,
                studyplanTestCase: 'active',
            });

        const studyPlanItems: StudyPlanItemStructure[] = mapStudyPlanItemWithInfo(
            studyPlanItemRaws,
            studyPlanItemRandoms
        );

        this.scenario.set(aliasStudyPlanItems, studyPlanItems);
        this.scenario.set(aliasStudyPlanName, studyPlanName);
        this.scenario.set(aliasStudyPlanId, studyPlanId);
    }
);

Given(
    'school admin has created a matched studyplan for course',
    { timeout: 100000 },
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const bookList = context.get<Book[]>(aliasRandomBooks);
        const studyPlanItemRandoms =
            this.scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItems) || [];
        const courseId = this.scenario.get(aliasCourseId);

        const { studyPlanItemRaws, studyPlanName } = await schoolAdminHasCreatedStudyPlanV2(
            this.cms,
            courseId,
            bookList,
            {
                studyPlanItems: studyPlanItemRandoms,
                studyplanTestCase: 'active',
            }
        );

        const studyPlanItems: StudyPlanItemStructure[] = mapStudyPlanItemWithInfo(
            studyPlanItemRaws,
            studyPlanItemRandoms
        );

        this.scenario.set(aliasStudyPlanItems, studyPlanItems);
        this.scenario.set(aliasStudyPlanName, studyPlanName);
    }
);

When(
    'school admin creates a matched studyplan {string} by {string} for {string}',
    { timeout: 100000 },
    async function (this: IMasterWorld, studyPlan: StudyPlans, book: Books, courses: Courses) {
        const course = this.scenario.get<NsMasterCourseService.UpsertCoursesRequest>(
            courseAliasWithSuffix(courses)
        );
        const courseId = course.id;
        const bookData = this.scenario.get<CreatedContentBookReturn>(book);
        const studyPlanItemRandoms = bookData.studyPlanItemList;

        const { studyPlanName } = await schoolAdminHasCreatedStudyPlanV2(
            this.cms,
            courseId,
            bookData.bookList,
            {
                studyPlanItems: studyPlanItemRandoms,
                studyplanTestCase: 'active',
            }
        );

        this.scenario.set(studyPlan, studyPlanName);
    }
);

Given(
    `school admin creates a matched studyplan {string} by {string} {string} track school progress for {string}`,
    async function (
        this: IMasterWorld,
        studyPlan: StudyPlans,
        book: Books,
        trackSchoolProgress: 'with' | 'without',
        courses: Courses
    ) {
        const course = this.scenario.get<NsMasterCourseService.UpsertCoursesRequest>(
            courseAliasWithSuffix(courses)
        );
        const courseId = course.id;
        const bookData = this.scenario.get<CreatedContentBookReturn>(book);
        const studyPlanItemRandoms = bookData.studyPlanItemList;

        const { studyPlanName, studyPlanItemRaws } = await schoolAdminHasCreatedStudyPlanV2(
            this.cms,
            courseId,
            bookData.bookList,
            {
                studyPlanItems: studyPlanItemRandoms,
                studyplanTestCase: 'active',
                customStudyPlan: {
                    trackSchoolProgress: trackSchoolProgress == 'with',
                },
            }
        );

        this.scenario.set(studyPlan, studyPlanName);
        this.scenario.set(aliasTrackSchoolProgress, trackSchoolProgress == 'with');
        this.scenario.set(aliasStudyPlanItemAvailableFrom, studyPlanItemRaws[0].availableFrom);
    }
);

Given(
    'school admin has created matched study plans for every book for student',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const bookContents = context.get<CreatedContentBookReturn[]>(aliasRandomBooks);
        const studentProfile = getUserProfileFromContext(
            context,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await this.cms.instruction('Create a course by calling gRPC', async function (cms) {
            const { request } = await createRandomCourses(cms);

            context.set(aliasCourseId, request[0].id);
            context.set(aliasCourseName, request[0].name);
        });

        const courseId = context.get<string>(aliasCourseId);
        await this.cms.instruction(
            'Add a course for student by calling gRPC',
            async function (cms) {
                const courseIdList = [courseId];
                const randomLocation = getRandomElement(studentProfile.locations || []);

                await addCoursesForStudent(cms, {
                    courseIds: courseIdList,
                    studentId: studentProfile.id,
                    locationId: randomLocation.locationId,
                });
            }
        );
        for (const bookContent of bookContents) {
            const response = await schoolAdminHasCreatedStudyPlanV2(
                this.cms,
                courseId,
                bookContent.bookList,
                {
                    studyPlanItems: bookContent.studyPlanItemList,
                    studyplanTestCase: 'active',
                }
            );

            const studyPlanNameList = context.get<string[]>(aliasStudyPlanNames) || [];
            context.set(aliasStudyPlanNames, [...studyPlanNameList, ...[response.studyPlanName]]);
        }
    }
);

Given(
    'school admin has created a matched studyplan P1 for student',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const bookList = context.get<Book[]>(aliasRandomBooks);
        const studentProfile = getUserProfileFromContext(
            context,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await this.cms.instruction('Create a course by calling gRPC', async function (cms) {
            const { request } = await createRandomCourses(cms);

            context.set(aliasCourseId, request[0].id);
            context.set(aliasCourseName, request[0].name);
        });

        const courseId = context.get<string>(aliasCourseId);

        const studyPlanItemRandoms =
            this.scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItemsBookB1) || [];

        await this.cms.instruction(
            'Add a course for student by calling gRPC',
            async function (cms) {
                const courseIdList = [courseId];
                const randomLocation = getRandomElement(studentProfile.locations || []);

                await addCoursesForStudent(cms, {
                    courseIds: courseIdList,
                    studentId: studentProfile.id,
                    locationId: randomLocation.locationId,
                });
            }
        );

        await schoolAdminHasCreatedStudyPlanV2(this.cms, courseId, bookList, {
            studyPlanItems: studyPlanItemRandoms,
            studyplanTestCase: 'active',
        });
    }
);

Given(
    'school admin has created a matched studyplan P3 for student in the same course',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);
        const bookList = context.get<Book[]>(aliasRandomBooks);

        const studyPlanItemRandoms =
            this.scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItemsBookB3) || [];

        await schoolAdminHasCreatedStudyPlanV2(this.cms, courseId, bookList, {
            studyPlanItems: studyPlanItemRandoms,
            studyplanTestCase: 'active',
        });
    }
);
