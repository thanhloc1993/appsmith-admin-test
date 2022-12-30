import { getExpectIndexAfterMoved } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';
import { MoveDirection, Position } from '@supports/types/cms-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasExpectedTopicIndex,
    aliasRandomChapters,
    aliasRandomTopics,
    aliasTopicName,
} from './alias-keys/syllabus';
import { teacherScrollIntoTopic } from './syllabus-expand-collapse-topic-definitions';
import {
    schoolAdminGetTopicWillBeMove,
    schoolAdminSeeTopicAtIndexInBookDetail,
    schoolAdminMovesTopic,
    studentAssertsTopicPositionAfterMove,
} from './syllabus-move-topic-definitions';
import { schoolAdminSeeTopicAtIndexInStudyPlanDetail } from './syllabus-study-plan-common-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import {
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    studentSeeChapterList,
} from './syllabus-utils';
import { Chapter, Topic } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given(
    'school admin selects a topic is not at {string}',
    function (this: IMasterWorld, position: Position) {
        const direction: MoveDirection = position === 'top' ? 'up' : 'down';
        return this.cms.instruction(
            `School admin selects the topic that is not at the ${position}`,
            async () => {
                const { name, moveIndex } = await schoolAdminGetTopicWillBeMove(
                    this.cms,
                    direction
                );
                this.scenario.set(aliasTopicName, name);
                this.scenario.set(
                    aliasExpectedTopicIndex,
                    getExpectIndexAfterMoved(moveIndex, direction)
                );
            }
        );
    }
);

When('school admin moves topic {string}', function (this: IMasterWorld, direction: MoveDirection) {
    const topicName = this.scenario.get(aliasTopicName);

    return this.cms.instruction(`School admin moves the topic ${topicName} ${direction}`, (cms) =>
        schoolAdminMovesTopic(cms, topicName, direction)
    );
});

Then(
    'school admin sees that topic is moved {string} on CMS',
    function (this: IMasterWorld, direction: MoveDirection) {
        const movedTopicName = this.scenario.get(aliasTopicName);
        const expectedTopicIndex = this.scenario.get<number>(aliasExpectedTopicIndex);

        return this.cms.instruction(
            `School admin sees the topic ${movedTopicName} being moved ${direction} at index ${expectedTopicIndex}`,
            async () => {
                await schoolAdminSeeTopicAtIndexInBookDetail(
                    this.cms,
                    movedTopicName,
                    expectedTopicIndex
                );
            }
        );
    }
);

Then(
    'student sees the topic moved {string} in Course detail screen on Learner App',
    async function (this: IMasterWorld, direction: MoveDirection) {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);

        await this.learner.instruction(
            'Student refreshes the home screen',
            studentRefreshHomeScreen
        );

        await this.learner.instruction(
            `Student goes to the ${courseName} course details screen`,
            (learner) => studentGoToCourseDetail(learner, courseName)
        );

        await this.learner.instruction(
            `Student sees the topic being moved ${direction}`,
            async function (learner) {
                await studentSeeChapterList(learner);
                await studentAssertsTopicPositionAfterMove(learner, context, direction);
            }
        );
    }
);
Then(
    'teacher sees the topic moved {string} in student study plan detail page',
    async function (this: IMasterWorld, direction: MoveDirection) {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const courseId = context.get<string>(aliasCourseId);
        const movedTopicName = context.get<string>(aliasTopicName);
        const studentId = await this.learner.getUserId();
        const { info: chapterInfo } = context.get<Chapter[]>(aliasRandomChapters)[0];
        const createdChapterId = chapterInfo!.id;

        const createdTopics = context
            .get<Topic[]>(aliasRandomTopics)
            .filter((topic) => topic.chapterId === createdChapterId);
        let topicPosition = 0;
        if (direction === 'down') {
            topicPosition = createdTopics.length - 1;
        }

        await this.teacher.instruction(
            `teacher goes to course ${courseName} people tab from home page`,
            async function (this: TeacherInterface) {
                await teacherGoesToStudyPlanDetails(this, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `Student sees the topic being moved ${direction}`,
            async (teacher: TeacherInterface) =>
                teacherScrollIntoTopic(teacher, movedTopicName, topicPosition)
        );
    }
);

Then(
    'school admin sees the topic is moved {string} in the master study plan detail',
    async function (direction: MoveDirection) {
        const context = this.scenario;
        const movedTopicName = context.get<string>(aliasTopicName);
        const { info: chapterInfo } = context.get<Chapter[]>(aliasRandomChapters)[0];
        const createdChapterId = chapterInfo!.id;

        const createdTopics = context
            .get<Topic[]>(aliasRandomTopics)
            .filter((topic) => topic.chapterId === createdChapterId);
        let topicPosition = 0;
        if (direction === 'down') {
            topicPosition = createdTopics.length - 1;
        }

        await this.cms.instruction(
            `School admin sees the topic ${movedTopicName} is moved ${direction} in master study plan detail page`,
            async () => {
                await schoolAdminSeeTopicAtIndexInStudyPlanDetail(this.cms, {
                    name: movedTopicName,
                    index: topicPosition,
                });
            }
        );
    }
);

Then(
    'school admin sees the topic is moved {string} in the individual study plan detail',
    async function (direction: MoveDirection) {
        const context = this.scenario;
        const movedTopicName = context.get<string>(aliasTopicName);
        const { info: chapterInfo } = context.get<Chapter[]>(aliasRandomChapters)[0];

        const createdChapterId = chapterInfo!.id;

        const createdTopics = context
            .get<Topic[]>(aliasRandomTopics)
            .filter((topic) => topic.chapterId === createdChapterId);
        let topicPosition = 0;
        if (direction === 'down') {
            topicPosition = createdTopics.length - 1;
        }
        await this.cms.instruction(
            `School admin sees the topic ${movedTopicName} is moved ${direction} in individual study plan detail page`,
            async () => {
                await schoolAdminSeeTopicAtIndexInStudyPlanDetail(this.cms, {
                    name: movedTopicName,
                    index: topicPosition,
                });
            }
        );
    }
);
