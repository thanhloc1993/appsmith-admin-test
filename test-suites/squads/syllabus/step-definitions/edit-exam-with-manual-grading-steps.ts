import { When } from '@cucumber/cucumber';

import { schoolAdminAssertManualGradingSetting } from 'test-suites/squads/syllabus/step-definitions/edit-exam-with-manual-grading-definitions';
import { checkIsManualGradingEnabled } from 'test-suites/squads/syllabus/step-definitions/syllabus-migration-temp';

When('school admin sees manual grading setting is disabled', async function () {
    const isManualGradingEnabled = await checkIsManualGradingEnabled();

    if (!isManualGradingEnabled) {
        return;
    }

    await this.cms.instruction('School admin sees manual grading setting is disabled', async () => {
        await schoolAdminAssertManualGradingSetting(this.cms);
    });
});
