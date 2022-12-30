import { CMSInterface } from '@supports/app-types';

import { editButtonLessonDetail } from '../common/cms-selectors';
import { TeachingMediumValueType } from '../types/lesson-management';
import { getLessonDataOnLessonDetailPage } from 'test-suites/squads/lesson/utils/lesson-detail';

export async function openEditingLessonPage(cms: CMSInterface) {
    await cms.selectElementByDataTestId(editButtonLessonDetail);
}

export async function seeUpdatedTeachingMedium(
    cms: CMSInterface,
    teachingMedium: TeachingMediumValueType
) {
    const lessonDetailData = await getLessonDataOnLessonDetailPage(cms);
    weExpect(lessonDetailData.teachingMedium).toEqual(teachingMedium);
}
