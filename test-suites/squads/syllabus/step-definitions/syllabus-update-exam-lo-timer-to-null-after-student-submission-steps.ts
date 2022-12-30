import { getBOBookDetailUrl } from '@syllabus-utils/book';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { ByValueKey } from 'flutter-driver-x';
import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import {
    aliasBookDetailsPage,
    aliasBookIds,
    aliasBookName,
    aliasContentBookLOQuestionQuantity,
    aliasCourseName,
    aliasExamLOFinishedQuestionCount,
    aliasExamLOName,
    aliasExamLOTimeLimit,
    aliasTopicName,
} from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { schoolAdminIsOnBookDetailPageByUrl } from 'test-suites/squads/syllabus/step-definitions/book-definitions';
import {
    studentSeesQuestionContentInSubmitConfirmationTimeLimit,
    studentSeesSubmitConfirmationTimeLimit,
    studentSeeTimeLimit,
    studentSeeTimeLimitCountingDownWithKey,
} from 'test-suites/squads/syllabus/step-definitions/create-exam-with-time-limit-definitions';
import { studentGoesToLODetailsPage } from 'test-suites/squads/syllabus/step-definitions/syllabus-create-question-definitions';
import { studentSubmitExamLOWhenOpenTimeLimitPopup } from 'test-suites/squads/syllabus/step-definitions/syllabus-do-exam-lo-definitions';
import { studentGoesToLearningMaterial } from 'test-suites/squads/syllabus/step-definitions/syllabus-do-lo-quiz-definitions';
import { studentStartExamLOFromInstructionScreen } from 'test-suites/squads/syllabus/step-definitions/syllabus-exam-lo-common-definition';
import { schoolAdminSelectEditExamLO } from 'test-suites/squads/syllabus/step-definitions/syllabus-exam-lo-edit-definitions';
import {
    studentDoesSomeQuestionInExamLo,
    studentGoesToTopicDetailScreenFromQuizFinishedScreen,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-update-exam-lo-timer-to-null-after-student-submission-definitions';
import { mappedLOTypeWithAliasStringName } from 'test-suites/squads/syllabus/step-definitions/syllabus-utils';
import { schoolAdminClickLOByName } from 'test-suites/squads/syllabus/step-definitions/syllabus-view-task-assignment-definitions';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

Given(
    'student submits the exam lo with a valid random timer',
    { timeout: 100000 },
    async function () {
        const scenario = this.scenario;
        const learner = this.learner;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const studyPlanItemName = scenario.get<string>(mappedLOTypeWithAliasStringName['exam LO']);

        await learner.instruction(`Student practices the exam lo`, async (learner) => {
            await studentGoesToLearningMaterial(
                learner,
                courseName,
                topicName,
                studyPlanItemName,
                'exam LO'
            );
        });

        const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);
        const numberOfLearningQuestions = randomInteger(1, questionQuantity);
        const quizQuestionNames = await learner.getQuizNameList();

        await learner.instruction(`Student does some questions at the exam lo`, async (learner) => {
            await studentDoesSomeQuestionInExamLo(
                scenario,
                learner,
                numberOfLearningQuestions,
                quizQuestionNames
            );
        });

        await learner.instruction(
            `Students taps on submit button to submit the exam lo`,
            async (learner) => {
                await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.submit_button));
            }
        );

        const finishedQuestionCount = scenario.get<number>(aliasExamLOFinishedQuestionCount);

        await learner.instruction(`student sees submit-confirmation popup`, async () => {
            await studentSeesSubmitConfirmationTimeLimit(learner);
        });

        await this.learner.instruction(
            `Student sees questions content in popup: ${finishedQuestionCount}/${questionQuantity}`,
            async (learner) => {
                await studentSeesQuestionContentInSubmitConfirmationTimeLimit(
                    learner,
                    finishedQuestionCount,
                    questionQuantity
                );
            }
        );

        await learner.instruction(`Student sees timer content in popup`, async (learner) => {
            await studentSeeTimeLimitCountingDownWithKey(
                learner,
                SyllabusLearnerKeys.examLOTimerTimeLeftContent
            );
        });

        const examLOName = scenario.get<string>(aliasExamLOName);

        await learner.instruction(`Student submits ${examLOName}`, async (learner) => {
            await studentSubmitExamLOWhenOpenTimeLimitPopup(learner, examLOName);
        });
    }
);

