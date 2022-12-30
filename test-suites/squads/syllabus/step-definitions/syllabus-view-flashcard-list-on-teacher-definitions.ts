import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasFlashcardContents } from './alias-keys/syllabus';
import { flashcardCardImg, questionListTable, tableBaseRow } from './cms-selectors/cms-keys';
import { ByValueKey } from 'flutter-driver-x';
import { CardFlashcard } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export async function getAllFlashcardCardsInTable(cms: CMSInterface, context: ScenarioContext) {
    const flashcardTable = await cms.page!.waitForSelector(questionListTable);

    const cards = await flashcardTable.$$(tableBaseRow);

    const cardsContent = await Promise.all(
        cards.map(async (card) => {
            const cardTerm = await card
                .waitForSelector('td:nth-child(2)')
                .then((cardTerm) => cardTerm?.textContent() ?? '');
            const definition = await card
                .waitForSelector('td:nth-child(3)')
                .then((cardDefinition) => cardDefinition?.textContent() ?? '');
            const imageLink = await card
                .waitForSelector(flashcardCardImg)
                .then((cardImg) => cardImg?.getAttribute('src') ?? '');
            return {
                term: cardTerm,
                definition: definition,
                imageLink: imageLink,
            };
        })
    );

    context.set(aliasFlashcardContents, cardsContent);
}

export async function teacherSeesFlashcardCardsContents(
    teacher: TeacherInterface,
    context: ScenarioContext
) {
    const flashcards = context.get<CardFlashcard[]>(aliasFlashcardContents);
    const driver = teacher.flutterDriver!;

    for (let i = 0; i < flashcards.length; i++) {
        const card = flashcards[i];
        await driver.waitFor(
            new ByValueKey(SyllabusTeacherKeys.flashCardListCardQuestion(i, card.term))
        );
        await driver.waitFor(
            new ByValueKey(SyllabusTeacherKeys.flashCardListCardAnswer(i, card.definition))
        );

        await driver.waitFor(
            new ByValueKey(SyllabusTeacherKeys.flashCardListCardImage(i, card.imageLink!))
        );
    }
}
