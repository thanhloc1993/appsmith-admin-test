import {
    asyncForEach,
    convertOneOfStringTypeToArray,
    getRandomElement,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { SeeOrNotSee } from '@supports/types/cms-types';
import { genId } from '@supports/utils/ulid';

import {
    aliasCardsInFlashcard,
    aliasCourseId,
    aliasFlashcardName,
    aliasImageOfCardInFlashcard,
} from './alias-keys/syllabus';
import { flashCardIcon } from './cms-selectors/cms-keys';
import {
    teacherGoToCourseStudentDetail,
    teacherWaitingForStudyPlanListVisible,
} from './create-course-studyplan-definitions';
import {
    schoolAdminGetImageOfCardInFlashcard,
    studentCheckTermOrDefinitionAudioOfCardInFlashcard,
    studentSeesImageOfCardInFlashcard,
    studentSeesTermOrDefinitionOfCardInFlashCard,
    studentSeesTermOrDefinitionOfCardInLearnFlashCard,
    teacherSeesDefinitionOfCardInFlashCard,
    teacherSeesImageOfCardInFlashcard,
    teacherSeesTermOfCardInFlashCard,
    studentSeesImageOfCardInLearnFlashcard,
    studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard,
} from './syllabus-card-flashcard-common-definitions';
import {
    schoolAdminFillCardFlashcardForm,
    schoolAdminOpenDialogUpsertCardInFlashcard,
    schoolAdminSaveCardFlashcard,
    schoolAdminWaitingForSaveCardFlashcardSuccess,
    schoolAdminGetAllCardFormFlashcard,
    schoolAdminSeesErrorForField,
    schoolAdminDeleteCardsInFlashcard,
    schoolAdminCheckAudioCardInFlashcard,
    schoolAdminSeeImageOfCardInFlashcard,
    schoolAdminSeeDefinitionOfCardInFlashcard,
    schoolAdminSeeTermOfCardInFlashcard,
    schoolAdminSeeDefaultImageOfCardInFlashcard,
    schoolAdminUploadCardImageFlashcard,
} from './syllabus-create-card-in-flashcard-definition';
import { teacherGoesToStudyPlanItemDetails } from './syllabus-create-question-definitions';
import { schoolAdminSeeEmptyCardListInFlashcard } from './syllabus-delete-card-in-flashcard-definitions';
import { studentFlipFlashcard } from './syllabus-flip-flashcard-definitions';
import { studentSwipeToLearnCard } from './syllabus-learn-flashcard-definitions';
import { studentGoesToFlashcardLearnPage } from './syllabus-view-flashcard-learn-definitions';
import { QuizItemAttributeConfig } from 'manabuf/common/v1/contents_pb';
import { CardFlashcard } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

type FlashcardLanguage = 'EN' | 'VI';

// Because this form is upsert multiple so we have schoolAdminDeleteCardsInFlashcard to delete some form to make test faster
// Please don't care schoolAdminDeleteCardsInFlashcard
// Current we will gen audio whenever language is english

Given('school admin goes to the flashcard detail page', async function () {
    const flashcardElement = await this.cms.page?.waitForSelector(flashCardIcon);

    await this.cms.instruction('User click flashcard item', async () => {
        await flashcardElement?.click();
    });

    await this.cms.instruction('User waiting for detail page loaded', async () => {
        await this.cms.waitForSkeletonLoading();
    });
});

Given('school admin is at add-edit card page in flashcard', async function () {
    await this.cms.instruction('User open dialog upsert card', async () => {
        await schoolAdminOpenDialogUpsertCardInFlashcard(this.cms);
    });
});

When(
    `school admin creates {string} card in the flashcard`,
    async function (type: 'one' | 'multiple') {
        const cards: CardFlashcard[] = [];

        const elements = await schoolAdminGetAllCardFormFlashcard(this.cms);

        if (type === 'one') await schoolAdminDeleteCardsInFlashcard(this.cms, elements.length - 1);

        const finalCardForms = await schoolAdminGetAllCardFormFlashcard(this.cms);

        await this.cms.instruction('Fill card forms', async () => {
            await asyncForEach<any, void>(finalCardForms, async (_, index) => {
                const formData: CardFlashcard = {
                    term: `Term ${genId()}`,
                    definition: `Definition ${genId()}`,
                };
                await schoolAdminFillCardFlashcardForm(this.cms, index, formData);

                cards.push(formData);
            });
        });

        this.scenario.set(aliasCardsInFlashcard, cards);

        await this.cms.instruction('User submit action', async () => {
            await schoolAdminSaveCardFlashcard(this.cms);
            await schoolAdminWaitingForSaveCardFlashcardSuccess(this.cms);
        });
    }
);

Given('school admin fills card form in the flashcard', async function () {
    const finalCardForms = await schoolAdminGetAllCardFormFlashcard(this.cms);

    await this.cms.instruction('Fill card forms', async () => {
        await asyncForEach<any, void>(finalCardForms, async (_, index) => {
            const formData: CardFlashcard = {
                term: `Term ${genId()}`,
                definition: `Definition ${genId()}`,
            };
            await schoolAdminFillCardFlashcardForm(this.cms, index, formData);
        });
    });
});

When('school admin cancel add-edit card in the flashcard', async function () {
    await this.cms.instruction('User click cancel add-edit card', async () => {
        await this.cms.cancelDialogAction();
    });
});

Then('school admin sees empty card in the flashcard', async function () {
    await this.cms.instruction('User will sees empty card list', async () => {
        await schoolAdminSeeEmptyCardListInFlashcard(this.cms);
    });
});

Then('school admin sees {string} card is created', async function (_: string) {
    const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);

    await asyncForEach<CardFlashcard, void>(cards, async (item, index) => {
        const { term, definition } = item;
        const instruction = `User see card created with ${term} and ${definition} and default image`;

        await this.cms.instruction(instruction, async () => {
            await schoolAdminSeeDefinitionOfCardInFlashcard(this.cms, definition, index);
            await schoolAdminSeeTermOfCardInFlashcard(this.cms, term, index);
            await schoolAdminSeeDefaultImageOfCardInFlashcard(this.cms, index);
        });
    });
});

