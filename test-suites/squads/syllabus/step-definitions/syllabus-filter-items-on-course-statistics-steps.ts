import { getRandomElement, getRandomElements } from '@legacy-step-definitions/utils';
import { courseClassesAlias, studentListAlias } from '@user-common/alias-keys/user';

import { When } from '@cucumber/cucumber';

import { Classes, IMasterWorld, StudyPlans, TeacherInterface } from '@supports/app-types';

import { aliasClassesList, aliasStudentsByClass } from './alias-keys/syllabus';
import {
    teacherClicksAllClassesOption,
    teacherClicksClassesFilter,
    teacherClicksHideClassesFilter,
} from './syllabus-course-statistics-filtering-multi-classes-definitions';
import {
    teacherSelectCourseStatisticsClassV2,
    teacherSelectCourseStatisticsStudyPlan,
} from './syllabus-filter-items-on-course-statistics-definitions';
import { SelectMode } from './syllabus-update-study-plan-item-time-steps';
import { ClassCSV } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(
    `teacher filters class {string}`,
    { timeout: 300000 },
    async function (this: IMasterWorld, classCourse: Classes): Promise<void> {
        const context = this.scenario;
        const className = context.get<ClassCSV>(classCourse).class_name as Classes;
        const classList = context.get<Classes[]>(aliasClassesList);
        const classIndex = classList.indexOf(className);
        await this.teacher.instruction(
            `teacher taps select class`,
            async function (this: TeacherInterface) {
                await teacherClicksClassesFilter(this);
            }
        );
        await this.teacher.instruction(
            `teacher deselects all`,
            async function (this: TeacherInterface) {
                await teacherClicksAllClassesOption(this);
            }
        );
        await this.teacher.instruction(
            `teacher selects class ${className}`,
            async function (this: TeacherInterface) {
                await teacherSelectCourseStatisticsClassV2(this, classIndex, className);
            }
        );
        await this.teacher.instruction(
            `teacher taps select class to hide the class filter`,
            async function (this: TeacherInterface) {
                await teacherClicksHideClassesFilter(this);
            }
        );
    }
);
When(
    `teacher filters {string} classes`,
    { timeout: 300000 },
    async function (this: IMasterWorld, mode: SelectMode): Promise<void> {
        const context = this.scenario;
        const classList = context.get<Classes[]>(aliasClassesList);

        switch (mode) {
            case 'all':
                await this.teacher.instruction(
                    `teacher taps select class`,
                    async function (this: TeacherInterface) {
                        await teacherClicksClassesFilter(this);
                    }
                );
                break;
            case 'one':
                {
                    const chosenClass = getRandomElement(classList);
                    const studentList =
                        context.get<string[]>(aliasStudentsByClass(chosenClass)) ??
                        ([] as string[]);
                    context.set(studentListAlias, studentList);
                    const classIndex = classList.indexOf(chosenClass);
                    await this.teacher.instruction(
                        `teacher taps select class`,
                        async function (this: TeacherInterface) {
                            await teacherClicksClassesFilter(this);
                        }
                    );
                    await this.teacher.instruction(
                        `teacher deselects all`,
                        async function (this: TeacherInterface) {
                            await teacherClicksAllClassesOption(this);
                        }
                    );
                    await this.teacher.instruction(
                        `teacher selects a class ${chosenClass}`,
                        async function (this: TeacherInterface) {
                            await teacherSelectCourseStatisticsClassV2(
                                this,
                                classIndex,
                                chosenClass
                            );
                        }
                    );
                }
                break;
            case 'some':
                {
                    await this.teacher.instruction(
                        `teacher taps select class`,
                        async function (this: TeacherInterface) {
                            await teacherClicksClassesFilter(this);
                        }
                    );
                    await this.teacher.instruction(
                        `teacher deselects all`,
                        async function (this: TeacherInterface) {
                            await teacherClicksAllClassesOption(this);
                        }
                    );
                    const chosenClasses = getRandomElements(classList);
                    context.set(courseClassesAlias, chosenClasses);
                    let studentList = [] as string[];

                    for (const chosenClass of chosenClasses) {
                        const studentListInClass = context.get<string[]>(
                            aliasStudentsByClass(chosenClass)
                        );

                        if (studentListInClass) {
                            studentList = studentList.concat(studentListInClass);
                        }

                        const classIndex = classList.indexOf(chosenClass);

                        await this.teacher.instruction(
                            `teacher selects class ${chosenClass}`,
                            async function (this: TeacherInterface) {
                                await teacherSelectCourseStatisticsClassV2(
                                    this,
                                    classIndex,
                                    chosenClass
                                );
                            }
                        );
                    }
                    context.set(studentListAlias, studentList);
                }
                break;
            default:
                break;
        }

        await this.teacher.instruction(
            `teacher hides the class filter`,
            async function (this: TeacherInterface) {
                await teacherClicksHideClassesFilter(this);
            }
        );
    }
);

When(
    `teacher filters study plan {string}`,
    async function (this: IMasterWorld, studyPlan: StudyPlans): Promise<void> {
        const context = this.scenario;
        const studyPlanName = context.get<string>(studyPlan);
        await this.teacher.instruction(
            `teacher select study plan ${studyPlanName}`,
            async function (this: TeacherInterface) {
                await teacherSelectCourseStatisticsStudyPlan(this, studyPlanName);
            }
        );
    }
);
