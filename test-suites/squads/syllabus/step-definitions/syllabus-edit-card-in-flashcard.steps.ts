import {
    asyncForEach,
    createNumberArrayWithLength,
    getRandomElement,
    randomOneOfStringType,
    randomUniqueIntegersByType,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { genId } from '@supports/utils/ulid';

import {
    aliasCardsInFlashcard,
    aliasCardsMapIndexInFlashcard,
    aliasContentBookLOQuestionQuantity,
    aliasCourseId,
    aliasFlashcardName,
    aliasImageOfCardInFlashcard,
} from './alias-keys/syllabus';
import { tableBaseRow } from './cms-selectors/cms-keys';
import {
    teacherGoToCourseStudentDetail,
    teacherWaitingForStudyPlanListVisible,
} from './create-course-studyplan-definitions';
import {
    schoolAdminGetImageOfCardInFlashcard,
    studentSeesImageOfCardInFlashcard,
    studentSeesTermOrDefinitionOfCardInFlashCard,
    teacherNotSeesImageOfCardInFlashcard,
    teacherSeesDefinitionOfCardInFlashCard,
    teacherSeesImageOfCardInFlashcard,
    teacherSeesTermOfCardInFlashCard,
    teacherSeesTotalCardInFlashcard,
    studentSeesTermOrDefinitionOfCardInLearnFlashCard,
    studentSeesImageOfCardInLearnFlashcard,
    studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard,
} from './syllabus-card-flashcard-common-definitions';
import {
    schoolAdminWaitingForSaveCardFlashcardSuccess,
    schoolAdminSaveCardFlashcard,
    schoolAdminGetAllCardFormFlashcard,
    schoolAdminFillCardFlashcardForm,
    schoolAdminCheckAudioCardInFlashcard,
    schoolAdminSeeDefinitionOfCardInFlashcard,
    schoolAdminSeeTermOfCardInFlashcard,
    schoolAdminUploadCardImageFlashcard,
    schoolAdminSeeImageOfCardInFlashcard,
    schoolAdminSeeDefaultImageOfCardInFlashcard,
} from './syllabus-create-card-in-flashcard-definition';
import { teacherGoesToStudyPlanItemDetails } from './syllabus-create-question-definitions';
import { schoolAdminNotSeeTermOrDefinitionCardInFlashcard } from './syllabus-delete-card-in-flashcard-definitions';
import {
    schoolAdminClickAddMoreCardInFlashcard,
    schoolAdminCheckAndPrepareImage,
    schoolAdminDeleteCardImageInFlashcard,
} from './syllabus-edit-card-in-flashcard.definitions';
import { studentFlipFlashcard } from './syllabus-flip-flashcard-definitions';
import { studentSwipeToLearnCard } from './syllabus-learn-flashcard-definitions';
import { studentGoesToFlashcardLearnPage } from './syllabus-view-flashcard-learn-definitions';
import { QuizItemAttributeConfig } from 'manabuf/common/v1/contents_pb';
import { CardFlashcard } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

/* 
For edit data
We will random list index to modify cards [1, 3, 5];
Then we have a Map() { 1: CardFlashcard } { 3: CardFlashcard } { 5: CardFlashcard };
Finally we will assert card updated base on the above data
*/

When(
    `school admin edits {string} card in the flashcard`,
    async function (type: 'one' | 'multiple' | 'all') {
        const cardModifyMap: Map<number, CardFlashcard> = new Map();

        const elements = await schoolAdminGetAllCardFormFlashcard(this.cms);

        const randomIndexToEdit = randomUniqueIntegersByType(type, elements.length - 1);

        await asyncForEach<number, void>(randomIndexToEdit, async (modifyIndex) => {
            const formData: CardFlashcard = {
                term: `Term edit ${type} ${genId()}`,
                definition: `Definition edit ${type} ${genId()}`,
                language: getRandomElement([
                    QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_JP,
                    QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_ENG,
                ]),
            };

            await this.cms.instruction(`User edit card at index ${modifyIndex}`, async () => {
                await schoolAdminFillCardFlashcardForm(this.cms, modifyIndex, formData);
            });

            cardModifyMap.set(modifyIndex, formData);
        });

        this.scenario.set(aliasCardsMapIndexInFlashcard, [...cardModifyMap]);

        await this.cms.instruction('User submit action', async () => {
            await schoolAdminSaveCardFlashcard(this.cms);
            await schoolAdminWaitingForSaveCardFlashcardSuccess(this.cms);
        });
    }
);

Given('school admin edits data {string} card in the flashcard', async function (oneOfStr: string) {
    const cardModifyMap: Map<number, CardFlashcard> = new Map();

    const type = randomOneOfStringType<'one' | 'multiple' | 'all'>(oneOfStr);

    const elements = await schoolAdminGetAllCardFormFlashcard(this.cms);

    const randomIndexToEdit = randomUniqueIntegersByType(type, elements.length - 1);

    await asyncForEach<number, void>(randomIndexToEdit, async (modifyIndex) => {
        const formData: CardFlashcard = {
            term: `Term edit ${type} ${genId()}`,
            definition: `Definition edit ${type} ${genId()}`,
        };

        await this.cms.instruction(`User edit card at index ${modifyIndex}`, async () => {
            await schoolAdminFillCardFlashcardForm(this.cms, modifyIndex, formData);
        });

        cardModifyMap.set(modifyIndex, formData);
    });

    this.scenario.set(aliasCardsMapIndexInFlashcard, [...cardModifyMap]);
});

Then('school admin still sees card no change', async function () {
    const cardModifyMap = this.scenario.get<[number, CardFlashcard][]>(
        aliasCardsMapIndexInFlashcard
    );

    await asyncForEach<
        [number, CardFlashcard],
        void
    >(cardModifyMap, async ([modifyIndex, card]) => {
        const { term, definition } = card;

        const instruction = `User not see card updated with ${term} and ${definition} at index ${modifyIndex}`;

        await this.cms.instruction(instruction, async () => {
            await schoolAdminNotSeeTermOrDefinitionCardInFlashcard(this.cms, definition);
            await schoolAdminNotSeeTermOrDefinitionCardInFlashcard(this.cms, term);
        });
    });
});

Then('school admin sees {string} card is updated', async function (_: string) {
    const cardModifyMap = this.scenario.get<[number, CardFlashcard][]>(
        aliasCardsMapIndexInFlashcard
    );

    await asyncForEach<
        [number, CardFlashcard],
        void
    >(cardModifyMap, async ([modifyIndex, card]) => {
        const { term, definition, language } = card;
        const shouldShowAudio = language === QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_ENG;

        const instruction = `User see card updated with ${term} and ${definition} at index ${modifyIndex}`;
        const instructionAudio = `User will ${
            shouldShowAudio ? 'see' : 'not see'
        } audio at index ${modifyIndex}`;

        await this.cms.instruction(instruction, async () => {
            await schoolAdminSeeDefinitionOfCardInFlashcard(this.cms, definition, modifyIndex);
            await schoolAdminSeeTermOfCardInFlashcard(this.cms, term, modifyIndex);
        });

        await this.cms.instruction(instructionAudio, async () => {
            await schoolAdminCheckAudioCardInFlashcard(this.cms, shouldShowAudio, modifyIndex);
        });
    });
});

When(
    `school admin creates {int} more cards in the flashcard`,
    async function (totalAddMore: number) {
        const cards: CardFlashcard[] = [];
        const cardAvailableTotal = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);

        const totalCardForm = cardAvailableTotal + totalAddMore;

        await this.cms.instruction(`User click add more ${totalAddMore} times`, async () => {
            await schoolAdminClickAddMoreCardInFlashcard(this.cms, totalAddMore);
        });

        await this.cms.instruction(`User will see total are ${totalCardForm} forms`, async () => {
            const cardForms = await schoolAdminGetAllCardFormFlashcard(this.cms);
            weExpect(cardForms.length).toEqual(totalCardForm);
        });

        await asyncForEach<number, void>(
            createNumberArrayWithLength(totalAddMore),
            async (_, index) => {
                const formData: CardFlashcard = {
                    term: `Term more ${genId()}`,
                    definition: `Definition more ${genId()}`,
                    language: getRandomElement([
                        QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_JP,
                        QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_ENG,
                    ]),
                };

                const cardFormIndex = cardAvailableTotal + index;

                await this.cms.instruction(
                    `User will fill card form at index ${cardFormIndex}`,
                    async () => {
                        await schoolAdminFillCardFlashcardForm(this.cms, cardFormIndex, formData);
                    }
                );

                cards.push(formData);
            }
        );

        this.scenario.set(aliasCardsInFlashcard, cards);

        await this.cms.instruction('User submit action', async () => {
            await schoolAdminSaveCardFlashcard(this.cms);
            await schoolAdminWaitingForSaveCardFlashcardSuccess(this.cms);
        });
    }
);

