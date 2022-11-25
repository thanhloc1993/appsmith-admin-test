import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { Given } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { userGoToMiddleLessonInChain } from 'test-suites/squads/lesson/step-definitions/lesson-teacher-saves-draft-individual-lesson-report-of-past-lesson-recurring-definitions';
import { getUsersFromContextByRegexKeys } from 'test-suites/squads/lesson/utils/user';

Given(
    '{string} has gone to detailed lesson info page of the {string} lesson in the middle of the recurring chain',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const studentsFromContext = getUsersFromContextByRegexKeys(
            scenarioContext,
            learnerProfileAlias
        );

        const studentName1st = studentsFromContext[0].name;

        await cms.instruction(
            `${role} has gone to detailed lesson info page of the ${lessonTime} lesson in the middle of the recurring chain`,
            async function () {
                await userGoToMiddleLessonInChain({ cms, lessonTime, studentName: studentName1st });
            }
        );
    }
);
