import { When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';

import { aliasSelectedStudents } from './alias-keys/syllabus';
import { teacherConfirmEditStudyPlanAction } from './syllabus-archive-study-plan-item-definitions';
import {
    teacherSelectsCheckboxStudent,
    teacherSelectsMoreActionButton,
} from './syllabus-study-plan-view-more-actions-status-definitions';
import { teacherSelectsUnarchive } from './syllabus-unarchive-study-plan-items-on-course-statistics-on-teacher-web-definitions';
import { SelectMode } from './syllabus-update-study-plan-item-time-steps';
import { delay } from 'flutter-driver-x';

When(
    `teacher unarchives {string} student`,
    async function (this: IMasterWorld, mode: SelectMode): Promise<void> {
        const context = this.scenario;
        const selectedStudents = context.get<Array<string>>(aliasSelectedStudents);

        for (const student of selectedStudents) {
            await this.teacher.instruction(
                `teacher selects checkbox ${mode} student`,
                async function (this: TeacherInterface) {
                    await teacherSelectsCheckboxStudent(this, student);
                }
            );
        }

        await this.teacher.instruction(
            `teacher selects more action button`,
            async function (this: TeacherInterface) {
                await teacherSelectsMoreActionButton(this);
            }
        );

        await this.teacher.instruction(
            `teacher selects unarchive`,
            async function (this: TeacherInterface) {
                await teacherSelectsUnarchive(this);
            }
        );

        await this.teacher.instruction(
            `teacher confirms unarchive`,
            async function (this: TeacherInterface) {
                await teacherConfirmEditStudyPlanAction(this);
            }
        );

        await delay(3000);
    }
);
