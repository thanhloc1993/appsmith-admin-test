import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { genId } from '@supports/utils/ulid';

import { aliasChapterName, aliasChapterNames, aliasCourseName } from './alias-keys/syllabus';
import { chapterFormRoot } from './cms-selectors/syllabus';
import { schoolAdminSeeChapter, studentDoesNotSeeNewChapter } from './create-chapter-definitions';
import { schoolAdminCreateAChapter } from './syllabus-content-book-create-definitions';
import {
    schoolAdminSeesErrorMessageField,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import { chapterItemRoot } from 'test-suites/squads/syllabus/step-definitions/cms-selectors/cms-keys';

When(
    `school admin creates a new chapter in book`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const chapterName = `Chapter ${genId()}`;
        const hasChapter =
            Boolean(this.scenario.get(aliasChapterName)) ||
            Boolean(this.scenario.get(aliasChapterNames)?.length);

        if (hasChapter) {
            await this.cms.page!.waitForSelector(chapterItemRoot);
        }

        await this.cms.instruction(
            `school admin selects create button, fill ${chapterName} chapter name and save`,
            async () => {
                await schoolAdminCreateAChapter(this.cms, chapterName);

                context.set(aliasChapterName, chapterName);
            }
        );
    }
);

Then(
    `school admin sees the new chapter on CMS`,
    async function (this: IMasterWorld): Promise<void> {
        const chapterName = this.scenario.get(aliasChapterName);

        await this.cms.instruction(`school admin sees the new chapter on CMS`, async () => {
            await schoolAdminSeeChapter(this.cms, chapterName);
        });
    }
);

When(
    'school admin creates a chapter with missing {string} in book',
    async function (this: IMasterWorld, missingField: string) {
        await this.cms.instruction(
            `school admin selects create button and save with missing ${missingField} field`,
            async () => {
                await schoolAdminCreateAChapter(this.cms);
            }
        );
    }
);

Then('school admin cannot create any chapter', async function () {
    await this.cms.instruction(
        'school admin still sees dialog add chapter with error message',
        async () => {
            await schoolAdminSeesErrorMessageField(this.cms, {
                wrapper: chapterFormRoot,
            });
        }
    );
});

Then(
    `student does not see the new chapter on Learner App`,
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
            `student does not see the new chapter on Learner App`,
            async function (this: LearnerInterface) {
                await studentDoesNotSeeNewChapter(this, context);
            }
        );
    }
);

Then(
    `teacher does not see the new chapter on Teacher App`,
    async function (this: IMasterWorld): Promise<void> {
        await this.teacher.instruction(
            `teacher does not see the new chapter on Teacher App`,
            async function (this: TeacherInterface) {
                console.log(`There is no book flow on teacher`);
            }
        );
    }
);
