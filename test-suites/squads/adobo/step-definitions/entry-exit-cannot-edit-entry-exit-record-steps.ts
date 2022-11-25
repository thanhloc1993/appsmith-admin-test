import { getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { StudentDetailTab } from '@supports/types/cms-types';

import {
    cmsGoToStudentEntryExitTab,
    StatusTypes,
} from './entry-exit-add-entry-exit-record-definitions';
import {
    attemptEditOrDeleteEntryExitRecord,
    createExistingRecordForQuitStudent,
    editEntryExitRecordWithExitTimeEarlierThanEntryTime,
    schoolAdminSeesDisabledEditEntryExitRecord,
} from './entry-exit-cannot-edit-entry-exit-record-definitions';
import {
    createExistingRecordForStudent,
    updateStatusAndGoToStudentEntryExitTab,
} from './entry-exit-records-list-definitions';
import { checkIfWithExitTime, getCorrectDateForEntryExit } from './entry-exit-utils';
import { schoolAdminChooseTabInStudentDetail } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

const currentDate = new Date();
const correctDate = getCorrectDateForEntryExit(currentDate);

Given(
    'at least 1 entry & exit record has been created for {string} {string}',
    async function (this: IMasterWorld, status: StatusTypes, studentRole: AccountRoles) {
        const cms = this.cms;
        const scenario = this.scenario;

        const learnerProfile = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        // Student should have Enrolled/Potential status to create a record via GRPC
        // If not, change status to Enrolled/Potential, create a record, then revert to old status
        if (
            learnerProfile.enrollmentStatus === 'STUDENT_ENROLLMENT_STATUS_POTENTIAL' ||
            learnerProfile.enrollmentStatus === 'STUDENT_ENROLLMENT_STATUS_ENROLLED'
        ) {
            // Create record via grpc normally
            await cms.instruction(`School admin creates a record`, async function () {
                await createExistingRecordForStudent(
                    cms,
                    learnerProfile,
                    correctDate,
                    checkIfWithExitTime(correctDate)
                );
            });

            await cms.instruction(
                `School admin goes to Entry & Exit tab in Student Detail page of ${studentRole}`,
                async function () {
                    await cmsGoToStudentEntryExitTab(cms, learnerProfile);
                }
            );
        } else {
            await cms.instruction(`Change status to Enrolled`, async function () {
                await createExistingRecordForQuitStudent(cms, learnerProfile, status);
            });
        }
    }
);

When(
    '{string} tries to edit a record of {string}',
    async function (
        this: IMasterWorld,
        schoolAdminRole: AccountRoles,
        studentRole: AccountRoles
    ): Promise<void> {
        const cms = this.cms;

        // We are already on Student Detail page
        await cms.instruction(
            `${schoolAdminRole} goes to Entry & Exit tab in Student Detail page of ${studentRole}`,
            async function () {
                await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.ENTRY_EXIT);
                await cms.waitForSkeletonLoading();
            }
        );

        await cms.instruction(
            `${schoolAdminRole} tries to delete record for ${studentRole}`,
            async function () {
                await attemptEditOrDeleteEntryExitRecord(cms);
            }
        );
    }
);

Given(
    `{string} updates student status to {string}`,
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles, status: StatusTypes) {
        const cms = this.cms;

        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        await cms.instruction(
            `${schoolAdminRole} updates status of student and goes to Entry & Exit tab`,
            async function () {
                await updateStatusAndGoToStudentEntryExitTab(cms, learnerProfile, status);
            }
        );
    }
);

Then(
    '{string} edits record where exit date is earlier than entry date for {string}',
    async function (
        this: IMasterWorld,
        schoolAdminRole: AccountRoles,
        studentRole: AccountRoles
    ): Promise<void> {
        const cms = this.cms;

        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await cms.instruction(
            `${schoolAdminRole} goes to Entry & Exit tab in Student Detail page of ${studentRole}`,
            async function () {
                await cmsGoToStudentEntryExitTab(cms, learnerProfile);
            }
        );

        await cms.instruction(
            `${schoolAdminRole} edits entry & exit record with invalid data for ${studentRole}`,
            async function () {
                await editEntryExitRecordWithExitTimeEarlierThanEntryTime(cms);
            }
        );
    }
);

Then(
    '{string} cannot update the entry & exit record',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles) {
        await this.cms.instruction(`${schoolAdminRole} sees error message`, async () => {
            await this.cms.assertTypographyWithTooltip(
                'p',
                'Entry time must be earlier than exit time'
            );
        });
    }
);

Then(
    '{string} sees that they cannot edit a record',
    async function (this: IMasterWorld, schoolAdminRole: AccountRoles) {
        const cms = this.cms;

        await cms.instruction(
            `${schoolAdminRole} sees that the Delete action is disabled`,
            async function () {
                await schoolAdminSeesDisabledEditEntryExitRecord(cms);
            }
        );
    }
);
