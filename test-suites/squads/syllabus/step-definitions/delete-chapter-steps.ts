import { DecideActions } from '@legacy-step-definitions/types/common';
import { asyncForEach, getRandomElement } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import {
    aliasChapterName,
    aliasChapterNames,
    aliasCourseName,
    aliasDeletedChapter,
    aliasDeletedTopics,
    aliasRandomChapters,
    aliasRandomTopics,
    aliasStudyPlanName,
    aliasTopicNames,
} from './alias-keys/syllabus';
import { schoolAdminSeeChapter } from './create-chapter-definitions';
import {
    schoolAdminConfirmsDeleteChapter,
    schoolAdminDoesNotSeeChapter,
    studentDoesNotSeeDeletedChapterOnCourse,
} from './syllabus-delete-chapter-definitions';
import { schoolAdminNotSeeTopicInStudyPlanDetail } from './syllabus-delete-topic-definitions';
import { schoolAdminClickChapterOption } from './syllabus-rename-chapter-definitions';
import {
    schoolAdminSeeTopicAtIndexInStudyPlanDetail,
    schoolAdminSelectCourseStudyPlan,
    schoolAdminSelectStudyPlanOfStudent,
    schoolAdminSelectStudyPlanTabByType,
    schoolAdminWaitingStudyPlanDetailLoading,
} from './syllabus-study-plan-common-definitions';
import { teacherDoesNotSeesDeletedTopicsOnTeacherApp } from './syllabus-study-plan-upsert-steps';
import {
    getTopicsByChapterId,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import { Chapter, Topic } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(`school admin deletes a chapter`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;
    const chapterList = context.get<Chapter[]>(aliasRandomChapters);
    const chapter = getRandomElement(chapterList);

    context.set(aliasChapterName, chapter.info!.name);

    context.set(aliasDeletedChapter, chapter);

    await this.cms.instruction(`school admin chooses delete chapter options`, async () => {
        await schoolAdminClickChapterOption(this.cms, chapter.info!.name, ActionOptions.DELETE);
    });

    await this.cms.instruction(`school admin chooses delete chapter option`, async () => {
        const deletedChapter = context.get<Chapter>(aliasDeletedChapter);
        const chapterNames = context.get<string[]>(aliasChapterNames);
        const topicList = context.get<Topic[]>(aliasRandomTopics);
        const newChapterNames = chapterNames.filter(function (chapter) {
            return chapter !== deletedChapter.info!.name;
        });
        const { topicsByChapterId, remainedTopicNames } = getTopicsByChapterId(
            topicList,
            deletedChapter.info!.id
        );

        context.set(aliasChapterNames, newChapterNames);
        context.set(aliasTopicNames, remainedTopicNames);
        context.set(aliasDeletedTopics, topicsByChapterId);
    });

    await this.cms.instruction(`school admin confirms delete chapter`, async () => {
        await schoolAdminConfirmsDeleteChapter(this.cms);
    });
});

Then(
    `school admin does not see the chapter on CMS`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const chapter = context.get<Chapter>(aliasDeletedChapter);

        await this.cms.instruction(
            `school admin does not see the chapter ${chapter.info!.name} on CMS`,
            async () => {
                await schoolAdminDoesNotSeeChapter(this.cms, chapter.info!.name);
            }
        );
    }
);

Then(
    `teacher does not see topics which belong to that chapter on Teacher App`,
    teacherDoesNotSeesDeletedTopicsOnTeacherApp
);

Then(
    `student does not see the deleted chapter in Course detail screen on Learner App`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const deletedChapter = context.get<Chapter>(aliasDeletedChapter);

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
            `Student does not see the deleted chapter ${
                deletedChapter.info!.name
            } in ${courseName}`,
            async function (learner) {
                await studentDoesNotSeeDeletedChapterOnCourse(
                    learner,
                    context,
                    deletedChapter.info!.name
                );
            }
        );
    }
);

