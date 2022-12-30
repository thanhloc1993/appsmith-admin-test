import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasContentBookLOQuestionQuantity,
    aliasCourseName,
    aliasFlashcardName,
    aliasTopicName,
} from './alias-keys/syllabus';
import { studentWaitingSelectChapterWithBookScreenLoaded } from './syllabus-add-book-to-course-definitions';
import { studentGoesToLODetailsPage } from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { FlashcardSettingToggleType } from './syllabus-flip-flashcard-steps';
import { studentRefreshHomeScreen, studentGoToCourseDetail } from './syllabus-utils';
import {
    studentSeeFlashcardDetailScreen,
    studentSeeFlashcardListWithType,
    studentSelectsTestButtonInFlashcardDetailPage,
} from './syllabus-view-flashcard-detail-definitions';

Given(`student goes to Flashcard Detail screen`, async function () {
    const context = this.scenario;
    const learner = this.learner;
    const courseName = context.get<string>(aliasCourseName);
    const topicName = context.get<string>(aliasTopicName);
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
});

When(`student selects a flashcard`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const topicName = context.get<string>(aliasTopicName);
    const flashcardName = context.get<string>(aliasFlashcardName);

    await this.learner.instruction(`Student select flashcard: ${flashcardName}`, async () => {
        await studentGoesToLODetailsPage(learner, topicName, flashcardName);
    });
});

Then(`student sees Flashcard Detail screen`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const flashcardName = context.get<string>(aliasFlashcardName);
    const questionQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);

    await studentSeeFlashcardDetailScreen(learner, flashcardName, questionQuantity);
});

When(`student selects Test Button in Flashcard Detail Screen`, async function () {
    await this.learner.instruction(`Student tap test button`, async () => {
        await studentSelectsTestButtonInFlashcardDetailPage(this.learner);
    });
});

Then(
    `student sees flashcard list show {string}`,
    async function (
        this: IMasterWorld,
        flashcardSettingToggleType: FlashcardSettingToggleType
    ): Promise<void> {
        const learner = this.learner;

        await learner.instruction(
            `student see ${flashcardSettingToggleType} card list`,
            async function () {
                await studentSeeFlashcardListWithType(learner, flashcardSettingToggleType);
            }
        );
    }
);
