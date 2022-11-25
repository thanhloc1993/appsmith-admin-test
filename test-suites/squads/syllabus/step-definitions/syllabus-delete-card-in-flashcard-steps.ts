import { asyncForEach } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import {
    aliasContentBookLOQuestionQuantity,
    aliasCourseId,
    aliasCourseName,
    aliasDeleteCardFlashcardMode,
    aliasFlashcardName,
    aliasTopicName,
} from './alias-keys/syllabus';
import { saveDialogButton } from './cms-selectors/cms-keys';
import {
    teacherGoToCourseStudentDetail,
    teacherWaitingForStudyPlanListVisible,
} from './create-course-studyplan-definitions';
import { studentWaitingSelectChapterWithBookScreenLoaded } from './syllabus-add-book-to-course-definitions';
import {
    schoolAdminDeleteCardFlashcardByIndex,
    schoolAdminSaveCardFlashcard,
    schoolAdminWaitingForSaveCardFlashcardSuccess,
} from './syllabus-create-card-in-flashcard-definition';
import {
    studentGoesToLODetailsPage,
    teacherGoesToStudyPlanItemDetails,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    schoolAdminGetTermValueCardFormInFlashcard,
    schoolAdminNotSeeTermOrDefinitionCardInFlashcard,
    schoolAdminSelectCardsIndexToDelete,
    DeleteCardInFlashcardMode,
    schoolAdminSeeEmptyCardListInFlashcard,
    studentDoesNotSeeCardTermInFlashcard,
    teacherDoesNotSeeTermOfCardInFlashCard,
    studentSeesFlashcardCardsContents,
    teacherReloadStudentStudyPlanScreen,
} from './syllabus-delete-card-in-flashcard-definitions';
import {
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    studentTapButtonOnScreen,
} from './syllabus-utils';
import {
    getAllFlashcardCardsInTable,
    teacherSeesFlashcardCardsContents,
} from './syllabus-view-flashcard-list-on-teacher-definitions';

const aliasTermOfCardsFlashcardDelete = 'aliasTermOfCardsFlashcardDelete';

Given('teacher sees created cards in flashcard', async function () {
    await getAllFlashcardCardsInTable(this.cms, this.scenario);
    const courseId = await this.scenario.get(aliasCourseId);
    const flashcardName = this.scenario.get(aliasFlashcardName);
    const learnerProfile = await this.learner.getProfile();

    await this.teacher.instruction(
        `Teacher goes to the course student detail: ${learnerProfile.name}`,
        async () => {
            await teacherGoToCourseStudentDetail(this.teacher, courseId, learnerProfile.id);
            await teacherWaitingForStudyPlanListVisible(this.teacher);
        }
    );

    await this.teacher.instruction(`Teacher open flashcard detail`, async () => {
        await teacherGoesToStudyPlanItemDetails(this.teacher, flashcardName);
    });
    await this.teacher.instruction(`Teacher see created cards`, async () => {
        await teacherSeesFlashcardCardsContents(this.teacher, this.scenario);
    });
});

Given('student sees created cards in flashcard', async function () {
    const learner = this.learner;
    const courseName = this.scenario.get<string>(aliasCourseName);
    const topicName = this.scenario.get<string>(aliasTopicName);
    const flashcardName = this.scenario.get(aliasFlashcardName);

    await learner.instruction('Refresh learner app', async () => {
        await studentRefreshHomeScreen(learner);
    });

    await learner.instruction(`Student go to the course: ${courseName}`, async () => {
        await studentGoToCourseDetail(learner, courseName);
        await studentWaitingSelectChapterWithBookScreenLoaded(learner);
    });

    await learner.instruction(`Student go to the topic: ${topicName}`, async () => {
        await studentGoToTopicDetail(learner, topicName);
    });

    await learner.instruction(`Student go to the flashcard: ${flashcardName}`, async () => {
        await studentGoesToLODetailsPage(learner, topicName, flashcardName);
    });

    await learner.instruction(`Student sees created cards: ${flashcardName}`, async () => {
        await studentSeesFlashcardCardsContents(this.learner, this.scenario);
    });
});

