import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getUsersFromContextByRegexKeys } from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasAttendanceStatusValue } from 'test-suites/squads/lesson/common/alias-keys';
import { AttendanceStatusValues } from 'test-suites/squads/lesson/common/types';
import {
    assertStudentAttendanceStatusInLessonDetail,
    bulkUpdateAttendanceStatusInLessonUpsert,
    savesUpdatedLesson,
    selectAttendanceStatusForStudent,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-attendance-value-of-the-one-time-group-lesson-in-the-future-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import { getRandomOneOfArray } from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has applied bulk action with {string} for Attendance status of student',
    async function (role: AccountRoles, attendanceStatus: AttendanceStatusValues) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has applied bulk action with ${attendanceStatus} for Attendance status of student`,
            async function () {
                await bulkUpdateAttendanceStatusInLessonUpsert({ cms, attendanceStatus });
            }
        );
    }
);

When(
    '{string} edits Attendance status of student to {string}',
    async function (role: AccountRoles, randomAttendanceStatus: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const attendanceStatus = getRandomOneOfArray(
            randomAttendanceStatus
        ) as AttendanceStatusValues;

        scenarioContext.set(aliasAttendanceStatusValue, attendanceStatus);

        const [student] = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);

        await cms.instruction(
            `${role} edits Attendance status of student to ${randomAttendanceStatus}`,
            async function () {
                await selectAttendanceStatusForStudent({
                    cms,
                    studentName: student.name,
                    attendanceStatus,
                });
            }
        );
    }
);

When(
    '{string} saves the changes {string} lesson',
    async function (role: AccountRoles, lessonActionSave: LessonActionSaveType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} saves the changes ${lessonActionSave} lesson`,
            async function () {
                await savesUpdatedLesson({
                    cms,
                    lessonActionSave,
                });
            }
        );
    }
);

Then(
    '{string} sees {string} Attendance status in detailed group lesson page',
    async function (role: AccountRoles, _randomAttendanceStatus: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const [student] = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
        const attendanceStatus = scenarioContext.get<AttendanceStatusValues>(
            aliasAttendanceStatusValue
        );

        await cms.instruction(
            `${role} sees ${attendanceStatus} Attendance status in detailed group lesson page`,
            async function () {
                await assertStudentAttendanceStatusInLessonDetail({
                    cms,
                    studentName: student.name,
                    attendanceStatus,
                });
            }
        );
    }
);
