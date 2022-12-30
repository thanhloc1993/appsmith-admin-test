import { aliasLessonId } from '@legacy-step-definitions/alias-keys/lesson';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
} from '@legacy-step-definitions/utils';
import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { CreateLessonRequestData } from '@supports/services/lessonmgmt/lesson-management-service';

import {
    aliasLessonName,
    aliasLessonInfo,
    aliasStartDate,
    aliasLocationId,
    aliasCourseId,
} from 'test-suites/squads/lesson/common/alias-keys';
import {
    LessonTimeValueType,
    TeachingMediumValueType,
    TeachingMethodValueType,
} from 'test-suites/squads/lesson/common/types';
import { assertSeeLessonWithStatus } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import { selectTeachingMethod } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { changeTimeLesson } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import { fillRemainingLessonFields } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-creates-a-group-lesson-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import {
    assertNewLessonOnTeacherApp,
    convertToLessonUpsertFields,
    parseTeachingMediumObject,
    parseTeachingMethodObject,
    saveFilledLessonUpsertFields,
    selectLessonDateByLessonTime,
    selectTeachingMedium,
} from 'test-suites/squads/lesson/utils/lesson-upsert';
import { applyLocationOnCMS } from 'test-suites/squads/lesson/utils/locations';
import { getUsersFromContextByRegexKeys } from 'test-suites/squads/lesson/utils/user';
import { assertLessonVisibleOnLearnerApp } from 'test-suites/squads/virtual-classroom/utils/lesson';
import { learnerGoToLesson } from 'test-suites/squads/virtual-classroom/utils/navigation';

Given(
    '{string} has applied location in location settings is the same as student location',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has applied location in location settings is the same as student location`,
            async function () {
                const locationId = scenarioContext.get(aliasLocationId);
                await applyLocationOnCMS(cms, locationId);
            }
        );
    }
);

When(
    '{string} fills date&time in the {string}',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(`${role} fills date&time in the ${lessonTime}`, async function () {
            await selectLessonDateByLessonTime({ cms, scenarioContext, lessonTime });
            await changeTimeLesson(cms, '23:00', '23:45');

            saveFilledLessonUpsertFields({
                scenarioContext,
                lessonField: ['lesson date', 'start time', 'end time'],
            });
        });
    }
);

When(
    '{string} selects teaching medium is {string}',
    async function (role: AccountRoles, teachingMedium: TeachingMediumValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} selects teaching medium is ${teachingMedium}`,
            async function () {
                await selectTeachingMedium(cms, parseTeachingMediumObject[teachingMedium]);

                saveFilledLessonUpsertFields({
                    scenarioContext,
                    lessonField: ['teaching medium'],
                });
            }
        );
    }
);

When(
    '{string} selects teaching method is {string}',
    async function (role: AccountRoles, teachingMethod: TeachingMethodValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} selects teaching method is ${teachingMethod}`,
            async function () {
                await selectTeachingMethod(cms, parseTeachingMethodObject[teachingMethod]);

                saveFilledLessonUpsertFields({
                    scenarioContext,
                    lessonField: ['teaching method'],
                });
            }
        );
    }
);

When(
    '{string} fills remain group lesson fields and missing {string} field',
    { timeout: 120000 },
    async function (role: AccountRoles, rawMissingField: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const missingFields = convertToLessonUpsertFields(rawMissingField);

        await cms.instruction(
            `${role} fills remain group lesson fields and missing ${rawMissingField} field`,
            async function () {
                await fillRemainingLessonFields({
                    cms,
                    scenarioContext,
                    missingFields,
                });
            }
        );
    }
);

Then(
    '{string} sees newly created {string} one time {string} group lesson on CMS',
    async function (
        role: AccountRoles,
        lessonSaveType: LessonActionSaveType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const lessonId = scenarioContext.get(aliasLessonId);
        const [studentInfo] = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);

        await cms.instruction(
            `${role} sees newly created ${lessonSaveType} one time group lesson on CMS`,
            async function () {
                await assertSeeLessonWithStatus({
                    cms,
                    lessonId,
                    lessonTime,
                    studentName: studentInfo.name,
                    shouldSeeLesson: true,
                    lessonStatus: lessonSaveType,
                });
            }
        );
    }
);

Then(
    '{string} can {string} new {string} one time group lesson on Teacher App',
    async function (
        role: AccountRoles,
        action: 'see' | 'not see',
        lessonTime: LessonTimeValueType
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenarioContext = this.scenario;

        const courseId = scenarioContext.get(aliasCourseId);
        const locationId = scenarioContext.get(aliasLocationId);
        const lessonId = scenarioContext.get(aliasLessonId);

        await teacher.instruction(
            `${role} can ${action} new ${lessonTime} one time group lesson on Teacher App`,
            async function () {
                const shouldDisplay = action === 'see' ? true : false;
                await assertNewLessonOnTeacherApp({
                    teacher,
                    lessonId,
                    courseId,
                    locationId,
                    lessonTime,
                    shouldDisplay,
                });
            }
        );
    }
);

Then(
    '{string} can {string} new one time group lesson on Learner App',
    async function (role: AccountRoles, action: 'see' | 'not see') {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonInfo = this.scenario.get<CreateLessonRequestData>(aliasLessonInfo);

        const getStartDateAlias = this.scenario.get(aliasStartDate);
        const startDate = getStartDateAlias || lessonInfo.startTime;
        const lessonStartTime = startDate ? new Date(startDate) : undefined;

        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get<string>(aliasLessonName) || '';
        await learner.instruction(
            `${role} can ${action} new lesson on Teacher App`,
            async function () {
                const shouldDisplay = action === 'see' ? true : false;
                await learnerGoToLesson(learner);
                await assertLessonVisibleOnLearnerApp(
                    learner,
                    lessonId,
                    lessonName,
                    lessonStartTime,
                    shouldDisplay
                );
            }
        );
    }
);
