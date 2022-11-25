import { genId } from '@legacy-step-definitions/utils';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import {
    CMSInterface,
    IMasterWorld,
    LearnerInterface,
    LOType,
    TeacherInterface,
} from '@supports/app-types';

import {
    aliasAssignmentName,
    aliasBookDetailsPage,
    aliasChapterName,
    aliasCourseId,
    aliasCourseName,
    aliasLOName,
    aliasRandomAssignment,
    aliasRandomBooks,
    aliasRandomChapters,
    aliasRandomLearningObjective,
    aliasRandomStudyPlanItems,
    aliasRandomTaskAssignment,
    aliasRandomTopics,
    aliasTopicName,
} from './alias-keys/syllabus';
import { createLOTabRoot, formInput, loAndAssignmentByName } from './cms-selectors/cms-keys';
import { studentGoToAssignmentInBook } from './syllabus-assignment-submit-definitions';
import { expandAChapter, expandATopic } from './syllabus-content-book-create-definitions';
import {
    schoolAdminSelectCreateLO,
    schoolAdminSelectLOType,
} from './syllabus-create-task-assignment-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    createRandomLOInTopic,
    getNameByLoType,
    schoolAdminCreateALO,
    schoolAdminFillLOFormData,
} from './syllabus-learning-objectives-create-definitions';
import {
    studentNotSeeStudyPlanItem,
    studentSeeStudyPlanItem,
    teacherGoesToStudyPlanDetails,
    teacherNotSeeStudyPlanItem,
    teacherSeeStudyPlanItem,
} from './syllabus-study-plan-upsert-definitions';
import {
    getDataByStudyPlanItemListWithTopicId,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    schoolAdminSeesErrorMessageField,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import {
    Book,
    Chapter,
    StudyPlanItem,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given(
    'a {string} is created in the content book',
    async function (this: IMasterWorld, loType: LOType): Promise<void> {
        const context = this.scenario;
        const book = context.get<Book[]>(aliasRandomBooks)[0];
        const topic = context.get<Topic[]>(aliasRandomTopics)[0];
        const studyPlanItemList = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems) || [];
        const { studyPlanItemListByTopicId } = getDataByStudyPlanItemListWithTopicId(
            topic.id,
            studyPlanItemList
        );

        await this.cms.instruction(
            `Create a learning objective ${loType} inside topic ${topic.name} of book ${book.name} by calling gRPC`,
            async function (cms) {
                let displayOrderFrom = 1;

                if (studyPlanItemListByTopicId.length)
                    displayOrderFrom = studyPlanItemListByTopicId.length + 1;

                const { losInTopic, assignmentsInTopic, taskAssignmentsInTopic } =
                    await createRandomLOInTopic(cms, {
                        topicId: topic.id,
                        loType,
                        displayOrderFrom,
                    });

                if (losInTopic.length) {
                    context.set(aliasRandomLearningObjective, losInTopic[0]);
                }

                if (assignmentsInTopic.length) {
                    context.set(aliasRandomAssignment, assignmentsInTopic[0]);
                }

                if (taskAssignmentsInTopic.length) {
                    context.set(aliasRandomTaskAssignment, taskAssignmentsInTopic[0]);
                }
            }
        );
    }
);

When(
    'school admin creates a new {string} in book',
    async function (this: IMasterWorld, loType: LOType): Promise<void> {
        const scenario = this.scenario;
        const chapterName = scenario.get<Chapter[]>(aliasRandomChapters)[0].info!.name;
        const topicName = scenario.get<Topic[]>(aliasRandomTopics)[0].name;
        scenario.set(aliasTopicName, topicName);
        scenario.set(aliasChapterName, chapterName);
        await this.cms.instruction(
            `Create A ${loType} in topic ${topicName}`,
            async function (this: CMSInterface) {
                await expandAChapter(this, chapterName);
                await expandATopic(this, topicName);
                await schoolAdminCreateALO(this, scenario, loType, undefined, topicName);
            }
        );
    }
);
Then(
    'school admin sees the new {string} on CMS',
    async function (this: IMasterWorld, loType: LOType): Promise<void> {
        const scenario = this.scenario;
        const topicName = scenario.get(aliasTopicName);
        const chapterName = scenario.get(aliasChapterName);
        const loName = scenario.get(aliasLOName);
        const bookUrl = scenario.get(aliasBookDetailsPage);

        await this.cms.instruction(`school admin go to ${bookUrl}`, async () => {
            await this.cms.page?.goto(bookUrl);
            await this.cms.waitForSkeletonLoading();
        });

        await expandAChapter(this.cms, chapterName);
        await expandATopic(this.cms, topicName);

        await this.cms.instruction(
            `See a new created ${loType} in topic ${topicName}`,
            async function (this: CMSInterface) {
                await this.page!.waitForSelector(loAndAssignmentByName(loName));
            }
        );
    }
);
Then(
    'teacher does not see the new {string} on Teacher App',
    async function (this: IMasterWorld, loType: LOType): Promise<void> {
        const scenario = this.scenario;
        const courseId = scenario.get(aliasCourseId);
        const courseName = scenario.get(aliasCourseName);
        const studentId = await this.learner.getUserId();
        const loName = scenario.get(aliasLOName);
        await this.teacher.instruction(
            `Go to course ${courseName} student tab`,
            async function (this: TeacherInterface) {
                await teacherGoesToStudyPlanDetails(this, courseId, studentId);
                await this.flutterDriver!.waitFor(
                    new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScreen)
                );
                await this.flutterDriver!.waitFor(
                    new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTab)
                );
                await this.flutterDriver!.reload();
            }
        );

        await this.teacher.instruction(
            `Not see a new created ${loType} in course ${courseName}`,
            async function (this: TeacherInterface) {
                await teacherNotSeeStudyPlanItem(this, courseName, loName);
            }
        );
    }
);
Then(
    'student does not see the new {string} on Learner App',
    async function (this: IMasterWorld, loType: LOType) {
        const scenario = this.scenario;
        const courseName = scenario.get(aliasCourseName);
        const topicName = scenario.get<Topic[]>(aliasRandomTopics)[0].name;
        const loName = scenario.get(aliasLOName);
        await this.learner.instruction(
            `Go to course ${courseName} detail`,
            async function (this: LearnerInterface) {
                await studentRefreshHomeScreen(this);
                await studentGoToCourseDetail(this, courseName);
            }
        );
        await this.learner.instruction(
            `Go to topic ${topicName} detail`,
            async function (this: LearnerInterface) {
                await studentGoToTopicDetail(this, topicName);
            }
        );
        await this.learner.instruction(
            `Not see ${loName} with ${loType} in ${topicName} detail`,
            async function (this: LearnerInterface) {
                await studentNotSeeStudyPlanItem(this, topicName, loName);
            }
        );
    }
);

