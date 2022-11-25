import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';
import { formatDate } from '@supports/utils/time/time';

import {
    aliasSelectedStudyPlanItemsByTopicId,
    aliasStudyPlanItemSchoolDate,
} from './alias-keys/syllabus';
import { teacherScrollIntoTopic } from './syllabus-expand-collapse-topic-definitions';
import { teacherSeeStudyPlanItemSchoolDate } from './syllabus-study-plan-common-definitions';
import { editStudyPlanItems } from './syllabus-unarchive-study-plan-item-steps';
import { teacherPickDateTime } from './syllabus-update-study-plan-item-time-definitions';
import { SelectMode } from './syllabus-update-study-plan-item-time-steps';

When(
    `teacher updates {string} study plan items school date to new date`,
    async function (mode: SelectMode): Promise<void> {
        const schoolDate = new Date();
        await editStudyPlanItems(this, mode, 'edit school date', false, {
            schoolDate: schoolDate,
        });
        this.scenario.set(aliasStudyPlanItemSchoolDate, schoolDate);
    }
);

Then(`teacher sees the edited items with updated school date`, async function (): Promise<void> {
    const schoolDate = this.scenario.get<Date>(aliasStudyPlanItemSchoolDate);
    const context = this.scenario;
    const teacher = this.teacher;
    const selectedStudyPlanItemsByTopicId = context.get<Map<string, string[]>>(
        aliasSelectedStudyPlanItemsByTopicId
    );

    for (const topicId of selectedStudyPlanItemsByTopicId.keys()) {
        const topicName = 'Topic ' + topicId;
        await teacher.instruction(
            `teacher scrolls into topic ${topicName}`,
            async function (this: TeacherInterface) {
                await teacherScrollIntoTopic(this, topicName);
            }
        );

        const studyPlanItems = selectedStudyPlanItemsByTopicId.get(topicId) ?? [];
        for (const studyPlanItemName of studyPlanItems) {
            await teacher.instruction(
                `teacher sees study plan item ${studyPlanItemName} with updated school date ${formatDate(
                    schoolDate,
                    'YYYY/MM/DD'
                )}`,
                async function (this: TeacherInterface) {
                    await teacherSeeStudyPlanItemSchoolDate(this, studyPlanItemName, schoolDate);
                }
            );
        }
    }
});

export async function fillStudyPlanItemSchoolDate(masterWorld: IMasterWorld, schoolDate: Date) {
    const teacher = masterWorld.teacher;

    await teacher.instruction(
        `teacher chooses school date at ${formatDate(schoolDate, 'YYYY/MM/DD')}`,
        async (teacher: TeacherInterface) => {
            await teacherPickDateTime(teacher, schoolDate, 'school date');
        }
    );
}
