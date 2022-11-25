import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { CreateLessonRequestData } from '@supports/services/bob-lesson-management/bob-lesson-management-service';

import { aliasLessonInfo } from 'step-definitions/alias-keys/lesson';
import { filterCheckOnLessonsList } from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';

export type FilteredDateOptions = 'Lesson Start Date' | 'Lesson End Date';

export type FilteredTimeOptions = 'Start Time' | 'End Time';

export type FilteredDateAndTimeOptions = FilteredDateOptions | FilteredTimeOptions;

export async function assertDateAndTimeOptionInLessonList(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    option: FilteredDateAndTimeOptions;
}) {
    const { cms, scenarioContext, option: criteria } = params;

    const lessonInfo = scenarioContext.get<CreateLessonRequestData>(aliasLessonInfo);

    // Date And Time is visible in lesson list
    await filterCheckOnLessonsList(cms, scenarioContext, criteria, lessonInfo);
}
