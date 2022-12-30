import { schoolAdminSeeEmptyTableMsg } from '@legacy-step-definitions/cms-common-definitions';
import { asyncForEach } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import {
    aliasBookDetailsPage,
    aliasBookName,
    aliasChapterNames,
    aliasFlashcardName,
    aliasLOName,
    aliasRandomStudyPlanItems,
    aliasTopicNames,
} from './alias-keys/syllabus';
import { schoolAdminSeeChapter } from './create-chapter-definitions';
import { schoolAdminSeeTopicByName } from './syllabus-create-topic-definitions';
import { schoolAdminDuplicateBook } from './syllabus-duplicate-book-multi-tenant-definitions';
import {
    getStudyPlanItemNames,
    schoolAdminGetBookNameDuplicated,
    schoolAdminSearchAndSelectBook,
    schoolAdminSeeLOsItemInBook,
} from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import { StudyPlanItem } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

When('school admin duplicates original book', async function () {
    await schoolAdminDuplicateBook(this.cms);
});

Then('school admin sees the duplicated book on CMS', async function () {
    const originalName = this.scenario.get(aliasBookName);

    const bookName = schoolAdminGetBookNameDuplicated(originalName);

    await this.cms.waitForSkeletonLoading();

    await schoolAdminSearchAndSelectBook(this.cms, bookName);

    await this.cms.waitForSkeletonLoading();
    await this.cms.assertThePageTitle(`${bookName}`);

    this.scenario.set(aliasBookDetailsPage, this.cms.page!.url());
});

Then('school admin sees chapter in book same as in original book', async function () {
    const chapterNames = this.scenario.get<string[]>(aliasChapterNames);

    await this.cms.instruction(`school admin sees chapter ${chapterNames} on CMS`, async () => {
        await asyncForEach(chapterNames, async (chapterName) => {
            await schoolAdminSeeChapter(this.cms, chapterName);
        });
    });
});

Then('school admin sees topic in each chapter same as in original book', async function () {
    const topicNames = this.scenario.get<string[]>(aliasTopicNames);

    await this.cms.instruction(`school admin sees topic ${topicNames} on CMS`, async () => {
        await asyncForEach(topicNames, async (topicName) => {
            await schoolAdminSeeTopicByName(this.cms, topicName);
        });
    });
});

Then(
    `school admin sees content learning in each topic same as in original book`,
    async function () {
        const studyPlanItems = this.scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);

        const names = getStudyPlanItemNames(studyPlanItems);

        await this.cms.instruction(
            `school admin sees content learning items ${names.join(', ')}`,
            async () => {
                await asyncForEach(names, async (name) => {
                    await schoolAdminSeeLOsItemInBook(this.cms, name);
                });
            }
        );
    }
);

Then(`school admin doesn't see any question in LO`, async function () {
    const loName = this.scenario.get(aliasLOName);
    const bookUrl = this.scenario.get(aliasBookDetailsPage);

    await this.cms.page?.goto(bookUrl);

    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction(`school admin goes to the LO ${loName}`, async () => {
        await schoolAdminClickLOByName(this.cms, loName);
    });

    await this.cms.waitingForLoadingIcon();
    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction('School admin sees an empty quiz table', async () => {
        await schoolAdminSeeEmptyTableMsg(this.cms);
    });
});

Then(`school admin doesn't see any card in flashcard`, async function () {
    const flashcardName = this.scenario.get(aliasFlashcardName);
    const bookUrl = this.scenario.get(aliasBookDetailsPage);

    await this.cms.page?.goto(bookUrl);

    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction(`school admin goes to the flashcard ${flashcardName}`, async () => {
        await schoolAdminClickLOByName(this.cms, flashcardName);
    });

    await this.cms.waitingForLoadingIcon();
    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction('School will sees an empty quiz table', async () => {
        await schoolAdminSeeEmptyTableMsg(this.cms);
    });
});
