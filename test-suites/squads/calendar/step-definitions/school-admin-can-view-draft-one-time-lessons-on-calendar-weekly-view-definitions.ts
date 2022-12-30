import { CMSInterface } from '@supports/app-types';

import * as CMSSelector from 'test-suites/squads/calendar/common/cms-selectors';

export async function openCreateLessonPage(cms: CMSInterface) {
    const page = cms.page!;
    await page.locator(CMSSelector.addButton).click();
    const popoverAddButton = page.locator(CMSSelector.popoverAddButton);
    await popoverAddButton?.locator(CMSSelector.addLessonButton).click();
}