Then('school admin sees newly created cards', async function () {
    const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);
    const cardAvailableTotal = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);

    await asyncForEach<CardFlashcard, void>(cards, async (item, index) => {
        const { term, definition, language } = item;
        const cardTableRowIndex = cardAvailableTotal + index;

        const instruction = `User see card created with ${term} and ${definition} at index ${cardTableRowIndex}`;

        await this.cms.instruction(instruction, async () => {
            await schoolAdminSeeDefinitionOfCardInFlashcard(
                this.cms,
                definition,
                cardTableRowIndex
            );
            await schoolAdminSeeTermOfCardInFlashcard(this.cms, term, cardTableRowIndex);
            await schoolAdminCheckAudioCardInFlashcard(
                this.cms,
                language === QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_ENG,
                cardTableRowIndex
            );
        });
    });
});

Then('school admin sees all cards', async function () {
    const cardAvailableTotal = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);
    const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);

    const totalCards = cardAvailableTotal + cards.length;

    await this.cms.instruction(`User sees total ${totalCards} card items`, async () => {
        const tableRows = await this.cms.page?.$$(tableBaseRow);
        weExpect(tableRows?.length).toEqual(totalCards);
    });
});

When(`school admin {string} image of card`, async function (action: 'delete' | 'update') {
    await schoolAdminCheckAndPrepareImage(this.cms, 0);

    await this.cms.instruction('User delete image of card at index 0', async () => {
        await schoolAdminDeleteCardImageInFlashcard(this.cms, 0);
    });

    if (action === 'update') {
        await this.cms.instruction('User upload new image to card at index 0', async () => {
            await schoolAdminUploadCardImageFlashcard(this.cms, 0);
        });
    }

    await this.cms.instruction('User submit action', async () => {
        await schoolAdminSaveCardFlashcard(this.cms);
        await schoolAdminWaitingForSaveCardFlashcardSuccess(this.cms);
    });
});

