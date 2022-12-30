import {
    loAndAssignmentByName,
    studyPlanItemByName,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import { studyPlanName } from '@legacy-step-definitions/cms-selectors/course';
import { DecideActions, LOPlace } from '@legacy-step-definitions/types/common';
import { getRandomElement } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import {
    CMSInterface,
    IMasterWorld,
    LearnerInterface,
    LOType,
    TeacherInterface,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ActionOptions } from '@supports/types/cms-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasLOName,
    aliasLONameSelected,
    aliasRandomAssignments,
    aliasRandomChapters,
    aliasRandomLearningObjectives,
    aliasRandomTaskAssignments,
    aliasRandomTopics,
    aliasStudyPlanName,
} from './alias-keys/syllabus';
import { schoolAdminGotoCourseDetail } from './create-course-studyplan-definitions';
import { expandAChapter, expandATopic } from './syllabus-content-book-create-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    schoolAdminClickLOsItemOption,
    schoolAdminClickOptionOnHeader,
    schoolAdminDeletesAssignment,
    schoolAdminDeletesLO,
} from './syllabus-delete-learning-objective-definitions';
import {
    schoolAdminGoesToStudentStudyPlanDetailPage,
    schoolAdminSelectCourseStudyPlan,
    schoolAdminSelectStudyPlanTabByType,
} from './syllabus-study-plan-common-definitions';
import {
    studentNotSeeStudyPlanItem,
    studentSeeStudyPlanItem,
    teacherGoesToStudyPlanDetails,
    teacherNotSeeStudyPlanItem,
    teacherSeeStudyPlanItem,
} from './syllabus-study-plan-upsert-definitions';
import {
    getLOTypeValue,
    schoolAdminNotSeeLOsItemInBook,
    schoolAdminSeeLOsItemInBook,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import { schoolAdminChooseTabInCourseDetail } from 'test-suites/common/step-definitions/course-definitions';
import {
    Assignment,
    Chapter,
    LearningObjective,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { convertOneOfStringTypeToArray } from 'test-suites/squads/syllabus/utils/common';

When(
    'school admin deletes the {string}',
    async function (this: IMasterWorld, loType: LOType): Promise<void> {
        const context = this.scenario;
        const chapter = context.get<Chapter[]>(aliasRandomChapters)[0];
        const topic = context.get<Topic[]>(aliasRandomTopics)[0];
        const loList = context.get<LearningObjective[]>(aliasRandomLearningObjectives);
        const assignmentList = context.get<Assignment[]>(aliasRandomAssignments);
        const taskAssignmentList = context.get<Assignment[]>(aliasRandomTaskAssignments);

        await this.cms.instruction(
            `School admin chooses ${chapter.info!.name} and ${
                topic.name
            } include ${loType} want to delete`,
            async function (this: CMSInterface) {
                await expandAChapter(this, chapter.info!.name);
                await expandATopic(this, topic.name);
            }
        );

        await this.cms.instruction(
            `School admin deletes the ${loType}`,
            async function (this: CMSInterface) {
                const topicId = topic.id;
                switch (loType) {
                    case 'assignment':
                        await schoolAdminDeletesAssignment(this, context, loType, {
                            topicId,
                            assignmentList,
                        });
                        break;

                    case 'task assignment':
                        await schoolAdminDeletesAssignment(this, context, loType, {
                            topicId,
                            assignmentList: taskAssignmentList,
                        });
                        break;

                    default:
                        await schoolAdminDeletesLO(this, context, loType, {
                            topicId,
                            loList,
                        });
                        break;
                }
            }
        );
    }
);

Then(
    'school admin does not see the {string} at book detail page on CMS',
    async function (this: IMasterWorld, loType: LOType) {
        const context = this.scenario;
        const loName = context.get<string>(aliasLOName);

        await this.cms.instruction(
            `School admin does not see ${loName} type of ${loType}`,
            async function (this: CMSInterface) {
                try {
                    await this.page?.waitForSelector(loAndAssignmentByName(loName), {
                        state: 'hidden',
                    });
                } catch (error) {
                    throw Error(`Warning: Do not want to see but ${loName} is displayed`);
                }
            }
        );
    }
);

Then(
    'school admin does not see the {string} at study plan v2 tab Master on CMS',
    async function (this: IMasterWorld, loType: LOType): Promise<void> {
        const context = this.scenario;
        const loName = context.get<string>(aliasLOName);
        const courseId = context.get<string>(aliasCourseId);

        await this.cms.instruction(`User go to the course: ${courseId} detail`, async () => {
            await schoolAdminGotoCourseDetail(this.cms, courseId);
        });

        await this.cms.instruction(
            `School admin chooses student study plan v2: ${studyPlanName}`,
            async (cms) => {
                await schoolAdminChooseTabInCourseDetail(cms, 'studyPlan');
            }
        );

        await this.cms.instruction(
            `School admin goes to master study plan detail page`,
            async (cms) => {
                const studyPlanName = context.get<string>(aliasStudyPlanName);
                await schoolAdminSelectCourseStudyPlan(cms, studyPlanName);
                await cms.waitingForLoadingIcon();
                await cms.waitForSkeletonLoading();
            }
        );

        await this.cms.instruction(
            `School admin does not see ${loName} type of ${loType}`,
            async function (this: CMSInterface) {
                try {
                    await this.page?.waitForSelector(studyPlanItemByName(loName), {
                        state: 'hidden',
                    });
                } catch (error) {
                    throw Error(`Warning: Do not want to see but ${loName} is displayed`);
                }
            }
        );
    }
);

Then(
    'school admin does not see the {string} at study plan v2 tab Individual on CMS',
    async function (this: IMasterWorld, loType: LOType): Promise<void> {
        const context = this.scenario;
        const loName = context.get<string>(aliasLOName);

        await this.cms.instruction(`School admin goes back`, async (cms) => {
            await cms.page?.goBack();
        });

        await this.cms.instruction(
            `School admin selects individual studyPlan: ${studyPlanName}`,
            async (cms) => {
                await schoolAdminSelectStudyPlanTabByType(cms, 'student');
                const studentProfile = context.get<UserProfileEntity>(
                    learnerProfileAliasWithAccountRoleSuffix('student')
                );
                const studyPlanName = context.get<string>(aliasStudyPlanName);
                await schoolAdminGoesToStudentStudyPlanDetailPage(cms, {
                    name: studentProfile.name,
                    studyPlanName: studyPlanName,
                });
            }
        );

        await this.cms.instruction(
            `School admin does not see ${loName} type of ${loType}`,
            async function (this: CMSInterface) {
                try {
                    await this.page?.waitForSelector(studyPlanItemByName(loName), {
                        state: 'hidden',
                    });
                } catch (error) {
                    throw Error(`Warning: Do not want to see but ${loName} is displayed`);
                }
            }
        );
    }
);

Then(
    'student still sees the {string} on Learner App',
    async function (this: IMasterWorld, loType: LOType) {
        const context = this.scenario;
        const courseName = context.get(aliasCourseName);
        const topicName = context.get<Topic[]>(aliasRandomTopics)[0].name;
        const loName = context.get<string>(aliasLOName);

        await this.learner.instruction(
            'Student refreshes home screen',
            async function (this: LearnerInterface) {
                await studentRefreshHomeScreen(this);
            }
        );

        await this.learner.instruction(
            `Student goes to ${courseName} detail`,
            async function (this: LearnerInterface) {
                await studentGoToCourseDetail(this, courseName);
            }
        );

        await this.learner.instruction(
            `Student goes to ${topicName} detail`,
            async function (this: LearnerInterface) {
                await studentGoToTopicDetail(this, topicName);
            }
        );

        await this.learner.instruction(
            `Student still sees ${loName} type of ${loType} in ${topicName}`,
            async function (this: LearnerInterface) {
                await studentSeeStudyPlanItem(this, topicName, loName);
            }
        );
    }
);

Then(
    'teacher still sees the {string} on Teacher App',
    async function (this: IMasterWorld, loType: LOType) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);
        const courseName = context.get<string>(aliasCourseName);
        const studentId = await this.learner.getUserId();
        const loName = context.get<string>(aliasLOName);

        await this.teacher.instruction(
            `Go to ${courseName} detail has study plan of student by URL`,
            async function (this: TeacherInterface) {
                await teacherGoesToStudyPlanDetails(this, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `Teacher still sees ${loName} type of ${loType} in ${courseName}`,
            async function (this: TeacherInterface) {
                await teacherSeeStudyPlanItem(this, loName);
            }
        );
    }
);

Then(
    'student does not see the {string} on Learner App',
    async function (this: IMasterWorld, loType: LOType) {
        const context = this.scenario;
        const courseName = context.get(aliasCourseName);
        const topicName = context.get<Topic[]>(aliasRandomTopics)[0].name;
        const loName = context.get<string>(aliasLOName);

        await this.learner.instruction(
            'Student refreshes home screen',
            async function (this: LearnerInterface) {
                await studentRefreshHomeScreen(this);
            }
        );

        await this.learner.instruction(
            `Student goes to ${courseName} detail`,
            async function (this: LearnerInterface) {
                await studentGoToCourseDetail(this, courseName);
            }
        );

        await this.learner.instruction(
            `Student goes to ${topicName} detail`,
            async function (this: LearnerInterface) {
                await studentGoToTopicDetail(this, topicName);
            }
        );

        await this.learner.instruction(
            `Student does not see ${loName} type of ${loType}`,
            async function (this: LearnerInterface) {
                await studentNotSeeStudyPlanItem(this, topicName, loName);
            }
        );
    }
);

Then(
    'teacher does not see the {string} on Teacher App',
    async function (this: IMasterWorld, loType: LOType) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);
        const courseName = context.get<string>(aliasCourseName);
        const studentId = await this.learner.getUserId();
        const loName = context.get<string>(aliasLOName);

        await this.teacher.instruction(
            `Go to ${courseName} detail has study plan of student by URL`,
            async function (this: TeacherInterface) {
                await teacherGoesToStudyPlanDetails(this, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `Teacher does not see ${loName} type of ${loType} in ${courseName}`,
            async function (this: TeacherInterface) {
                await teacherNotSeeStudyPlanItem(this, loName, courseName);
            }
        );
    }
);

Given(
    'school admin select a LO {string} in {string} to delete',
    async function (this: IMasterWorld, loType: LOType, place: LOPlace) {
        const list = convertOneOfStringTypeToArray<LOType>(loType);

        const loList = this.scenario.get<LearningObjective[]>(aliasRandomLearningObjectives);
        const type = getRandomElement<LOType>(list);

        const { loTypeNumber } = await getLOTypeValue({ loType: type });

        const {
            info: { name: loName },
        } = loList.find((item) => item.type === loTypeNumber) as LearningObjective;

        this.scenario.set(aliasLONameSelected, loName);

        await this.cms.instruction(`school admin will select ${loName} to delete`, async () => {
            await this.cms.page?.waitForSelector(loAndAssignmentByName(loName));
        });

        if (place === 'book') {
            await this.cms.instruction('school admin select delete option', async () => {
                await schoolAdminClickLOsItemOption(this.cms, loName, ActionOptions.DELETE);
            });

            return;
        }

        await this.cms.instruction(`school admin go to ${loName} detail page`, async () => {
            await schoolAdminClickLOByName(this.cms, loName);
            await this.cms.waitingForLoadingIcon();
        });

        await this.cms.instruction('school admin select delete option', async () => {
            await schoolAdminClickOptionOnHeader(this.cms, ActionOptions.DELETE);
        });
    }
);

When(
    'school admin {string} the deleting LO process',
    async function (this: IMasterWorld, action: DecideActions) {
        const name = this.scenario.get(aliasLONameSelected);

        await this.cms.instruction(`school admin ${action} delete LO ${name}`, async () => {
            if (action === 'cancels') return await this.cms.cancelDialogAction();

            await this.cms.confirmDialogAction();
        });
    }
);

Then('school admin does not see the deleted LO in book', async function (this: IMasterWorld) {
    await this.cms.waitingForLoadingIcon();
    await this.cms.waitForSkeletonLoading();

    const name = this.scenario.get(aliasLONameSelected);

    await this.cms.instruction(`School admin does not see ${name}`, async () => {
        await schoolAdminNotSeeLOsItemInBook(this.cms, name);
    });
});

Then(
    'school admin still sees the LO in {string}',
    async function (this: IMasterWorld, place: 'book' | 'detail') {
        const name = this.scenario.get(aliasLONameSelected);

        const instruction = `school admin still sees LO ${name} in ${place}`;

        if (place === 'book') {
            await this.cms.instruction(instruction, async () => {
                await schoolAdminSeeLOsItemInBook(this.cms, name);
            });

            return;
        }

        await this.cms.instruction(instruction, async () => {
            await this.cms.assertThePageTitle(name);
        });
    }
);
