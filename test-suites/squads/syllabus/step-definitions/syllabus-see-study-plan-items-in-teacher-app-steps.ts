import { asyncForEach } from '@syllabus-utils/common';

import { Then } from '@cucumber/cucumber';

import {
    aliasCourseId,
    aliasCourseName,
    aliasRandomStudyPlanItems,
    aliasSelectedStudyPlanItemNames,
    aliasSelectedStudyPlanItems,
    aliasTopicName,
} from './alias-keys/syllabus';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { teacherSeeTopicStudyPlanItem } from './syllabus-expand-collapse-topic-definitions';
import {
    studentSeeStudyPlanItem,
    teacherGoesToStudyPlanDetails,
} from './syllabus-study-plan-upsert-definitions';
import {
    studentGoesToHomeTab,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import { StudyPlanItem } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Then(`teacher sees the study plan items on Teacher App`, async function (): Promise<void> {
    const context = this.scenario;
    const courseName = context.get<string>(aliasCourseName);
    const courseId = context.get<string>(aliasCourseId);
    const studentId = await this.learner.getUserId();

    const studyPlanItemList = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

    const studyPlanItemNames: string[] = studyPlanItemList.map(
        (studyPlanItem) => studyPlanItem.name
    );

    await this.teacher.instruction(
        `teacher goes to course ${courseName} people tab from home page`,
        async () => {
            await teacherGoesToStudyPlanDetails(this.teacher, courseId, studentId);
        }
    );
    await asyncForEach(studyPlanItemNames, async (studyPlanName) => {
        await this.teacher.instruction(
            `teacher sees the ${studyPlanName} on Teacher App`,
            async () => {
                await teacherSeeTopicStudyPlanItem(this.teacher, studyPlanName);
            }
        );
    });

    context.set(aliasSelectedStudyPlanItemNames, studyPlanItemNames);
    context.set(aliasSelectedStudyPlanItems, studyPlanItemList);
});

Then(
    `student sees the study plan items in course on Learner app`,
    { timeout: 50000 },
    async function (): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const courseName = context.get<string>(aliasCourseName);
        const topicName = context.get<string>(aliasTopicName);

        const selectedStudyPlanItemNames = context.get<string[]>(aliasSelectedStudyPlanItemNames);

        if (!selectedStudyPlanItemNames) {
            throw new Error(`selectedStudyPlanItemNames not found`);
        }

        await studentGoesToHomeTab(learner);

        await studentRefreshHomeScreen(learner);

        await studentGoToCourseDetail(learner, courseName);

        await studentGoToTopicDetail(learner, topicName);

        await asyncForEach(selectedStudyPlanItemNames, async (studyPlanItemName) => {
            await this.learner.instruction(
                `Student sees the study plan item ${studyPlanItemName}`,
                async () => {
                    await studentSeeStudyPlanItem(this.learner, topicName, studyPlanItemName);
                }
            );
        });
    }
);
