import {
    aliasCourseId,
    aliasCourseName,
    aliasExpectedChapterIndex,
    aliasExpectedTopicIndex,
    aliasMovedChapterIndex,
    aliasMovedChapterName,
    aliasRandomChapters,
    aliasRandomTopics,
    aliasStudyPlanName,
    aliasTopicsOfChapter,
} from '@legacy-step-definitions/alias-keys/syllabus';
import { delay, getExpectIndexAfterMoved } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';
import { MoveDirection, Position } from '@supports/types/cms-types';

import { teacherWaitingForStudyPlanListVisible } from './create-course-studyplan-definitions';
import { expandAllChapters } from './syllabus-content-book-create-definitions';
import { teacherScrollIntoTopic } from './syllabus-expand-collapse-topic-definitions';
import {
    getChapterWillBeMove,
    schoolAdminSeeChapterAtIndexInBookDetail,
    studentSeeChapterAtIndexInCourseDetail,
} from './syllabus-move-chapter-definitions';
import { schoolAdminMovesChapter } from './syllabus-move-chapter-definitions';
import { getOnScreenTopicNames } from './syllabus-move-topic-definitions';
import {
    schoolAdminSeeTopicAtIndexInStudyPlanDetail,
    schoolAdminSelectCourseStudyPlan,
    schoolAdminSelectStudyPlanOfStudent,
    schoolAdminSelectStudyPlanTabByType,
    schoolAdminWaitingStudyPlanDetailLoading,
} from './syllabus-study-plan-common-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import {
    getTopicsByChapterId,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    studentSeeChapterList,
} from './syllabus-utils';
import { Chapter, Topic } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given(
    'school admin selects a chapter is not at {string}',
    function (this: IMasterWorld, position: Position) {
        const context = this.scenario;
        const direction: MoveDirection = position === 'top' ? 'up' : 'down';

        return this.cms.instruction(
            `School admin selects the chapter is not at the ${position}`,
            async () => {
                const { moveIndex, name } = await getChapterWillBeMove(this.cms, direction);

                context.set(aliasMovedChapterName, name);
                context.set(aliasMovedChapterIndex, moveIndex);
                context.set(
                    aliasExpectedChapterIndex,
                    getExpectIndexAfterMoved(moveIndex, direction)
                );
            }
        );
    }
);

When(
    'school admin moves chapter {string}',
    async function (this: IMasterWorld, direction: MoveDirection) {
        const context = this.scenario;
        const movedChapterName = context.get<string>(aliasMovedChapterName);
        const movedChapter = context
            .get<Chapter[]>(aliasRandomChapters)
            .filter((chapter) => chapter.info!.name === movedChapterName)[0];
        const topicList = context.get<Topic[]>(aliasRandomTopics);

        await this.cms.instruction(
            `School admin moves the chapter ${movedChapterName} ${direction}`,
            async () => {
                await schoolAdminMovesChapter(this.cms, movedChapterName, direction);
            }
        );

        if (!topicList) return;

        const { topicsByChapterId } = getTopicsByChapterId(topicList, movedChapter.info!.id);

        await this.cms.instruction(
            `School admin expands all chapters to see all topics in book`,
            async () => {
                await expandAllChapters(this.cms, context);

                // need to wait for the chapter to fully expand and see the topic
                await delay(1000);

                const onScreenTopicNames = await getOnScreenTopicNames(this.cms);
                const expectedTopicIndex = onScreenTopicNames.findIndex(
                    (topicName) => topicName === topicsByChapterId[0].name
                );

                context.set(aliasExpectedTopicIndex, expectedTopicIndex);
            }
        );

        context.set(aliasTopicsOfChapter, topicsByChapterId);
    }
);

Then(
    'school admin sees that chapter is moved {string} on CMS',
    function (this: IMasterWorld, direction: MoveDirection) {
        const context = this.scenario;
        const movedChapterName = context.get<string>(aliasMovedChapterName);
        const expectedChapterIndex = context.get<number>(aliasExpectedChapterIndex);

        return this.cms.instruction(
            `School admin sees the chapter ${movedChapterName} is moved ${direction} at index ${expectedChapterIndex}`,
            () =>
                schoolAdminSeeChapterAtIndexInBookDetail(this.cms, {
                    name: movedChapterName,
                    index: expectedChapterIndex,
                })
        );
    }
);

