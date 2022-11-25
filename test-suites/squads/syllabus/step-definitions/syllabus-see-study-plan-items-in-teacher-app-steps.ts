import { Then } from '@cucumber/cucumber';

import { TeacherInterface } from '@supports/app-types';

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
import {
    Assignment,
    isAssignment,
    LearningObjective,
    StudyPlanItem,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Then(`teacher sees the study plan items on Teacher App`, async function (): Promise<void> {
    const context = this.scenario;
    const courseName = context.get<string>(aliasCourseName);
    const courseId = context.get<string>(aliasCourseId);
    const studentId = await this.learner.getUserId();

    const studyPlanItemList = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

    const studyPlanItemNames: string[] = studyPlanItemList.map((studyPlanItem) => {
        if (isAssignment(studyPlanItem)) {
            const assignment = studyPlanItem as Assignment;
            return assignment.name;
        } else {
            const lo = studyPlanItem as LearningObjective;
            return lo.info.name;
        }
    });

    await this.teacher.instruction(
        `teacher goes to course ${courseName} people tab from home page`,
        async function (this: TeacherInterface) {
            await teacherGoesToStudyPlanDetails(this, courseId, studentId);
        }
    );
    for (const studyPlanName of studyPlanItemNames) {
        await this.teacher.instruction(
            `teacher sees the ${studyPlanName} on Teacher App`,
            async function (teacher: TeacherInterface) {
                await teacherSeeTopicStudyPlanItem(teacher, studyPlanName);
            }
        );
    }

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

        for (const studyPlanItemName of selectedStudyPlanItemNames) {
            await this.learner.instruction(
                `Student sees the study plan item ${studyPlanItemName}`,
                async (learner) => {
                    await studentSeeStudyPlanItem(learner, topicName, studyPlanItemName);
                }
            );
        }
    }
);
