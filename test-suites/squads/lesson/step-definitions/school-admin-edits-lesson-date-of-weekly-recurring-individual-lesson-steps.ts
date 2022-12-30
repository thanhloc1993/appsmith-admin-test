import { goToLessonsList } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import * as LessonManagementKeys from '../common/cms-selectors';
import {
    assertLessonStatus,
    assertLessonStatusOrderBy,
} from './auto-change-status-change-to-completed-when-submit-lesson-group-report-definitions';
import {
    changeLessonDateOfLessonInRecurringChain,
    assertLessonDateRangeOfLessonInRecurringChain,
    filterLessonListByStudentName,
    LessonDateWeeklyRecurring,
    selectLessonLinkByLessonOrder,
    assertWeeklyDayOfLessonInRecurringChain,
    assertEndDateOfLateLessonsInRecurringChain,
    assertUpdatedLessonDate,
    OrderLessonInRecurringChain,
    assertFirstLessonsInRecurringChainRemainingLessonDate,
    getFirstStudentInfo,
    assertEndDateLessonsInRecurringChain,
} from './school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import { LessonStatusType, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { saveLessonInfo } from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has gone to detailed lesson page of the lesson which is in the middle of the chain in the {string}',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const studentInfo = await getFirstStudentInfo(this.scenario);

        await cms.instruction(
            `${role} has gone to detailed lesson page of the lesson which is in the middle of the chain in the ${lessonTime}`,
            async function () {
                await goToLessonsList(cms, lessonTime);
                await filterLessonListByStudentName(cms, studentInfo.name, lessonTime);
                await selectLessonLinkByLessonOrder(
                    cms,
                    OrderLessonInRecurringChain.MIDDLE,
                    lessonTime
                );
                await saveLessonInfo(cms, scenarioContext);
            }
        );
    }
);

When(
    '{string} edits lesson date with {string}',
    async function (this: IMasterWorld, role: AccountRoles, lessonDate: LessonDateWeeklyRecurring) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(`${role} edits lesson date with ${lessonDate}`, async function () {
            await changeLessonDateOfLessonInRecurringChain(cms, scenarioContext, lessonDate);
        });
    }
);

Then(
    '{string} sees updated lesson date for this {string} lesson',
    async function (this: IMasterWorld, role: AccountRoles, lessonStatus: LessonStatusType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(`${role} sees lesson upsert dialog is closed`, async function () {
            await cms.page!.waitForSelector(LessonManagementKeys.upsertLessonDialog, {
                state: 'detached',
            });
        });

        await cms.instruction(
            `${role} sees updated lesson date for this lesson`,
            async function () {
                await assertUpdatedLessonDate(cms, scenarioContext);
                await assertLessonStatus(cms, lessonStatus);
            }
        );
    }
);

Then(
    '{string} sees other {string} lessons in chain from edited lesson has lesson date added 7 days',
    async function (this: IMasterWorld, role: AccountRoles, lessonStatus: LessonStatusType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees other lessons in chain from edited lesson have lesson date added 7 days from edited lesson`,
            async function () {
                await assertLessonStatus(cms, lessonStatus);
                await assertLessonDateRangeOfLessonInRecurringChain({
                    cms,
                    scenarioContext,
                    orderInChain: OrderLessonInRecurringChain.FOURTH,
                    lessonTime: 'future',
                    orderInChainOfEditedLesson: OrderLessonInRecurringChain.MIDDLE,
                });
            }
        );
    }
);

Then(
    '{string} sees other {string} lessons in chain from edited lesson has weekly on is day of week of edited lesson',
    async function (this: IMasterWorld, role: AccountRoles, lessonStatus: LessonStatusType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees other lessons in chain from edited lesson have updated weekly on is day of the week of edited lesson`,
            async function () {
                await assertLessonStatus(cms, lessonStatus);
                await assertWeeklyDayOfLessonInRecurringChain(
                    cms,
                    scenarioContext,
                    OrderLessonInRecurringChain.FOURTH,
                    'future'
                );
            }
        );
    }
);

Then(
    '{string} sees other {string} lessons in chain from edited lesson remaining end date',
    async function (this: IMasterWorld, role: AccountRoles, lessonStatus: LessonStatusType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees other ${lessonStatus} lessons in chain from edited lesson remaining end date`,
            async function () {
                await assertLessonStatus(cms, lessonStatus);
                await assertEndDateOfLateLessonsInRecurringChain(cms, scenarioContext, 'future');
            }
        );
    }
);

Then(
    '{string} sees {string} lessons in chain before edited lesson has end date is lesson date of previous lesson',
    async function (this: IMasterWorld, role: AccountRoles, lessonStatus: LessonStatusType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees ${lessonStatus} lessons in chain before edited lesson has end date is lesson date of previous lesson`,
            async function () {
                await assertLessonStatusOrderBy({
                    cms,
                    scenarioContext,
                    lessonTime: 'future',
                    lessonStatus,
                    endIndex: 0,
                    startIndex: 0,
                });
                await assertEndDateLessonsInRecurringChain(cms, scenarioContext, 'future');
            }
        );
    }
);

Then(
    '{string} sees other {string} lessons in chain before edited lesson remaining lesson date and weekly on',
    async function (this: IMasterWorld, role: AccountRoles, lessonStatus: LessonStatusType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees other {string} lessons in chain before edited lesson remaining lesson date and weekly on`,
            async function () {
                await assertLessonStatus(cms, lessonStatus);
                await assertFirstLessonsInRecurringChainRemainingLessonDate(
                    cms,
                    scenarioContext,
                    'future'
                );
            }
        );
    }
);

Then(
    '{string} sees other {string} lessons in chain no update after edits lesson date with {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonDate: LessonDateWeeklyRecurring
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees other ${lessonStatus} lessons in chain no update after edits lesson date with ${lessonDate}`,
            async function () {
                const deviatedDate =
                    lessonDate === 'current date < lesson date < End date' ? -1 : 1;

                await assertLessonStatus(cms, lessonStatus);

                await assertLessonDateRangeOfLessonInRecurringChain({
                    cms,
                    scenarioContext,
                    orderInChain: OrderLessonInRecurringChain.MIDDLE,
                    lessonTime: 'past',
                    orderInChainOfEditedLesson: OrderLessonInRecurringChain.SECOND,
                    deviatedDate,
                });

                await assertLessonDateRangeOfLessonInRecurringChain({
                    cms,
                    scenarioContext,
                    orderInChain: OrderLessonInRecurringChain.FIRST,
                    lessonTime: 'past',
                    orderInChainOfEditedLesson: OrderLessonInRecurringChain.SECOND,
                    deviatedDate,
                });

                // in this case, we edited the second lesson in chain, we will check the first lesson and middle lesson
                // ex: lesson date are 1, 8, 15, 22, 29 after edit second lesson to 7
                // we will expect lesson date of second lesson - first lesson = 6
                // and lesson date of second lesson - middle lesson = -8
            }
        );
    }
);
