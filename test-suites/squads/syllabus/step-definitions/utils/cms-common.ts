import { CMSInterface } from '@supports/app-types';

import {
    applyFilterAdvancedButton,
    openFilterAdvancedPopupButton,
} from 'test-suites/squads/syllabus/step-definitions/cms-selectors/cms-keys';

export const schoolAdminOpenFilterAdvanced = async (cms: CMSInterface) => {
    await cms.page?.click(openFilterAdvancedPopupButton);
};

export const schoolAdminApplyFilterAdvanced = async (cms: CMSInterface) => {
    await cms.page?.click(applyFilterAdvancedButton);
};
