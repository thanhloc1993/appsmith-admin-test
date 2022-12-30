import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasCardInFlashcardQuantity,
    aliasContentBookLOQuestionQuantity,
    aliasCourseId,
    aliasCourseName,
    aliasFlashcardCurrentLearningIndex,
    aliasFlashcardName,
    aliasFlashcardSettingToggleType,
    aliasFlashcardTotalRememberedCards,
    aliasFlashcardTotalSkippedCards,
    aliasTopicName,
} from './alias-keys/syllabus';
import { studentWaitingSelectChapterWithBookScreenLoaded } from './syllabus-add-book-to-course-definitions';
import { studentGoesToLODetailsPage } from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { FlashcardSettingToggleType } from './syllabus-flip-flashcard-steps';
import {
    studentSeeCongratulationsCardInFlashcardLearnScreen,
    studentSeeNiceWorkCardInFlashcardLearnScreen,
    studentSwipeToLearnCard,
    studentTapContinueLearningFlashcard,
    studentTapRestartLearningFlashcard,
    teacherCheckFlashcardResultCompleted,
} from './syllabus-learn-flashcard-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import {
    studentRefreshHomeScreen,
    studentGoToCourseDetail,
    studentTapButtonOnScreen,
} from './syllabus-utils';
import { studentGoesToFlashcardLearnPage } from './syllabus-view-flashcard-learn-definitions';
import { ByValueKey } from 'flutter-driver-x';

export type QuantityFlashcardLearningType = 'one' | 'multiple' | 'all';

Given(
    `student has learned {string} cards in flashcard with skipping {int} cards`,
    async function (
        this: IMasterWorld,
        quantityFlashcardLearningType: QuantityFlashcardLearningType,
        numberOfSkippedCard: number
    ): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const courseName = context.get<string>(aliasCourseName);
        const topicName = context.get<string>(aliasTopicName);
        const flashcardName = context.get<string>(aliasFlashcardName);
        const questionQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);
        const flashcardSettingToggleType: FlashcardSettingToggleType =
            context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ??
            'definition';
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

        let questionLearningQuantity = questionQuantity;
        switch (quantityFlashcardLearningType) {
            case 'one':
                questionLearningQuantity = 1;
                break;
            case 'multiple':
                questionLearningQuantity = questionQuantity - 1;
                break;
            default:
                break;
        }
        let indexSkippedCard = 0;
        let totalSkippedCards = 0;
        let totalRememberedCards = 0;
        for (let index = 0; index < questionLearningQuantity; index++) {
            if (indexSkippedCard < numberOfSkippedCard) {
                indexSkippedCard += 1;
                totalSkippedCards += 1;
                await learner.instruction(
                    `Student swipe left card to skip at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            false
                        );
                        context.set(aliasFlashcardTotalSkippedCards, totalSkippedCards);
                    }
                );
            } else {
                totalRememberedCards += 1;
                await learner.instruction(
                    `Student swipe right card to learn at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            true
                        );
                        context.set(aliasFlashcardTotalRememberedCards, totalRememberedCards);
                    }
                );
            }
            context.set(aliasFlashcardCurrentLearningIndex, index + 1);
        }
    }
);

