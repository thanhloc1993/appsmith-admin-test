import {
    aliasStudyPlanItemEndDate,
    aliasStudyPlanItemStartDate,
} from '@legacy-step-definitions/alias-keys/syllabus';
import { getRandomElement, getRandomElements } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';

import {
    aliasSelectedStudentNameCheckBox,
    aliasStudyPlanItemAvailableFrom,
} from './alias-keys/syllabus';
import {
    teacherEditsTodoDurationForStudents,
    teacherSeesTheTodoDurationEdited,
    teacherTapsOnEditTodoDurationButton,
} from './edit-todo-duration-on-course-statistics-in-teacher-app-definitions';
import {
    teacherSelectsTheCheckboxOfStudent,
    teacherTapsOnMoreActionButton,
} from './see-edit-school-date-option-on-course-statistics-in-teacher-app-definitions';

When(
    `teacher edits todo duration for {string} students`,
    async function (this: IMasterWorld, mode: string): Promise<void> {
        const student1 = await this.learner.getProfile();
        const student2 = await this.learner2.getProfile();
        const student3 = await this.learner3.getProfile();
        const students = [student1, student2, student3];
        const randomStudent = getRandomElement(students);
        const randomStudents = getRandomElements(students);
        const context = this.scenario;
        const selectedStudentName: string[] = [];
        const initialDate = context.get<Date>(aliasStudyPlanItemAvailableFrom);
        const startDate = new Date(initialDate);
        const endDate = new Date(initialDate);
        startDate.setDate(startDate.getDate() + 7);
        endDate.setDate(startDate.getDate() + 7);

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

        await this.teacher.instruction(
            `teacher taps on more action button`,
            async function (this: TeacherInterface) {
                await teacherTapsOnMoreActionButton(this);
            }
        );

        await this.teacher.instruction(
            `teacher taps on edit todo duration button`,
            async function (this: TeacherInterface) {
                await teacherTapsOnEditTodoDurationButton(this);
            }
        );

        await this.teacher.instruction(
            `teacher edits todo duration for students`,
            async function (this: TeacherInterface) {
                await teacherEditsTodoDurationForStudents(this, startDate, endDate);
            }
        );

        context.set(aliasStudyPlanItemStartDate, startDate);
        context.set(aliasStudyPlanItemEndDate, endDate);
    }
);

Then(`teacher sees the todo duration edited`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;
    const selectedStudentName = context.get<string[]>(aliasSelectedStudentNameCheckBox);
    await this.teacher.instruction(
        `teacher sees the todo duration has been edited`,
        async function (this: TeacherInterface) {
            for (const studentName of selectedStudentName) {
                await teacherSeesTheTodoDurationEdited(this, studentName, context);
            }
        }
    );
});
