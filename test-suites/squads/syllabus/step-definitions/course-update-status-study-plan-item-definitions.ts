import { CMSInterface } from '@supports/app-types';

import { showHideStudyPlanItem } from './cms-selectors/cms-keys';

export const schoolAdminToggleStudyPlanItemStatus = async (
    cms: CMSInterface,
    studyPlanItemName: string
) => {
    const selector = `${showHideStudyPlanItem}:right-of(:has-text("${studyPlanItemName}"))`;

    await cms.page?.click(selector);
};
