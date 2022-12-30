import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasAttendanceStatusValue } from 'test-suites/squads/lesson/common/alias-keys';
import { lessonUpsertStudentAttendanceStatusInput } from 'test-suites/squads/lesson/common/cms-selectors';
import { AttendanceStatusValues } from 'test-suites/squads/lesson/common/types';
import { saveUpdateLessonOfLessonManagement } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { assertAttendanceStatusOfStudentOnLessonDetail } from 'test-suites/squads/lesson/step-definitions/lesson-edit-attendance-of-past-lesson-definitions';
import { selectAttendanceStatus } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { getRandomOneOfArray } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

Given(
    '{string} has applied {string} Attendance value',
    async function (role: AccountRoles, attendanceValue: AttendanceStatusValues) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} change attendance status of student to ${attendanceValue}`,
            async function () {
                await selectAttendanceStatus(
                    cms,
                    attendanceValue,
                    lessonUpsertStudentAttendanceStatusInput
                );
            }
        );

        await cms.instruction(`${role} saves updates`, async function () {
            await saveUpdateLessonOfLessonManagement(cms);
        });
    }
);

When(
    '{string} edits to {string} Attendance value',
    async function (role: AccountRoles, randomAttendanceValue: string) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const attendanceValue = getRandomOneOfArray(
            randomAttendanceValue
        ) as AttendanceStatusValues;
        scenario.set(aliasAttendanceStatusValue, attendanceValue);

        await cms.instruction(`${role} opens editing lesson page`, async function () {
            await cms.selectAButtonByAriaLabel('Edit');
        });

        await cms.instruction(
            `${role} change attendance status of student to ${attendanceValue}`,
            async function () {
                await selectAttendanceStatus(
                    cms,
                    attendanceValue,
                    lessonUpsertStudentAttendanceStatusInput
                );
            }
        );

        await cms.instruction(`${role} saves updates`, async function () {
            await saveUpdateLessonOfLessonManagement(cms);
        });
    }
);

Then(
    '{string} sees {string} Attendance value in detailed lesson page',
    async function (role: AccountRoles, _randomAttendanceValue: string) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const attendanceValue = scenario.get<AttendanceStatusValues>(aliasAttendanceStatusValue);

        await cms.instruction(
            `${role} sees attendance status of student is ${attendanceValue} on detail lesson page`,
            async function () {
                await assertAttendanceStatusOfStudentOnLessonDetail(cms, attendanceValue);
            }
        );
    }
);
