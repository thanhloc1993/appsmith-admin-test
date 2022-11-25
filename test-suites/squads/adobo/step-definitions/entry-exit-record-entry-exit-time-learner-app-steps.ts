import {
    getLearnerInterfaceFromRole,
    getUserProfileFromContext,
} from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    addEntryExitRecordOnCMS,
    cmsGoToStudentEntryExitTab,
} from './entry-exit-add-entry-exit-record-definitions';
import { editEntryExitRecordOnCms } from './entry-exit-edit-entry-exit-record-definitions';
import {
    accountSeesNoExitRecord,
    accountSeesEntryExitRecord,
    tapOnMyEntryExitRecords,
} from './entry-exit-record-entry-exit-time-learner-app-definitions';
import { openMenuPopupOnWeb } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

export type Nth = 'first' | 'second' | 'third' | 'fourth';
export type TouchType = 'Entry' | 'Exit';

const today = new Date();
const yesterday = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);

When(
    '{string} scans QR code successfully the {string} time',
    async function (this: IMasterWorld, role: AccountRoles, nth: Nth): Promise<void> {
        const cms = this.cms;

        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(role)
        );

        switch (nth) {
            case 'first':
                await cms.instruction(
                    `Simulate first scan via manual adding of entry record`,
                    async function () {
                        await cmsGoToStudentEntryExitTab(cms, learnerProfile);
                        await addEntryExitRecordOnCMS(cms, false, false, yesterday);
                    }
                );
                break;
            case 'second':
                await cms.instruction(
                    `Simulate second scan via manual adding of entry/exit record`,
                    async function () {
                        await cmsGoToStudentEntryExitTab(cms, learnerProfile);
                        await addEntryExitRecordOnCMS(cms, true, false, yesterday);
                    }
                );
                break;
            case 'third':
                await cms.instruction(
                    `Simulate first scan via manual adding of entry record`,
                    async function () {
                        await cmsGoToStudentEntryExitTab(cms, learnerProfile);
                        await addEntryExitRecordOnCMS(cms, false, false, yesterday);
                    }
                );
                await cms.instruction(
                    `Simulate second scan via manual adding of exit record`,
                    async function () {
                        await editEntryExitRecordOnCms(cms);
                    }
                );
                await cms.instruction(
                    `Simulate third scan via manual adding of entry record`,
                    async function () {
                        await addEntryExitRecordOnCMS(cms, false, false, today);
                    }
                );
                break;
            case 'fourth':
                await cms.instruction(
                    `Simulate first & second scan via manual adding of entry/exit record`,
                    async function () {
                        await cmsGoToStudentEntryExitTab(cms, learnerProfile);
                        await addEntryExitRecordOnCMS(cms, true, false, yesterday);
                    }
                );
                await cms.instruction(
                    `Simulate first & second scan via manual adding of entry/exit record`,
                    async function () {
                        await cmsGoToStudentEntryExitTab(cms, learnerProfile);
                        await addEntryExitRecordOnCMS(cms, true, false, today);
                    }
                );
                break;
            default:
                break;
        }
    }
);

When(
    '{string} scans QR code successfully the second time',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = this.cms;

        const learnerProfile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(role)
        );

        await cms.instruction(
            `Simulate second scan via manual adding of entry record`,
            async function () {
                await cmsGoToStudentEntryExitTab(cms, learnerProfile);
                await addEntryExitRecordOnCMS(cms, false, false, yesterday);
            }
        );
    }
);

Then(
    '{string} and {string} see {string} time is recorded for student',
    async function (
        this: IMasterWorld,
        studentRole: AccountRoles,
        parentRole: AccountRoles,
        touchType: TouchType
    ) {
        const learner = getLearnerInterfaceFromRole(this, studentRole);
        const parent = this.parent!;

        await learner.instruction('Student goes to Entry & Exit records screen', async function () {
            await openMenuPopupOnWeb(learner);

            await tapOnMyEntryExitRecords(learner);
        });

        const { records } = await learner.getEntryExitRecords();

        await learner.instruction(`${studentRole} sees ${touchType} record`, async function () {
            await accountSeesEntryExitRecord(learner, records[0], touchType, studentRole);
        });

        await parent.instruction(
            'Parent of student goes to Entry & Exit records screen',
            async function () {
                await openMenuPopupOnWeb(parent);

                await tapOnMyEntryExitRecords(parent);
            }
        );

        await parent.instruction(`${parentRole} sees ${touchType} record`, async function () {
            await accountSeesEntryExitRecord(parent, records[0], touchType, parentRole);
        });
    }
);

Then(
    '{string} and {string} see no exit time displayed',
    async function (this: IMasterWorld, studentRole: AccountRoles, parentRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, 'student');
        const parent = this.parent!;

        const { records } = await learner.getEntryExitRecords();

        await learner.instruction(`${studentRole} sees no exit record`, async function () {
            await accountSeesNoExitRecord(learner, records[0].id);
        });

        await parent.instruction(`${parentRole} sees no exit record`, async function () {
            await accountSeesNoExitRecord(parent, records[0].id);
        });
    }
);