Then(
    'student sees the chapter moved {string} in Course detail screen on Learner App',
    async function (this: IMasterWorld, direction: MoveDirection) {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const movedChapterName = context.get<string>(aliasMovedChapterName);
        const expectedChapterIndex = context.get<number>(aliasExpectedChapterIndex);

        await this.learner.instruction(
            'Student refreshes the home screen',
            studentRefreshHomeScreen
        );

        await this.learner.instruction(
            `Student goes to the ${courseName} course details screen`,
            (learner) => studentGoToCourseDetail(learner, courseName)
        );

        await this.learner.instruction(
            `Student sees the chapter is moved ${direction}`,
            async function (learner) {
                await studentSeeChapterList(learner);
                await studentSeeChapterAtIndexInCourseDetail(learner, {
                    name: movedChapterName,
                    index: expectedChapterIndex,
                });
            }
        );
    }
);

Then(
    'school admin sees the topic of chapter moved {string} in master study plan detail page',
    async function (direction: MoveDirection) {
        const context = this.scenario;
        const studyPlanName = context.get<string>(aliasStudyPlanName);
        const topicsOfChapter = context.get<Topic[]>(aliasTopicsOfChapter);
        let expectedTopicIndex = context.get<number>(aliasExpectedTopicIndex);

        await this.cms.instruction(
            `School admin goes to ${studyPlanName} master study plan detail page`,
            async () => {
                await schoolAdminSelectCourseStudyPlan(this.cms, studyPlanName);
                await schoolAdminWaitingStudyPlanDetailLoading(this.cms);
            }
        );

        for (const topic of topicsOfChapter) {
            await this.cms.instruction(
                `School admin sees the topic ${topic.name} is moved ${direction} in master study plan detail page`,
                async () => {
                    await schoolAdminSeeTopicAtIndexInStudyPlanDetail(this.cms, {
                        name: topic.name,
                        index: expectedTopicIndex,
                    });

                    expectedTopicIndex = expectedTopicIndex + 1;
                }
            );
        }
    }
);

Then(
    'school admin sees the topic of chapter moved {string} in individual study plan detail page',
    async function (direction: MoveDirection) {
        const context = this.scenario;
        const studyPlanName = context.get<string>(aliasStudyPlanName);
        const topicsOfChapter = context.get<Topic[]>(aliasTopicsOfChapter);
        let expectedTopicIndex = context.get<number>(aliasExpectedTopicIndex);
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

        for (const topic of topicsOfChapter) {
            await this.cms.instruction(
                `School admin sees the topic ${topic.name} is moved ${direction} in individual study plan detail page`,
                async () => {
                    await schoolAdminSeeTopicAtIndexInStudyPlanDetail(this.cms, {
                        name: topic.name,
                        index: expectedTopicIndex,
                    });

                    expectedTopicIndex = expectedTopicIndex + 1;
                }
            );
        }
    }
);

Then(
    'teacher sees the topic of chapter moved {string} in student study plan detail page',
    async function (direction: MoveDirection) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);
        const topicsOfChapter = context.get<Topic[]>(aliasTopicsOfChapter);
        let expectedTopicIndex = context.get<number>(aliasExpectedTopicIndex);
        const studentId = await this.learner.getUserId();

        await this.teacher.instruction(
            `Teacher goes to course ${courseId} people tab from home page`,
            async () => {
                await teacherGoesToStudyPlanDetails(this.teacher, courseId, studentId);
                await teacherWaitingForStudyPlanListVisible(this.teacher);
            }
        );

        for (const topic of topicsOfChapter) {
            await this.teacher.instruction(
                `Teacher sees the topic ${topic.name} moved ${direction}`,
                async (teacher: TeacherInterface) => {
                    await teacherScrollIntoTopic(teacher, topic.name, expectedTopicIndex);

                    expectedTopicIndex = expectedTopicIndex + 1;
                }
            );
        }
    }
);
