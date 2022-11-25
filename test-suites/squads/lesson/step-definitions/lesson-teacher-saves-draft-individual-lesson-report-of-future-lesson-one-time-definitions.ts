import { CMSInterface } from '@supports/app-types';

import {
    doubleDashValue,
    valuableFieldLessonReport,
} from 'test-suites/squads/lesson/common/cms-selectors';

export async function userSeeFulFilledIndividualReport(cms: CMSInterface) {
    const emptyField = await cms.page!.locator(doubleDashValue).elementHandles();
    weExpect(emptyField, 'Expect does not see `--` in lesson report detail').toHaveLength(0);
}

export async function userSeeEmptyIndividualReport(cms: CMSInterface) {
    const page = cms.page!;

    const emptyField = await page.locator(doubleDashValue).elementHandles();
    const valuableFields = await page.locator(valuableFieldLessonReport).elementHandles();

    weExpect(emptyField, 'Expect all fields in lesson report detail are `--`').toHaveLength(
        valuableFields.length
    );
}
