import { getRandomElement } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';

import {
    aliasRandomBooks,
    aliasStudyPlanItemsByTopicId,
    aliasStudyPlanNames,
} from './alias-keys/syllabus';
import {
    teacherScrollIntoTopic,
    teacherSeesTopic,
    teacherSeeTopicStudyPlanItems,
} from './syllabus-expand-collapse-topic-definitions';
import { teacherSelectStudyPlan } from './syllabus-filter-study-plan-definitions';
import {
    Assignment,
    CreatedContentBookReturn,
    isAssignment,
    LearningObjective,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    `teacher selects studyplan on student course study plan`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const studyPlanNames = context.get<string[]>(aliasStudyPlanNames);
        const books = context.get<CreatedContentBookReturn[]>(aliasRandomBooks);
        const selectedStudyPlan = getRandomElement(studyPlanNames);
        const { topicList, studyPlanItemList } = books[studyPlanNames.indexOf(selectedStudyPlan)];
        const studyPlanItemsByTopicId = new Map<string, string[]>();

        for (const topic of topicList) {
            studyPlanItemsByTopicId.set(
                topic.name,
                studyPlanItemList.map((studyPlanItem) => {
                    if (isAssignment(studyPlanItem)) {
                        const assignment = studyPlanItem as Assignment;
                        return assignment.name;
                    } else {
                        const lo = studyPlanItem as LearningObjective;
                        return lo.info.name;
                    }
                })
            );
        }

        await this.teacher.instruction(
            `teacher selects ${selectedStudyPlan} on study plans list`,
            async function (this: TeacherInterface) {
                await teacherSelectStudyPlan(this, selectedStudyPlan);
            }
        );

        context.set(aliasStudyPlanItemsByTopicId, studyPlanItemsByTopicId);
    }
);

Then(
    `teacher sees study plan items grouped by topics`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const studyPlanItemsByTopicId = context.get<Map<string, string[]>>(
            aliasStudyPlanItemsByTopicId
        );
        for (const topicName of studyPlanItemsByTopicId.keys()) {
            await this.teacher.instruction(
                `teacher scrolls into topic ${topicName}`,
                async function (this: TeacherInterface) {
                    await teacherScrollIntoTopic(this, topicName);
                }
            );

            await this.teacher.instruction(
                `teacher sees the topic ${topicName}`,
                async function (this: TeacherInterface) {
                    await teacherSeesTopic(this, topicName);
                }
            );

            await this.teacher.instruction(
                `teacher sees study plan items of ${topicName}`,
                async function (this: TeacherInterface) {
                    await teacherSeeTopicStudyPlanItems(
                        this,
                        studyPlanItemsByTopicId.get(topicName)!
                    );
                }
            );
        }
    }
);