Then(
    'school admin does not see topics of chapter in master study plan detail page',
    async function () {
        const context = this.scenario;
        const remainedTopicNames = context.get<string[]>(aliasTopicNames);
        const deletedTopicList = context.get<Topic[]>(aliasDeletedTopics);
        const studyPlanName = context.get(aliasStudyPlanName);

        await this.cms.instruction(
            `School admin goes the ${studyPlanName} master study plan detail page`,
            async () => {
                await schoolAdminSelectCourseStudyPlan(this.cms, studyPlanName);
                await schoolAdminWaitingStudyPlanDetailLoading(this.cms);
            }
        );

        await asyncForEach(deletedTopicList, async (deletedTopic) => {
            await this.cms.instruction(
                `School admin does not see topic ${deletedTopic.name} in master study plan detail page`,
                async () => {
                    await schoolAdminNotSeeTopicInStudyPlanDetail(this.cms, deletedTopic.name);
                }
            );
        });

        await asyncForEach(remainedTopicNames, async (topicName, index) => {
            await this.cms.instruction(
                `School admin still sees topic ${topicName} is remained`,
                async () => {
                    await schoolAdminSeeTopicAtIndexInStudyPlanDetail(this.cms, {
                        name: topicName,
                        index,
                    });
                }
            );
        });
    }
);

Then(
    'school admin does not see topics of chapter in individual study plan detail page',
    async function () {
        const context = this.scenario;
        const remainedTopicNames = context.get<string[]>(aliasTopicNames);
        const deletedTopicList = context.get<Topic[]>(aliasDeletedTopics);
        const studyPlanName = context.get(aliasStudyPlanName);

        const { name } = await this.learner.getProfile();

        await this.cms.instruction(
            'School admin selects the individual study plan tab',
            async () => {
                await this.cms.page?.goBack();
                await schoolAdminSelectStudyPlanTabByType(this.cms, 'student');
                await this.cms.waitForSkeletonLoading();
            }
        );

        await this.cms.instruction(
            `School admin goes to the study plan ${studyPlanName} of student ${name}`,
            async () => {
                await schoolAdminSelectStudyPlanOfStudent(this.cms, name, studyPlanName);
                await schoolAdminWaitingStudyPlanDetailLoading(this.cms);
            }
        );

        await asyncForEach(deletedTopicList, async (deletedTopic) => {
            await this.cms.instruction(
                `School admin does not see topic ${deletedTopic.name} in individual study plan detail page`,
                async () => {
                    await schoolAdminNotSeeTopicInStudyPlanDetail(this.cms, deletedTopic.name);
                }
            );
        });

        await asyncForEach(remainedTopicNames, async (topicName, index) => {
            await this.cms.instruction(
                `School admin still sees topic ${topicName} is remained`,
                async () => {
                    await schoolAdminSeeTopicAtIndexInStudyPlanDetail(this.cms, {
                        name: topicName,
                        index,
                    });
                }
            );
        });
    }
);

Given('school admin selects a chapter in book to delete', async function (this: IMasterWorld) {
    const chapterName = this.scenario.get(aliasChapterName);

    await this.cms.instruction(
        `school select delete in menu option of chapter ${chapterName}`,
        async () => {
            await schoolAdminClickChapterOption(this.cms, chapterName, ActionOptions.DELETE);
        }
    );
});

When(
    'school admin {string} the deleting chapter process',
    async function (this: IMasterWorld, action: DecideActions) {
        await this.cms.instruction(`school admin ${action} delete chapter`, async () => {
            if (action === 'cancels') return await this.cms.selectAButtonByAriaLabel('Cancel');

            await schoolAdminConfirmsDeleteChapter(this.cms);
        });
    }
);

Then('school admin does not see the deleted chapter in book', async function (this: IMasterWorld) {
    const chapterName = this.scenario.get(aliasChapterName);

    await this.cms.instruction(`school admin don't see chapter ${chapterName}`, async () => {
        await schoolAdminDoesNotSeeChapter(this.cms, chapterName);
    });
});

Then('school admin still sees the chapter in book', async function (this: IMasterWorld) {
    const chapterName = this.scenario.get(aliasChapterName);

    await this.cms.instruction(`school admin still sees chapter ${chapterName}`, async () => {
        await schoolAdminSeeChapter(this.cms, chapterName);
    });
});
