import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { studentGoesToPageFromHomeScreen } from './syllabus-utils';

export async function studentGoesToStatsPageFromHomeScreen(learner: LearnerInterface) {
    const statsKey = SyllabusLearnerKeys.stats_tab;
    const statsPageKey = SyllabusLearnerKeys.stats_page;
    await studentGoesToPageFromHomeScreen(learner, statsKey, statsPageKey);
}