Then(`school admin sees {string} image`, async function (image: 'placeholder' | 'new') {
    if (image === 'placeholder') {
        const instruction = 'User sees default image when deleted image of card at index 0';
        await this.cms.instruction(instruction, async () => {
            await schoolAdminSeeDefaultImageOfCardInFlashcard(this.cms, 0);
        });
        return;
    }

    await this.cms.instruction('User sees image of card at index 0', async () => {
        await schoolAdminSeeImageOfCardInFlashcard(this.cms, 0);
    });

    const imgSrc = await schoolAdminGetImageOfCardInFlashcard(this.cms, 0);

    if (!imgSrc) throw Error("Can't get image");

    this.scenario.set(aliasImageOfCardInFlashcard, imgSrc);
});

Then('student sees newly created cards in Flashcard Detail screen', async function () {
    const cardAvailableTotal = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);
    const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);

    await asyncForEach<CardFlashcard, void>(cards, async (card, index) => {
        const { term, definition, language } = card;
        const shouldVisible = language === QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_ENG;
        const seeOrNotSee = shouldVisible ? 'see' : 'not see';
        const indexExpect = cardAvailableTotal + index;

        await this.learner.instruction(
            `Student sees term ${term} at index ${indexExpect}`,
            async () => {
                await studentSeesTermOrDefinitionOfCardInFlashCard(
                    this.learner,
                    'term',
                    term,
                    indexExpect
                );
            }
        );

        await this.learner.instruction(
            `Student will ${seeOrNotSee} term audio of card`,
            async () => {
                await studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard(
                    this.learner,
                    'term',
                    shouldVisible,
                    indexExpect
                );
            }
        );

        await this.learner.instruction(`Flip card at index ${indexExpect}`, async () => {
            await studentFlipFlashcard(this.learner, indexExpect, 'term');
        });

        await this.learner.instruction(
            `Student sees definition ${definition} at index ${indexExpect}`,
            async () => {
                await studentSeesTermOrDefinitionOfCardInFlashCard(
                    this.learner,
                    'definition',
                    definition,
                    indexExpect
                );
            }
        );

        await this.learner.instruction(
            `Student will ${seeOrNotSee} definition audio of card`,
            async () => {
                await studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard(
                    this.learner,
                    'definition',
                    shouldVisible,
                    indexExpect
                );
            }
        );
    });
});