Given(
    `student has continued learning {string} cards in flashcard with skipping {int} cards`,
    async function (
        this: IMasterWorld,
        quantityFlashcardLearningType: QuantityFlashcardLearningType,
        numberOfSkippedCard: number
    ): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const previousFlashcardTotalSkippedCards = context.get<number>(
            aliasFlashcardTotalSkippedCards
        );
        const flashcardSettingToggleType: FlashcardSettingToggleType =
            context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ??
            'definition';

        await learner.instruction(`Student tap on continue learning button`, async () => {
            await studentTapContinueLearningFlashcard(learner);
            //Total skipped will be our next quantity of flashcard
            context.set(aliasContentBookLOQuestionQuantity, previousFlashcardTotalSkippedCards);
            context.set(aliasFlashcardCurrentLearningIndex, 0);
        });

        let questionLearningQuantity = previousFlashcardTotalSkippedCards;
        switch (quantityFlashcardLearningType) {
            case 'one':
                questionLearningQuantity = 1;
                break;
            case 'multiple':
                questionLearningQuantity = questionLearningQuantity - 1;
                break;
            default:
                break;
        }
        let indexSkippedCard = 0;
        let totalSkippedCards = 0;
        let totalRememberedCards = 0;
        for (let index = 0; index < questionLearningQuantity; index++) {
            if (indexSkippedCard < numberOfSkippedCard) {
                indexSkippedCard += 1;
                totalSkippedCards += 1;
                await learner.instruction(
                    `Student swipe left card to skip at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            false
                        );
                        context.set(aliasFlashcardTotalSkippedCards, totalSkippedCards);
                    }
                );
            } else {
                totalRememberedCards += 1;
                await learner.instruction(
                    `Student swipe right card to learn at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            true
                        );
                        context.set(aliasFlashcardTotalRememberedCards, totalRememberedCards);
                    }
                );
            }
            context.set(aliasFlashcardCurrentLearningIndex, index + 1);
        }
    }
);

Given(
    `student stands at card's position {int}`,
    async function (this: IMasterWorld, expectedCardPosition: number): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const flashcardSettingToggleType: FlashcardSettingToggleType =
            context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ??
            'definition';
        let totalRememberedCards = 0;

        for (let index = 0; index < expectedCardPosition; index++) {
            totalRememberedCards += 1;
            await learner.instruction(
                `Student swipe right card to learn at position ${index}`,
                async () => {
                    await studentSwipeToLearnCard(learner, index, flashcardSettingToggleType, true);
                    context.set(aliasFlashcardTotalRememberedCards, totalRememberedCards);
                }
            );

            context.set(aliasFlashcardCurrentLearningIndex, index + 1);
        }
    }
);

Given(
    `student stands at card's position {int} with skipping {int} cards`,
    async function (
        this: IMasterWorld,
        expectedCardPosition: number,
        numberOfSkippedCard: number
    ): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const flashcardSettingToggleType: FlashcardSettingToggleType =
            context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ??
            'definition';
        let indexSkippedCard = 0;
        let totalSkippedCards = 0;
        let totalRememberedCards = 0;
        for (let index = 0; index < expectedCardPosition; index++) {
            if (indexSkippedCard < numberOfSkippedCard) {
                indexSkippedCard += 1;
                totalSkippedCards += 1;
                await learner.instruction(
                    `Student swipe left card to skip at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            false
                        );
                        context.set(aliasFlashcardTotalSkippedCards, totalSkippedCards);
                    }
                );
            } else {
                totalRememberedCards += 1;
                await learner.instruction(
                    `Student swipe right card to learn at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            true
                        );
                        context.set(aliasFlashcardTotalRememberedCards, totalRememberedCards);
                    }
                );
            }
            context.set(aliasFlashcardCurrentLearningIndex, index + 1);
        }
    }
);

Given(
    `student continues learning and stands at card's position {int}`,
    async function (this: IMasterWorld, expectedCardPosition: number): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const flashcardSettingToggleType: FlashcardSettingToggleType =
            context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ??
            'definition';
        const previousFlashcardTotalSkippedCards = context.get<number>(
            aliasFlashcardTotalSkippedCards
        );

        await learner.instruction(`Student tap on continue learning button`, async () => {
            await studentTapContinueLearningFlashcard(learner);
            //Total skipped will be our next quantity of flashcard
            context.set(aliasContentBookLOQuestionQuantity, previousFlashcardTotalSkippedCards);
            context.set(aliasFlashcardCurrentLearningIndex, 0);
        });

        let totalRememberedCards = 0;

        for (let index = 0; index < expectedCardPosition; index++) {
            totalRememberedCards += 1;
            await learner.instruction(
                `Student swipe right card to learn at position ${index}`,
                async () => {
                    await studentSwipeToLearnCard(learner, index, flashcardSettingToggleType, true);
                    context.set(aliasFlashcardTotalRememberedCards, totalRememberedCards);
                }
            );

            context.set(aliasFlashcardCurrentLearningIndex, index + 1);
        }
    }
);

