import { When } from '@cucumber/cucumber';

import { studentTapUndoLearnButtonInFlashcardLearn } from './syllabus-undo-flashcard-definitions';

When(
    `student selects go back previous card button in Flashcard Learn Screen`,
    async function (): Promise<void> {
        const learner = this.learner;

        await learner.instruction(`student tap on go back previous card  button `, async () => {
            await studentTapUndoLearnButtonInFlashcardLearn(learner);
        });
    }
);
