import { parentInputPasswordSelector } from '@user-common/cms-selectors/student';
import { dialogStudentAccountInfoFooterButtonClose } from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    clickOnAddParentAndFillInParentInformation,
    schoolAdminFindStudentAndGoesToStudentDetail,
    searchAndSelectExistedParent,
} from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export async function cmsCreateNewParentAndAddForStudent(
    cms: CMSInterface,
    studentProfile: UserProfileEntity
): Promise<UserProfileEntity> {
    const page = cms.page!;

    await schoolAdminFindStudentAndGoesToStudentDetail(cms, studentProfile);

    const newParentInfo = await clickOnAddParentAndFillInParentInformation(
        cms,
        studentProfile.email
    );

    const newParentPassword = await page.getAttribute(parentInputPasswordSelector, 'value');

    await page.click(dialogStudentAccountInfoFooterButtonClose);

    return {
        id: '',
        email: newParentInfo.userName,
        password: newParentPassword ?? '',
        phoneNumber: newParentInfo.phoneNumber,
        name: newParentInfo.userName,
        avatar: '',
        givenName: '',
    };
}

export async function cmsAddExistedParentForStudent(
    cms: CMSInterface,
    studentProfile: UserProfileEntity,
    newParentProfile: UserProfileEntity
) {
    await schoolAdminFindStudentAndGoesToStudentDetail(cms, studentProfile);

    await searchAndSelectExistedParent(cms, newParentProfile.email);

    await cms.waitingForLoadingIcon();
}
