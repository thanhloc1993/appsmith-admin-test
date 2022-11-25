import { bookDetailScreenRoute, topicDetailScreenRoute } from '@legacy-step-definitions/endpoints';
import {
    asyncForEach,
    delay,
    getLearnerTenantInterfaceFromRole,
    getSchoolAdminTenantInterfaceFromRole,
    getTeacherTenantInterfaceFromRole,
    toShortenStr,
} from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';
import { learnerTenantProfileAliasWithLearnerTenantRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import {
    BookWithTenant,
    CourseWithTenant,
    IMasterWorld,
    LearnerRolesWithTenant,
    SchoolAdminRolesWithTenant,
    TeacherRolesWithTenant,
    Tenant,
} from '@supports/app-types';
import {
    brightCoveSampleLink,
    brightCoveSampleLink2,
    samplePDFFilePath,
    samplePDFFilePath2,
} from '@supports/constants';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';
import { ActionOptions } from '@supports/types/cms-types';

import {
    aliasAssignmentFilesWithTenant,
    aliasAssignmentName,
    aliasBookDetailUrlWithTenant,
    aliasChaptersWithTenant,
    aliasContentBookLOQuestionQuantity,
    aliasLOName,
    aliasQuestionUrlsWithTenant,
    aliasStudyPlanItemsWithTenant,
    aliasStudyPlanItemUrlsWithTenant,
    aliasStudyPlanNameWithTenant,
    aliasTopicsWithTenant,
} from './alias-keys/syllabus';
import {
    externalLink,
    fileChipName,
    fileIconPDF,
    fileIconVideo,
    loAndAssignmentByName,
    tableBaseRow,
} from './cms-selectors/cms-keys';
import { examLoQuizSection, loQuizSection } from './cms-selectors/learning-objective';
import {
    teacherGoToCourseStudentDetail,
    teacherSeeStudyPlan,
} from './create-course-studyplan-definitions';
import { studentSeeStudyPlanItemInCourseDetail } from './syllabus-archive-study-plan-item-definitions';
import { studentSeeChapter } from './syllabus-content-book-create-definitions';
import {
    schoolAdminCanNotSeeBook,
    schoolAdminIsOnBookDetailsPageWithBookName,
    schoolAdminSeeCreatedChapterWithChapterName,
    schoolAdminSeeCreatedTopicWithTopicName,
    schoolAdminTenantHasCreatedAContentBook,
} from './syllabus-create-book-multi-tenant-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { studentSeeTopicOnCourse } from './syllabus-delete-topic-definitions';
import {
    schoolAdminSelectEditAssignment,
    schoolAdminUploadAssignmentAttachmentsWithTenant,
} from './syllabus-edit-assignment-definitions';
import {
    schoolAdminUploadLOStudyGuideWithPath,
    schoolAdminUploadLOVideoLinkWithLink,
} from './syllabus-edit-learning-objective-definitions';
import {
    studentGoToCourseDetail,
    studentNotSeeAllChaptersInCourse,
    studentNotSeeAllTopicsInCourse,
    studentNotSeeSelectedBookNameInCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import { ByText, ByValueKey } from 'flutter-driver-x';
import { LearningObjectiveType } from 'manabuf/common/v1/enums_pb';
import {
    Assignment,
    Book,
    Chapter,
    isAssignment,
    LearningObjective,
    StudyPlanItem,
    StudyPlanItemStructure,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    '{string} creates a book {string}',
    { timeout: 100000 },
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        bookTenant: BookWithTenant
    ) {
        const masterWorld = this!;
        const { bookList, chaptersList, topicList, studyPlanItemList } =
            await schoolAdminTenantHasCreatedAContentBook(masterWorld, schoolAdminRole);
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const context = masterWorld.scenario;
        const tenant = bookTenant == 'book Tenant S1' ? 'Tenant S1' : 'Tenant S2';
        await cms.instruction(`school admin goes to LO details`, async function (cms) {
            const loName = context.get<string>(aliasLOName);
            await schoolAdminIsOnBookDetailsPageWithBookName(cms, bookList[0].name);
            const loRow = await cms.page!.waitForSelector(loAndAssignmentByName(loName));
            await loRow.click();
            await cms.assertThePageTitle(loName);
        });

        await cms.instruction(
            `school admin updates the video and pdf for the LO`,
            async function (cms) {
                await schoolAdminUploadLOStudyGuideWithPath(
                    cms,
                    tenant == 'Tenant S1' ? samplePDFFilePath : samplePDFFilePath2
                );
                await cms.page!.waitForSelector(fileIconPDF);
                await schoolAdminUploadLOVideoLinkWithLink(
                    cms,
                    tenant == 'Tenant S1' ? brightCoveSampleLink : brightCoveSampleLink2
                );
            }
        );

        await cms.instruction(`school admin goes to Assignment details`, async function (cms) {
            const assignmentName = context.get<string>(aliasAssignmentName);
            await schoolAdminIsOnBookDetailsPageWithBookName(cms, bookList[0].name);
            const assignmentRow = await cms.page!.waitForSelector(
                loAndAssignmentByName(assignmentName)
            );
            await assignmentRow.click();
            await cms.assertThePageTitle(assignmentName);
        });

        await cms.instruction(
            `school admin updates the attachment to Assignment`,
            async function (cms) {
                await schoolAdminSelectEditAssignment(cms);
                await schoolAdminUploadAssignmentAttachmentsWithTenant(cms, context, tenant);
            }
        );
        masterWorld.scenario.set(bookTenant, bookList[0]);
        masterWorld.scenario.set(aliasChaptersWithTenant(tenant), chaptersList);
        masterWorld.scenario.set(aliasTopicsWithTenant(tenant), topicList);
        masterWorld.scenario.set(aliasStudyPlanItemsWithTenant(tenant), studyPlanItemList);
    }
);

Then(
    '{string} can see the book {string} and its content',
    { timeout: 100000 },
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        bookTenant: BookWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const context = this.scenario;
        const book = context.get<Book>(bookTenant);
        const tenant: Tenant = bookTenant == 'book Tenant S1' ? 'Tenant S1' : 'Tenant S2';
        const chapters = this.scenario.get<Chapter[]>(aliasChaptersWithTenant(tenant));
        const topics = this.scenario.get<Topic[]>(aliasTopicsWithTenant(tenant));
        const studyplanItems = this.scenario.get<StudyPlanItem[]>(
            aliasStudyPlanItemsWithTenant(tenant)
        );
        await cms.instruction(
            `School admin goes to the created content book ${bookTenant} page: ${book.name}`,
            async function (cms) {
                await schoolAdminIsOnBookDetailsPageWithBookName(cms, book.name);
                context.set(aliasBookDetailUrlWithTenant(tenant), cms.page!.url());
            }
        );

        await cms.instruction(
            `School admin sees chapter: ${chapters[0].info!.name}`,
            async function (cms) {
                await schoolAdminSeeCreatedChapterWithChapterName(cms, chapters[0].info!.name);
            }
        );

        await cms.instruction(`School admin sees topic: ${topics[0].name}`, async function (cms) {
            await schoolAdminSeeCreatedTopicWithTopicName(cms, topics[0].name);
        });
        const studyPlanItemDetailURLs: string[] = [];
        const questionURLs: string[] = [];
        const questionQuantity = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);

        for (const studyplanItem of studyplanItems) {
            const isAssignmentStudyPlanItem = isAssignment(studyplanItem);

            const studyplanItemName = isAssignmentStudyPlanItem
                ? (studyplanItem as Assignment).name
                : (studyplanItem as LearningObjective).info.name;
            await cms.instruction(
                `School admin sees content learning: ${studyplanItemName}}`,
                async function (cms) {
                    await schoolAdminIsOnBookDetailsPageWithBookName(cms, book.name);
                    const studyplanItemRow = await cms.page!.waitForSelector(
                        loAndAssignmentByName(studyplanItemName)
                    );
                    await studyplanItemRow.click();
                    await cms.assertThePageTitle(studyplanItemName);
                    studyPlanItemDetailURLs.push(cms.page!.url());
                }
            );

            if (isAssignmentStudyPlanItem) {
                const attachments = context.get<string[]>(aliasAssignmentFilesWithTenant(tenant));
                await asyncForEach<string, void>(attachments, async (attachment) => {
                    await cms.instruction(`${attachment} should be visible`, async () => {
                        await cms.page!.waitForSelector(fileChipName(toShortenStr(attachment, 20)));
                    });
                });
            } else {
                const learningObjectiveType = (studyplanItem as LearningObjective).type;
                if (
                    learningObjectiveType == LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING
                ) {
                    await cms.instruction(`pdf should be visible`, async () => {
                        await cms.page!.waitForSelector(fileIconPDF);
                        await cms.page!.waitForSelector(externalLink);
                    });
                    await cms.instruction(`video should be visible`, async () => {
                        await cms.page!.waitForSelector(fileIconVideo);
                    });
                }
                if (
                    learningObjectiveType ==
                        LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING ||
                    learningObjectiveType == LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_EXAM_LO
                ) {
                    const quizSection =
                        learningObjectiveType ==
                        LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING
                            ? loQuizSection
                            : examLoQuizSection;
                    for (let index = 0; index < questionQuantity; index++) {
                        await cms.instruction(`quiz ${index + 1} should be visible`, async () => {
                            await cms.selectActionButton(ActionOptions.EDIT, {
                                target: 'actionPanelTrigger',
                                wrapperSelector: `${quizSection} ${tableBaseRow}:nth-child(${
                                    index + 1
                                })`,
                            });
                            questionURLs.push(cms.page!.url());
                            await cms.selectActionButton(ActionOptions.CLOSE);
                        });
                    }
                }
            }
        }

        context.set(aliasStudyPlanItemUrlsWithTenant(tenant), studyPlanItemDetailURLs);
        context.set(aliasQuestionUrlsWithTenant(tenant), questionURLs);
    }
);