Given(
    `student continues learning and stands at card's position {int} with skipping {int} cards`,
    async function (
        this: IMasterWorld,
        expectedCardPosition: number,
        numberOfSkippedCard: number
    ): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const flashcardSettingToggleType: FlashcardSettingToggleType =
            context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ??
            'definition';
        const previousFlashcardTotalSkippedCards = context.get<number>(
            aliasFlashcardTotalSkippedCards
        );

        await learner.instruction(`Student tap on continue learning button`, async () => {
            await studentTapContinueLearningFlashcard(learner);
            //Total skipped will be our next quantity of flashcard
            context.set(aliasContentBookLOQuestionQuantity, previousFlashcardTotalSkippedCards);
            context.set(aliasFlashcardCurrentLearningIndex, 0);
        });

        let indexSkippedCard = 0;
        let totalSkippedCards = 0;
        let totalRememberedCards = 0;
        for (let index = 0; index < expectedCardPosition; index++) {
            if (indexSkippedCard < numberOfSkippedCard) {
                indexSkippedCard += 1;
                totalSkippedCards += 1;
                await learner.instruction(
                    `Student swipe left card to skip at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            false
                        );
                        context.set(aliasFlashcardTotalSkippedCards, totalSkippedCards);
                    }
                );
            } else {
                totalRememberedCards += 1;
                await learner.instruction(
                    `Student swipe right card to learn at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            true
                        );
                        context.set(aliasFlashcardTotalRememberedCards, totalRememberedCards);
                    }
                );
            }
            context.set(aliasFlashcardCurrentLearningIndex, index + 1);
        }
    }
);

Given(`student stands at the final card`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const questionQuantity = context.get<number>(aliasCardInFlashcardQuantity);
    const flashcardSettingToggleType: FlashcardSettingToggleType =
        context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ?? 'definition';
    let totalRememberedCards = 0;

    for (let index = 0; index < questionQuantity - 1; index++) {
        totalRememberedCards += 1;
        await learner.instruction(
            `Student swipe right card to learn at position ${index}`,
            async () => {
                await studentSwipeToLearnCard(learner, index, flashcardSettingToggleType, true);
                context.set(aliasFlashcardTotalRememberedCards, totalRememberedCards);
            }
        );

        context.set(aliasFlashcardCurrentLearningIndex, index + 1);
    }
});

Given(
    `student stands at the final card with skipping {int} cards`,
    async function (this: IMasterWorld, numberOfSkippedCard: number): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const questionQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);
        const flashcardSettingToggleType: FlashcardSettingToggleType =
            context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ??
            'definition';
        let totalRememberedCards = 0;
        let totalSkippedCards = 0;
        let indexSkippedCard = 0;
        for (let index = 0; index < questionQuantity - 1; index++) {
            if (indexSkippedCard < numberOfSkippedCard) {
                indexSkippedCard += 1;
                totalSkippedCards += 1;
                await learner.instruction(
                    `Student swipe left card to skip at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            false
                        );
                        context.set(aliasFlashcardTotalSkippedCards, totalSkippedCards);
                    }
                );
            } else {
                totalRememberedCards += 1;
                await learner.instruction(
                    `Student swipe right card to learn at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            true
                        );
                        context.set(aliasFlashcardTotalRememberedCards, totalRememberedCards);
                    }
                );
            }
            context.set(aliasFlashcardCurrentLearningIndex, index + 1);
        }
    }
);

Given(`student has stopped learning flashcard`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const topicName = context.get<string>(aliasTopicName);
    const flashcardName = context.get<string>(aliasFlashcardName);

    await learner.instruction(
        `Student back to Flashcard Detail Screen from Flashcard Learn Screen`,
        async () => {
            await studentTapButtonOnScreen(
                learner,
                SyllabusLearnerKeys.flash_card_practice_screen(flashcardName),
                SyllabusLearnerKeys.back_button
            );
        }
    );

    await learner.instruction(
        `Student back to LO List Screen from Flashcard Detail Screen`,
        async () => {
            await studentTapButtonOnScreen(
                learner,
                SyllabusLearnerKeys.flash_card_preview_screen(flashcardName),
                SyllabusLearnerKeys.back_button
            );
        }
    );

    await learner.instruction(
        `Student back to Book Detail Screen from LO List Screen`,
        async () => {
            await studentTapButtonOnScreen(
                learner,
                SyllabusLearnerKeys.lo_list_screen(topicName),
                SyllabusLearnerKeys.back_button
            );
        }
    );

    await learner.instruction(`Student back to Home Screen from Book Detail Screen`, async () => {
        await studentTapButtonOnScreen(
            learner,
            SyllabusLearnerKeys.book_detail_screen,
            SyllabusLearnerKeys.back_button
        );
    });
});

