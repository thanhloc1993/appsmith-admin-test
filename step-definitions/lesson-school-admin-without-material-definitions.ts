import { CMSInterface } from '@supports/app-types';

import * as LessonKeys from './cms-selectors/lesson';

export async function makeSureLessonDetailHasNoMaterial(cms: CMSInterface) {
    const page = cms.page!;

    const materials = await page.$$(LessonKeys.chipFileContainer);
    weExpect(materials, 'Expect there is no materials').toHaveLength(0);
}