Then(
    '{string} can not see the book {string} and its content',
    { timeout: 100000 },
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        bookTenant: BookWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const context = this.scenario;
        const book = context.get<Book>(bookTenant);

        await cms.instruction(
            `School admin search and not found the created content book ${bookTenant}: ${book.name}`,
            async function (cms) {
                await schoolAdminCanNotSeeBook(cms, book.name);
            }
        );
    }
);

Then(
    '{string} opens the book {string} and its content by URL and see error 404',
    { timeout: 100000 },
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        bookTenant: BookWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const context = this.scenario;
        const book = context.get<Book>(bookTenant);
        const tenant: Tenant = bookTenant == 'book Tenant S1' ? 'Tenant S1' : 'Tenant S2';
        const bookDetailURl = context.get<string>(aliasBookDetailUrlWithTenant(tenant));
        const studyPlanItemURLs = context.get<string[]>(aliasStudyPlanItemUrlsWithTenant(tenant));
        const questionURLs = context.get<string[]>(aliasQuestionUrlsWithTenant(tenant));
        await cms.instruction(
            `School admin opens book detail screen URL of ${bookTenant}: ${book.name} and see 404 error`,
            async function (cms) {
                await cms.page!.goto(bookDetailURl, { waitUntil: 'networkidle' });
                await cms.page!.waitForSelector(`[data-testid="WrapperPageHeader__root"]`, {
                    state: 'hidden',
                });
            }
        );
        await asyncForEach<string, void>(studyPlanItemURLs, async (url) => {
            await cms.instruction(
                `School admin opens study plan item url: ${url} and see 404 error`,
                async () => {
                    await cms.page!.goto(url, { waitUntil: 'networkidle' });
                    await cms.page!.waitForSelector(`[data-testid="WrapperPageHeader__root"]`, {
                        state: 'hidden',
                    });
                }
            );
        });
        await asyncForEach<string, void>(questionURLs, async (url) => {
            await cms.instruction(
                `School admin opens question url: ${url} and see 404 error`,
                async () => {
                    await cms.page!.goto(url, { waitUntil: 'networkidle' });
                    await cms.page!.waitForSelector(`[data-testid="FormDialog__title"]`, {
                        state: 'hidden',
                    });
                }
            );
        });
    }
);

