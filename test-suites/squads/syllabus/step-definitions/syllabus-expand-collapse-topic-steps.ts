import { getRandomElement } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';

import {
    aliasCourseName,
    aliasCourseId,
    aliasTopicName,
    aliasTopicNames,
    aliasStudyPlanItemsByTopicId,
    aliasRandomStudyPlanItems,
} from './alias-keys/syllabus';
import {
    teacherTapsOnTopic,
    teacherDoesNotSeeTopicStudyPlanItems,
    teacherSeesTopic,
    teacherSeesTopicProgress,
    teacherSeeTopicStudyPlanItems,
    teacherScrollIntoTopic,
} from './syllabus-expand-collapse-topic-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import {
    Assignment,
    isAssignment,
    LearningObjective,
    StudyPlanItem,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given(
    `teacher is at student's studyplan detail screen`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const courseId = context.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();

        await this.teacher.instruction(
            `teacher goes to course ${courseName} people tab from home page`,
            async function (this: TeacherInterface) {
                await teacherGoesToStudyPlanDetails(this, courseId, studentId);
            }
        );
    }
);

Given('teacher collapses a topic', async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;

    const topics = context.get<string[]>(aliasTopicNames);
    const topicName = getRandomElement(topics);

    const topicId = topicName.split(' ')[1];

    const studyPlanItemsByTopicId: string[] = [];

    const studyPlanItemList = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

    studyPlanItemList.forEach((studyPlanItem) => {
        if (isAssignment(studyPlanItem)) {
            const assignment = studyPlanItem as Assignment;
            if (assignment.content?.topicId === topicId) {
                studyPlanItemsByTopicId.push(assignment.name);
            }
            return;
        }

        const lo = studyPlanItem as LearningObjective;
        if (lo.topicId === topicId) {
            studyPlanItemsByTopicId.push(lo.info.name);
        }
    });

    await this.teacher.instruction(
        `teacher scrolls into topic ${topicName}`,
        async function (this: TeacherInterface) {
            await teacherScrollIntoTopic(this, topicName);
        }
    );

    await this.teacher.instruction(
        `teacher taps on a topic randomly`,
        async function (this: TeacherInterface) {
            await teacherTapsOnTopic(this, topicName);
        }
    );

    context.set(aliasStudyPlanItemsByTopicId, studyPlanItemsByTopicId);
    context.set(aliasTopicName, topicName);
});

When('teacher expands a topic', async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;
    const topicName = context.get<string>(aliasTopicName);

    await this.teacher.instruction(
        `teacher taps on a topic ${topicName}`,
        async function (this: TeacherInterface) {
            await teacherTapsOnTopic(this, topicName);
        }
    );

    await this.teacher.instruction(
        `s into topic ${topicName}`,
        async function (this: TeacherInterface) {
            await teacherScrollIntoTopic(this, topicName);
        }
    );
});

Then('teacher sees the progress of the topic', async function () {
    const context = this.scenario;
    const topicName = context.get<string>(aliasTopicName);
    const studyPlanItems = context.get<string[]>(aliasStudyPlanItemsByTopicId);

    await this.teacher.instruction(
        `teacher sees the progress of topic ${topicName}`,
        async function (this: TeacherInterface) {
            await teacherSeesTopicProgress(this, topicName, 0, studyPlanItems.length);
        }
    );
});

Then(`teacher does not see the topic's studyplan items`, async function () {
    const context = this.scenario;
    const topicName = context.get<string>(aliasTopicName);
    const studyPlanItems = context.get<string[]>(aliasStudyPlanItemsByTopicId);

    await this.teacher.instruction(
        `teacher sees the progress of topic ${topicName}`,
        async function (this: TeacherInterface) {
            await teacherDoesNotSeeTopicStudyPlanItems(this, studyPlanItems);
        }
    );
});

Then(`teacher sees the topic's studyplan items`, async function () {
    const context = this.scenario;
    const topicName = context.get<string>(aliasTopicName);
    const studyPlanItems = context.get<string[]>(aliasStudyPlanItemsByTopicId);

    await this.teacher.instruction(
        `teacher sees the progress of topic ${topicName}`,
        async function (this: TeacherInterface) {
            await teacherSeeTopicStudyPlanItems(this, studyPlanItems);
        }
    );
});

Then('teacher sees the topic name', async function () {
    const context = this.scenario;
    const topicName = context.get<string>(aliasTopicName);

    await this.teacher.instruction(
        `teacher sees the topic ${topicName}`,
        async function (this: TeacherInterface) {
            await teacherSeesTopic(this, topicName);
        }
    );
});
