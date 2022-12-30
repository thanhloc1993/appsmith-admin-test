import {
    capitalizeFirstLetter,
    getRandomGradeMaster,
    randomEnumKey,
    randomGrade,
} from '@legacy-step-definitions/utils';
import {
    buttonSaveEditStudent,
    studentInputFirstNameSelector,
    studentInputLastNameSelector,
} from '@user-common/cms-selectors/student';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';
import { chooseAutocompleteOptionByText } from '@user-common/utils/autocomplete-actions';
import { addMoreRandomUILocations } from '@user-common/utils/locations';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { LocationInfoGRPC, StudentDetailTab } from '@supports/types/cms-types';

import {
    clickOnAddParentAndFillInParentInformation,
    EnrollmentStatus as EnrollmentStatusType,
    schoolAdminChooseTabInStudentDetail,
} from './user-create-student-definitions';
import {
    clickOnSaveInDialog,
    findNewlyCreatedStudent,
    searchStudentOnCMS,
} from './user-definition-utils';
import { strictEqual } from 'assert';
import { StudentEnrollmentStatus } from 'manabuf/common/v1/enums_pb';

export async function createParentWithProfile(
    cms: CMSInterface,
    learnerProfile: UserProfileEntity
): Promise<UserProfileEntity> {
    const newParentInfo = await clickOnAddParentAndFillInParentInformation(
        cms,
        `${learnerProfile.email}`
    );
    await cms.page!.click(studentPageSelectors.dialogStudentAccountInfoFooterButtonClose);
    return {
        id: '',
        avatar: '',
        givenName: '',
        password: '',
        email: '',
        phoneNumber: newParentInfo.phoneNumber,
        name: newParentInfo.userName,
    };
}

export async function editStudentSiblingInfo(cms: CMSInterface, learnerProfile: UserProfileEntity) {
    const page = cms.page!;
    const isShowGradeMaster = await isEnabledFeatureFlag('STUDENT_MANAGEMENT_GRADE_MASTER');
    const studentInformationContainer = page.locator(studentPageSelectors.studentForm);

    const newFirstName = `${learnerProfile.firstName}-edited`;
    const newLastName = `${learnerProfile.lastName}-edited`;
    const newName = `${newLastName} ${newFirstName}`;
    const newGradeMaster = await getRandomGradeMaster(cms);
    const newGrade = isShowGradeMaster ? newGradeMaster?.name : randomGrade();
    const randomEnumKeyStatus = randomEnumKey(StudentEnrollmentStatus, [
        'STUDENT_ENROLLMENT_STATUS_NONE',
    ]);
    const newEnrollmentStatus = randomEnumKeyStatus
        .replace('STUDENT_ENROLLMENT_STATUS_', '')
        .toLowerCase() as EnrollmentStatusType;
    let newLocations: LocationInfoGRPC[] = [];

    await cms.instruction('Edit first name', async () => {
        await page.fill(studentInputFirstNameSelector, newFirstName);
    });

    await cms.instruction('Edit last name', async () => {
        await page.fill(studentInputLastNameSelector, newLastName);
    });

    await cms.instruction('Edit grade', async () => {
        const gradeField = studentInformationContainer.locator(
            studentPageSelectors.gradeAutoComplete
        );
        await gradeField.click();
        await chooseAutocompleteOptionByText(cms, newGrade);
    });

    await cms.instruction('Edit enrollment status', async () => {
        const enrollmentStatusField = studentInformationContainer.locator(
            studentPageSelectors.enrollmentStatusAutoComplete
        );
        await enrollmentStatusField.click();
        await chooseAutocompleteOptionByText(cms, capitalizeFirstLetter(newEnrollmentStatus));
    });

    await cms.instruction('Edit locations', async () => {
        const locationField = page.locator(studentPageSelectors.formSelectInputLocation);
        await locationField.click();
        newLocations = await addMoreRandomUILocations(cms, learnerProfile.locations!);
        await clickOnSaveInDialog(cms);
    });

    await cms.instruction('Click save button', async () => {
        await page.click(buttonSaveEditStudent);
    });
    return {
        newName,
        newGrade,
        newEnrollmentStatus,
        newLocations,
    };
}

export async function assertSiblingInfosOfStudent(
    cms: CMSInterface,
    studentInfo: UserProfileEntity,
    siblingInfos: UserProfileEntity[]
) {
    const page = cms.page!;
    await cms.instruction('school admin goes to student list', async function () {
        await cms.schoolAdminIsOnThePage(Menu.STUDENTS, 'Student Management');
    });
    await cms.instruction(
        `school admin searches for student ${studentInfo.name}`,
        async function () {
            await searchStudentOnCMS(cms, studentInfo.name);
            await page.waitForTimeout(1000);
        }
    );
    const student = await findNewlyCreatedStudent(cms, studentInfo);

    await cms.instruction('school admin goes to Family tab', async function () {
        await (await student?.waitForSelector(studentPageSelectors.tableStudentName))?.click();
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
        await cms.waitForSkeletonLoading();
    });
    const siblingTable = page.locator(studentPageSelectors.siblingListTable);
    siblingTable.scrollIntoViewIfNeeded();
    const elementRows = siblingTable.locator(studentPageSelectors.tableBaseRow);

    const rowLength = await elementRows.count();

    for (let index = 0; index < rowLength; index++) {
        const row = elementRows.nth(index);
        const siblingInfo = siblingInfos[index];
        const colName = await row
            ?.locator(studentPageSelectors.tableSiblingNameCell)
            ?.textContent();
        const colStatus = await row
            ?.locator(studentPageSelectors.tableSiblingStatusCell)
            ?.textContent();
        const colGrade = await row
            ?.locator(studentPageSelectors.tableSiblingGradeCell)
            ?.textContent();
        const colLocation = await row
            ?.locator(studentPageSelectors.tableSiblingLocationCell)
            ?.textContent();

        strictEqual(colName, siblingInfo.name, 'UI should map data sibling name');
        const enrollmentStatus =
            siblingInfo.enrollmentStatus! === 'loa'
                ? siblingInfo.enrollmentStatus!.toUpperCase()
                : capitalizeFirstLetter(siblingInfo.enrollmentStatus!);
        strictEqual(
            colStatus,
            capitalizeFirstLetter(enrollmentStatus),
            'UI should map data sibling status'
        );
        strictEqual(colGrade, siblingInfo.gradeMaster?.name, 'UI should map data sibling grade');
        siblingInfo.locations!.forEach((location) => {
            weExpect(colLocation, 'UI should map data sibling locations').toContain(location.name);
        });
    }
}