Then(
    '{string} sees the book {string} topics in course {string} studyplan',
    { timeout: 100000 },
    async function (
        this: IMasterWorld,
        teacherRole: TeacherRolesWithTenant,
        bookTenant: BookWithTenant,
        courseTenant: CourseWithTenant
    ) {
        const teacher = getTeacherTenantInterfaceFromRole(this, teacherRole);
        const tenant: Tenant = bookTenant == 'book Tenant S1' ? 'Tenant S1' : 'Tenant S2';
        const studentRole = tenant == 'Tenant S1' ? 'student Tenant S1' : 'student Tenant S2';

        const context = this.scenario;
        const course = context.get<NsMasterCourseService.UpsertCoursesRequest>(courseTenant);
        const studyPlanName = context.get<string>(aliasStudyPlanNameWithTenant(tenant));
        const topics = this.scenario.get<Topic[]>(aliasTopicsWithTenant(tenant));
        const profile = context.get<UserProfileEntity>(
            learnerTenantProfileAliasWithLearnerTenantRoleSuffix(studentRole)
        );
        await teacher.instruction(
            `Teacher go to the course student detail: ${profile.name}`,
            async () => {
                await teacherGoToCourseStudentDetail(teacher, course.id, profile.id);
            }
        );

        await teacher.instruction(`Teacher assert study plan for ${profile.name}`, async () => {
            await teacherSeeStudyPlan(teacher, studyPlanName);
        });

        await teacher.instruction(`Teacher sees topic: ${topics[0].name}`, async () => {
            await teacher.flutterDriver!.waitFor(new ByText(topics[0].name));
        });
    }
);

