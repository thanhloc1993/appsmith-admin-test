import { aliasFirstGrantedLocation } from '@legacy-step-definitions/alias-keys/architecture';
import { saveButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { learnerProfileAlias, studentParentsAlias } from '@user-common/alias-keys/user';
import { tableStudentSiblingLoading } from '@user-common/cms-selectors/students-page';
import * as studentPageSelectors from '@user-common/cms-selectors/students-page';
import { createRandomStudentData } from '@user-common/utils/create-student';
import { goToAddStudentPage } from '@user-common/utils/goto-page';

import { DataTable } from '@cucumber/cucumber';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationObjectGRPC, StudentDetailTab } from '@supports/types/cms-types';

import {
    clickOnAddParentAndFillInParentInformation,
    schoolAdminChooseTabInStudentDetail,
    searchAndSelectExistedParent,
} from './user-create-student-definitions';
import {
    fillInStudentInformation,
    findNewlyCreatedStudent,
    searchStudentOnCMS,
} from './user-definition-utils';

export interface ParentInfo {
    name: string;
    isExisted: boolean;
}

export interface StudentSiblings {
    student: 'Student S1' | 'Student S2' | 'Student S3';
    siblings: string[];
}
export interface StudentInfo {
    student: {
        type: 'Student S1' | 'Student S2' | 'Student S3';
        profile: UserProfileEntity;
    };
    parents: string[];
}
export interface StudentSiblingsInfo {
    student: UserProfileEntity;
    siblings: UserProfileEntity[];
}

export async function assertSiblingsInfoOnCMS(
    cms: CMSInterface,
    studentSiblings: StudentSiblingsInfo
) {
    await cms.instruction('school admin goes to student list', async function () {
        await cms.schoolAdminIsOnThePage(Menu.STUDENTS, 'Student Management');
    });

    await cms.instruction(
        `school admin searches for student ${studentSiblings.student.name}`,
        async function () {
            await searchStudentOnCMS(cms, studentSiblings.student.name);
            await cms.page?.waitForTimeout(1000);
        }
    );

    const student = await findNewlyCreatedStudent(cms, studentSiblings.student);
    const siblingColumn = await student?.waitForSelector(
        studentPageSelectors.tableStudentSiblingCell
    );

    await siblingColumn?.scrollIntoViewIfNeeded();
    await siblingColumn?.waitForSelector(tableStudentSiblingLoading, {
        state: 'hidden',
    });

    await cms.instruction(
        'school admin sees siblings column on student list table',
        async function () {
            const siblingContent = await siblingColumn?.textContent();
            studentSiblings.siblings.forEach((sibling) => {
                weExpect(siblingContent, 'UI should map data student siblings').toContain(
                    sibling.name
                );
            });
        }
    );

    await cms.instruction('school admin goes to Family tab', async function () {
        await (await student?.waitForSelector(studentPageSelectors.tableStudentName))?.click();
        await schoolAdminChooseTabInStudentDetail(cms, StudentDetailTab.FAMILY);
        await cms.waitForSkeletonLoading();
    });

    await cms.instruction('school admin sees siblings on sibling table', async function () {
        const siblingTable = cms.page!.locator(studentPageSelectors.siblingListTable);
        siblingTable.scrollIntoViewIfNeeded();
        const elementRows = siblingTable.locator(studentPageSelectors.tableBaseRow);

        const rowLength = await elementRows.count();

        for (let index = 0; index < rowLength; index++) {
            const row = elementRows.nth(index);
            const colName = await row.textContent();
            const sibling = studentSiblings.siblings[index];
            weExpect(colName, 'UI should map data sibling name').toContain(sibling.name);
        }
    });
}

export async function createStudentWithProfile(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    await cms.instruction('school admin goes to student upsert page', async function () {
        await goToAddStudentPage(cms);
    });

    const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(aliasFirstGrantedLocation);
    const studentGeneralInfo = await createRandomStudentData(cms, {
        locations: [firstGrantedLocation],
    });

    const newLearnerProfile: UserProfileEntity = {
        ...studentGeneralInfo,
        id: '',
        avatar: '',
        givenName: '',
        password: '',
    };

    scenarioContext.set(learnerProfileAlias, newLearnerProfile);

    await cms.instruction('school admin fills in student general info', async function () {
        await fillInStudentInformation(cms, scenarioContext, studentGeneralInfo);
    });

    await cms.instruction('school admin clicks on save button', async function () {
        await cms.selectElementByDataTestId(saveButton);
        await cms.waitingForLoadingIcon();
    });

    await cms.instruction('school admins closes student info dialog', async function () {
        const dialogStudentAccountInfo = cms.page!.locator(studentPageSelectors.dialogStudentInfo);
        const closeButton = dialogStudentAccountInfo.locator(
            studentPageSelectors.dialogStudentAccountInfoFooterButtonClose
        );
        await closeButton.click();
    });

    await cms.waitingForLoadingIcon();
}

export async function createStudentsWithMultipleParents(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    dataTable: DataTable
) {
    const mappedStudentParents: StudentInfo[] = dataTable.hashes().map((student) => ({
        student: {
            type: student.student,
            profile: {
                id: '',
                email: '',
                name: '',
                avatar: '',
                phoneNumber: '',
                givenName: '',
                password: '',
            },
        },
        parents: student.parents.split(' & '),
    }));

    const parentsMap = new Map<string, ParentInfo>();
    mappedStudentParents.forEach((studentParents) => {
        studentParents.parents.forEach((parent) => {
            if (!parentsMap.get(parent)) {
                parentsMap.set(parent, { name: '', isExisted: false });
            }
        });
    });

    for (const studentParents of mappedStudentParents) {
        await createStudentWithProfile(cms, scenarioContext);
        studentParents.student.profile = scenarioContext.get(learnerProfileAlias);

        for (const parent of studentParents.parents) {
            if (!parentsMap.get(parent)?.isExisted) {
                const newParentInfo = await clickOnAddParentAndFillInParentInformation(
                    cms,
                    `${parent.split(' ').join('')}${studentParents.student.profile.email}`
                );
                parentsMap.set(parent, {
                    name: newParentInfo.userName,
                    isExisted: true,
                });
                await cms.page!.click(
                    studentPageSelectors.dialogStudentAccountInfoFooterButtonClose
                );
            } else {
                await searchAndSelectExistedParent(cms, parentsMap.get(parent)!.name);
                await cms.page?.waitForTimeout(1000);
            }
        }
    }
    scenarioContext.set(studentParentsAlias, mappedStudentParents);
}

export async function mapStudentSiblings(dataTable: DataTable, scenarioContext: ScenarioContext) {
    const mappedStudentSiblings: StudentSiblings[] = dataTable.hashes().map((studentInfo) => ({
        student: studentInfo.student,
        siblings: studentInfo.siblings.split(' & '),
    }));

    const studentParentInfoList = scenarioContext.get<StudentInfo[]>(studentParentsAlias);

    const studentInfoMap = new Map<string, UserProfileEntity>();
    studentParentInfoList.forEach((studentParentInfo) => {
        if (!studentInfoMap.get(studentParentInfo.student.type)) {
            studentInfoMap.set(studentParentInfo.student.type, studentParentInfo.student.profile);
        }
    });

    const studentSiblings = mappedStudentSiblings.map((studentSibling) => ({
        student: studentInfoMap.get(studentSibling.student)!,
        siblings: studentSibling.siblings.map((sibling) => studentInfoMap.get(sibling)!),
    }));

    return studentSiblings;
}