Then('student sees newly created cards in Flashcard Learn screen', async function () {
    const cardAvailableTotal = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);
    const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);

    const cardFiltered: Set<number> = new Set();
    let isExit = false;

    await this.learner.instruction(`Student go to the flashcard learn screen`, async () => {
        await studentGoesToFlashcardLearnPage(this.learner);
    });

    await asyncForEach<
        number,
        void
    >(createNumberArrayWithLength(cardAvailableTotal + cards.length), async (_, index) => {
        await asyncForEach<CardFlashcard, void>(cards, async (card, cardIndex) => {
            if (cardFiltered.has(cardIndex)) return;

            const { definition, term, language } = card;
            const shouldVisible =
                language === QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_ENG;
            const seeOrNotSee = shouldVisible ? 'see' : 'not see';

            try {
                await studentSeesTermOrDefinitionOfCardInLearnFlashCard(
                    this.learner,
                    'definition',
                    definition,
                    index
                );

                await this.learner.instruction(`Student see definition ${definition}`, async () => {
                    console.log(`Student see definition ${definition}`);
                });

                await this.learner.instruction(
                    `Student will ${seeOrNotSee} definition audio of card`,
                    async () => {
                        await studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard(
                            this.learner,
                            'definition',
                            shouldVisible,
                            index
                        );
                    }
                );

                await studentFlipFlashcard(this.learner, index, 'definition');

                await this.learner.instruction(`Student see term ${term}`, async () => {
                    await studentSeesTermOrDefinitionOfCardInLearnFlashCard(
                        this.learner,
                        'term',
                        term,
                        index
                    );
                });

                await this.learner.instruction(
                    `Student will ${seeOrNotSee} term audio of card`,
                    async () => {
                        await studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard(
                            this.learner,
                            'term',
                            shouldVisible,
                            index
                        );
                    }
                );

                await studentSwipeToLearnCard(this.learner, index, 'term', true);

                cardFiltered.add(cardIndex);
                isExit = true;
            } catch {
                console.log('Current card is not match on the UI');
            }
        });
        if (!isExit) {
            isExit = false;
            await studentSwipeToLearnCard(this.learner, index, 'definition', true);
        }
    });

    weExpect(
        cardFiltered.size,
        `Student should see total ${cards.length} newly created but display is ${cardFiltered.size}`
    ).toEqual(cards.length);
});

Then('teacher sees newly created cards on the Teacher App', async function () {
    const cardAvailableTotal = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);
    const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);
    const totalCards = cardAvailableTotal + cards.length;

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

    await this.teacher.instruction(`Teacher sees total ${totalCards} cards`, async () => {
        await teacherSeesTotalCardInFlashcard(this.teacher, totalCards);
    });

    await asyncForEach<CardFlashcard, void>(cards, async (card, index) => {
        const { term, definition } = card;

        const indexExpect = cardAvailableTotal + index;

        await this.teacher.instruction(
            `Teacher sees card ${term} and ${definition} at index ${indexExpect}`,
            async () => {
                await teacherSeesTermOfCardInFlashCard(this.teacher, term, indexExpect);
                await teacherSeesDefinitionOfCardInFlashCard(this.teacher, definition, indexExpect);
            }
        );
    });
});

