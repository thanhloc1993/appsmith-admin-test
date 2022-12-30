import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { LOStatus } from '@supports/types/cms-types';

import {
    aliasCardInFlashcardQuantity,
    aliasCourseId,
    aliasFlashcardName,
} from './alias-keys/syllabus';
import { schoolAdminIsOnBookDetailsPage } from './syllabus-content-book-create-definitions';
import { teacherGoesToStudyPlanItemDetails } from './syllabus-create-question-definitions';
import {
    teacherGoesToStudyPlanDetails,
    teacherSeeStudyPlanItem,
} from './syllabus-study-plan-upsert-definitions';
import {
    getAllFlashcardCardsInTable,
    teacherSeesFlashcardCardsContents,
} from './syllabus-view-flashcard-list-on-teacher-definitions';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import { ByValueKey } from 'flutter-driver-x';

Given('school admin sees flashcard list has been created on CMS', async function () {
    const flashcardName = this.scenario.get(aliasFlashcardName);

    await this.cms.instruction('school admin is on book details page', async () => {
        await schoolAdminIsOnBookDetailsPage(this.cms, this.scenario);
    });

    await this.cms.instruction('school admin goes to flashcard details page', async () => {
        await schoolAdminClickLOByName(this.cms, flashcardName);
    });

    await this.cms.waitingForLoadingIcon();
    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction('school admin sees flashcard list created on CMS', async () => {
        await getAllFlashcardCardsInTable(this.cms, this.scenario);
    });
});

When(
    'teacher goes to study plan management screen on Teacher App',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();

        await this.teacher.instruction(
            `teacher goes to study plan management screen`,
            async function (teacher) {
                await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
            }
        );
    }
);

When('teacher goes to flashcard details screen', async function () {
    const flashcardName = this.scenario.get(aliasFlashcardName);

    await this.teacher.instruction(`teacher see flashcard study plan item`, async () => {
        await teacherSeeStudyPlanItem(this.teacher, flashcardName);
    });

    await this.teacher.instruction(`teacher tap to view flashcard details`, async () => {
        await teacherGoesToStudyPlanItemDetails(this.teacher, flashcardName);
    });
});

Then(
    'teacher sees flashcard status {string} and total card count',
    async function (flashcardStatus: LOStatus) {
        const cardQuantity = this.scenario.get<number>(aliasCardInFlashcardQuantity);

        await this.teacher.instruction(
            `teacher sees flashcard with status ${flashcardStatus}`,
            async () => {
                await this.teacher.flutterDriver!.waitFor(
                    new ByValueKey(
                        SyllabusTeacherKeys.flashCardStatus(flashcardStatus == 'complete')
                    )
                );
            }
        );

        await this.teacher.instruction(
            `teacher sees ${cardQuantity} card as total card`,
            async () => {
                await this.teacher.flutterDriver!.waitFor(
                    new ByValueKey(SyllabusTeacherKeys.flashCardTotalCard(cardQuantity))
                );
            }
        );
    }
);

Then('teacher sees details of cards and theirs order matches on CMS', async function () {
    await this.teacher.instruction(
        `teacher sees details of cards in order matches input on CMS`,
        async () => {
            await teacherSeesFlashcardCardsContents(this.teacher, this.scenario);
        }
    );
});
