// Start search actions
import { CMSInterface } from '@supports/app-types';

import {
    openFilterAdvancedPopupButton,
    applyFilterAdvancedButton,
    resetFilterAdvancedButton,
    tableEmptyMessage,
    clearAllFilterAdvancedButton,
} from './cms-selectors/cms-keys';

// Start search actions

export const schoolAdminOpenFilterAdvanced = async (cms: CMSInterface) => {
    await cms.page?.click(openFilterAdvancedPopupButton);
};

export const schoolAdminApplyFilterAdvanced = async (cms: CMSInterface) => {
    await cms.page?.click(applyFilterAdvancedButton);
};

export const schoolAdminResetFilterAdvanced = async (cms: CMSInterface) => {
    await cms.page?.click(resetFilterAdvancedButton);
};

export const schoolAdminNotSeesLabelFiltersAdvanced = async (cms: CMSInterface) => {
    await cms.page?.waitForSelector(resetFilterAdvancedButton, { state: 'visible' });
};

export const schoolAdminClearAllFilterAdvanced = async (cms: CMSInterface) => {
    await cms.page?.click(resetFilterAdvancedButton);
};
export const schoolAdminClearAllChipsFilterAdvanced = async (cms: CMSInterface) => {
    await cms.page!.click(clearAllFilterAdvancedButton);
};
// ---------------- End search actions ---------------- //

// Start table

export const schoolAdminSeeEmptyTableMsg = async (
    cms: CMSInterface,
    { wrapper }: { wrapper?: string } = {}
) => {
    const selector = wrapper ? `${wrapper} ${tableEmptyMessage}` : tableEmptyMessage;
    await cms.page?.waitForSelector(selector);
};
// ---------------- End table ---------------- //