When(`school admin deletes {string} cards in the flashcard`, async function (total: string) {
    const fakeTotal = total === 'one' ? '[one]' : total;
    const { deleteIndexListSortByDesc, deleteMode } = await schoolAdminSelectCardsIndexToDelete(
        this.cms,
        fakeTotal
    );

    const termOfCardsDeleted: string[] = [];

    await asyncForEach<number, void>(deleteIndexListSortByDesc, async (deleteIndex) => {
        const termValue = await schoolAdminGetTermValueCardFormInFlashcard(this.cms, deleteIndex);
        const instruction = `User will delete card have term ${termValue} at index ${deleteIndex}`;

        if (!termValue) throw new Error(`Can't get text value`);

        await this.cms.instruction(instruction, async () => {
            await schoolAdminDeleteCardFlashcardByIndex(this.cms, deleteIndex);
        });

        const successMessage = 'You have deleted the card successfully!';

        await this.cms.instruction(`User see message the ${successMessage}`, async () => {
            await this.cms.assertNotification(successMessage);
        });
        termOfCardsDeleted.push(termValue);
    });

    this.scenario.set(aliasTermOfCardsFlashcardDelete, termOfCardsDeleted);

    this.scenario.set(aliasDeleteCardFlashcardMode, deleteMode);
});

Then('school admin saves after deleting cards', async function () {
    const deletedMode = this.scenario.get<DeleteCardInFlashcardMode>(aliasDeleteCardFlashcardMode);

    if (deletedMode === 'all') {
        await this.cms.instruction('User see save button was disabled', async () => {
            const button = await this.cms.page?.waitForSelector(saveDialogButton);
            await button?.isDisabled();
        });
        await this.cms.instruction('User click cancel', async () => {
            await this.cms.cancelDialogAction();
        });
        return;
    }

    await this.cms.instruction('User submit action', async () => {
        await schoolAdminSaveCardFlashcard(this.cms);
        await schoolAdminWaitingForSaveCardFlashcardSuccess(this.cms);
    });
});

Then(`school admin {string} add-edit page`, async function (action: 'cancel' | 'leave') {
    await this.cms.instruction(`User click ${action}`, async () => {
        if (action === 'leave') return await this.cms.closeDialogAction();
        return await this.cms.cancelDialogAction();
    });
});

Then('school admin does not see the deleted card', async function () {
    const termOfCardsDeleted = this.scenario.get<string[]>(aliasTermOfCardsFlashcardDelete);
    const deletedMode = this.scenario.get<DeleteCardInFlashcardMode>(aliasDeleteCardFlashcardMode);

    if (deletedMode === 'all') {
        await this.cms.instruction('User will sees empty card list', async () => {
            await schoolAdminSeeEmptyCardListInFlashcard(this.cms);
        });
        return;
    }

    await asyncForEach<string, void>(termOfCardsDeleted, async (termOfCardDeleted) => {
        await this.cms.instruction(
            `User will not see card have term ${termOfCardDeleted}`,
            async () => {
                await schoolAdminNotSeeTermOrDefinitionCardInFlashcard(this.cms, termOfCardDeleted);
            }
        );
    });
});

Then('student does not see the deleted card', async function () {
    const termOfCardsDeleted = this.scenario.get<string[]>(aliasTermOfCardsFlashcardDelete);
    const totalCards = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);
    const flashcardName = this.scenario.get(aliasFlashcardName);
    const topicName = this.scenario.get<string>(aliasTopicName);

    await this.learner.instruction(
        `Student back to LO List Screen from Flashcard Detail Screen`,
        async () => {
            await studentTapButtonOnScreen(
                this.learner,
                SyllabusLearnerKeys.flash_card_preview_screen(flashcardName),
                SyllabusLearnerKeys.back_button
            );
        }
    );

    await this.learner.instruction(`Student go to the flashcard: ${flashcardName}`, async () => {
        await studentGoesToLODetailsPage(this.learner, topicName, flashcardName);
    });

    await asyncForEach<string, void>(termOfCardsDeleted, async (term) => {
        await this.learner.instruction(`Student does not see card with term ${term}`, async () => {
            for (let i = 0; i < totalCards; i++) {
                await studentDoesNotSeeCardTermInFlashcard(this.learner, 'term', term, i);
            }
        });
    });
});

Then('teacher does not see the deleted card', async function () {
    const termOfCardsDeleted = this.scenario.get<string[]>(aliasTermOfCardsFlashcardDelete);
    const totalCards = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);
    const flashcardName = this.scenario.get(aliasFlashcardName);

    await this.teacher.instruction(`Teacher refresh current web`, async () => {
        await teacherReloadStudentStudyPlanScreen(this.teacher);
    });

    await this.teacher.instruction(`Teacher open flashcard detail`, async () => {
        await teacherGoesToStudyPlanItemDetails(this.teacher, flashcardName);
    });

    await asyncForEach<string, void>(termOfCardsDeleted, async (term) => {
        await this.teacher.instruction(`Teacher does not see card with term ${term}`, async () => {
            for (let i = 0; i < totalCards; i++) {
                await teacherDoesNotSeeTermOfCardInFlashCard(this.teacher, term, i);
            }
        });
    });
});
