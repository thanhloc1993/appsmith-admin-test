import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';
import { staffListStaffName, staffFormNameInput } from '@user-common/cms-selectors/staff';
import {
    buttonSaveEditStudent,
    parentFormEmailSelector,
    parentTableEditButtonSelector,
    rowOption,
    rowsPerPage,
    studentInputNameSelector,
} from '@user-common/cms-selectors/student';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import {
    dialogWithHeaderFooterWrapper,
    formTableParentsTable,
    tableBaseRowWithId,
} from '@user-common/cms-selectors/students-page';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { StudentDetailTab } from '@supports/types/cms-types';

import * as communicationKeys from './learner-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';
import {
    clickOnSaveButtonInParentElement,
    schoolAdminChooseTabInStudentDetail,
    schoolAdminFindStudentAndGoesToStudentDetail,
} from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';
import {
    gotoEditPageOnCMS,
    openMenuPopupOnWeb,
    userTeacherManagementBackOfficeTeacherDetailsNewUI,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import {
    changeAvatarOnLearner,
    tapOnEditAccountButton,
    updateProfileOnLearner,
} from 'test-suites/squads/user-management/step-definitions/user-edit-on-learner-definitions';

export async function cmsGoToEditStudentPage(cms: CMSInterface, learnerProfile: UserProfileEntity) {
    const page = cms.page!;

    await schoolAdminFindStudentAndGoesToStudentDetail(cms, learnerProfile);

    await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.DETAIL);

    const editStudentButton = await page.waitForSelector(studentPageSelectors.editStudentButton);
    await editStudentButton.click();
}

export async function cmsUpdateStudentName(
    cms: CMSInterface,
    learnerProfile: UserProfileEntity
): Promise<string> {
    const page = cms.page!;

    const firstName = learnerProfile.name;
    const lastName = 'edited';
    const newName = lastName + ' ' + firstName;

    try {
        // Toggle first name & last name is off
        await page.fill(studentInputNameSelector, newName);
    } catch (e) {
        // Toggle first name & last name is on
        await page.fill(studentPageSelectors.formInputFirstName, firstName);
        await page.fill(studentPageSelectors.formInputLastName, lastName);
    }

    await page.click(buttonSaveEditStudent);

    return newName;
}

export async function learnerUpdatesAvatar(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    await openMenuPopupOnWeb(learner);
    await tapOnEditAccountButton(learner);

    await changeAvatarOnLearner(learner);
    const newAvatarUrl = await updateProfileOnLearner(learner);

    await driver.tap(new ByValueKey(LearnerKeys.back_button));

    return newAvatarUrl;
}

export async function teacherVerifyNameOfParticipantList(teacher: TeacherInterface, name: string) {
    const driver = teacher.flutterDriver!;

    const nameFinder = new ByValueKey(communicationKeys.participantListTitle(name));
    await driver.waitFor(nameFinder);
}

export async function teacherVerifyAvatarOfParticipantList(
    teacher: TeacherInterface,
    avatarUrl: string
) {
    const driver = teacher.flutterDriver!;

    const avatarFinder = new ByValueKey(communicationKeys.participantListAvatar(avatarUrl));
    await driver.waitFor(avatarFinder);
}

export async function teacherVerifyUserNameInParticipantList(
    teacher: TeacherInterface,
    name: string,
    userId: string
) {
    const driver = teacher.flutterDriver!;

    const nameFinder = new ByValueKey(communicationKeys.conversationUserInfoName(name, userId));
    await driver.waitFor(nameFinder);
}

export async function teacherVerifyUserAvatarInParticipantList(
    teacher: TeacherInterface,
    name: string,
    avatarUrl: string
) {
    const driver = teacher.flutterDriver!;

    const avatarFinder = new ByValueKey(
        communicationKeys.conversationUserInfoAvatar(name, avatarUrl)
    );
    await driver.waitFor(avatarFinder);
}

export async function cmsUpdateParentName(
    cms: CMSInterface,
    parentProfile: UserProfileEntity
): Promise<string> {
    const page = cms.page!;

    // Select parent to edit
    const table = await page.waitForSelector(formTableParentsTable);
    const parentOfStudentRow = await table.waitForSelector(tableBaseRowWithId(parentProfile.email));
    const parentTableEditButton = await parentOfStudentRow.waitForSelector(
        parentTableEditButtonSelector
    );
    await parentTableEditButton.click();

    // Update parent name
    const newParentName = parentProfile.name + ' edited';
    const parentFormName = await page.waitForSelector(parentFormEmailSelector);
    await parentFormName.fill(newParentName);

    // Save
    const updateParentDialog = await page.$(dialogWithHeaderFooterWrapper);
    await clickOnSaveButtonInParentElement(cms, updateParentDialog!);

    return newParentName;
}

export async function cmsGoToEditStaffPage(cms: CMSInterface, staffProfile: UserProfileEntity) {
    await cms.schoolAdminIsOnThePage(Menu.STAFF, 'Staff Management');
    await cms.waitForSkeletonLoading();

    await cmsGoToStaffDetailsPage(cms, staffProfile.name);

    const isEnabledTeacherDetailsNewUI = await featureFlagsHelper.isEnabled(
        userTeacherManagementBackOfficeTeacherDetailsNewUI
    );

    if (isEnabledTeacherDetailsNewUI) {
        await cms.selectAButtonByAriaLabel('Edit');
    } else {
        await gotoEditPageOnCMS(cms, 'Teacher');
    }
}

async function cmsGoToStaffDetailsPage(cms: CMSInterface, name: string) {
    const cmsPage = cms.page!;
    await cmsPage.click(rowsPerPage);
    await cmsPage.click(rowOption('50'));
    await cms.waitForSkeletonLoading();

    const teacherItem = await cms.assertTypographyWithTooltip(
        `${studentPageSelectors.tableBaseBody} ${staffListStaffName}`,
        name
    );
    await teacherItem?.click();
    await cms.waitForSkeletonLoading();
}

export async function cmsUpdateTeacherName(
    cms: CMSInterface,
    teacherProfile: UserProfileEntity
): Promise<string> {
    const page = cms.page!;
    const newTeacherName = teacherProfile.name + ' edited';

    await page.fill(staffFormNameInput, newTeacherName);

    await cms.selectAButtonByAriaLabel('Save');

    return newTeacherName;
}