Then(
    '{string} opens the course {string} studyplan and its contents by URL and see error 404',
    { timeout: 100000 },
    async function (
        this: IMasterWorld,
        teacherRoles: TeacherRolesWithTenant,
        courseTenant: CourseWithTenant
    ) {
        const teacher = getTeacherTenantInterfaceFromRole(this, teacherRoles);
        const tenant: Tenant = courseTenant == 'course Tenant S1' ? 'Tenant S1' : 'Tenant S2';
        const studentRole = tenant == 'Tenant S1' ? 'student Tenant S1' : 'student Tenant S2';
        const bookTenant = tenant == 'Tenant S1' ? 'book Tenant S1' : 'book Tenant S2';

        const context = this.scenario;
        const course = context.get<NsMasterCourseService.UpsertCoursesRequest>(courseTenant);
        const book = context.get<Book>(bookTenant);

        const profile = context.get<UserProfileEntity>(
            learnerTenantProfileAliasWithLearnerTenantRoleSuffix(studentRole)
        );
        let studentStudyPlanURL = '';
        const topics = this.scenario.get<Topic[]>(aliasTopicsWithTenant(tenant));
        await teacher.instruction(
            `Teacher ${teacherRoles} go to the course ${course.name} student detail: ${profile.name} and see error 404`,
            async () => {
                await teacherGoToCourseStudentDetail(teacher, course.id, profile.id);
                studentStudyPlanURL = teacher.page!.url();
                await delay(5000);
                await teacher.instruction(
                    `Teacher dont see study plan for ${profile.name}`,
                    async () => {
                        await teacher.flutterDriver!.waitFor(
                            new ByValueKey(SyllabusTeacherKeys.studentStudyPlanDropDownDisable)
                        );
                    }
                );

                await teacher.instruction(`Teacher dont see topic: ${topics[0].name}`, async () => {
                    await teacher.flutterDriver!.waitForAbsent(new ByText(topics[0].name));
                });
            }
        );
        const studyplanItems = context.get<StudyPlanItem[]>(aliasStudyPlanItemsWithTenant(tenant));
        const assignment = studyplanItems.find((e) => isAssignment(e)) as Assignment;
        await teacher.instruction(
            `Teacher ${teacherRoles} go to the assignment ${assignment.name} of book ${book.name}`,
            async () => {
                const assignmentURL = `${studentStudyPlanURL}/score_assignment?assignment_id=${assignment.assignmentId}&submission_id=&study_plan_item_id=`;
                console.log(assignmentURL);
                await teacher.flutterDriver!.webDriver!.page.goto(assignmentURL);
                await delay(5000);
                await teacher.instruction(
                    `Teacher dont see assignment: ${assignment.name}`,
                    async () => {
                        await teacher.flutterDriver!.runUnsynchronized(async () => {
                            await teacher.flutterDriver!.waitForAbsent(
                                new ByValueKey(
                                    SyllabusTeacherKeys.assignmentNameTextField(assignment.name)
                                )
                            );
                        });
                    }
                );
            }
        );
    }
);

