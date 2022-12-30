import { asyncForEach, createNumberArrayWithLength } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Then, When } from '@cucumber/cucumber';

import { aliasCardInFlashcardQuantity } from './alias-keys/syllabus';
import { studentSubmitsQuizAnswer } from './syllabus-create-question-definitions';
import {
    studentSeesFinishedTopicProgressTitle,
    studentTapCloseButtonOnWhiteboard,
} from './syllabus-do-lo-quiz-definitions';
import {
    studentSketchesWhiteboardEnglish,
    studentScanWhiteboard,
    studentEraseWhiteboard,
} from './syllabus-sketch-whiteboard-definitions';
import { studentTapNextButton } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

When('student answer flashcard by handwriting', async function () {
    const totalCard = this.scenario.get<number>(aliasCardInFlashcardQuantity);

    await asyncForEach(createNumberArrayWithLength(totalCard), async (_, index) => {
        const isNotFirstLoop = index !== 0;
        await this.learner.instruction('Student opens the whiteboard', async () => {
            const fibAnswerInputKey = new ByValueKey(
                SyllabusLearnerKeys.answerFillTheBlankWithOriginalIndex(1)
            );

            await this.learner.flutterDriver!.tap(fibAnswerInputKey);
        });

        if (isNotFirstLoop) {
            await this.learner.instruction('Student erases the whiteboard', async () => {
                await studentEraseWhiteboard(this.learner);
            });
        }

        await this.learner.instruction('Student sketches a word into whiteboard', async () => {
            await studentSketchesWhiteboardEnglish(this.learner);
        });

        await this.learner.instruction('Student scans the whiteboard', async () => {
            await studentScanWhiteboard(this.learner);
        });

        await this.learner.instruction('Student closes the whiteboard', async () => {
            await studentTapCloseButtonOnWhiteboard(this.learner);
        });

        await studentSubmitsQuizAnswer(this.learner);
    });
});

Then('student sees all cards submitted', async function () {
    await this.learner.instruction(`Student goes next to crown equivalent screen`, async () => {
        await studentTapNextButton(this.learner);
    });

    await this.learner.instruction(`Student goes next screen`, async () => {
        await studentTapNextButton(this.learner);
    });
});

Then('student sees the learning progress screen', async function () {
    await this.learner.instruction(`Student sees topic progress screen`, async () => {
        await studentSeesFinishedTopicProgressTitle(this.learner);
    });
});
