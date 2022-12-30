import { Then } from '@cucumber/cucumber';

import { aliasFlashcardName } from './alias-keys/syllabus';
import {
    studentSeesFlashcardQuizScreen,
    studentSeesNthCardInFlashcardQuizScreen,
} from './syllabus-view-flashcard-quiz-on-learner-app-definitions';

Then(`student sees detail screen of 1st question of Quiz`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;

    const flashcardName = context.get<string>(aliasFlashcardName);

    await learner.instruction(`Student see ${flashcardName} quiz screen`, async () => {
        await studentSeesFlashcardQuizScreen(learner, flashcardName);
    });

    await learner.instruction(`Student see 1st card at flashcard quiz screen`, async () => {
        await studentSeesNthCardInFlashcardQuizScreen(learner, 1);
    });
});
