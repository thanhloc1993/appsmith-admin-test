import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { learnerProfileAlias } from '../../user-management/step-definitions/common/alias-keys/user';
import { VisibleState } from '../../virtual-classroom/utils/types';
import { aliasDuplicatedLessonId, aliasGroupLessonInfo, aliasLessonId } from '../common/alias-keys';
import { LessonTimeValueType, MethodSavingType } from '../common/types';
import { GroupLessonInfo } from '../types/lesson-management';
import { parseAfterThatLessonTime } from '../utils/lesson-report';
import {
    createLessonWithGRPC,
    methodSavingObject,
    schoolAdminClicksDuplicateGroupLessonButtonOption,
    schoolAdminPublishesDuplicatedLesson,
} from '../utils/lesson-upsert';
import { getUsersFromContextByRegexKeys } from '../utils/user';
import {
    assertAllInformationAreCopiedFromPreviousGroupLesson,
    assertEndDateFieldVisible,
    assertLessonRecurringChainNoChange,
    assertNewlyDuplicatedLessonVisibleOnTheList,
    assertSelectedLessonToDuplicatingVisible,
    selectedRecurringSettings,
    assertValueOfAttendanceInfoNote,
    assertValueOfAttendanceInfoNotice,
    assertValueOfAttendanceInfoReason,
    assertValueOfAttendanceInfoStatus,
    schoolAdminRedirectsToNewCreateLessonInfoPage,
    userGoToFirstLessonInChain,
    assertRecurringSettingChecked,
} from './school-admin-duplicate-group-lesson-definitions';
import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';

Given(
    '{string} has created a {string} group lesson with filled all information',
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
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP,
                    teachingMedium: 'Online',
                    methodSavingOption: methodSavingObject[savingMethod],
                });
            }
        );
    }
);

Given(
    '{string} has created a {string} group lesson with filled all information in the {string}',
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
            `${role} has created a ${savingMethod} group lesson with filled all information in the ${createLessonTime}`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP,
                    teachingMedium: 'Online',
                    methodSavingOption: methodSavingObject[savingMethod],
                });
            }
        );
    }
);

Given(
    '{string} has gone to detailed lesson info page of the {string} lesson in the first of the recurring chain',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const studentName = getUsersFromContextByRegexKeys(this.scenario, learnerProfileAlias)[0]
            .name;
        await cms.instruction(
            `${role} has gone to detailed lesson info page of the "future" lesson in the first of the recurring chain`,
            async function () {
                await userGoToFirstLessonInChain({ cms, lessonTime, studentName });
            }
        );
    }
);

Given('{string} has clicked duplicate group lesson button', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;
    await cms.instruction(`${role} has clicked duplicate group lesson button`, async function () {
        await schoolAdminClicksDuplicateGroupLessonButtonOption(cms, context);
    });
});

Given(
    '{string} has selected {string} Recurring Settings',
    async function (role: AccountRoles, recurringSettings: MethodSavingType) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} has selected Recurring Settings is ${recurringSettings}`,
            async function () {
                await selectedRecurringSettings(cms, recurringSettings);
            }
        );
    }
);

When('{string} clicks duplicate group lesson button', async function (role: AccountRoles) {
    const context = this.scenario;
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} clicks duplicates group lesson lesson`, async function () {
        await schoolAdminClicksDuplicateGroupLessonButtonOption(cms, context);
    });
});

When('{string} published the duplicated group lesson', async function (role: AccountRoles) {
    const context = this.scenario;
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} published the duplicated group lesson`, async function () {
        await schoolAdminPublishesDuplicatedLesson(cms, context);
    });
});

Then(
    '{string} is redirected to new create lesson info page in the current tab',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} is redirected to new create lesson info page in the current tab`,
            async function () {
                await schoolAdminRedirectsToNewCreateLessonInfoPage(cms);
            }
        );
    }
);

Then(
    '{string} sees all information is copied from the previous group lesson',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const groupLessonInfo = this.scenario.get<GroupLessonInfo>(aliasGroupLessonInfo);
        await cms.instruction(
            `${role} sees all information is copied from the previous group lesson`,
            async function () {
                await assertAllInformationAreCopiedFromPreviousGroupLesson(cms, groupLessonInfo);
            }
        );
    }
);

Then(
    '{string} sees attendance info "Status", "Notice", "Reason", "Note" of students is blank',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees attendance info "Status", "Notice", "Reason", "Note" of students is blank`,
            async function () {
                await assertValueOfAttendanceInfoStatus(cms, '');
                await assertValueOfAttendanceInfoNotice(cms, '');
                await assertValueOfAttendanceInfoReason(cms, '');
                await assertValueOfAttendanceInfoNote(cms, '');
            }
        );
    }
);

Then(
    '{string} {string} the end date field',
    async function (role: AccountRoles, visibleState: VisibleState) {
        const cms = getCMSInterfaceByRole(this, role);
        const visible = visibleState === 'can see';
        await cms.instruction(`${role} does not see the end date field`, async function () {
            await assertEndDateFieldVisible(cms, visible);
        });
    }
);

Then(
    '{string} sees newly duplicated lesson in the {string} on the list on CMS',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const studentName = getUsersFromContextByRegexKeys(context, learnerProfileAlias)[0].name;
        const lessonId = context.get(aliasDuplicatedLessonId);
        await cms.instruction(
            `${role} sees newly duplicated lesson in the ${lessonTime} on the list on CMS`,
            async function () {
                await assertNewlyDuplicatedLessonVisibleOnTheList(
                    cms,
                    lessonId,
                    lessonTime,
                    studentName
                );
            }
        );
    }
);

Then('{string} sees lesson recurring chain no change', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const context = this.scenario;
    const previousLessonId = context.get(aliasLessonId);
    const duplicatedLessonId = context.get(aliasDuplicatedLessonId);
    await cms.instruction(`${role} sees lesson recurring chain no change`, async function () {
        await assertLessonRecurringChainNoChange(cms, previousLessonId, duplicatedLessonId);
    });
});

Then(
    '{string} {string} selected the lesson to duplicating in the {string}',
    async function (
        role: AccountRoles,
        visibleState: VisibleState,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        const duplicatingLesson = context.get(aliasLessonId);
        const visible = visibleState === 'can see';
        await cms.instruction(
            `${role} ${visibleState} selected the lesson to duplicating in the ${lessonTime}`,
            async function () {
                await assertSelectedLessonToDuplicatingVisible(
                    cms,
                    duplicatingLesson,
                    visible,
                    lessonTime
                );
            }
        );
    }
);

Then(
    '{string} sees Recurring Settings is {string}',
    async function (role: AccountRoles, savingMethod: MethodSavingType) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees Recurring Settings is ${savingMethod}`,
            async function () {
                await assertRecurringSettingChecked(cms, savingMethod, true);
            }
        );
    }
);