Given(
    `teacher and student see the assignment in their apps`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const topicName = context.get<string>(aliasTopicName);
        const assignmentName = context.get<string>(aliasAssignmentName);
        const courseId = context.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();

        await this.teacher.instruction(`teacher see ${assignmentName}`, async function (teacher) {
            await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
            await teacherSeeStudyPlanItem(teacher, assignmentName);
        });

        await this.learner.instruction(`student see ${assignmentName}`, async function (learner) {
            await learner.instruction(
                `Go to course ${courseName} detail`,
                async function (learner) {
                    await studentRefreshHomeScreen(learner);
                    await studentGoToCourseDetail(learner, courseName);
                }
            );

            await learner.instruction(`Go to topic ${topicName} detail`, async function (learner) {
                await studentGoToTopicDetail(learner, topicName);
            });

            await learner.instruction(
                `Go to assignment ${assignmentName}`,
                async function (learner) {
                    await studentGoToAssignmentInBook(learner, topicName, assignmentName);
                }
            );
        });
    }
);

Then(
    'teacher sees the new {string} on Teacher App',
    async function (this: IMasterWorld, loType: LOType) {
        const scenario = this.scenario;
        const courseId = scenario.get(aliasCourseId);
        const courseName = scenario.get(aliasCourseName);
        const studentProfile = await this.learner.getProfile();

        await this.teacher.instruction(
            `Teacher goes to study plan detail of the student in ${courseName} course`,
            async () => {
                await teacherGoesToStudyPlanDetails(this.teacher, courseId, studentProfile.id);
            }
        );

        await this.teacher.instruction(
            `Teacher sees new study plan item type of ${loType} in ${courseName} course`,
            async () => {
                const name = getNameByLoType(scenario, loType);

                await teacherSeeStudyPlanItem(this.teacher, name);
            }
        );
    }
);

