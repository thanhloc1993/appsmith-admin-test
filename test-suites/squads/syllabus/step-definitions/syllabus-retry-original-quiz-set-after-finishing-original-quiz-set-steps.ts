import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasLOName } from './alias-keys/syllabus';
import { studentSeesAndDoesLOQuestionsWithIncorrectQuizzes } from './syllabus-create-question-definitions';
import { studentClickPracticeAgainButton } from './syllabus-retry-original-quiz-set-after-finishing-original-quiz-set-definitions';
import { ByValueKey } from 'flutter-driver-x';

When(`student selects to practice again`, async function (this: IMasterWorld): Promise<void> {
    await this.learner.instruction(`school click practice again button`, async function (learner) {
        await studentClickPracticeAgainButton(learner);
    });
});

Then(
    `student sees the original quiz set questions`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const loName = this.scenario.get<string>(aliasLOName);
        await this.learner.instruction(`Student is at Quiz Screen`, async function (learner) {
            const quizScreenFinder = new ByValueKey(SyllabusLearnerKeys.quiz_screen(loName));
            await learner.flutterDriver!.waitFor(quizScreenFinder);
        });
        await this.learner.instruction(
            `Student see the original quiz set`,
            async function (learner) {
                await studentSeesAndDoesLOQuestionsWithIncorrectQuizzes(learner, context, 1);
            }
        );
    }
);
