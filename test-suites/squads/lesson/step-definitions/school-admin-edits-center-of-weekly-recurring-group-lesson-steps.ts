import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getUserProfileFromContext } from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasCourseName } from 'test-suites/squads/lesson/common/alias-keys';
import { openDialogAddStudentSubscriptionV2 } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import { changeCenter } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-center-of-weekly-recurring-individual-lesson-definitions';
import { updateCenterStudent } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-center-of-weekly-recurring-individual-lesson-definitions';
import { clearLessonFieldOfGroupLesson } from 'test-suites/squads/lesson/step-definitions/school-admin-edits-center-of-weekly-recurring-group-lesson-definitions';
import { selectCourseByNameV3 } from 'test-suites/squads/lesson/utils/lesson-upsert';

When('{string} edits Center of Weekly Recurring lesson', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await cms.instruction(`${role} clear center`, async function () {
        await clearLessonFieldOfGroupLesson(cms, 'center');
    });

    await cms.instruction(`${role} has selected weekly recurring`, async function () {
        await changeCenter(cms, scenario, role);
    });
});

When('{string} updates student center of the group lesson', async function (role: AccountRoles) {
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
