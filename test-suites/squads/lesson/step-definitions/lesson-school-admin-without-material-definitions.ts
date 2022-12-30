import { CMSInterface } from '@supports/app-types';

import { materialChipContainer } from 'test-suites/squads/lesson/common/cms-selectors';

export async function makeSureLessonDetailHasNoMaterial(cms: CMSInterface) {
    const page = cms.page!;

    const materials = await page.$$(materialChipContainer);
    weExpect(materials, 'Expect there is no materials').toHaveLength(0);
}