Given(
    'school admin edits the timer to {string} after student submitting the exam lo',
    async function (timeLimit: number | 'null') {
        const cms = this.cms;
        const scenario = this.scenario;

        const bookId = scenario.get<string[]>(aliasBookIds)[0];
        const bookName = scenario.get<string>(aliasBookName);
        const examLOName = scenario.get<string>(aliasExamLOName);

        const bookDetailURL = getBOBookDetailUrl(bookId);

        await cms.instruction(
            `school admin goes to book ${bookName} detail page by url ${bookDetailURL}`,
            async (cms) => {
                await schoolAdminIsOnBookDetailPageByUrl(cms, { id: bookId, name: bookName });
            }
        );

        scenario.set(aliasBookDetailsPage, bookDetailURL);

        await cms.instruction(
            `school admin goes to ${examLOName} detail page, select to edit the exam LO`,
            async (cms) => {
                await schoolAdminClickLOByName(cms, examLOName);
                await schoolAdminSelectEditExamLO(cms);
            }
        );

        await cms.instruction(
            `School admin ${
                timeLimit === 'null' ? 'leaves empty' : `fills ${timeLimit}`
            } in time limit`,
            async (cms) => {
                await cmsExamForm.fillTimeLimit(
                    cms.page!,
                    timeLimit === 'null' ? undefined : Number(timeLimit)
                );
            }
        );

        await cms.instruction('School admin saves the exam', async (cms) => {
            await cms.selectAButtonByAriaLabel('Save');
        });

        scenario.set(aliasExamLOTimeLimit, timeLimit);

        await cms.instruction(`School admin sees success message`, async (cms) => {
            await cms.assertNotification('You have updated learning objective successfully');
        });
    }
);

When('student practices this exam lo again', async function () {
    const scenario = this.scenario;
    const learner = this.learner;
    const driver = learner.flutterDriver!;

    const topicName = scenario.get<string>(aliasTopicName);
    const examLOName = scenario.get<string>(aliasExamLOName);
    const studyPlanItemName = scenario.get<string>(mappedLOTypeWithAliasStringName['exam LO']);

    await learner.instruction(`Student goes back to ${topicName} detail`, async (learner) => {
        await studentGoesToTopicDetailScreenFromQuizFinishedScreen(learner);
    });

    await driver.reload(); // Reload the page to get the new timer data which is set by school admin

    const loListScreenKey = new ByValueKey(SyllabusLearnerKeys.lo_list_screen(topicName));

    await driver.waitFor(loListScreenKey, 10000);

    await learner.instruction(
        `Student goes to ${studyPlanItemName} attempt history screen`,
        async () => {
            await studentGoesToLODetailsPage(learner, topicName, studyPlanItemName);
        }
    );

    await learner.instruction(`Student takes again the ${examLOName}`, async (learner) => {
        await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.takeAgainButton));
    });
});

Then(
    'student can no longer see the timer in this exam lo in instruction screen',
    async function () {
        const learner = this.learner;
        const timeLimit = this.scenario.get<number | 'null'>(aliasExamLOTimeLimit);
        const timeLimitValue = timeLimit !== 'null' ? timeLimit : undefined;

        await learner.instruction(
            `Student cannot see the timer in instruction screen`,
            async (learner) => {
                await studentSeeTimeLimit(learner, timeLimitValue);
            }
        );
    }
);

Then('student can no longer see the timer in this exam lo exam lo screen', async function () {
    const learner = this.learner;
    const timeLimit = this.scenario.get<number | 'null'>(aliasExamLOTimeLimit);
    const timeLimitValue = timeLimit !== 'null' ? timeLimit : undefined;

    await learner.instruction(`Student starts this exam lo again`, async (learner) => {
        await studentStartExamLOFromInstructionScreen(learner);
    });

    await learner.instruction(`Student cannot see the timer in exam lo screen`, async (learner) => {
        await studentSeeTimeLimit(learner, timeLimitValue);
    });
});
