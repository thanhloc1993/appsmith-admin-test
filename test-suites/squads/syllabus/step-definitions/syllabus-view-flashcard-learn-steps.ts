import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasCourseName,
    aliasFlashcardTotalSkippedCards,
    aliasContentBookLOQuestionQuantity,
    aliasFlashcardCurrentLearningIndex,
    aliasTopicName,
    aliasFlashcardTotalRememberedCards,
    aliasFlashcardSettingToggleType,
    aliasFlashcardName,
} from './alias-keys/syllabus';
import { studentWaitingSelectChapterWithBookScreenLoaded } from './syllabus-add-book-to-course-definitions';
import { studentGoesToLODetailsPage } from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { FlashcardSettingToggleType } from './syllabus-flip-flashcard-steps';
import { studentRefreshHomeScreen, studentGoToCourseDetail } from './syllabus-utils';
import {
    studentDoesNotSeeOptionsBottomButtonInFlashcardLearn,
    studentGoesToFlashcardLearnPage,
    studentOpenOptionsSectionInFlashcardLearn,
    studentSeeFlashcardLearnScreen,
    studentSeeFlashcardPracticeAtPosition,
    studentSeeOptionsBottomModalInFlashcardLearn,
    studentSeeProgressFlashcard,
    studentSeeRememberedTotalCards,
    studentSeeSkippedTotalCards,
    studentSeeStatusFlashcardUndoButton,
    studentSelectsTestButtonInFlashcardLearnPage,
    studentTapOptionsBottomButtonInFlashcardLearn,
} from './syllabus-view-flashcard-learn-definitions';
import { ByValueKey } from 'flutter-driver-x';

export type FlashcardUndoLearnButtonStatus = 'enabled' | 'disabled' | 'disappeared';

Given(`student goes to Flashcard Learn screen`, async function () {
    const learner = this.learner;
    const courseName = this.scenario.get(aliasCourseName);
    const topicName = this.scenario.get(aliasTopicName);
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

    await learner.instruction(`Student go to the flashcard learn screen`, async () => {
        await studentGoesToFlashcardLearnPage(learner);
    });
});

Given(`student opens Options section in Flashcard Learn screen`, async function (): Promise<void> {
    const learner = this.learner;

    await learner.instruction(`Student tap options button to open Options section`, async () => {
        await studentOpenOptionsSectionInFlashcardLearn(learner);
    });
});

When(`student selects learn button in Flashcard Detail screen`, async function (): Promise<void> {
    const learner = this.learner;

    await this.learner.instruction(`Student tap learn button`, async () => {
        await studentGoesToFlashcardLearnPage(learner);
    });
});

When(`student selects options button in Flashcard Learn screen`, async function (): Promise<void> {
    const learner = this.learner;

    await learner.instruction(`Student tap options button`, async () => {
        await studentTapOptionsBottomButtonInFlashcardLearn(learner);
    });
});

When(`student selects top back button in Flashcard Learn screen`, async function (): Promise<void> {
    const learner = this.learner;
    const driver = learner.flutterDriver!;
    await learner.instruction(`Student select top back button`, async () => {
        await driver!.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
    });
});

When(`student selects Test Button in Flashcard Learn Screen`, async function (): Promise<void> {
    const learner = this.learner;

    await this.learner.instruction(`Student tap test your memory button`, async () => {
        await studentSelectsTestButtonInFlashcardLearnPage(learner);
    });
});

Then(`student backs to Flashcard Learn Screen`, async function (): Promise<void> {
    const learner = this.learner;
    await learner.instruction(`Student select learn button`, async () => {
        await studentGoesToFlashcardLearnPage(learner);
    });
});

Then(`student sees Flashcard Learn screen`, async function () {
    const flashcardName = this.scenario.get<string>(aliasFlashcardName);

    await studentSeeFlashcardLearnScreen(this.learner, flashcardName);
});

Then(`student sees the number of skipped cards increase 1`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const previousFlashcardTotalSkippedCards =
        context.get<number>(aliasFlashcardTotalSkippedCards) ?? 0;
    await learner.instruction(
        `Student see total skipped cards is ${previousFlashcardTotalSkippedCards}`,
        async () => {
            await studentSeeSkippedTotalCards(learner, previousFlashcardTotalSkippedCards);
        }
    );
});

Then(`student sees the number of remembered cards increase 1`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const previousFlashcardTotalRememberedCards =
        context.get<number>(aliasFlashcardTotalRememberedCards) ?? 0;
    await learner.instruction(
        `Student see total remembered cards is ${previousFlashcardTotalRememberedCards}`,
        async () => {
            await studentSeeRememberedTotalCards(learner, previousFlashcardTotalRememberedCards);
        }
    );
});

Then(`student sees progress bar show current with total cards`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const flashcardQuizLength = context.get<number>(aliasContentBookLOQuestionQuantity);
    const flashcardCurrentLearningIndex =
        context.get<number>(aliasFlashcardCurrentLearningIndex) ?? 0;

    const flashcardShowingProgress =
        flashcardCurrentLearningIndex + 1 > flashcardQuizLength
            ? flashcardCurrentLearningIndex
            : flashcardCurrentLearningIndex + 1;
    await this.learner.instruction(
        `Student see progress showing is ${flashcardShowingProgress}/${flashcardQuizLength}`,
        async () => {
            await studentSeeProgressFlashcard(
                learner,
                flashcardCurrentLearningIndex,
                flashcardQuizLength
            );
        }
    );
});

