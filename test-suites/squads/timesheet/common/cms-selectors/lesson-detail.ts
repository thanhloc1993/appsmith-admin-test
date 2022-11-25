import { getTestId } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { actionPanelMenuList } from 'test-suites/squads/timesheet/common/cms-selectors/common';

export const completeLessonButton = `${actionPanelMenuList} [aria-label="Complete Lesson"]`;
export const cancelLessonButton = `${actionPanelMenuList} [aria-label="Cancel Lesson"]`;
export const revertToPublishedButton = `${actionPanelMenuList} [aria-label="Revert to Published"]`;

export const lessonStatusChip = getTestId('HeaderLessonDetailWithAction__chipLessonStatus');
export const lessonDetailEditButton = getTestId('TabLessonDetail__buttonEdit');