When(
    'school admin creates card in the flashcard when missing {string}',
    async function (missingField: 'term' | 'definition') {
        const elements = await schoolAdminGetAllCardFormFlashcard(this.cms);
        await schoolAdminDeleteCardsInFlashcard(this.cms, elements.length - 1);

        await this.cms.instruction(`User create card when missing ${missingField}`, async () => {
            const formData: CardFlashcard = {
                term: missingField === 'term' ? '' : `Term ${genId()}`,
                definition: missingField === 'definition' ? '' : `Definition ${genId()}`,
            };
            await schoolAdminFillCardFlashcardForm(this.cms, 0, formData);
            this.scenario.set(aliasCardsInFlashcard, [formData]);
        });

        await this.cms.instruction('User submit action', async () => {
            await schoolAdminSaveCardFlashcard(this.cms);
        });
    }
);

Then(
    "school admin can't create any card when missing {string}",
    async function (missingField: 'term' | 'definition') {
        const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);
        await this.cms.instruction('User see errors msg', async () => {
            await schoolAdminSeesErrorForField(this.cms, missingField, cards.length);
        });
    }
);

When(
    'school admin creates card in the flashcard with language {string}',
    async function (language: string) {
        const languages = convertOneOfStringTypeToArray<FlashcardLanguage>(language);
        const languageSelected = getRandomElement<FlashcardLanguage>(languages);

        const elements = await schoolAdminGetAllCardFormFlashcard(this.cms);

        await schoolAdminDeleteCardsInFlashcard(this.cms, elements.length - 1);

        await this.cms.instruction(`User create card`, async () => {
            const formData: CardFlashcard = {
                term: 'Term',
                definition: 'Def',
                image: false,
                language:
                    languageSelected === 'EN'
                        ? QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_ENG
                        : QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_JP,
            };
            this.scenario.set(aliasCardsInFlashcard, [formData]);
            await schoolAdminFillCardFlashcardForm(this.cms, 0, formData);
        });

        await this.cms.instruction('User submit action', async () => {
            await schoolAdminSaveCardFlashcard(this.cms);
            await schoolAdminWaitingForSaveCardFlashcardSuccess(this.cms);
        });
    }
);

