import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { LessonManagementLessonDetailTabNames } from './cms-selectors/lesson-management';
import { chooseLessonDetailTab } from './lesson-edit-lesson-by-updating-and-adding-definitions';
import { assertStudentOnLessonReportStudentsList } from './lesson-edit-student-of-past-lesson-definitions';
import { getCMSInterfaceByRole, getUserProfileFromContext } from './utils';

When(
    '{string} reloads detailed lesson info page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} reloads detailed lesson info page`, async function () {
            await cms.page!.reload();
        });
    }
);

Then(
    '{string} sees added {string} in student list of lesson report on CMS',
    async function (this: IMasterWorld, role: AccountRoles, secondRole: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix(secondRole)
        );

        await cms.instruction(
            `${role} sees added ${secondRole} in student list of lesson report on CMS`,
            async function () {
                await chooseLessonDetailTab(
                    cms,
                    LessonManagementLessonDetailTabNames.LESSON_REPORT
                );

                await assertStudentOnLessonReportStudentsList({ cms, studentName });
            }
        );
    }
);

Then(
    '{string} does not see {string} in student list of lesson report on CMS',
    async function (this: IMasterWorld, role: AccountRoles, secondRole: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix(secondRole)
        );

        await cms.instruction(
            `${role} does not see ${secondRole} in student list of lesson report on CMS`,
            async function () {
                await chooseLessonDetailTab(
                    cms,
                    LessonManagementLessonDetailTabNames.LESSON_REPORT
                );

                await assertStudentOnLessonReportStudentsList({
                    cms,
                    studentName,
                    shouldBeOnList: false,
                });
            }
        );
    }
);
