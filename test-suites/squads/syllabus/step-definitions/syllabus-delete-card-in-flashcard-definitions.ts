import {
    convertOneOfStringTypeToArray,
    delay,
    getRandomElement,
    randomUniqueIntegersByType,
} from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasFlashcardContents } from './alias-keys/syllabus';
import { tableBaseRow, tableEmptyMessage } from './cms-selectors/cms-keys';
import { schoolAdminGetAllCardFormFlashcard } from './syllabus-create-card-in-flashcard-definition';
import { FlashcardSettingToggleType } from './syllabus-flip-flashcard-steps';
import { ByValueKey } from 'flutter-driver-x';
import { CardFlashcard } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export type DeleteCardInFlashcardMode = 'one' | 'multiple' | 'all';

export const schoolAdminSelectCardsIndexToDelete = async (
    cms: CMSInterface,
    typeString: string
) => {
    const types = convertOneOfStringTypeToArray<DeleteCardInFlashcardMode>(typeString);
    const elements = await schoolAdminGetAllCardFormFlashcard(cms);
    const deleteMode = getRandomElement(types);

    const randomIndex = randomUniqueIntegersByType(deleteMode, elements.length - 1);

    return {
        deleteIndexListSortByDesc: randomIndex.sort().reverse(),
        deleteMode,
    };
};

export const schoolAdminNotSeeTermOrDefinitionCardInFlashcard = async (
    cms: CMSInterface,
    termOrDefinition: string
) => {
    await cms.page?.waitForSelector(`${tableBaseRow}:has-text("${termOrDefinition}")`, {
        state: 'detached',
    });
};

export const schoolAdminGetTermValueCardFormInFlashcard = async (
    cms: CMSInterface,
    formIndex: number
) => {
    const textInputSelector = `[name="flashcards.${formIndex}.term"]`;
    const inputElement = await cms.page?.waitForSelector(textInputSelector);

    return await inputElement?.inputValue();
};

export const schoolAdminSeeEmptyCardListInFlashcard = async (cms: CMSInterface) => {
    await cms.page?.waitForSelector(tableEmptyMessage);
};

export const studentDoesNotSeeCardTermInFlashcard = async (
    learner: LearnerInterface,
    field: FlashcardSettingToggleType,
    content: string,
    index: number
) => {
    const finder = new ByValueKey(
        SyllabusLearnerKeys.flashCardItemWithContent(index, field === 'term', content)
    );

    await learner.flutterDriver?.waitForAbsent(finder);
};

export const teacherDoesNotSeeTermOfCardInFlashCard = async (
    teacher: TeacherInterface,
    content: string,
    index: number
) => {
    const finder = new ByValueKey(SyllabusTeacherKeys.flashCardListCardAnswer(index, content));

    await teacher.flutterDriver?.waitForAbsent(finder);
};

export const teacherReloadStudentStudyPlanScreen = async (teacher: TeacherInterface) => {
    await teacher.flutterDriver!.reload();
    await delay(3000);
    await teacher.flutterDriver!.waitFor(new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTab));
    await teacher.flutterDriver!.waitFor(
        new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScreen)
    );
};

export const studentSeesFlashcardCardsContents = async (
    learner: LearnerInterface,
    context: ScenarioContext
) => {
    const flashcards = context.get<CardFlashcard[]>(aliasFlashcardContents);
    const driver = learner.flutterDriver!;

    for (let i = 0; i < flashcards.length; i++) {
        const card = flashcards[i];
        const finder = new ByValueKey(
            SyllabusLearnerKeys.flashCardItemWithContent(i, true, card.term)
        );
        await driver.waitFor(finder);
    }
};