Then(`school admin can {string} audio generated`, async function (generated: SeeOrNotSee) {
    const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);

    await asyncForEach<CardFlashcard, void>(cards, async (_item, index) => {
        await this.cms.instruction(`User will ${generated} audio`, async () => {
            await schoolAdminCheckAudioCardInFlashcard(this.cms, generated === 'see', index);
        });
    });
});

When(
    'school admin creates cards in the flashcard with image {string} limit size',
    async function (size: 'greater than') {
        const cards: CardFlashcard[] = [];

        const elements = await schoolAdminGetAllCardFormFlashcard(this.cms);

        await schoolAdminDeleteCardsInFlashcard(this.cms, elements.length - 1);

        await this.cms.instruction(`User create card with image`, async () => {
            const formData: CardFlashcard = {
                term: 'Term',
                definition: 'Def',
            };
            cards.push(formData);

            await schoolAdminFillCardFlashcardForm(this.cms, 0, formData);

            if (size !== 'greater than') {
                await schoolAdminUploadCardImageFlashcard(this.cms, 0);
                return;
            }

            await this.cms.instruction('User upload image with greater limit size', async () => {
                await schoolAdminUploadCardImageFlashcard(this.cms, 0, false);
                await this.cms.assertNotification(
                    'JPEG file type is not allowed or File size is bigger than 10MB'
                );
            });
        });

        this.scenario.set(aliasCardsInFlashcard, cards);

        await this.cms.instruction('Saving data', async () => {
            await schoolAdminSaveCardFlashcard(this.cms);
            await schoolAdminWaitingForSaveCardFlashcardSuccess(this.cms);
        });
    }
);

Then(
    'school admin sees cards is created and can {string} image',
    async function (action: SeeOrNotSee) {
        const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);

        const shouldSeeImage = action === 'see';

        await asyncForEach<CardFlashcard, void>(cards, async (_item, index) => {
            await this.cms.instruction(`User will ${action} the image of card`, async () => {
                if (shouldSeeImage) {
                    await schoolAdminSeeImageOfCardInFlashcard(this.cms, index);
                    return;
                }

                await schoolAdminSeeDefaultImageOfCardInFlashcard(this.cms, index);
            });
        });

        if (shouldSeeImage) {
            const imgSrc = await schoolAdminGetImageOfCardInFlashcard(this.cms, 0);

            if (!imgSrc) throw Error("Can't get image");

            this.scenario.set(aliasImageOfCardInFlashcard, imgSrc);
        }
    }
);

Then('student sees the new cards in Flashcard Detail screen', async function () {
    const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);

    await asyncForEach<CardFlashcard, void>(cards, async (card, index) => {
        const { term, definition } = card;

        const instructionTerm = `Student sees term ${term} at index ${index}`;
        await this.learner.instruction(instructionTerm, async () => {
            await studentSeesTermOrDefinitionOfCardInFlashCard(this.learner, 'term', term, index);
        });

        await this.learner.instruction(`Flip card at index ${index}`, async () => {
            await studentFlipFlashcard(this.learner, index, 'term');
        });

        const instructionDefinition = `Student sees definition ${definition} at index ${index}`;
        await this.learner.instruction(instructionDefinition, async () => {
            await studentSeesTermOrDefinitionOfCardInFlashCard(
                this.learner,
                'definition',
                definition,
                index
            );
        });
    });
});

Then(
    'student sees the new cards in Flashcard Learn screen',
    { timeout: 120000 },
    async function () {
        const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);
        const checked: Set<number> = new Set<number>();

        await this.learner.instruction(`Student go to the flashcard learn screen`, async () => {
            await studentGoesToFlashcardLearnPage(this.learner);
        });

        await asyncForEach<CardFlashcard, void>(cards, async (_, index) => {
            let isExited = false;
            await asyncForEach<CardFlashcard, void>(cards, async (card, cardIndex) => {
                const { definition, term } = card;

                if (checked.has(cardIndex)) return;

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

                    await this.learner.instruction(`Student flip card`, async () => {
                        await studentFlipFlashcard(this.learner, index, 'definition');
                    });

                    await this.learner.instruction(`Student see card term ${term}`, async () => {
                        await studentSeesTermOrDefinitionOfCardInLearnFlashCard(
                            this.learner,
                            'term',
                            term,
                            index
                        );
                    });

                    await this.learner.instruction(
                        `Student swipe to next card index ${index + 1}`,
                        async () => {
                            await studentSwipeToLearnCard(this.learner, index, 'term', true);
                        }
                    );

                    isExited = true;
                    checked.add(cardIndex);
                } catch {
                    console.log(
                        `Not see card have definition ${definition} will check in the next cards`
                    );
                }
            });

            if (!isExited) throw new Error('Cannot find card matching with card created');
        });
    }
);

