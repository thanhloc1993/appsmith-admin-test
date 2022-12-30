import { splitAndCombinationIntoArray } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { Classes } from '@supports/app-types';

import {
    teacherClicksClassesFilter,
    teacherSeesAllClassesOption,
    teacherSeesClassesOptionWithOrder,
} from './syllabus-course-statistics-filtering-multi-classes-definitions';

Then('teacher sees the all classes option', async function () {
    await this.teacher.instruction(`teacher sees the all classes option`, async (teacher) => {
        await teacherClicksClassesFilter(teacher);
        await teacherSeesAllClassesOption(teacher);
    });
});

Then(
    'teacher sees descending order in which the classes {string} are created',
    async function (classes: Classes) {
        const classesList = splitAndCombinationIntoArray(classes) as Classes[];
        for (let i = 0; i < classesList.length; i++) {
            await this.teacher.instruction(
                `teacher sees position ${i + 1} is ${classesList[i]} `,
                async (teacher) => {
                    await teacherSeesClassesOptionWithOrder(teacher, i, classesList[i]);
                }
            );
        }
    }
);