Then(
    `student sees new card set with {int} skipping cards from the latest learning attempt`,
    async function (this: IMasterWorld, numberOfSkippedCards: number): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const flashcardCurrentLearningIndex =
            context.get<number>(aliasFlashcardCurrentLearningIndex) ?? 0;

        const flashcardShowingProgress =
            flashcardCurrentLearningIndex + 1 > numberOfSkippedCards
                ? flashcardCurrentLearningIndex
                : flashcardCurrentLearningIndex + 1;
        await this.learner.instruction(
            `Student see progress showing is ${flashcardShowingProgress}/${numberOfSkippedCards}`,
            async () => {
                await studentSeeProgressFlashcard(
                    learner,
                    flashcardCurrentLearningIndex,
                    numberOfSkippedCards
                );
            }
        );
    }
);

Then(
    `student sees the number of skipped cards is {int}`,
    async function (this: IMasterWorld, numberOfSkippedCards: number): Promise<void> {
        const learner = this.learner;

        await this.learner.instruction(
            `Student see the number of skipped cards is ${numberOfSkippedCards}`,
            async () => {
                await studentSeeSkippedTotalCards(learner, numberOfSkippedCards);
            }
        );
    }
);

Then(
    `student sees the number of remembered cards is {int}`,
    async function (this: IMasterWorld, numberOfRememberedCards: number): Promise<void> {
        const learner = this.learner;

        await this.learner.instruction(
            `Student see the number of remembered cards is ${numberOfRememberedCards}`,
            async () => {
                await studentSeeRememberedTotalCards(learner, numberOfRememberedCards);
            }
        );
    }
);

Then(`student sees Options Section in Flashcard Learn screen`, async function (): Promise<void> {
    const learner = this.learner;

    await learner.instruction(`Student sees options section`, async () => {
        await studentSeeOptionsBottomModalInFlashcardLearn(learner);
    });
});

Then(`student does not see options button in Flashcard Learn screen`, async function () {
    await this.learner.instruction(`Student does not see options button`, async () => {
        await studentDoesNotSeeOptionsBottomButtonInFlashcardLearn(this.learner);
    });
});

Then(
    `student sees bottom back button is {string} in Flashcard Learn Screen`,
    async function (
        this: IMasterWorld,
        flashcardUndoLearnButtonStatus: FlashcardUndoLearnButtonStatus
    ): Promise<void> {
        const learner = this.learner;

        await learner.instruction(
            `Student sees undo back button is ${flashcardUndoLearnButtonStatus}`,
            async () => {
                await studentSeeStatusFlashcardUndoButton(learner, flashcardUndoLearnButtonStatus);
            }
        );
    }
);

Then(
    `student sees card at position {int}`,
    async function (this: IMasterWorld, cardPosition: number): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;

        const flashcardSettingToggleType =
            context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ??
            'definition';

        await learner.instruction(
            `student sees ${flashcardSettingToggleType} card at position ${cardPosition}`,
            async () => {
                await studentSeeFlashcardPracticeAtPosition(
                    learner,
                    cardPosition,
                    flashcardSettingToggleType == 'term'
                );
            }
        );
    }
);

Then(
    `student sees progress bar show progress {int} with total cards`,
    async function (this: IMasterWorld, progressNumber: number): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const flashcardQuizLength = context.get<number>(aliasContentBookLOQuestionQuantity);

        await this.learner.instruction(
            `Student see progress showing is ${progressNumber}/${flashcardQuizLength}`,
            async () => {
                await studentSeeProgressFlashcard(learner, progressNumber - 1, flashcardQuizLength);
            }
        );
    }
);

Then(
    `student sees progress bar show progress {int} with total skipping cards`,
    async function (this: IMasterWorld, progressNumber: number): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const flashcardQuizLength = context.get<number>(aliasContentBookLOQuestionQuantity);

        await this.learner.instruction(
            `Student see progress showing is ${progressNumber}/${flashcardQuizLength}`,
            async () => {
                await studentSeeProgressFlashcard(learner, progressNumber - 1, flashcardQuizLength);
            }
        );
    }
);

Then(`student sees a new card set in Flashcard Learn Screen`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const flashcardName = context.get<string>(aliasFlashcardName);
    const flashcardQuizLength = context.get<number>(aliasContentBookLOQuestionQuantity);

    await studentSeeFlashcardLearnScreen(learner, flashcardName);

    await this.learner.instruction(
        `Student see progress showing is 1/${flashcardQuizLength}`,
        async () => {
            await studentSeeProgressFlashcard(learner, 0, flashcardQuizLength);
        }
    );

    await this.learner.instruction(`Student see the number of remembered cards is 0`, async () => {
        await studentSeeRememberedTotalCards(learner, 0);
    });

    await this.learner.instruction(`Student see the number of skipped cards is 0`, async () => {
        await studentSeeSkippedTotalCards(learner, 0);
    });
});