Then('teacher sees card is updated on the Teacher App', async function () {
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

    const cardModifyMap = this.scenario.get<[number, CardFlashcard][]>(
        aliasCardsMapIndexInFlashcard
    );
    await asyncForEach<
        [number, CardFlashcard],
        void
    >(cardModifyMap, async ([modifyIndex, card]) => {
        const { term, definition } = card;

        const instruction = `Teacher sees card updated with ${term} and ${definition} at index ${modifyIndex}`;

        await this.teacher.instruction(instruction, async () => {
            await teacherSeesTermOfCardInFlashCard(this.teacher, term, modifyIndex);
            await teacherSeesDefinitionOfCardInFlashCard(this.teacher, definition, modifyIndex);
        });
    });
});

Then('student sees card is updated in Flashcard Detail screen', async function () {
    const cardModifyMap = this.scenario.get<[number, CardFlashcard][]>(
        aliasCardsMapIndexInFlashcard
    );

    await asyncForEach<
        [number, CardFlashcard],
        void
    >(cardModifyMap, async ([modifyIndex, card]) => {
        const { term, definition, language } = card;
        const shouldVisible = language === QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_ENG;
        const seeOrNotSee = shouldVisible ? 'see' : 'not see';

        await this.learner.instruction(
            `Student sees term ${term} at index ${modifyIndex}`,
            async () => {
                await studentSeesTermOrDefinitionOfCardInFlashCard(
                    this.learner,
                    'term',
                    term,
                    modifyIndex
                );
            }
        );

        await this.learner.instruction(
            `Student will ${seeOrNotSee} term audio of card`,
            async () => {
                await studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard(
                    this.learner,
                    'term',
                    shouldVisible,
                    modifyIndex
                );
            }
        );

        await this.learner.instruction(`Flip card at index ${modifyIndex}`, async () => {
            await studentFlipFlashcard(this.learner, modifyIndex, 'term');
        });

        await this.learner.instruction(
            `Student sees definition ${definition} at index ${modifyIndex}`,
            async () => {
                await studentSeesTermOrDefinitionOfCardInFlashCard(
                    this.learner,
                    'definition',
                    definition,
                    modifyIndex
                );
            }
        );

        await this.learner.instruction(
            `Student will ${seeOrNotSee} definition audio of card`,
            async () => {
                await studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard(
                    this.learner,
                    'definition',
                    shouldVisible,
                    modifyIndex
                );
            }
        );
    });
});

Then(
    'student sees card is updated in Flashcard Learn screen',
    { timeout: 150000 },
    async function () {
        const cardModifyMap = this.scenario.get<[number, CardFlashcard][]>(
            aliasCardsMapIndexInFlashcard
        );

        const cardAvailableTotal = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);

        const checked: Set<number> = new Set<number>();

        await this.learner.instruction(`Student go to the flashcard learn screen`, async () => {
            await studentGoesToFlashcardLearnPage(this.learner);
        });

        await asyncForEach<number, void>(
            createNumberArrayWithLength(cardAvailableTotal),
            async (_, index) => {
                let isExit = false;

                await asyncForEach(cardModifyMap, async ([modifyIndex, card]) => {
                    const { definition, term, language } = card;
                    const shouldVisible =
                        language === QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_ENG;
                    const seeOrNotSee = shouldVisible ? 'see' : 'not see';

                    if (checked.has(modifyIndex)) return;

                    try {
                        await studentSeesTermOrDefinitionOfCardInLearnFlashCard(
                            this.learner,
                            'definition',
                            definition,
                            index
                        );

                        await this.learner.instruction(
                            `Student see card definition ${definition}`,
                            async () => {
                                console.log(`Student see card definition ${definition}`);
                            }
                        );

                        await this.learner.instruction(
                            `Student will ${seeOrNotSee} definition audio of card`,
                            async () => {
                                await studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard(
                                    this.learner,
                                    'definition',
                                    shouldVisible,
                                    index
                                );
                            }
                        );

                        await studentFlipFlashcard(this.learner, index, 'definition');

                        await this.learner.instruction(
                            `Student see card term ${term}`,
                            async () => {
                                await studentSeesTermOrDefinitionOfCardInLearnFlashCard(
                                    this.learner,
                                    'term',
                                    term,
                                    index
                                );
                            }
                        );

                        await this.learner.instruction(
                            `Student will ${seeOrNotSee} term audio of card`,
                            async () => {
                                await studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard(
                                    this.learner,
                                    'term',
                                    shouldVisible,
                                    index
                                );
                            }
                        );

                        await studentSwipeToLearnCard(this.learner, index, 'term', true);

                        checked.add(modifyIndex);
                        isExit = true;
                    } catch {
                        console.log('Current card is not match on the UI');
                    }
                });

                if (!isExit) {
                    isExit = false;
                    await studentSwipeToLearnCard(this.learner, index, 'definition', true);
                }
            }
        );

        weExpect(
            checked.size,
            `student should see total ${cardModifyMap.length} cards updated but result is ${checked.size}`
        ).toEqual(cardModifyMap.length);
    }
);

