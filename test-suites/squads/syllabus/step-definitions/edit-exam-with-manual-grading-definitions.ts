import { CMSInterface } from '@supports/app-types';

import { disabledRadioButton } from 'test-suites/squads/syllabus/step-definitions/cms-selectors/cms-keys';
import {
    manualGradingRadioOff,
    manualGradingRadioOn,
} from 'test-suites/squads/syllabus/step-definitions/cms-selectors/exam-lo';

export const schoolAdminAssertManualGradingSetting = async (cms: CMSInterface) => {
    const radioOnEl = await cms.page!.waitForSelector(manualGradingRadioOn);
    const radioOffEl = await cms.page!.waitForSelector(manualGradingRadioOff);

    await radioOnEl.waitForSelector(disabledRadioButton);
    await radioOffEl.waitForSelector(disabledRadioButton);
};
