import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasExamLOName } from './alias-keys/syllabus';
import {
    teacherSeesAndGoesToMarkingPage,
    viewMarkingPageAsEditMode,
    viewMarkingPageAsViewMode,
} from './view-exam-lo-marking-page-definitions';

When(
    `teacher goes to marking page from student study plan`,
    { timeout: 200 * 1000 },
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const loName = context.get<string>(aliasExamLOName) ?? '';

        await this.teacher.instruction(`teacher goes to marking page by exam lo name`, async () => {
            await teacherSeesAndGoesToMarkingPage(this.teacher, loName);
        });
    }
);

Then(
    `teacher sees marking page display as {string} mode`,
    { timeout: 200 * 1000 },
    async function (this: IMasterWorld, mode: string) {
        switch (mode) {
            case 'edit':
                await this.teacher.instruction(
                    `teacher sees marking page display as ${mode} mode`,
                    async () => viewMarkingPageAsEditMode(this.teacher, this.scenario)
                );
                break;
            case 'view':
                await this.teacher.instruction(
                    `teacher sees marking page display as ${mode} mode`,
                    async () => viewMarkingPageAsViewMode(this.teacher, this.scenario)
                );
                break;
        }
    }
);