Then(
    '{string} opens the course {string} and sees the book {string} contents',
    { timeout: 100000 },
    async function (
        this: IMasterWorld,
        learnerRole: LearnerRolesWithTenant,
        courseTenant: CourseWithTenant,
        bookTenant: BookWithTenant
    ) {
        const learner = getLearnerTenantInterfaceFromRole(this, learnerRole);
        const tenant: Tenant = bookTenant == 'book Tenant S1' ? 'Tenant S1' : 'Tenant S2';

        const context = this.scenario;
        const course = context.get<NsMasterCourseService.UpsertCoursesRequest>(courseTenant);
        const chapters = context.get<Chapter[]>(aliasChaptersWithTenant(tenant));
        const topics = context.get<Topic[]>(aliasTopicsWithTenant(tenant));
        const studyplanItems = context.get<StudyPlanItem[]>(aliasStudyPlanItemsWithTenant(tenant));

        await learner.instruction(`Student goes to course ${course.name}`, async () => {
            await studentRefreshHomeScreen(learner);
            await studentGoToCourseDetail(learner, course.name);
        });

        await learner.instruction(`Student sees chapter and topic of course`, async () => {
            await studentSeeChapter(learner, chapters[0].info!.name);
            await studentSeeTopicOnCourse(learner, topics[0].name);
        });

        await learner.instruction(`Student goes to topic detail`, async () => {
            await studentGoToTopicDetail(learner, topics[0].name);
        });

        for (const studyplanItem of studyplanItems) {
            const isAssignmentStudyPlanItem = isAssignment(studyplanItem);

            const studyplanItemName = isAssignmentStudyPlanItem
                ? (studyplanItem as Assignment).name
                : (studyplanItem as LearningObjective).info.name;

            await learner.instruction(
                `Student sees studyplan item: ${studyplanItemName}`,
                async () => {
                    await studentSeeStudyPlanItemInCourseDetail(
                        learner,
                        topics[0].name,
                        studyplanItemName
                    );
                }
            );
        }
    }
);

Then(
    '{string} sees the book {string} LOs by open by URL',
    { timeout: 100000 },
    async function (
        this: IMasterWorld,
        learnerRole: LearnerRolesWithTenant,
        bookTenant: BookWithTenant
    ) {
        const learner = getLearnerTenantInterfaceFromRole(this, learnerRole);
        const tenant: Tenant = bookTenant == 'book Tenant S1' ? 'Tenant S1' : 'Tenant S2';

        const context = this.scenario;
        const studyplanItems = context.get<StudyPlanItem[]>(aliasStudyPlanItemsWithTenant(tenant));
        const studyplanItemStructures = context.get<StudyPlanItemStructure[]>(
            tenant == 'Tenant S1' ? 'studyplan Tenant S1' : 'studyplan Tenant S2'
        );

        const loItem = studyplanItems.find((e) => {
            if (isAssignment(e)) {
                return false;
            }
            if (
                (e as LearningObjective).type ==
                LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING
            ) {
                return true;
            }
            return false;
        }) as LearningObjective;
        const studyPlanItem = studyplanItemStructures.find((e) => e.contentId == loItem.info.id);
        await learner.instruction(`Student opens LO: ${loItem.info.name} by URL`, async () => {
            const currentURL = learner.page!.url();
            await learner.page!.goto(
                `${currentURL}/videoStudyGuide?study_plan_item_id=${
                    studyPlanItem!.studyPlanItemId
                }&lo_id=${loItem.info.id}&session_id=`
            );
            await learner.flutterDriver!.waitFor(
                new ByValueKey(SyllabusLearnerKeys.video_and_pdf_screen(loItem.info.name))
            );
        });
    }
);

