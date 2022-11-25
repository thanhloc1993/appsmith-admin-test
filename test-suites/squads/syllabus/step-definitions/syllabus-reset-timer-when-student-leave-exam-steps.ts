import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Then, When } from '@cucumber/cucumber';

import { ByValueKey } from 'flutter-driver-x';
import {
    aliasExamLOTimeLimit,
    aliasTopicName,
} from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import {
    studentSeeTimeLimit,
    studentSeeTimeLimitCountingDownWithKey,
} from 'test-suites/squads/syllabus/step-definitions/create-exam-with-time-limit-definitions';
import { studentGoesToLODetailsPage } from 'test-suites/squads/syllabus/step-definitions/syllabus-create-question-definitions';
import { studentStartExamLOFromInstructionScreen } from 'test-suites/squads/syllabus/step-definitions/syllabus-exam-lo-common-definition';
import { mappedLOTypeWithAliasStringName } from 'test-suites/squads/syllabus/step-definitions/syllabus-utils';

When('students leaves the exam lo', async function () {
    await this.learner.instruction(`Student taps on back button`, async function (learner) {
        await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
    });

    await this.learner.instruction(
        `Student sees leaving confirmation dialog`,
        async function (learner) {
            await learner.flutterDriver!.waitFor(
                new ByValueKey(SyllabusLearnerKeys.leavingExamLOConfirmDialog)
            );
        }
    );

    await this.learner.instruction(
        `Student taps on dialog's leave button to leave the exam`,
        async function (learner) {
            await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.leaveButtonKey));
        }
    );
});

When('students practices this exam lo again', async function () {
    const topicName = this.scenario.get<string>(aliasTopicName);
    const studyPlanItemName = this.scenario.get<string>(mappedLOTypeWithAliasStringName['exam LO']);

    await this.learner.instruction(
        `Student goes back to ${studyPlanItemName} detail`,
        async (learner) => {
            await studentGoesToLODetailsPage(learner, topicName, studyPlanItemName);
        }
    );

    await this.learner.instruction(`Student practices this exam lo again`, async (learner) => {
        await studentStartExamLOFromInstructionScreen(learner);
    });
});

Then('students sees the timer is reset', async function () {
    const timeLimit = this.scenario.get<number>(aliasExamLOTimeLimit);

    await this.learner.instruction(`Student sees time limit is reset`, async () => {
        await studentSeeTimeLimit(this.learner, timeLimit);
    });

    await this.learner.instruction(`Student sees time limit counting down again`, async () => {
        await studentSeeTimeLimitCountingDownWithKey(
            this.learner,
            SyllabusLearnerKeys.examLOTimeLimit
        );
    });
});
