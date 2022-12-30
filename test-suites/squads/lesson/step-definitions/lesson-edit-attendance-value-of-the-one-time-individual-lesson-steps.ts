import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    aliasAttendanceStatusValue,
    aliasLessonId,
} from 'test-suites/squads/lesson/common/alias-keys';
import { AttendanceStatusValues } from 'test-suites/squads/lesson/common/types';
import {
    applyAttendanceStatus,
    editAttendanceStatus,
} from 'test-suites/squads/lesson/step-definitions/lesson-edit-attendance-value-of-the-one-time-individual-lesson-definitions';
import { goToEditLessonPage } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-general-information-of-weekly-recurring-individual-lesson-definitions';
import { getRandomOneOfArray } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

Given(
    '{string} has opened editing future one time individual lesson page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const lessonId = scenario.get(aliasLessonId);

        await cms.instruction(
            `${role} has opened editing lesson page of the lesson in the recurring chain`,
            async function () {
                await goToEditLessonPage(cms, lessonId);
            }
        );
    }
);

Given(
    '{string} has applied {string} Attendance status value',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        attendanceStatus: AttendanceStatusValues
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has applied ${attendanceStatus} Attendance status value`,
            async function () {
                await applyAttendanceStatus(cms, attendanceStatus);
            }
        );
    }
);

When(
    '{string} edits Attendance value to {string}',
    async function (this: IMasterWorld, role: AccountRoles, attendanceValuesList: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const attendanceStatus = getRandomOneOfArray(
            attendanceValuesList
        ) as AttendanceStatusValues;
        scenarioContext.set(aliasAttendanceStatusValue, attendanceStatus);

        await cms.instruction(
            `${role} edits Attendance value to ${attendanceStatus}`,
            async function () {
                await editAttendanceStatus(cms, attendanceStatus);
            }
        );
    }
);