When(`student swipes left the card`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const flashcardSettingToggleType: FlashcardSettingToggleType =
        context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ?? 'definition';

    const flashcardCurrentLearningIndex =
        context.get<number>(aliasFlashcardCurrentLearningIndex) ?? 0;

    const previousFlashcardTotalSkippedCards =
        context.get<number>(aliasFlashcardTotalSkippedCards) ?? 0;

    await learner.instruction(
        `Student swipe left card to skip at position ${flashcardCurrentLearningIndex}`,
        async () => {
            await studentSwipeToLearnCard(
                learner,
                flashcardCurrentLearningIndex,
                flashcardSettingToggleType,
                false
            );
        }
    );
    context.set(aliasFlashcardTotalSkippedCards, previousFlashcardTotalSkippedCards + 1);
    context.set(aliasFlashcardCurrentLearningIndex, flashcardCurrentLearningIndex + 1);
});

When(`student swipes right the card`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const flashcardSettingToggleType: FlashcardSettingToggleType =
        context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ?? 'definition';

    const flashcardCurrentLearningIndex =
        context.get<number>(aliasFlashcardCurrentLearningIndex) ?? 0;

    const previousFlashcardTotalRememberedCards =
        context.get<number>(aliasFlashcardTotalRememberedCards) ?? 0;

    await learner.instruction(
        `Student swipe right card to skip at position ${flashcardCurrentLearningIndex}`,
        async () => {
            await studentSwipeToLearnCard(
                learner,
                flashcardCurrentLearningIndex,
                flashcardSettingToggleType,
                true
            );
        }
    );
    context.set(aliasFlashcardTotalRememberedCards, previousFlashcardTotalRememberedCards + 1);
    context.set(aliasFlashcardCurrentLearningIndex, flashcardCurrentLearningIndex + 1);
});

