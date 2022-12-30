import { aliasLessonInfo } from '@legacy-step-definitions/alias-keys/lesson';
import { getCMSInterfaceByRole, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { endTimeUpdate, startTimeUpdate } from '../common/constants';
import {
    getEndDateFromLessonInfo,
    getLessonInfoFromContext,
    getStartDateFromLessonInfo,
} from '../utils/lesson-upsert';
import { changeTimeLesson } from './lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import {
    assertLessonEndDateInChains,
    assertLessonEndTimeAndStartTime,
    assertLessonInChainChangeStartEndTime,
    assertLessonEndDate,
} from './lesson-upsert-school-admin-edit-start-and-end-time-of-weekly-recurring-individual-lesson-definitions';
import moment from 'moment';
import { LessonStatusType, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { assertLessonStatusOrderBy } from 'test-suites/squads/lesson/step-definitions/auto-change-status-change-to-completed-when-submit-lesson-group-report-definitions';

When('{string} edits start & end time', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} edits start & end time`, async function () {
        await changeTimeLesson(cms, startTimeUpdate, endTimeUpdate);
    });
});

Then(
    '{string} sees updated start & end time for this lesson',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees updated start & end time for this lesson`,
            async function () {
                await assertLessonEndTimeAndStartTime({
                    cms,
                    startTime: startTimeUpdate,
                    endTime: endTimeUpdate,
                });
            }
        );
    }
);

Then(
    '{string} sees lessons {string} in chain from edited have start & end time updated and remain repeat duration',
    async function (this: IMasterWorld, role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const endDate = getEndDateFromLessonInfo(scenario);
        const indexOfChains = [1, 2, 3, 4];

        await cms.instruction(
            `${role} sees other lessons in chain from edited lesson have start & end time updated`,
            async function () {
                await assertLessonInChainChangeStartEndTime({
                    cms,
                    startTime: startTimeUpdate,
                    endTime: endTimeUpdate,
                    lessonTime,
                    studentName,
                    role,
                    indexOfChains,
                });
            }
        );

        await cms.instruction(
            `${role} sees other lessons in chain from edited lesson have remain repeat duration`,
            async function () {
                await assertLessonEndDateInChains({
                    cms,
                    endDate,
                    lessonTime,
                    studentName,
                    role,
                    indexOfChains,
                    scenarioContext: scenario,
                });
            }
        );
    }
);

Then(
    '{string} sees {string} {string} lessons in chain before edited lesson has end date is lesson date of previous lesson',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const endDate = getStartDateFromLessonInfo(scenario);
        const indexOfChains = [0];

        await cms.instruction(
            `${role} sees ${lessonStatus} ${lessonTime} lessons in chain before edited lesson has end date is lesson date of previous lesson`,
            async function () {
                await assertLessonEndDateInChains({
                    cms,
                    scenarioContext: scenario,
                    endDate,
                    lessonTime,
                    studentName,
                    role,
                    indexOfChains,
                });

                await assertLessonStatusOrderBy({
                    cms,
                    lessonStatus,
                    lessonTime,
                    startIndex: 1,
                    endIndex: 4,
                    scenarioContext: scenario,
                });
            }
        );
    }
);

