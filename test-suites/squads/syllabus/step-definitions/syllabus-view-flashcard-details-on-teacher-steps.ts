import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasFlashcardName } from './alias-keys/syllabus';
import { teacherSeesFlashcardDetails } from './syllabus-view-flashcard-details-on-teacher-definitions';
import { ByValueKey } from 'flutter-driver-x';

Then('teacher sees details of all cards on Teacher App', async function (this: IMasterWorld) {
    const context = this.scenario;
    const flashcardName = context.get<string>(aliasFlashcardName);

    await this.teacher.instruction(
        `Teacher tap to quiz tab to view flashcard details`,
        async function (teacher) {
            const driver = teacher.flutterDriver!;
            const quizTab = new ByValueKey(SyllabusTeacherKeys.popupReviewQuestionQuizTab);
            await driver.waitFor(quizTab);
            await driver.tap(quizTab);
        }
    );

    await this.teacher.instruction(
        `Teacher sees details of all cards in ${flashcardName} flashcard on Teacher App`,
        async function (teacher) {
            await teacherSeesFlashcardDetails(teacher, context);
        }
    );
});
