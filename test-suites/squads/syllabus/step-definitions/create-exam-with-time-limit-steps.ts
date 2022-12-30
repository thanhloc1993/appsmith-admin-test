import { genId } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { schoolAdminSelectEditExamLO } from './syllabus-exam-lo-edit-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { cmsExamDetail } from 'test-suites/squads/syllabus/cms-locators/exam-detail';
import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import {
    aliasContentBookLOQuestionQuantity,
    aliasExamInstruction,
    aliasExamLOFinishedQuestionCount,
    aliasExamLOName,
    aliasExamLOTimeLimit,
    aliasTopicName,
} from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import {
    schoolAdminFillsExamWithTimeLimit,
    studentSeesQuestionContentInSubmitConfirmationTimeLimit,
    studentSeesSubmitConfirmationTimeLimit,
    studentSeeTimeLimit,
    studentSeeTimeLimitCountingDownWithKey,
} from 'test-suites/squads/syllabus/step-definitions/create-exam-with-time-limit-definitions';
import { schoolAdminSelectExamLOTypeAndOpenUpsertDialog } from 'test-suites/squads/syllabus/step-definitions/syllabus-exam-lo-create-definitions';
import {
    getRandomPollingOptionFromOptions,
    randomInteger,
} from 'test-suites/squads/syllabus/utils/common';

type EditExamLOTimerType = 'random from 1 to 180' | 'null';

When(
    'school admin creates exam with time limit setting is {string}',
    async function (options: string) {
        const timeLimit = getRandomPollingOptionFromOptions(options);
        const id = genId();
        const name = `Exam ${id}`;
        const instruction = `Instruction ${id}`;
        const topicName = this.scenario.get(aliasTopicName);

        await this.cms.instruction(`School admin selects exam type in ${topicName}`, async () => {
            await schoolAdminSelectExamLOTypeAndOpenUpsertDialog(this.cms, topicName);
        });

        await this.cms.instruction(
            `School admin fills the exam with time limit is ${timeLimit}`,
            async () => {
                await schoolAdminFillsExamWithTimeLimit(this.cms, {
                    name,
                    instruction,
                    timeLimit: timeLimit === 'null' ? undefined : Number(timeLimit),
                });
            }
        );

        await this.cms.instruction('School admin saves the exam', async () => {
            await this.cms.selectAButtonByAriaLabel('Save');
        });

        this.scenario.set(aliasExamLOName, name);
        this.scenario.set(aliasExamInstruction, instruction);
        this.scenario.set(aliasExamLOTimeLimit, timeLimit);
    }
);

Then('school admin sees exam detail with time limit on CMS', async function () {
    const timeLimit = this.scenario.get(aliasExamLOTimeLimit);

    await this.cms.waitingForLoadingIcon();
    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction(
        `School admin sees time limit is ${timeLimit === 'null' ? '--' : timeLimit}`,
        async () => {
            await cmsExamDetail.findTimeLimit(
                this.cms,
                timeLimit === 'null' ? undefined : Number(timeLimit)
            );
        }
    );
});

Then(`school admin sees time limit's validation error message`, async function () {
    const message = 'The number must be an integer between 1 and 180';

    await this.cms.instruction(
        `School admin sees time limit's validation error message: ${message}`,
        async () => {
            await cmsExamForm.findValidationError(this.cms, message);
        }
    );
});

Given(
    "school admin changes exam lo's time limit to {string}",
    async function (this: IMasterWorld, type: EditExamLOTimerType) {
        await this.cms.instruction(`school admin selects to edit the exam LO`, async () => {
            await schoolAdminSelectEditExamLO(this.cms);
        });

        let timeLimit: number | undefined = undefined;

        switch (type) {
            case 'random from 1 to 180':
                timeLimit = randomInteger(1, 180);
                break;
            default:
                break;
        }

        await this.cms.instruction(
            `School admin ${type === 'null' ? 'leaves empty' : `fills ${timeLimit}`} in time limit`,
            async () => {
                await cmsExamForm.fillTimeLimit(
                    this.cms.page!,
                    type === 'null' ? undefined : Number(timeLimit)
                );
            }
        );

        await this.cms.instruction('School admin saves the exam', async () => {
            await this.cms.selectAButtonByAriaLabel('Save');
        });

        await this.cms.instruction(`School admin sees success msg`, async () => {
            await this.cms.assertNotification('You have updated learning objective successfully');
        });

        this.scenario.set<number | undefined>(aliasExamLOTimeLimit, timeLimit);
    }
);

Then('student sees submit-confirmation popup with content', async function () {
    const questionQuantity = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);
    const finishedQuestionCount = this.scenario.get<number>(aliasExamLOFinishedQuestionCount);

    await this.learner.instruction(`student sees submit-confirmation popup`, async () => {
        await studentSeesSubmitConfirmationTimeLimit(this.learner);
    });

    await this.learner.instruction(
        `Student sees questions content in popup: ${finishedQuestionCount}/${questionQuantity}`,
        async () => {
            await studentSeesQuestionContentInSubmitConfirmationTimeLimit(
                this.learner,
                finishedQuestionCount,
                questionQuantity
            );
        }
    );

    await this.learner.instruction(`Student sees timer content in popup`, async () => {
        await studentSeeTimeLimitCountingDownWithKey(
            this.learner,
            SyllabusLearnerKeys.examLOTimerTimeLeftContent
        );
    });
});

Then("student sees exam lo's time limit with matched setting", async function (this: IMasterWorld) {
    const timeLimit = this.scenario.get<number | undefined>(aliasExamLOTimeLimit);

    await this.learner.instruction(
        `student sees exam lo's time limit ${
            timeLimit === undefined ? 'not appear' : `is ${timeLimit}`
        } minute`,
        async () => {
            await studentSeeTimeLimit(this.learner, timeLimit);
        }
    );
});

Then('student sees time counting down at exam lo', async function (this: IMasterWorld) {
    const timeLimit = this.scenario.get<number | undefined>(aliasExamLOTimeLimit);

    await this.learner.instruction(`Student sees quiz appear`, async () => {
        await this.learner.flutterDriver!.waitFor(new ByValueKey(SyllabusLearnerKeys.quiz), 30000);
    });

    await this.learner.instruction(`Student sees time limit appear`, async () => {
        await studentSeeTimeLimit(this.learner, timeLimit);
    });

    await this.learner.instruction(`Student sees time limit counting down`, async () => {
        await studentSeeTimeLimitCountingDownWithKey(
            this.learner,
            SyllabusLearnerKeys.examLOTimeLimit
        );
    });
});
