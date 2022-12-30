import { DecideActions } from '@legacy-step-definitions/types/common';
import { asyncForEach } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import {
    aliasCourseName,
    aliasDeletedTopics,
    aliasRandomTopics,
    aliasStudyPlanName,
    aliasTopicName,
    aliasTopicNames,
} from './alias-keys/syllabus';
import { schoolAdminSeeTopicByName } from './syllabus-create-topic-definitions';
import {
    schoolAdminChoosesDeleteTopic,
    schoolAdminClicksTopicOptions,
    schoolAdminConfirmsDeleteTopic,
    schoolAdminDoesNotSeeTopic,
    schoolAdminNotSeeTopicInStudyPlanDetail,
    schoolAdminSeeTotalTopicInStudyPlanDetail,
    schoolAdminSelectTopicOption,
    studentNotSeeTopicOnCourse,
    studentSeeTopicOnCourse,
} from './syllabus-delete-topic-definitions';
import {
    schoolAdminSelectCourseStudyPlan,
    schoolAdminSelectStudyPlanOfStudent,
    schoolAdminSelectStudyPlanTabByType,
    schoolAdminWaitingStudyPlanDetailLoading,
} from './syllabus-study-plan-common-definitions';
import { teacherDoesNotSeesDeletedTopicsOnTeacherApp } from './syllabus-study-plan-upsert-steps';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';
import { Topic } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(`school admin deletes a topic`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;

    const topicList = context.get<Topic[]>(aliasRandomTopics);

    await this.cms.instruction(`school admin chooses topic options`, async function (cms) {
        const { topicNameOpened } = await schoolAdminClicksTopicOptions(cms, context);
        let deletedTopics: Topic[] = [];
        let remainTopicNames: string[] = [];

        for (const topic of topicList) {
            if (topic.name === topicNameOpened) {
                deletedTopics = [...deletedTopics, topic];
            } else {
                remainTopicNames = [...remainTopicNames, topic.name];
            }
        }

        context.set(aliasTopicName, topicNameOpened);
        context.set(aliasTopicNames, remainTopicNames);
        context.set(aliasDeletedTopics, deletedTopics);
    });

    await this.cms.instruction(`school admin chooses delete topic option`, async function (cms) {
        await schoolAdminChoosesDeleteTopic(cms);
    });

    await this.cms.instruction(`school admin confirms delete topic`, async function (cms) {
        await schoolAdminConfirmsDeleteTopic(cms);
    });
});

Then(
    `school admin does not see that topic on CMS`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const topicName = context.get<Topic[]>(aliasDeletedTopics)[0].name;

        await this.cms.instruction(
            `school admin does not see the topic ${topicName} on CMS`,
            async function (cms) {
                await schoolAdminDoesNotSeeTopic(cms, topicName);
            }
        );
    }
);

Then(
    `teacher does not see deleted topic on Teacher App`,
    teacherDoesNotSeesDeletedTopicsOnTeacherApp
);

Then(
    `student does not see topic in Course detail screen on Learner App`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const deletedTopicName = this.scenario.get<Topic[]>(aliasDeletedTopics)[0].name;
        const remainTopicNames = this.scenario.get<string[]>(aliasTopicNames);

        await this.learner.instruction('Refresh home screen', async function (learner) {
            await studentRefreshHomeScreen(learner);
        });

        await this.learner.instruction(
            `Go to course ${courseName} detail`,
            async function (learner) {
                await studentGoToCourseDetail(learner, courseName);
            }
        );

        await this.learner.instruction(
            `Student does not see topic ${deletedTopicName} in ${courseName}`,
            async function (learner) {
                await studentNotSeeTopicOnCourse(learner, deletedTopicName);
            }
        );

        await asyncForEach(remainTopicNames, async (topicName) => {
            await this.learner.instruction(`Student still see the topic ${topicName}`, async () => {
                await studentSeeTopicOnCourse(this.learner, topicName);
            });
        });
    }
);

Then('school admin does not see that topic on master study plan CMS', async function () {
    const deleteTopicName = this.scenario.get<Topic[]>(aliasDeletedTopics)[0].name;
    const remainTopicNames = this.scenario.get<string[]>(aliasTopicNames);
    const studyPlanName = this.scenario.get(aliasStudyPlanName);

    await this.cms.instruction('User go the course study plan detail', async () => {
        await schoolAdminSelectCourseStudyPlan(this.cms, studyPlanName);
        await schoolAdminWaitingStudyPlanDetailLoading(this.cms);
    });

    await this.cms.instruction(`User not see topic ${deleteTopicName} in SP detail`, async () => {
        await schoolAdminNotSeeTopicInStudyPlanDetail(this.cms, deleteTopicName);
    });

    await this.cms.instruction(`User see ${remainTopicNames.length} remain topics`, async () => {
        await schoolAdminSeeTotalTopicInStudyPlanDetail(this.cms, remainTopicNames.length);
    });
});

Then('school admin does not see that topic on individual study plan CMS', async function () {
    const deleteTopicName = this.scenario.get<Topic[]>(aliasDeletedTopics)[0].name;
    const remainTopicNames = this.scenario.get<string[]>(aliasTopicNames);
    const studyPlanName = this.scenario.get(aliasStudyPlanName);

    const { name } = await this.learner.getProfile();

    await this.cms.instruction('User select the student study plan tab', async () => {
        await this.cms.page?.goBack();
        await schoolAdminSelectStudyPlanTabByType(this.cms, 'student');
        await this.cms.waitForSkeletonLoading();
    });

    await this.cms.instruction(
        `User goes to the study plan ${studyPlanName} of student ${name}`,
        async () => {
            await schoolAdminSelectStudyPlanOfStudent(this.cms, name, studyPlanName);
            await schoolAdminWaitingStudyPlanDetailLoading(this.cms);
        }
    );

    await this.cms.instruction(`User not see topic ${deleteTopicName} in SP detail`, async () => {
        await schoolAdminNotSeeTopicInStudyPlanDetail(this.cms, deleteTopicName);
    });

    await this.cms.instruction(`User see ${remainTopicNames.length} remain topics`, async () => {
        await schoolAdminSeeTotalTopicInStudyPlanDetail(this.cms, remainTopicNames.length);
    });
});

Given('school admin selects a topic in book to delete', async function (this: IMasterWorld) {
    const topicName = this.scenario.get(aliasTopicName);
    await this.cms.instruction(
        `school admin select delete in panel option of topic ${topicName}`,
        async () => {
            await schoolAdminSelectTopicOption(this.cms, topicName, ActionOptions.DELETE);
        }
    );
});

When(
    'school admin {string} the deleting topic process',
    async function (this: IMasterWorld, action: DecideActions) {
        await this.cms.instruction(`school admin ${action} delete topic`, async (cms) => {
            if (action === 'cancels') return await this.cms.selectAButtonByAriaLabel('Cancel');

            await schoolAdminConfirmsDeleteTopic(cms);
        });
    }
);

Then('school admin does not see the deleted topic in book', async function (this: IMasterWorld) {
    const topicName = this.scenario.get(aliasTopicName);

    await this.cms.instruction(
        `school admin does not see the topic ${topicName} in book`,
        async function (cms) {
            await schoolAdminDoesNotSeeTopic(cms, topicName);
        }
    );
});

Then('school admin still sees the topic in book', async function (this: IMasterWorld) {
    const topicName = this.scenario.get(aliasTopicName);

    await this.cms.instruction(
        `school admin still sees the topic ${topicName} in book`,
        async () => {
            await schoolAdminSeeTopicByName(this.cms, topicName);
        }
    );
});
