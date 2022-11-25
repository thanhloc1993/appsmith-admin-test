import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { QuizTypeTitle } from '@supports/types/cms-types';

import { aliasFlashcardContents } from './alias-keys/syllabus';
import { teacherGoesToSeeNextQuizQuestion } from './syllabus-create-question-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { CardFlashcard } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export async function teacherSeesFlashcardDetails(
    teacher: TeacherInterface,
    scenario: ScenarioContext
): Promise<void> {
    const flashcardContents = scenario.get<CardFlashcard[]>(aliasFlashcardContents);

    for (let i = 0; i < flashcardContents.length; i++) {
        const cardDefinition = flashcardContents[i].definition;
        const cardTerm = flashcardContents[i].term;
        const cardImg = flashcardContents[i].imageLink ?? '';

        await teacherSeesFlashcardCardDetails(teacher, cardDefinition, cardTerm, cardImg);

        if (i < flashcardContents.length - 1) {
            await teacherGoesToSeeNextQuizQuestion(teacher);
        }
    }
}

export async function teacherSeesFlashcardCardDetails(
    teacher: TeacherInterface,
    cardDefinition: string,
    cardTerm: string,
    cardImg: string
): Promise<void> {
    await teacher.instruction(`teacher sees card ${cardDefinition} details`, async function () {
        const driver = teacher.flutterDriver!;
        const quizTypeTitle: QuizTypeTitle = 'pair of words';
        const cardDefinitionKey = new ByValueKey(
            SyllabusTeacherKeys.questionTypeTitle(quizTypeTitle, cardDefinition)
        );

        const cardTermKey = new ByValueKey(
            SyllabusTeacherKeys.answerTypeTitle(quizTypeTitle, cardTerm)
        );

        const cardImgKey = new ByValueKey(SyllabusTeacherKeys.quizQuestionImg(cardImg));

        await driver.waitFor(cardDefinitionKey);
        await driver.waitFor(cardTermKey);
        await driver.waitFor(cardImgKey);
    });
}