Then(
    'student sees the new {string} on Learner App',
    async function (this: IMasterWorld, loType: LOType) {
        const context = this.scenario;
        const courseName = context.get(aliasCourseName);
        const topic = context.get<Topic[]>(aliasRandomTopics)[0];

        await this.learner.instruction(
            `Go to course ${courseName} detail`,
            async function (learner) {
                await studentRefreshHomeScreen(learner);
                await studentGoToCourseDetail(learner, courseName);
            }
        );
        await this.learner.instruction(
            `Go to topic ${topic.name} detail`,
            async function (learner) {
                await studentGoToTopicDetail(learner, topic.name);
            }
        );
        await this.learner.instruction(
            `Student sees new study plan item type of ${loType} in ${topic.name}`,
            async () => {
                const name = getNameByLoType(context, loType);

                await studentSeeStudyPlanItem(this.learner, topic.name, name);
            }
        );
    }
);

When(
    'school admin creates a LO {string} in book',
    async function (this: IMasterWorld, loType: LOType): Promise<void> {
        const topicName = this.scenario.get(aliasTopicName);
        const loName = `${loType} ${genId()}`;

        await schoolAdminSelectCreateLO(this.cms, topicName);

        await schoolAdminSelectLOType(this.cms, loType);

        await this.cms.instruction(
            `Create A ${loType} with name ${loName} in topic ${topicName}`,
            async () => {
                await schoolAdminFillLOFormData(this.cms, loName);
                await this.cms.selectAButtonByAriaLabel(`Confirm`);
            }
        );

        this.scenario.set(aliasLOName, loName);
    }
);

Then(
    'school admin sees the new LO {string} created on CMS',
    async function (this: IMasterWorld, loType: LOType) {
        const loName = this.scenario.get(aliasLOName);
        const bookUrl = await this.scenario.get(aliasBookDetailsPage);

        await this.cms.waitingForLoadingIcon();
        await this.cms.waitForSkeletonLoading();

        await this.cms.instruction(`school admin see blank LO ${loType} detail page`, async () => {
            await this.cms.assertThePageTitle(`${loName}`);
        });

        await this.cms.instruction(`school admin go to ${bookUrl}`, async () => {
            await this.cms.page?.goto(bookUrl);
            await this.cms.waitForSkeletonLoading();
        });

        await this.cms.instruction(`school admin see LO ${loName} in book`, async () => {
            await this.cms.page?.waitForSelector(loAndAssignmentByName(loName));
        });
    }
);

When(
    'school admin creates a LO {string} with missing {string}',
    async function (this: IMasterWorld, loType: LOType, missingField: 'name' | 'type') {
        const topicName = this.scenario.get(aliasTopicName);

        await schoolAdminSelectCreateLO(this.cms, topicName);

        if (missingField !== 'type') await schoolAdminSelectLOType(this.cms, loType);

        if (missingField === 'type') {
            await this.cms.instruction("school admin don't see input to type LO name", async () => {
                await this.cms.page?.waitForSelector(formInput, {
                    state: 'detached',
                });
            });
        }

        await this.cms.selectAButtonByAriaLabel(`Confirm`);
    }
);

Then('school admin cannot create any LO', async function (this: IMasterWorld) {
    await this.cms.instruction(
        'school admin still sees dialog add LO with error message',
        async () => {
            await schoolAdminSeesErrorMessageField(this.cms, {
                wrapper: createLOTabRoot,
            });
        }
    );
});
