import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasCourseName, aliasExamLOName, aliasTopicName } from './alias-keys/syllabus';
import { studentGoesToLODetailsPage } from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';
import {
    studentPressTakeAgainButton,
    validateStartButton,
} from './validate-start-button-submission-attempt-definitions';

When('student opens the exam lo attempt history screen', async function () {
    const learner = this.learner;
    const scenario = this.scenario;

    const courseName = scenario.get<string>(aliasCourseName);
    const topicName = scenario.get<string>(aliasTopicName);
    const examLOName = scenario.get<string>(aliasExamLOName);

    await learner.instruction('Student refreshes home screen', async (learner) => {
        await studentRefreshHomeScreen(learner);
    });

    await learner.instruction(`Student goes to ${courseName} detail`, async (learner) => {
        await studentGoToCourseDetail(learner, courseName);
    });

    await learner.instruction(`Student goes to ${topicName} detail`, async (learner) => {
        await studentGoToTopicDetail(learner, topicName);
    });
    await learner.instruction(
        `Student goes to ${examLOName} attempt history screen`,
        async (learner) => {
            await studentGoesToLODetailsPage(learner, topicName, examLOName);
        }
    );
});

When(
    'student press take again button at exam lo attempt history screen',
    async function (this: IMasterWorld) {
        await studentPressTakeAgainButton(this.learner);
    }
);

Then(
    'student sees start button in instruction screen is {string}',
    async function (this: IMasterWorld, state: string) {
        await validateStartButton(this.learner, state == 'enabled');
    }
);
