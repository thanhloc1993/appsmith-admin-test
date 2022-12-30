import { CMSInterface } from '@supports/app-types';

import { tableDeleteButton } from './cms-selectors/cms-keys';
import { chipAutocompleteIconDelete } from './cms-selectors/lesson';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';

export async function removeTeacherFromLesson(cms: CMSInterface, teacherName: string) {
    const page = cms.page!;

    const teacherTagBox = await page.waitForSelector(
        LessonManagementKeys.teacherAutocompleteTagBoxWithTeacherName(teacherName)
    );

    const deleteChipIcon = await teacherTagBox.waitForSelector(chipAutocompleteIconDelete);
    await deleteChipIcon.click();
}

export async function removeStudentFromLesson(cms: CMSInterface, studentSubscriptionId: string) {
    const page = cms.page!;

    await page.click(
        LessonManagementKeys.recordStudentSubscriptionTableCheckBox(studentSubscriptionId)
    );

    await page.click(tableDeleteButton);
}
