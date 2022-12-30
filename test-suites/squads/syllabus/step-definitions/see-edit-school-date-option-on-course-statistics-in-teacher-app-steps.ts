import { delay, getRandomElement, getRandomElements } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';

import { aliasSelectedStudentNameCheckBox, aliasTopicName } from './alias-keys/syllabus';
import { CreatedContentBookReturn } from './cms-models/content';
import {
    teacherSeesEditSchoolDate,
    teacherSelectsTheCheckboxOfStudent,
    teacherTapsOnMoreActionButton,
} from './see-edit-school-date-option-on-course-statistics-in-teacher-app-definitions';
import { teacherTapsOnTopic } from './syllabus-expand-collapse-topic-definitions';
import { teacherGoesToStudyPlanItemDetailsCourseStatisticsFlow } from './syllabus-sees-statistics-on-course-statistics-definitions';
import { SelectMode } from './syllabus-update-study-plan-item-time-steps';

When(
    `teacher goes to course statistics detail`,
    { timeout: 300000 },
    async function (): Promise<void> {
        const context = this.scenario;

        const topicName = context.get<string>(aliasTopicName);

        await delay(10000);

        await this.teacher.instruction(
            `teacher taps on a topic`,
            async function (this: TeacherInterface) {
                await teacherTapsOnTopic(this, topicName);
            }
        );

        const bookData = this.scenario.get<CreatedContentBookReturn>('book');
        const studyPlanItemList = bookData.studyPlanItemList;
        const studyPlanItemNames: string[] = studyPlanItemList.map((studyPlanItem) => {
            return studyPlanItem.name;
        });
        const randomStudyPlanItemName = getRandomElement(studyPlanItemNames);

        await this.teacher.instruction(
            `teacher goes to course statistics detail`,
            async function (this: TeacherInterface) {
                await teacherGoesToStudyPlanItemDetailsCourseStatisticsFlow(
                    this,
                    randomStudyPlanItemName
                );
            }
        );
    }
);

When(
    `teacher selects {string} student`,
    async function (this: IMasterWorld, mode: SelectMode): Promise<void> {
        const student1 = await this.learner.getProfile();
        const student2 = await this.learner2.getProfile();
        const students = [student1, student2];
        const randomStudent = getRandomElement(students);
        const randomStudents = getRandomElements(students);

        const selectedStudentName: string[] = [];

        if (mode == 'one') {
            await this.teacher.instruction(
                `teacher selects ${mode} student`,
                async function (this: TeacherInterface) {
                    await teacherSelectsTheCheckboxOfStudent(this, randomStudent.name);
                    selectedStudentName.push(randomStudent.name);
                }
            );
        } else if (mode == 'some') {
            for (const student of randomStudents) {
                await this.teacher.instruction(
                    `teacher selects ${mode} student`,
                    async function (this: TeacherInterface) {
                        await teacherSelectsTheCheckboxOfStudent(this, student.name);
                        selectedStudentName.push(student.name);
                    }
                );
            }
        } else if (mode == 'all') {
            for (const student of students) {
                await this.teacher.instruction(
                    `teacher selects ${mode} student`,
                    async function (this: TeacherInterface) {
                        await teacherSelectsTheCheckboxOfStudent(this, student.name);
                        selectedStudentName.push(student.name);
                    }
                );
            }
        }

        this.scenario.set(aliasSelectedStudentNameCheckBox, selectedStudentName);
    }
);

Then(`teacher sees "Edit School Date" option`, async function (this: IMasterWorld): Promise<void> {
    await this.teacher.instruction(
        `teacher sees "Edit School Date" option`,
        async function (this: TeacherInterface) {
            await teacherTapsOnMoreActionButton(this);
            await teacherSeesEditSchoolDate(this, true);
        }
    );
});

Then(
    `teacher cannot see "Edit School Date" option`,
    async function (this: IMasterWorld): Promise<void> {
        await this.teacher.instruction(
            `teacher can't see "Edit School Date" option`,
            async function (this: TeacherInterface) {
                await teacherTapsOnMoreActionButton(this);
                await teacherSeesEditSchoolDate(this, false);
            }
        );
    }
);
