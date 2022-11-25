import { delay, getRandomElement, getRandomElements } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, TeacherInterface } from '@supports/app-types';

import { aliasRandomStudyPlanItems, aliasTopicName } from './alias-keys/syllabus';
import { Assignment, isAssignment, LearningObjective, StudyPlanItem } from './cms-models/content';
import {
    teacherNotSeesEditPopup,
    teacherSeesEditPopup,
    teacherSelectsCheckboxStudent,
    teacherSelectsMoreActionButton,
    teacherTapsOnStudyPlanItem,
} from './syllabus-study-plan-view-more-actions-status-definitions';
import { aliasSelectedStudents } from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { teacherTapsOnTopic } from 'test-suites/squads/syllabus/step-definitions/syllabus-expand-collapse-topic-definitions';
import { SelectMode } from 'test-suites/squads/syllabus/step-definitions/syllabus-update-study-plan-item-time-steps';

When(
    `teacher goes to study plan item detail screen`,
    { timeout: 300000 },
    async function (): Promise<void> {
        const context = this.scenario;

        const topicName = context.get<string>(aliasTopicName);

        const studyPlanItemList = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

        const studyPlanItems: string[] = studyPlanItemList.map((studyPlanItem) => {
            if (isAssignment(studyPlanItem)) {
                const assignment = studyPlanItem as Assignment;
                return assignment.name;
            } else {
                const lo = studyPlanItem as LearningObjective;
                return lo.info.name;
            }
        });

        const randomStudyPlanItemName = getRandomElement(studyPlanItems);

        await this.teacher.instruction(
            `teacher taps on a topic`,
            async function (this: TeacherInterface) {
                await teacherTapsOnTopic(this, topicName);
            }
        );

        await this.teacher.instruction(
            `selects on a study plan item detail screen`,
            async function (this: TeacherInterface) {
                await teacherTapsOnStudyPlanItem(this, randomStudyPlanItemName);
            }
        );
    }
);

When(
    `teacher selects {string} students`,
    async function (this: IMasterWorld, mode: SelectMode): Promise<void> {
        const context = this.scenario;

        const learner1 = this.learner;
        const learner2 = this.learner2;
        const learner3 = this.learner3;

        const student1 = await learner1.getProfile();
        const student2 = await learner2.getProfile();
        const student3 = await learner3.getProfile();
        const students = [student1, student2, student3];

        const randomStudent = getRandomElement(students);
        const randomStudents = getRandomElements(students);

        await delay(3000);

        if (mode == 'one') {
            await this.teacher.instruction(
                `teacher selects checkbox ${mode} student`,
                async function (this: TeacherInterface) {
                    await teacherSelectsCheckboxStudent(this, randomStudent.name);
                }
            );
            context.set(aliasSelectedStudents, [randomStudent.name]);
        } else if (mode == 'some') {
            for (const student of randomStudents) {
                await this.teacher.instruction(
                    `teacher selects checkbox ${mode} student`,
                    async function (this: TeacherInterface) {
                        await teacherSelectsCheckboxStudent(this, student.name);
                    }
                );
            }
            context.set(
                aliasSelectedStudents,
                randomStudents.map((student) => student.name)
            );
        } else if (mode == 'all') {
            await this.teacher.instruction(
                `teacher selects checkbox ${mode} student`,
                async function (this: TeacherInterface) {
                    await teacherSelectsCheckboxStudent(this, '');
                }
            );
            context.set(aliasSelectedStudents, ['']);
        }
    }
);

When(`teacher deselects that students`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;
    const selectedStudents = context.get<Array<string>>(aliasSelectedStudents);

    for (const student of selectedStudents) {
        await this.teacher.instruction(
            `teacher deselects checkbox that students`,
            async function (this: TeacherInterface) {
                await teacherSelectsCheckboxStudent(this, student);
            }
        );
    }
});

When(`teacher taps more action button`, async function (this: IMasterWorld): Promise<void> {
    await this.teacher.instruction(
        `teacher selects more action button`,
        async function (this: TeacherInterface) {
            await teacherSelectsMoreActionButton(this);
        }
    );
});

Then(
    `teacher sees more action button is {string}`,
    async function (this: IMasterWorld, status: string): Promise<void> {
        if (status == 'enabled') {
            await this.teacher.instruction(
                `teacher sees edit popup`,
                async function (this: TeacherInterface) {
                    await teacherSeesEditPopup(this);
                }
            );
        } else {
            await this.teacher.instruction(
                `teacher does not see edit popup`,
                async function (this: TeacherInterface) {
                    await teacherNotSeesEditPopup(this);
                }
            );
        }
    }
);
