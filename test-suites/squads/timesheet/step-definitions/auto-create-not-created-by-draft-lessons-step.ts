import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    assertNoTimesheetsCreatedFor,
    assertTimesheetManagementTableEmpty,
    createDraftLesson,
} from './auto-create-not-created-by-draft-lessons-definition';
import moment from 'moment-timezone';

When(
    '{string} creates a draft lesson for today with start time for later',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction(
            `${role} creates a draft lesson for today with start time for later`,
            async () => {
                await createDraftLesson({
                    cms,
                    context,
                    lessonData: {
                        date: new Date(),
                        startTime: '23:00',
                        endTime: '23:15',
                    },
                });
            }
        );
    }
);

When(
    '{string} creates a draft lesson for a past date',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction(`${role} creates a draft lesson for a past date`, async () => {
            await createDraftLesson({
                cms,
                context,
                lessonData: {
                    date: moment().subtract(3, 'days').toDate(),
                    startTime: '11:00',
                    endTime: '11:15',
                },
            });
        });
    }
);

When(
    '{string} creates a draft lesson with a date within 2 months from today',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction(
            `${role} creates a draft lesson with a date within 2 months from today`,
            async () => {
                await createDraftLesson({
                    cms,
                    context,
                    lessonData: {
                        date: moment().add(1, 'months').endOf('month').toDate(),
                        startTime: '11:00',
                        endTime: '11:15',
                    },
                });
            }
        );
    }
);

Then(
    '{string} sees no timesheets are auto created for draft lessons',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees no timesheets are auto created for draft lessons`,
            async () => {
                await assertTimesheetManagementTableEmpty(cms);
            }
        );
    }
);

Then(
    '{string} sees no timesheets are auto created from draft lessons for that requestor',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction(
            `${role} sees no timesheets are auto created from draft lessons for that requestor`,
            async () => {
                const staff = context.get<UserProfileEntity>(
                    staffProfileAliasWithAccountRoleSuffix('teacher')
                );
                await assertNoTimesheetsCreatedFor(cms, context, staff.name);
            }
        );
    }
);
