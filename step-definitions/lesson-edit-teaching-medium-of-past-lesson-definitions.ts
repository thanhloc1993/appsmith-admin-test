import { CMSInterface } from '@supports/app-types';

import { lessonTeachingMediumGeneralInfo } from './cms-selectors/lesson';
import { TeachingMedium } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { selectTeachingMedium } from 'test-suites/squads/lesson/utils/lesson-upsert';

export async function selectTeachingMediumByLabel(
    cms: CMSInterface,
    teachingMedium: TeachingMedium
) {
    const teachingMediumValue =
        teachingMedium === 'Online'
            ? 'LESSON_TEACHING_MEDIUM_ONLINE'
            : 'LESSON_TEACHING_MEDIUM_OFFLINE';
    await selectTeachingMedium(cms, teachingMediumValue);
}

export async function schoolAdminSeesTeachingMedium(
    cms: CMSInterface,
    teachingMedium: TeachingMedium
) {
    await cms.waitForSelectorHasText(lessonTeachingMediumGeneralInfo, teachingMedium);
}
