import {
    getLearnerInterfaceFromRole,
    getRandomElement,
    getRandomElements,
} from '@legacy-step-definitions/utils';
import { courseAliasWithSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, StudyPlanItemStatus, TeacherInterface } from '@supports/app-types';
import { CourseEntityWithLocation } from '@supports/entities/course-entity';

import {
    aliasSelectedScoredLearningType,
    aliasSelectedScoredStudyPlanItemName,
    aliasSelectedStudents,
    aliasTopicName,
} from './alias-keys/syllabus';
import { teacherConfirmEditStudyPlanAction } from './syllabus-archive-study-plan-item-definitions';
import { teacherSelectsArchive } from './syllabus-archive-study-plan-items-on-course-statistics-on-teacher-web-definitions';
import {
    LearningTypeWithScore,
    studentDoesStudyPlanItemWithScore,
} from './syllabus-sees-statistics-on-course-statistics-steps';
import { teacherSeeStudyPlanItemWithStatus } from './syllabus-study-plan-common-definitions';
import {
    teacherSelectsCheckboxStudent,
    teacherSelectsMoreActionButton,
} from './syllabus-study-plan-view-more-actions-status-definitions';
import { SelectMode } from './syllabus-update-study-plan-item-time-steps';
import { delay } from 'flutter-driver-x';

When(
    `teacher archives {string} student`,
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
            context.set(
                aliasSelectedStudents,
                students.map((s) => s.name)
            );
        }

        await this.teacher.instruction(
            `teacher selects more action button`,
            async function (this: TeacherInterface) {
                await teacherSelectsMoreActionButton(this);
            }
        );

        await this.teacher.instruction(
            `teacher selects archive`,
            async function (this: TeacherInterface) {
                await teacherSelectsArchive(this);
            }
        );

        await this.teacher.instruction(
            `teacher confirms archive`,
            async function (this: TeacherInterface) {
                await teacherConfirmEditStudyPlanAction(this);
            }
        );

        await delay(3000);
    }
);

When(
    'students answers study plan item that requires grade',
    { timeout: 1000000 },
    async function (this: IMasterWorld) {
        const scenario = this.scenario;
        const courseData = scenario.get<CourseEntityWithLocation>(courseAliasWithSuffix('course'));
        const courseName = courseData.name;
        const topicName = scenario.get<string>(aliasTopicName);
        const scoredStudyPlanItemType = scenario.get<LearningTypeWithScore>(
            aliasSelectedScoredLearningType
        );
        const studyPlanItemScoreName = scenario.get<string>(aliasSelectedScoredStudyPlanItemName);
        const learner1 = getLearnerInterfaceFromRole(this, 'student S1') ?? this.learner;
        const learner2 = getLearnerInterfaceFromRole(this, 'student S2') ?? this.learner;
        const learner3 = getLearnerInterfaceFromRole(this, 'student S3') ?? this.learner;
        await studentDoesStudyPlanItemWithScore(
            scenario,
            learner1,
            courseName,
            topicName,
            studyPlanItemScoreName,
            scoredStudyPlanItemType
        );
        await studentDoesStudyPlanItemWithScore(
            scenario,
            learner2,
            courseName,
            topicName,
            studyPlanItemScoreName,
            scoredStudyPlanItemType
        );
        await studentDoesStudyPlanItemWithScore(
            scenario,
            learner3,
            courseName,
            topicName,
            studyPlanItemScoreName,
            scoredStudyPlanItemType
        );
    }
);

Then(
    'teacher sees {string} statistics of the course',
    { timeout: 100000 },
    async function (this: IMasterWorld, status: StudyPlanItemStatus) {
        const scenario = this.scenario;
        const selectedStudents = scenario.get<Array<string>>(aliasSelectedStudents);

        await delay(3000);

        await this.teacher.instruction(
            `teacher sees ${status}`,
            async function (this: TeacherInterface) {
                for (const student of selectedStudents) {
                    await teacherSeeStudyPlanItemWithStatus(this, student, status);
                }
            }
        );
    }
);
