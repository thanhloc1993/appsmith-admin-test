import { CMSInterface } from '@supports/app-types';

import { buttonByAriaLabel, dialogCancelConfirm } from './cms-selectors/cms-keys';
import { updateFieldOfLesson } from './lesson-edit-lesson-by-updating-and-adding-definitions';
import { upsertLessonDialog } from 'step-definitions/cms-selectors/lesson-management';
import {
    LessonManagementLessonTime,
    LessonUpsertFields,
} from 'test-suites/squads/lesson/types/lesson-management';

export async function updateAllLessonFields(
    cms: CMSInterface,
    lessonTime: LessonManagementLessonTime
) {
    const lessonFields: LessonUpsertFields[] = [
        'lesson date',
        'start time',
        'end time',
        'teaching medium',
        'teaching method',
        'teacher',
        'center',
        'student',
    ];

    for (const field of lessonFields) {
        await updateFieldOfLesson(cms, field, lessonTime);
    }
}

export async function cancelEditLesson(cms: CMSInterface, shouldLeave: boolean) {
    await cms.instruction('User cancels edit lesson dialog', async function () {
        await cms.selectElementWithinWrapper(upsertLessonDialog, buttonByAriaLabel('Cancel'));
    });

    if (shouldLeave) {
        await cms.instruction('User confirms leaving edit lesson dialog', async function () {
            await cms.selectElementWithinWrapper(dialogCancelConfirm, buttonByAriaLabel('Leave'));
        });
        return;
    }

    await cms.instruction('User cancels leaving edit lesson dialog', async function () {
        await cms.selectElementWithinWrapper(dialogCancelConfirm, buttonByAriaLabel('Cancel'));
    });
}
