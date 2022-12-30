import { When } from '@cucumber/cucumber';

import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import { checkIsManualGradingEnabled } from 'test-suites/squads/syllabus/step-definitions/syllabus-migration-temp';

When('school admin sees manual grading setting is disabled', async function () {
    const isManualGradingEnabled = await checkIsManualGradingEnabled();

    if (!isManualGradingEnabled) {
        return;
    }

    await this.cms.instruction('School admin sees manual grading setting is disabled', async () => {
        await cmsExamForm.findManualGradingRadio(this.cms.page!);
    });
});