When(
    `student learns until card's position {int} with skipping {int} cards`,
    async function (
        this: IMasterWorld,
        expectedCardPosition: number,
        numberOfSkippedCard: number
    ): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const flashcardSettingToggleType: FlashcardSettingToggleType =
            context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ??
            'definition';

        let indexSkippedCard = 0;
        let totalSkippedCards = 0;
        let totalRememberedCards = 0;
        for (let index = 0; index < expectedCardPosition; index++) {
            if (indexSkippedCard < numberOfSkippedCard) {
                indexSkippedCard += 1;
                totalSkippedCards += 1;
                await learner.instruction(
                    `Student swipe left card to skip at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            false
                        );
                        context.set(aliasFlashcardTotalSkippedCards, totalSkippedCards);
                    }
                );
            } else {
                totalRememberedCards += 1;
                await learner.instruction(
                    `Student swipe right card to learn at position ${index}`,
                    async () => {
                        await studentSwipeToLearnCard(
                            learner,
                            index,
                            flashcardSettingToggleType,
                            true
                        );
                        context.set(aliasFlashcardTotalRememberedCards, totalRememberedCards);
                    }
                );
            }
            context.set(aliasFlashcardCurrentLearningIndex, index + 1);
        }
    }
);

When(
    `student selects restart learning in Flashcard Learn Screen`,
    async function (): Promise<void> {
        const learner = this.learner;

        await learner.instruction(`Student tap on restart learning button`, async () => {
            await studentTapRestartLearningFlashcard(learner);
        });
    }
);

When(
    `student selects continue learning in Flashcard Learn Screen`,
    async function (): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const previousFlashcardTotalSkippedCards = context.get<number>(
            aliasFlashcardTotalSkippedCards
        );
        await learner.instruction(`Student tap on continue learning button`, async () => {
            await studentTapContinueLearningFlashcard(learner);
            //Total skipped will be our next quantity of flashcard
            context.set(aliasContentBookLOQuestionQuantity, previousFlashcardTotalSkippedCards);
            context.set(aliasFlashcardCurrentLearningIndex, 0);
        });
    }
);

Then(`student sees next card in Flashcard Learn screen`, async function (): Promise<void> {
    const context = this.scenario;
    const learner = this.learner;
    const flashcardSettingToggleType: FlashcardSettingToggleType =
        context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ?? 'definition';

    const flashcardCurrentLearningIndex = context.get<number>(aliasFlashcardCurrentLearningIndex);

    await learner.instruction(
        `Student sees next card at position ${flashcardCurrentLearningIndex}`,
        async () => {
            const cardKey =
                flashcardSettingToggleType == 'definition'
                    ? SyllabusLearnerKeys.flashCardItemDefinition(flashcardCurrentLearningIndex)
                    : SyllabusLearnerKeys.flashCardItemTerm(flashcardCurrentLearningIndex);
            await learner.flutterDriver!.waitFor(new ByValueKey(cardKey));
        }
    );
});

Then(
    `student can learn the rest of cards in Flashcard Learn screen`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const questionQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);
        const flashcardSettingToggleType: FlashcardSettingToggleType =
            context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ??
            'definition';

        const flashcardCurrentLearningIndex = context.get<number>(
            aliasFlashcardCurrentLearningIndex
        );

        for (let index = flashcardCurrentLearningIndex; index < questionQuantity; index++) {
            await learner.instruction(
                `Student swipe right card to learn at position ${index}`,
                async () => {
                    await studentSwipeToLearnCard(learner, index, flashcardSettingToggleType, true);
                }
            );
            context.set(aliasFlashcardCurrentLearningIndex, index + 1);
        }
    }
);

Then(
    `student learns new card set with {int} skipping cards from the latest learning attempt`,
    async function (this: IMasterWorld, numberOfSkippedCard: number): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const questionQuantity = numberOfSkippedCard;
        const flashcardSettingToggleType: FlashcardSettingToggleType =
            context.get<FlashcardSettingToggleType>(aliasFlashcardSettingToggleType) ??
            'definition';

        const flashcardCurrentLearningIndex = context.get<number>(
            aliasFlashcardCurrentLearningIndex
        );

        for (let index = flashcardCurrentLearningIndex; index < questionQuantity; index++) {
            await learner.instruction(
                `Student swipe right card to learn at position ${index}`,
                async () => {
                    await studentSwipeToLearnCard(learner, index, flashcardSettingToggleType, true);
                }
            );
            context.set(aliasFlashcardCurrentLearningIndex, index + 1);
        }

        await learner.instruction(`Student sees congratulations card`, async () => {
            await studentSeeCongratulationsCardInFlashcardLearnScreen(learner);
        });
    }
);

Then(
    `student sees nice work card in Flashcard Learn screen`,
    async function (this: IMasterWorld): Promise<void> {
        const learner = this.learner;

        await learner.instruction(`Student sees nice work card`, async () => {
            await studentSeeNiceWorkCardInFlashcardLearnScreen(learner);
        });
    }
);

Then(
    `student sees congratulations card in Flashcard Learn screen`,
    async function (this: IMasterWorld): Promise<void> {
        const learner = this.learner;

        await learner.instruction(`Student sees congratulations card`, async () => {
            await studentSeeCongratulationsCardInFlashcardLearnScreen(learner);
        });
    }
);

Then(
    `teacher sees student's flashcard result is still displayed as completed`,
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseId = context.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();
        const flashcardName = context.get<string>(aliasFlashcardName);

        await this.teacher.instruction(
            `teacher goes to study plan management screen`,
            async function (teacher) {
                await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `teacher see student's flashcard result is completed`,
            async function (teacher) {
                await teacherCheckFlashcardResultCompleted(teacher, flashcardName);
            }
        );
    }
);
