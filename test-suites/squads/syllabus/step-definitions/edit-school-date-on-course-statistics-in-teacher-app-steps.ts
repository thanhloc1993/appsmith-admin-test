import { getRandomElement, getRandomElements } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';

import {
    aliasSelectedStudentNameCheckBox,
    aliasStudyPlanItemSchoolDate,
} from './alias-keys/syllabus';
import {
    teacherEditsSchoolDateForStudents,
    teacherSeesTheSchoolDateEdited,
    teacherTapsOnEditSchoolDateButton,
} from './edit-school-date-on-course-statistics-in-teacher-app-definitions';
import {
    teacherSelectsTheCheckboxOfStudent,
    teacherTapsOnMoreActionButton,
} from './see-edit-school-date-option-on-course-statistics-in-teacher-app-definitions';

When(
    `teacher edits school date for {string} students`,
    async function (this: IMasterWorld, mode: string): Promise<void> {
        const schoolDate = new Date();
        const context = this.scenario;

        const student1 = await this.learner.getProfile();
        const student2 = await this.learner2.getProfile();
        const student3 = await this.learner3.getProfile();
        const students = [student1, student2, student3];
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

        await this.teacher.instruction(
            `teacher taps on more action button`,
            async function (this: TeacherInterface) {
                await teacherTapsOnMoreActionButton(this);
            }
        );

        await this.teacher.instruction(
            `teacher taps on edit school date button`,
            async function (this: TeacherInterface) {
                await teacherTapsOnEditSchoolDateButton(this);
            }
        );

        await this.teacher.instruction(
            `teacher edits school date for students`,
            async function (this: TeacherInterface) {
                await teacherEditsSchoolDateForStudents(this, schoolDate);
            }
        );

        context.set(aliasStudyPlanItemSchoolDate, schoolDate);
    }
);

Then(
    `teacher sees the school date has been edited`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const schoolDate = context.get<Date>(aliasStudyPlanItemSchoolDate);
        const selectedStudentName = context.get<string[]>(aliasSelectedStudentNameCheckBox);
        await this.teacher.instruction(
            `teacher sees the school date has been edited`,
            async function (this: TeacherInterface) {
                for (const studentName of selectedStudentName) {
                    await teacherSeesTheSchoolDateEdited(this, schoolDate, studentName);
                }
            }
        );
    }
);
