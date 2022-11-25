import {
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    getUserProfileFromContext,
    getUsersFromContextByRegexKeys,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasLessonTime } from 'test-suites/squads/lesson/common/alias-keys';
import {
    AttendanceNoticeValues,
    AttendanceReasonValues,
    AttendanceStatusValues,
    LessonTimeValueType,
    LessonUpsertFields,
} from 'test-suites/squads/lesson/common/types';
import {
    assertBreakRecurringChain,
    assertDetailLessonChangeSavingOption,
} from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-center-of-weekly-recurring-individual-lesson-definitions';
import {
    assertValueOfAttendanceInfoNoteUpdated,
    assertValueOfAttendanceInfoNoticeUpdated,
    assertValueOfAttendanceInfoReasonUpdated,
    assertValueOfAttendanceInfoStatusUpdated,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-general-infomation-of-weekly-recurring-group-lesson-definitions';
import {
    filterLessonListByStudentName,
    OrderLessonInRecurringChain,
    selectLessonLinkByLessonOrder,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import { goToLessonsList } from 'test-suites/squads/lesson/utils/lesson-list';
import {
    assertGroupLessonUpsertFieldNoChanged,
    assertGroupLessonUpsertFieldUpdated,
    assertUpdatedGroupLessonFieldOfOtherLessonInChain,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

Then(
    '{string} sees Attendance is {string}, {string}, {string}, and {string} of student are updated',
    async function (
        role: AccountRoles,
        status: AttendanceStatusValues,
        notice: AttendanceNoticeValues,
        reason: AttendanceReasonValues,
        note: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees Attendance is ${status}, ${notice}, ${reason}, and ${note} of student are updated`,
            async function () {
                await assertValueOfAttendanceInfoStatusUpdated(cms, status);
                await assertValueOfAttendanceInfoNoticeUpdated(cms, notice);
                await assertValueOfAttendanceInfoReasonUpdated(cms, reason);
                await assertValueOfAttendanceInfoNoteUpdated(cms, note);
            }
        );
    }
);

Then(
    '{string} sees all {string} lessons in chain no change',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `${role} sees other ${lessonTime} lessons in chain no change`,
            async function () {
                await assertBreakRecurringChain({
                    cms,
                    countBreakChain: 5,
                    studentName,
                    role,
                    lessonTime,
                });

                await assertDetailLessonChangeSavingOption({
                    cms,
                    lessonTime,
                    studentName,
                    role,
                    savingOptionExpect: 'Weekly Recurring',
                });
            }
        );
    }
);

Then(
    '{string} sees updated {string} for this group lesson',
    async function (role: AccountRoles, field: LessonUpsertFields) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(`${role} sees updated ${field} for this lesson`, async function () {
            await assertGroupLessonUpsertFieldUpdated(cms, scenarioContext, field);
        });
    }
);

Then(
    '{string} sees updated {string} for other group lessons in chain',
    async function (role: AccountRoles, field: LessonUpsertFields) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);

        await cms.instruction(
            `${role} sees updated ${field} for other group lessons in chain`,
            async function () {
                await assertUpdatedGroupLessonFieldOfOtherLessonInChain(
                    cms,
                    scenarioContext,
                    lessonTime,
                    field
                );
            }
        );
    }
);

Then(
    '{string} other group lessons before the edited lesson no change in {string}',
    async function (role: AccountRoles, field: LessonUpsertFields) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);
        const users = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
        await cms.instruction(
            `${role} other lessons before the edited lesson no change in ${field}`,
            async function () {
                await goToLessonsList({ cms, lessonTime });
                await filterLessonListByStudentName(cms, users[0].name, lessonTime);
                await selectLessonLinkByLessonOrder(
                    cms,
                    OrderLessonInRecurringChain.FIRST,
                    lessonTime
                );
                await assertGroupLessonUpsertFieldNoChanged(cms, scenarioContext, field);
            }
        );
    }
);

Then(
    '{string} other group lessons after the edited lesson no change in {string}',
    async function (role: AccountRoles, field: LessonUpsertFields) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);
        const users = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
        await cms.instruction(
            `${role} other lessons after the edited lesson no change in ${field}`,
            async function () {
                await goToLessonsList({ cms, lessonTime });
                await filterLessonListByStudentName(cms, users[0].name, lessonTime);
                await selectLessonLinkByLessonOrder(
                    cms,
                    OrderLessonInRecurringChain.FOURTH,
                    lessonTime
                );
                await assertGroupLessonUpsertFieldNoChanged(cms, scenarioContext, field);
            }
        );
    }
);