Then(
    `student can {string} image in Flashcard Detail screen`,
    async function (action: 'see' | 'not see') {
        await this.learner.instruction(`Flip card at index 0`, async () => {
            await studentFlipFlashcard(this.learner, 0, 'term');
        });

        if (action === 'see') {
            const imgSrc = this.scenario.get(aliasImageOfCardInFlashcard);
            await this.learner.instruction(
                `Student sees image ${imgSrc} of card at index 0`,
                async () => {
                    await studentSeesImageOfCardInFlashcard(this.learner, imgSrc, 0);
                }
            );
            return;
        }

        await this.learner.instruction(`Student will not see image of card`, async () => {
            await studentSeesImageOfCardInLearnFlashcard(this.learner, '', 0);
        });
    }
);

Then(
    `student can {string} image in Flashcard Learn screen`,
    async function (action: 'see' | 'not see') {
        const cardAvailableTotal = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);
        let isSeeImg: undefined | boolean = undefined;

        await this.learner.instruction(`Student go to the flashcard learn screen`, async () => {
            await studentGoesToFlashcardLearnPage(this.learner);
        });

        await asyncForEach<number, void>(
            createNumberArrayWithLength(cardAvailableTotal),
            async (_, index) => {
                try {
                    if (typeof isSeeImg !== 'undefined') return;

                    if (action === 'see') {
                        const imgSrc = this.scenario.get(aliasImageOfCardInFlashcard);

                        await studentSeesImageOfCardInFlashcard(this.learner, imgSrc, index);

                        await this.learner.instruction(
                            `Student sees image ${imgSrc} of card at index ${index}`,
                            async () => {
                                isSeeImg = true;
                            }
                        );

                        return;
                    }

                    await studentSeesImageOfCardInLearnFlashcard(this.learner, '', index);

                    await this.learner.instruction(
                        `Student will not see image of card at index ${index}`,
                        async () => {
                            isSeeImg = false;
                        }
                    );
                } catch (error) {
                    await studentSwipeToLearnCard(this.learner, index, 'definition', true);
                }
            }
        );

        if (typeof isSeeImg === 'undefined') {
            throw new Error('Error come from cannot get empty image or new image element');
        }
    }
);

Then(`teacher can {string} on the Teacher App`, async function (action: 'see' | 'not see') {
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

    if (action === 'see') {
        const imgSrc = this.scenario.get(aliasImageOfCardInFlashcard);
        await this.teacher.instruction(
            `Teacher will new see image of card at index 0`,
            async () => {
                await teacherSeesImageOfCardInFlashcard(this.teacher, imgSrc, 0);
            }
        );

        return;
    }

    await this.teacher.instruction(`Teacher will not see image of card`, async () => {
        await teacherNotSeesImageOfCardInFlashcard(this.teacher, 0);
    });
});