Then('teacher sees the new cards on Teacher App', async function () {
    const courseId = await this.scenario.get(aliasCourseId);
    const flashcardName = this.scenario.get(aliasFlashcardName);

    const cards = this.scenario.get<CardFlashcard[]>(aliasCardsInFlashcard);

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

    await asyncForEach<CardFlashcard, void>(cards, async (card, index) => {
        const { term, definition } = card;

        const instruction = `Teacher sees card with ${term} and ${definition} at index ${index}`;

        await this.teacher.instruction(instruction, async () => {
            await teacherSeesTermOfCardInFlashCard(this.teacher, term, index);
            await teacherSeesDefinitionOfCardInFlashCard(this.teacher, definition, index);
        });
    });
});

Then('teacher sees cards is created with image on Teacher App', async function () {
    const imgSrc = this.scenario.get(aliasImageOfCardInFlashcard);
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

    await this.teacher.instruction('Teacher see image of card', async () => {
        await teacherSeesImageOfCardInFlashcard(this.teacher, imgSrc, 0);
    });
});

Then('student sees cards is created with image in Flashcard Detail screen', async function () {
    const imgSrc = this.scenario.get(aliasImageOfCardInFlashcard);

    await this.learner.instruction(`Flip card`, async () => {
        await studentFlipFlashcard(this.learner, 0, 'term');
    });

    await this.learner.instruction('Student sees image of card', async () => {
        await studentSeesImageOfCardInFlashcard(this.learner, imgSrc, 0);
    });
});

Then('student sees cards is created with image in Flashcard Learn screen', async function () {
    const imgSrc = this.scenario.get(aliasImageOfCardInFlashcard);

    await this.learner.instruction(`Student go to the flashcard learn screen`, async () => {
        await studentGoesToFlashcardLearnPage(this.learner);
    });

    await this.learner.instruction('Student sees image of card', async () => {
        await studentSeesImageOfCardInLearnFlashcard(this.learner, imgSrc, 0);
    });
});

Then(
    'student can {string} audio generated in Flashcard Detail screen',
    async function (generated: 'see' | 'not see') {
        const shouldVisible = generated === 'see';

        await this.learner.instruction(`Student will ${generated} term audio of card`, async () => {
            await studentCheckTermOrDefinitionAudioOfCardInFlashcard(
                this.learner,
                'term',
                shouldVisible,
                0
            );
        });

        await this.learner.instruction(`Flip card`, async () => {
            await studentFlipFlashcard(this.learner, 0, 'term');
        });

        await this.learner.instruction(
            `Student will ${generated} definition audio of card`,
            async () => {
                await studentCheckTermOrDefinitionAudioOfCardInFlashcard(
                    this.learner,
                    'definition',
                    shouldVisible,
                    0
                );
            }
        );
    }
);

Then(
    'student can {string} audio generated in in Flashcard Learn screen',
    async function (generated: 'see' | 'not see') {
        const shouldVisible = generated === 'see';

        await this.learner.instruction(`Student go to the flashcard learn screen`, async () => {
            await studentGoesToFlashcardLearnPage(this.learner);
        });

        await this.learner.instruction(
            `Student will ${generated} definition audio of card`,
            async () => {
                await studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard(
                    this.learner,
                    'definition',
                    shouldVisible,
                    0
                );
            }
        );

        await this.learner.instruction(`Flip card`, async () => {
            await studentFlipFlashcard(this.learner, 0, 'definition');
        });

        await this.learner.instruction(`Student will ${generated} term audio of card`, async () => {
            await studentCheckTermOrDefinitionAudioOfCardInLearnFlashcard(
                this.learner,
                'term',
                shouldVisible,
                0
            );
        });
    }
);
