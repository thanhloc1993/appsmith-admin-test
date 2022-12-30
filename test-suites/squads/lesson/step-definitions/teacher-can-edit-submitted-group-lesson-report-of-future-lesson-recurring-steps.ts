import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { GroupLessonReportField } from 'test-suites/squads/lesson/common/types';
import {
    clearValueGroupLessonReport,
    createGroupLessonReport,
} from 'test-suites/squads/lesson/utils/lesson-report';

Given('{string} has created a group lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} has created a group lesson report`, async function () {
        await createGroupLessonReport(cms);
    });
});

Given(
    '{string} has cleared {string} value of group lesson report',
    async function (role: AccountRoles, rawFields: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const fields = rawFields.split(', ') as GroupLessonReportField[];
        await cms.instruction(
            `${role} has cleared ${rawFields} value of group lesson report`,
            async function () {
                await clearValueGroupLessonReport({ cms, fields });
            }
        );
    }
);

Given(
    '{string} has cleared all fields of group lesson report',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} has cleared all fields of group lesson report`,
            async function () {
                await clearValueGroupLessonReport({
                    cms,
                    fields: [
                        'Content',
                        'Remark (Internal Only)',
                        'Homework',
                        'Announcement',
                        'In-lesson Quiz',
                        'Remark',
                    ],
                });
            }
        );
    }
);
