import { CMSInterface } from '@supports/app-types';

import { approveButton } from 'test-suites/squads/timesheet/common/cms-selectors/timesheet-list';
import {
    assertElementExists,
    assertTableColumnExists,
} from 'test-suites/squads/timesheet/common/step-definitions/common-assertion-definitions';

export const assertTimesheetManagementTableColumnExists = async (
    cms: CMSInterface,
    columnLabel: string
) => {
    await assertTableColumnExists({
        cms,
        columnLabel,
        tableTestId: 'AdminTimesheetList__table',
    });
};

export const assertTimesheetManagementApproveButtonExists = async (cms: CMSInterface) => {
    await assertElementExists(cms, approveButton);
};