Then(
    '{string} opens the course {string}, the book {string} contents by URL and see error 404',
    { timeout: 100000 },
    async function (
        this: IMasterWorld,
        learnerRole: LearnerRolesWithTenant,
        courseTenant: CourseWithTenant,
        bookTenant: BookWithTenant
    ) {
        const learner = getLearnerTenantInterfaceFromRole(this, learnerRole);
        const tenant: Tenant = courseTenant == 'course Tenant S1' ? 'Tenant S1' : 'Tenant S2';

        const context = this.scenario;
        const course = context.get<NsMasterCourseService.UpsertCoursesRequest>(courseTenant);
        const book = context.get<Book>(bookTenant);
        const chapters = context.get<Chapter[]>(aliasChaptersWithTenant(tenant));
        const topics = context.get<Topic[]>(aliasTopicsWithTenant(tenant));
        const studyplanItems = context.get<StudyPlanItem[]>(aliasStudyPlanItemsWithTenant(tenant));
        const studyplanItemStructures = context.get<StudyPlanItemStructure[]>(
            tenant == 'Tenant S1' ? 'studyplan Tenant S1' : 'studyplan Tenant S2'
        );

        const loItem = studyplanItems.find((e) => {
            if (isAssignment(e)) {
                return false;
            }
            if (
                (e as LearningObjective).type ==
                LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING
            ) {
                return true;
            }
            return false;
        }) as LearningObjective;
        const studyPlanItem = studyplanItemStructures.find((e) => e.contentId == loItem.info.id);
        const domainUrl = learner.page!.url().split('#')[0] + '#/';
        const bookDetailScreenPath = `${domainUrl}${bookDetailScreenRoute(course.id)}`;
        const topicDetailScreenPath = `${domainUrl}${topicDetailScreenRoute(
            course.id,
            book.bookId,
            chapters[0].info!.id,
            topics[0].id
        )}`;
        const loScreenPath = `${topicDetailScreenPath}/videoStudyGuide?study_plan_item_id=${
            studyPlanItem!.studyPlanItemId
        }&lo_id=${loItem.info.id}&session_id=`;
        await learner.instruction(
            `Student goes to course ${course.name} by URL and see 404 error`,
            async () => {
                await learner.page!.goto(bookDetailScreenPath);
                await studentNotSeeSelectedBookNameInCourseDetail(learner, book.name);
                await studentNotSeeAllChaptersInCourse(learner, [chapters[0].info!.name]);
                await studentNotSeeAllTopicsInCourse(learner, [topics[0].name]);
            }
        );

        await learner.instruction(
            `Student goes to topic ${topics[0].name} of book ${book.name} by URL and see 404 error`,
            async () => {
                await learner.page!.goto(topicDetailScreenPath);
                const loListScreenKey = new ByValueKey(
                    SyllabusLearnerKeys.lo_list_screen(topics[0].name)
                );
                await delay(5000);
                await learner.flutterDriver!.runUnsynchronized(async () => {
                    await learner.flutterDriver!.waitForAbsent(loListScreenKey);
                });
            }
        );

        await learner.instruction(
            `Student goes to LO ${loItem.info.name} of book ${topics[0].name} by URL and see 404 error`,
            async () => {
                await learner.page!.goto(loScreenPath);
                await delay(5000);
                const videoAndStudyGuideScreenKey = new ByValueKey(
                    SyllabusLearnerKeys.video_and_pdf_screen(loItem.info.name)
                );
                await delay(5000);
                await learner.flutterDriver!.runUnsynchronized(async () => {
                    await learner.flutterDriver!.waitFor(
                        new ByValueKey(SyllabusLearnerKeys.nextButtonUnenabled)
                    );
                    await learner.flutterDriver!.waitForAbsent(videoAndStudyGuideScreenKey);
                });
            }
        );
    }
);
