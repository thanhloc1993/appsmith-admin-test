import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasIndividualLessonInfo } from '../common/alias-keys';
import { LessonTimeValueType, MethodSavingType } from '../common/types';
import { IndividualLessonInfo } from '../types/lesson-management';
import { parseAfterThatLessonTime } from '../utils/lesson-report';
import {
    createLessonWithGRPC,
    methodSavingObject,
    schoolAdminClicksDuplicateIndividualLessonButtonOption,
    schoolAdminPublishesDuplicatedLesson,
} from '../utils/lesson-upsert';
import {
    assertAllInformationAreCopiedFromPreviousLesson,
    seeLessonRecurringAndDuplicatedLessonOnLessonList,
} from './school-admin-duplicate-individual-lesson-definitions';
import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';

Given(
    '{string} has created a {string} individual lesson with filled all information',
    async function (role: AccountRoles, savingMethod: MethodSavingType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const createLessonTime = parseAfterThatLessonTime({
            lessonTime: 'future',
            methodSaving: savingMethod,
        });

        await cms.instruction(
            `${role} has created a ${savingMethod} group lesson with filled all information`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime: createLessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
                    teachingMedium: 'Online',
                    methodSavingOption: methodSavingObject[savingMethod],
                });
            }
        );
    }
);

Given(
    '{string} has created a {string} individual lesson with filled all information in the {string}',
    async function (
        role: AccountRoles,
        savingMethod: MethodSavingType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const createLessonTime = parseAfterThatLessonTime({
            lessonTime,
            methodSaving: savingMethod,
        });

        await cms.instruction(
            `${role} has created a ${savingMethod} individual lesson with filled all information in the ${lessonTime}`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
                    teachingMedium: 'Online',
                    methodSavingOption: methodSavingObject[savingMethod],
                });
            }
        );
    }
);

Given(
    '{string} has clicked duplicate individual lesson button',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        await cms.instruction(
            `${role} has clicked duplicate individual lesson button`,
            async function () {
                await schoolAdminClicksDuplicateIndividualLessonButtonOption(cms, context);
            }
        );
    }
);

When('{string} clicks duplicate individual lesson button', async function (role: AccountRoles) {
    const context = this.scenario;
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} clicks duplicates individual lesson lesson`, async function () {
        await schoolAdminClicksDuplicateIndividualLessonButtonOption(cms, context);
    });
});

When('{string} published the duplicated individual lesson', async function (role: AccountRoles) {
    const context = this.scenario;
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} published the duplicated group lesson`, async function () {
        await schoolAdminPublishesDuplicatedLesson(cms, context);
    });
});

Then(
    '{string} sees all information is copied from the previous individual lesson',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const individualLessonInfo =
            this.scenario.get<IndividualLessonInfo>(aliasIndividualLessonInfo);
        await cms.instruction(
            `${role} sees all information is copied from the previous individual lesson`,
            async function () {
                await assertAllInformationAreCopiedFromPreviousLesson(cms, individualLessonInfo);
            }
        );
    }
);

Then(
    '{string} sees created weekly recurring lesson and duplicated lesson on the {string} lessons list on CMS',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees created weekly recurring lesson and duplicated lesson on the ${lessonTime} lessons list on CMS`,
            async function () {
                await seeLessonRecurringAndDuplicatedLessonOnLessonList(cms, scenario, lessonTime);
            }
        );
    }
);
