import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasLOName } from './alias-keys/syllabus';
import { studentSeesAndDoesLOQuestionsWithIncorrectQuizzes } from './syllabus-create-question-definitions';
import { ByValueKey } from 'flutter-driver-x';

Given(`student reloads web`, async function (this: IMasterWorld): Promise<void> {
    await this.learner.instruction(`Student reloads the page`, async function (learner) {
        await learner.flutterDriver!.reload();
    });
});

Then(
    `student sees the latest incorrect quiz set`,
    async function (this: IMasterWorld): Promise<void> {
        const loName = this.scenario.get<string>(aliasLOName);
        const context = this.scenario;
        await this.learner.instruction(`Student is at Quiz Screen`, async function (learner) {
            const quizScreenFinder = new ByValueKey(SyllabusLearnerKeys.quiz_screen(loName));
            await learner.flutterDriver!.waitFor(quizScreenFinder);
        });
        await this.learner.instruction(`Student see incorrect quiz set`, async function (learner) {
            await studentSeesAndDoesLOQuestionsWithIncorrectQuizzes(learner, context, 1);
        });
    }
);
