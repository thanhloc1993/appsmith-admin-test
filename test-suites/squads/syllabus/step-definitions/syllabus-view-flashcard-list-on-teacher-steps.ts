import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { LOStatus } from '@supports/types/cms-types';

import {
    aliasContentBookLOQuestionQuantity,
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

Given(
    'school admin sees flashcard list has been created on CMS',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const flashcardName = context.get<string>(aliasFlashcardName);

        await this.cms.instruction('school admin is on book details page', async function (cms) {
            await schoolAdminIsOnBookDetailsPage(cms, context);
        });

        await this.cms.instruction('school admin goes to flashcard details page', async () => {
            await schoolAdminClickLOByName(this.cms, flashcardName);
        });

        await this.cms.waitingForLoadingIcon();
        await this.cms.waitForSkeletonLoading();

        await this.cms.instruction(
            'school admin sees flashcard list created on CMS',
            async function (cms) {
                await getAllFlashcardCardsInTable(cms, context);
            }
        );
    }
);

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

When('teacher goes to flashcard details screen', async function (this: IMasterWorld) {
    const context = this.scenario;
    const flashcardName = context.get<string>(aliasFlashcardName);

    await this.teacher.instruction(
        `teacher see flashcard study plan item`,
        async function (teacher) {
            await teacherSeeStudyPlanItem(teacher, flashcardName);
        }
    );

    await this.teacher.instruction(
        `teacher tap to view flashcard details`,
        async function (teacher) {
            await teacherGoesToStudyPlanItemDetails(teacher, flashcardName);
        }
    );
});

Then(
    'teacher sees flashcard status {string} and total card count',
    async function (this: IMasterWorld, flashcardStatus: LOStatus) {
        const context = this.scenario;
        const cardQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);

        await this.teacher.instruction(
            `teacher sees flashcard with status ${flashcardStatus}`,
            async function (teacher) {
                await teacher.flutterDriver!.waitFor(
                    new ByValueKey(
                        SyllabusTeacherKeys.flashCardStatus(flashcardStatus == 'complete')
                    )
                );
            }
        );

        await this.teacher.instruction(
            `teacher sees ${cardQuantity} card as total card`,
            async function (teacher) {
                await teacher.flutterDriver!.waitFor(
                    new ByValueKey(SyllabusTeacherKeys.flashCardTotalCard(cardQuantity))
                );
            }
        );
    }
);

Then(
    'teacher sees details of cards and theirs order matches on CMS',
    async function (this: IMasterWorld) {
        const context = this.scenario;

        await this.teacher.instruction(
            `teacher sees details of cards in order matches input on CMS`,
            async function (teacher) {
                await teacherSeesFlashcardCardsContents(teacher, context);
            }
        );
    }
);
