import { getRandomElement } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import {
    CMSInterface,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import { aliasChapterName, aliasCourseName, aliasRandomChapters } from './alias-keys/syllabus';
import { chapterFormRoot, chapterFormSubmit } from './cms-selectors/syllabus';
import { schoolAdminFillChapterData } from './syllabus-content-book-create-definitions';
import {
    schoolAdminClickChapterOption,
    schoolAdminEditsChapterName,
    schoolAdminSeesRenamedChapter,
    studentSeesRenamedChapter,
} from './syllabus-rename-chapter-definitions';
import {
    schoolAdminSeesErrorMessageField,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    studentSeeChapterList,
} from './syllabus-utils';
import { Chapter } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When(`school admin edits chapter name`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;
    const chapterList = context.get<Chapter[]>(aliasRandomChapters);

    const chapter = getRandomElement(chapterList);

    context.set(aliasChapterName, chapter.info!.name);

    await this.cms.instruction(`school admin chooses rename chapter options`, async () => {
        await schoolAdminClickChapterOption(this.cms, chapter.info!.name, ActionOptions.RENAME);
    });

    await this.cms.instruction(
        `school admin edits chapter name`,
        async function (this: CMSInterface) {
            await schoolAdminEditsChapterName(this, context);
        }
    );
});

When(
    'school admin edits chapter with missing {string}',
    async function (this: IMasterWorld, missingField: string) {
        const context = this.scenario;
        const chapter = context.get<Chapter[]>(aliasRandomChapters)[0];

        await this.cms.instruction(
            `school admin chooses chapter ${chapter.info!.name} to rename`,
            async () => {
                await schoolAdminClickChapterOption(
                    this.cms,
                    chapter.info!.name,
                    ActionOptions.RENAME
                );
            }
        );

        await this.cms.instruction(
            `school admin edits chapter with missing ${missingField}`,
            async () => {
                await schoolAdminFillChapterData(this.cms, '');
                await this.cms.page!.click(chapterFormSubmit);
            }
        );
    }
);

Then('school admin cannot edit chapter', async function (this: IMasterWorld) {
    await this.cms.instruction(
        'school admin still sees edit chapter dialog with error message',
        async () => {
            await schoolAdminSeesErrorMessageField(this.cms, {
                wrapper: chapterFormRoot,
            });
        }
    );
});

Then(
    `school admin sees the edited chapter name on CMS`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;

        await this.cms.instruction(
            `school admin sees the edited chapter name on CMS`,
            async function (this: CMSInterface) {
                await schoolAdminSeesRenamedChapter(this, context);
            }
        );
    }
);

Then(
    `student sees the edited chapter name on Learner App`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;

        await this.learner.instruction(
            `student refresh course list and go to course details page`,
            async function (this: LearnerInterface) {
                const courseName = context.get<string>(aliasCourseName);
                await studentRefreshHomeScreen(this);
                await studentGoToCourseDetail(this, courseName);
            }
        );

        await this.learner.instruction(
            `student sees the edited chapter name on Learner App`,
            async function (this: LearnerInterface) {
                await studentSeeChapterList(this);
                await studentSeesRenamedChapter(this, context);
            }
        );
    }
);

Then(
    `teacher does not see the edited chapter name on Teacher App`,
    async function (this: IMasterWorld): Promise<void> {
        await this.teacher.instruction(
            `teacher does not see the edited chapter name on Teacher App`,
            async function (this: TeacherInterface) {
                console.log(`There is no book flow on teacher`);
            }
        );
    }
);
