import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getUserProfileFromContext } from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasCourseName } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonStatusType, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { assertLessonStatusOrderBy } from 'test-suites/squads/lesson/step-definitions/auto-change-status-change-to-completed-when-submit-lesson-group-report-definitions';
import { openDialogAddStudentSubscriptionV2 } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import {
    assertBreakRecurringChain,
    assertDetailLessonChangeSavingOption,
    changeCenter,
} from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-center-of-weekly-recurring-individual-lesson-definitions';
import { updateCenterStudent } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-center-of-weekly-recurring-individual-lesson-definitions';
import { clearLessonFieldOfGroupLesson } from 'test-suites/squads/lesson/step-definitions/school-admin-edits-center-of-weekly-recurring-group-lesson-definitions';
import { selectCourseByNameV3 } from 'test-suites/squads/lesson/utils/lesson-upsert';

When('{string} edits location of Weekly Recurring lesson', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await cms.instruction(`${role} clear center`, async function () {
        await clearLessonFieldOfGroupLesson(cms, 'center');
    });

    await cms.instruction(`${role} has selected weekly recurring`, async function () {
        await changeCenter(cms, scenario, role);
    });
});

When('{string} updates student location of the group lesson', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await openDialogAddStudentSubscriptionV2(cms);

    const { name: studentName } = getUserProfileFromContext(
        scenario,
        learnerProfileAliasWithAccountRoleSuffix('student S2')
    );

    await cms.instruction(`${role} updates center of student`, async function () {
        await updateCenterStudent({ cms, studentName });
    });
});

When('{string} updates Course of Weekly Recurring Lesson', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;
    const courseName = scenario.get<string>(aliasCourseName);

    await cms.instruction(`${role} updates Course of Weekly Recurring Lesson`, async function () {
        await selectCourseByNameV3(cms, courseName);
    });
});

Then(
    '{string} sees other {string} {string} lessons in chain no change',
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

        await cms.instruction(
            `${role} sees other ${lessonStatus} ${lessonTime} lessons in chain no change`,
            async function () {
                await assertBreakRecurringChain({
                    cms,
                    countBreakChain: 4,
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

                await assertLessonStatusOrderBy({
                    cms,
                    lessonTime,
                    startIndex: 0,
                    endIndex: 3,
                    scenarioContext: scenario,
                    lessonStatus,
                });
            }
        );
    }
);