Then(
    '{string} sees lessons {string} in chain before edited remaining start & end time and weekly on',
    async function (this: IMasterWorld, role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = this.cms;
        const scenario = this.scenario;
        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const { endTime, startTime } = getLessonInfoFromContext(scenario, aliasLessonInfo);
        const indexOfChains = [0];

        const startTimeConverted = moment(startTime).format('HH:mm');
        const endTimeConverted = moment(endTime).format('HH:mm');

        await cms.instruction(
            `${role} sees lessons ${lessonTime} in chain before edited remaining start & end time and weekly on`,
            async function () {
                await assertLessonInChainChangeStartEndTime({
                    cms,
                    startTime: startTimeConverted,
                    endTime: endTimeConverted,
                    lessonTime,
                    studentName,
                    role,
                    indexOfChains,
                });
            }
        );
    }
);
Then(
    '{string} sees updated start & end time and remained repeat duration in this {string} {string} lesson',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const endDate = getEndDateFromLessonInfo(scenario);

        await cms.instruction(
            `${role} sees updated start & end time in this lesson`,
            async function () {
                await assertLessonEndTimeAndStartTime({
                    cms,
                    startTime: startTimeUpdate,
                    endTime: endTimeUpdate,
                });
            }
        );

        await cms.instruction(
            `${role} sees remained repeat duration in this lesson`,
            async function () {
                await assertLessonEndDate({
                    cms,
                    endDate,
                });

                await assertLessonStatusOrderBy({
                    cms,
                    scenarioContext: scenario,
                    lessonTime,
                    startIndex: 0,
                    endIndex: 4,
                    lessonStatus,
                });
            }
        );
    }
);
Then(
    '{string} sees other {string} {string} lessons in chain no change end date',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const endDate = getEndDateFromLessonInfo(scenario);
        const indexOfChains = [0, 1, 2, 3, 4];

        await cms.instruction(
            `${role} sees other lessons in chain no change end date`,
            async function () {
                await assertLessonEndDateInChains({
                    cms,
                    endDate,
                    lessonTime,
                    studentName,
                    role,
                    indexOfChains,
                    scenarioContext: scenario,
                });

                await assertLessonStatusOrderBy({
                    cms,
                    scenarioContext: scenario,
                    startIndex: 1,
                    endIndex: 4,
                    lessonTime,
                    lessonStatus,
                });
            }
        );
    }
);

Then(
    '{string} sees {string} {string} lessons in chain from edited lesson has start&end time are updated',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const indexOfChains = [1, 2, 3, 4];

        await cms.instruction(
            `${role} sees ${lessonStatus} ${lessonTime} lessons in chain from edited lesson has start&end time are updated`,
            async function () {
                await assertLessonInChainChangeStartEndTime({
                    cms,
                    startTime: startTimeUpdate,
                    endTime: endTimeUpdate,
                    lessonTime,
                    studentName,
                    role,
                    indexOfChains,
                });
            }
        );
    }
);
Then(
    '{string} sees {string} {string} lessons in chain from edited lesson has repeat duration are remained',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const endDate = getEndDateFromLessonInfo(scenario);
        const indexOfChains = [1, 2, 3, 4];

        await cms.instruction(
            `${role} sees ${lessonStatus} ${lessonTime} lessons in chain from edited lesson has repeat duration are remained`,
            async function () {
                await assertLessonEndDateInChains({
                    cms,
                    endDate,
                    lessonTime,
                    studentName,
                    role,
                    indexOfChains,
                    scenarioContext: scenario,
                });
            }
        );
    }
);

Then(
    '{string} sees {string} {string} lessons in chain before edited remaining start & end time and weekly on',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = this.cms;
        const scenario = this.scenario;
        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const { endTime, startTime } = getLessonInfoFromContext(scenario, aliasLessonInfo);
        const indexOfChains = [0];

        const startTimeConverted = moment(startTime).format('HH:mm');
        const endTimeConverted = moment(endTime).format('HH:mm');

        await cms.instruction(
            `${role} sees ${lessonStatus} ${lessonTime} lessons in chain before edited remaining start & end time and weekly on`,
            async function () {
                await assertLessonInChainChangeStartEndTime({
                    cms,
                    startTime: startTimeConverted,
                    endTime: endTimeConverted,
                    lessonTime,
                    studentName,
                    role,
                    indexOfChains,
                });

                await assertLessonStatusOrderBy({
                    cms,
                    scenarioContext: scenario,
                    lessonTime,
                    lessonStatus,
                    startIndex: 2,
                    endIndex: 1,
                });
            }
        );
    }
);
