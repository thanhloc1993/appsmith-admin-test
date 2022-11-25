import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import * as LessonManagementKeys from './cms-selectors/lesson-management';
import { StatusTypes } from './types/common';

export async function openEditStudentPage(cms: CMSInterface) {
    const editStudentButton = await cms.page!.waitForSelector(
        studentPageSelectors.editStudentButton
    );
    await editStudentButton.click();
}

export async function selectStatusFromOptionInAutoCompleteBoxByText(
    cms: CMSInterface,
    status: StatusTypes
) {
    await cms.page!.click(studentPageSelectors.enrollmentStatusAutoComplete);
    await cms.chooseOptionInAutoCompleteBoxByText(status);
}

export async function seeStudentInTableMatchStudentNameSearchBar(
    cms: CMSInterface,
    student: UserProfileEntity
) {
    await cms.waitForSelectorHasText(
        LessonManagementKeys.studentNameOnDialogAddStudentTableStudentSubscription,
        student.name
    );
}
