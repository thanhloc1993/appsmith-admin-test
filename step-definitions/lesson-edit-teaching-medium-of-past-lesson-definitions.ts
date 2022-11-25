import { CMSInterface } from '@supports/app-types';

import {
    lessonTeachingMediumOfflineRatioButton,
    lessonTeachingMediumOnlineRatioButton,
    lessonTeachingMediumGeneralInfo,
} from './cms-selectors/lesson';
import { TeachingMedium } from './lesson-teacher-submit-individual-lesson-report-definitions';

export async function schoolAdminEditsTeachingMedium(
    cms: CMSInterface,
    teachingMedium: TeachingMedium
) {
    switch (teachingMedium) {
        case 'Offline':
            await cms.selectElementByDataTestId(lessonTeachingMediumOfflineRatioButton);
            break;
        case 'Online':
            await cms.selectElementByDataTestId(lessonTeachingMediumOnlineRatioButton);
            break;
    }
}

export async function schoolAdminSeesTeachingMedium(
    cms: CMSInterface,
    teachingMedium: TeachingMedium
) {
    await cms.waitForSelectorHasText(lessonTeachingMediumGeneralInfo, teachingMedium);
}
